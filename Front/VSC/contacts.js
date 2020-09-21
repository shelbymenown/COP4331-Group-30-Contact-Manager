const URL_BASE = 'http://spadecontactmanager.com/LAMPAPI';
const API_EXTENSION = 'php';
const DEBUG = true;
const CONTACTS_PER_PAGE = 5;

var token;
var userId = 0;
var searchQry = ''
var page = 0;
var loadedContacts = [];
var container;

function getInt(val, def = 0) {
	if (!isNaN(val) && parseInt(Number(val) == val) && !isNaN(parseInt(val, 10)))
		return parseInt(val, 10);
	else return def;
}

// Handle page load
$(document).ready(function () {
	var contact_list = $("#contact-list");
	var html_contacts_li;
	var urlParams = new URLSearchParams(window.location.search);
	token = Cookies.get("token");

	page = urlParams.has("page") ? getInt(urlParams.get("page")) : 0;
	searchQry = urlParams.has("search") ? urlParams.get("search") : '';

	// Change Auth page if not logged in
	if (!token && !DEBUG) {
		alert("You must log in to view this page!");
		window.location.pathname = "";
	}

	// TODO : Load Contacts from API!!!!!
	loadedContacts = getContacts(token, searchQry, page);
	// console.log(loadedContacts);

	// TODO : Display Contacts in page
	if (loadedContacts) {
		// HTML list (unordered)
		var all_contacts_li = [];
		
		loadedContacts.forEach(contact => {
			console.log(contact);
			let FULL_NAME = `${contact.firstName} ${contact.lastName}`;
			
			// HTML list item
			var contact_li;

			// TODO : add buttons to the <li>'s
			// Unique id for buttons (#delete{contact.id}), (#edit{contact.id})
			// Bind delete with this contact.id
			// Bind edit with this contact.id

			// Generate contact HTML
			contact_li = `
				<li class="list-group-item">
					<div class="row w-100">
						<div class="col-12 col-sm-6 col-md-3 px-0">
							<img src="${faker.image.avatar()}"
								alt="${FULL_NAME}" class="rounded-circle mx-auto d-block img-fluid">
						</div>
						<div class="col-12 col-sm-6 col-md-9 text-center text-sm-left">
							<label class="name lead">${FULL_NAME}</label>
							<br>
							<span class="fa fa-map-marker fa-fw text-muted" data-toggle="tooltip" title=""
								data-original-title="${contact.address}"></span>
							<span class="text-muted">${contact.address}</span>
							<br>
							<span class="fa fa-phone fa-fw text-muted" data-toggle="tooltip" title=""
								data-original-title="${contact.phone}"></span>
							<span class="text-muted small">${contact.phone}</span>
							<br>
							<span class="fa fa-envelope fa-fw text-muted" data-toggle="tooltip"
								data-original-title="" title=""></span>
							<span class="text-muted small text-truncate">${contact.email}</span>
						</div>
					</div>
				</li>
			`;

			// console.log(contact_li);
			contact_list.append(contact_li);

			// // Append to contact HTML collection
			// all_contacts_li.push(contact_li);
		});

		// // Append all li(s) together
		// html_contacts_li = all_contacts_li.join('\n');

		// // Insert li(s) to DOM
		// $("#contact-list").
	}
	else {
		// TODO : Display erros if no contacts or invalid page number
	}

	$('#logoutBtn').click(doLogout);
	$('#addBtn').click(doCreate);
});


function doLogout(e) {
	Cookies.remove("userId");
	alert("Logged out successfuly!");
	window.location.pathname = "";
}

function doCreate(e) {
	alert("Create contact form does not exist yet");

	// window.location.pathname = "/create.html";
}

function getContacts(token, searchQry, page) {

	let uri = `${URL_BASE}/searchcontact${API_EXTENSION ? "." : ""}${API_EXTENSION}`
	let payload = { token: token, searchName: searchQry, page: page };

	// List of random contacts
	let contacts = [...Array(CONTACTS_PER_PAGE)].map(() => ({
		id: faker.random.number(),
		firstName: faker.name.firstName(),
		lastName: faker.name.lastName(),
		phone: faker.phone.phoneNumberFormat(1),
		address: faker.address.streetAddress(),
		email: faker.internet.email()
	}));

	console.log(contacts);

	// let contacts = [
	// 	{
	// 		"name" : 
	// 	}
	// ];

	// $.get(uri, JSON.stringify(payload))
	// 	.done(function (res){
	// 		console.log(res);
	// 		contacts = res;
	// 	})
	// 	.fail(function (jqXHR, textStatus, errorThrown) {
	// 		// TODO : handle error
	// 		errMsg = jqXHR.responseJSON && jqXHR.responseJSON.error ? jqXHR.responseJSON.error + "😢" : "An error has occured 😟";
	// 		console.log(jqXHR); console.log(textStatus); console.log(errorThrown);

	// 		// Display error
	// 		showError($("#signup-error"), errMsg)
	// 	});

	// payload = {userId: userId, page: page}
	// alert("getContacts() not functional yet");
	return contacts;
}