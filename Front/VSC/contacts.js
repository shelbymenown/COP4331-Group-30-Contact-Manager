const URL_BASE = 'http://spadecontactmanager.com/LAMPAPI';
const API_EXTENSION = 'php';
const DEBUG = false;
const CONTACTS_PER_PAGE = 5;


// State
var editing = false;
var loadedContacts = [];
var searchQry = ''
var page = 1;
var token;

function getInt(val, def = 0) {
	if (!isNaN(val) && parseInt(Number(val) == val) && !isNaN(parseInt(val, 10)))
		return parseInt(val, 10);
	else return def;
}

function mustLogIn()
{
	$("#alertModal-title").text("Unauthorized Access");
	$("#alertModal-body").text("You must log in to view this page!");
	$("#alertModal-continue").hide();
	$("#alertModal-dismiss").text("Continue");
	$('#alertModal').on('hidden.bs.modal', () => {setTimeout(() => {window.location.pathname = "";}, 50)});
	$('#alertModal').modal('toggle');
}

// Handle page load
$(document).ready(function () {
	var urlParams = new URLSearchParams(window.location.search);
	token = Cookies.get("token");

	page = urlParams.has("page") && urlParams.get("page") > 0 ? urlParams.get("page") : 1;
	searchQry = urlParams.has("search") ? urlParams.get("search") : '';
	$("#search-form :input[name='search']").val(searchQry);

	// Change Auth page if not logged in
	if (!token && !DEBUG) {
		mustLogIn();
		return;
	}

	// Add event listeners to header buttons
	$('#logoutBtn').click(doLogout);
	$('#addBtn').click(doCreate);
	$('#search-form').on('submit', doSearch);

	// Load Contacts on page render
	loadContacts(token, searchQry, page);
});


function doSearch(e) {
	e.preventDefault();
	searchQry = $("#search-form :input[name='search']").val();

	if (history.pushState) {
		var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname
		+ `?search=${searchQry}` + `&page=${page}`;
		window.history.pushState({path:newurl},'',newurl);
	}
	
	loadContacts(token, searchQry, page);
}

function loadContacts(token, search, page) {
	$.ajaxSetup({
		headers: {
			'x-access-token': token
		}
	});

	if (page < 1) page = 1;


	let uri = `${URL_BASE}/searchcontact${API_EXTENSION ? "." : ""}${API_EXTENSION}`

	if (!DEBUG) {

		$.get(uri, { search: search, page: page-1 })
		.done(function (res) {
			// Display contacts
			displayContacts(res.contacts);
			displayPagination(page, res.total_pages ? res.total_pages : page + faker.random.number(4));
		})
		.fail(function (jqXHR, textStatus, errorThrown) {
			// TODO : handle error
			errMsg = jqXHR.responseJSON && jqXHR.responseJSON.error ? jqXHR.responseJSON.error + "😢" : "An error has occured 😟";
			console.log(jqXHR); console.log(textStatus); console.log(errorThrown);
			
			// Display error
			// showError($("#signup-error"), errMsg)
		});
		
	}
	else{
		let contacts = [...Array(CONTACTS_PER_PAGE)].map(() => ({
			id: faker.random.number(),
			firstName: faker.name.firstName(),
			lastName: faker.name.lastName(),
			phone: faker.phone.phoneNumberFormat(1),
			address: faker.address.streetAddress(),
			email: faker.internet.email()
		}));
		displayContacts(contacts);
		displayPagination(page, page + faker.random.number(4));
	}
}



function displayContacts(contacts) {
	var contact_list = $("#contact-list");
	contact_list.empty();

	loadedContacts = [...contacts];
	console.log(loadedContacts);

	contacts.forEach(contact => {
		let FULL_NAME = `${contact.firstName} ${contact.lastName}`;

		// HTML list item
		var contact_li;

		// TODO : add buttons to the <li>'s
		// Unique id for buttons (#delete{contact.id}), (#edit{contact.id})
		// Bind delete with this contact.id
		// Bind edit with this contact.id

		// Generate contact HTML
		contact_li = `
			<li class="list-group-item" id="${`contact-${contact.id}`}">
				<div class="row w-100">
					<div class="col-12 col-sm-4 col-md-3 px-0">
						<img src="${faker.image.avatar()}"
							alt="${FULL_NAME}" class="rounded-circle mx-auto d-block img-fluid">
					</div>
					<div class="col-12 col-sm-6 col-md-7 text-center text-sm-left">
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
					<div class="col-12 col-sm-2 col-md-2">
						<div class="tool-tip">
							<button class="btn btn-success btn-sm" onclick="doEdit(${contact.id})"
									data-toggle="modal" data-target="#editCreateModal"
									type="button" title="Edit">
								<i class="fa fa-pencil"></i>
							</button>
							<button class="btn btn-danger btn-sm" onclick="doDelete(${contact.id})"
									data-toggle="modal" data-target="#deleteModal"
									type="button" title="Delete"">
								<i class="fa fa-trash-o"></i>
							</button>
						</div>
					</div>
				</div>
			</li>
		`;

		// console.log(contact_li);
		contact_list.append(contact_li);
	});
}

function doLogout() {
	$("#alertModal-title").text("Logout?");
	$("#alertModal-body").text("Are you sure you want to log out?");
	$("#alertModal-continue").text("Continue");
	$("#alertModal-continue").unbind();
	$("#alertModal-continue").click(submitLogout);
}

function doEdit(id)
{
	contact = loadedContacts.filter(contact => contact.id == id)[0];
	console.log(contact);
	$("#editCreateModal-title").text(`Edit Contact (${[contact.firstName, contact.lastName].join(' ')})`);
	$("#editCreateModal-form :input[name='firstName']")	.val(contact.firstName);
	$("#editCreateModal-form :input[name='lastName']")	.val(contact.lastName);
	$("#editCreateModal-form :input[name='address']")	.val(contact.address);
	$("#editCreateModal-form :input[name='email']")		.val(contact.email);
	$("#editCreateModal-form :input[name='phone']")		.val(contact.phone);

	$("#editCreateModal-continue").text("Save");
	$("#editCreateModal-continue").unbind();
	$("#editCreateModal-continue").click(() => submitEdit(id));
}

function doCreate()
{
	console.log("Here")
	$("#editCreateModal-title").text(`Create New Contact`);
	$("#editCreateModal-form :input[name='firstName']")	.val('');
	$("#editCreateModal-form :input[name='lastName']")	.val('');
	$("#editCreateModal-form :input[name='address']")	.val('');
	$("#editCreateModal-form :input[name='email']")		.val('');
	$("#editCreateModal-form :input[name='phone']")		.val('');

	$("#editCreateModal-continue").text("Create");
	$("#editCreateModal-continue").unbind();
	$("#editCreateModal-continue").click(submitCreate);
}

function doDelete(id)
{
	contact = loadedContacts.filter(contact => contact.id == id)[0];
	console.log(contact);
	$("#deleteModal-body").text(
		`Are you sure you want to delete 
		${[contact.firstName, contact.lastName].join(" ")} 
		from your contacts?`
	);
	
	$("#deleteModal-continue").unbind();
	$("#deleteModal-continue").click(() => submitDelete(id));
}

function submitDelete(contactId)
{
	console.log(contactId);
	// TODO : DELETE to API
	// TODO : On success	- close modal
	// TODO : On fail 		- display error
	
	$('#deleteModal').modal('toggle');
}

function submitLogout()
{

	// TODO : DELETE to API
	// TODO : On success	- close modal
	// TODO : On fail 		- display error
	
	$('#alertModal').modal('toggle');
	setTimeout(() => { token = undefined; Cookies.remove("token"); window.location.pathname = ""; }, 50);
}


function submitEdit(contactId)
{
	console.log(contactId);

	editedContact = {
		id: contactId,
		firstName: $("#editCreateModal-form :input[name='firstName']").val(),
		lastName: $("#editCreateModal-form :input[name='lastName']").val(),
		address: $("#editCreateModal-form :input[name='address']").val(),
		email: $("#editCreateModal-form :input[name='email']").val(),
		phone: $("#editCreateModal-form :input[name='phone']").val()
	};

	console.log(editedContact);

	// TODO : POST to API
	// TODO : On success	- close modal
	// TODO : On fail 		- display error
	
	$('#editCreateModal').modal('toggle');
}
function submitCreate()
{
	createContact = {
		firstName: $("#editCreateModal-form :input[name='firstName']").val(),
		lastName: $("#editCreateModal-form :input[name='lastName']").val(),
		address: $("#editCreateModal-form :input[name='address']").val(),
		email: $("#editCreateModal-form :input[name='email']").val(),
		phone: $("#editCreateModal-form :input[name='phone']").val()
	};

	console.log(createContact);

	// TODO : POST to API
	// TODO : On success	- close modal
	// TODO : On fail 		- display error
	
	$('#editCreateModal').modal('toggle');
}

function submitDelete(contactId)
{
	console.log(contactId);
	$('#deleteModal').modal('toggle');
}

function displayPagination(page, total_pages)
{
	
	let pagination_ul = $("#pagination ul");
	let pagination_content = [];
	pagination_ul.empty();
	
	let first_page = page > 3 ? page - 3 : 1;
	let last_page = page > 3 ? page + 3 : 6;
	

	// console.log("[displayPagination()] page:", page);
	// console.log("[displayPagination()] total_pages:", total_pages);
	// console.log("[displayPagination()] first_page:", first_page);
	// console.log("[displayPagination()] last_page:", last_page);


	disabled = page == 1;
	pagination_content.push(`
		<li>
			<a class="page-first ${disabled ? ' disabled' : ''}" href="javascript:;" ${disabled ? '' : 'onclick="changePage(1)"'}><<</a>
		</li>
	`);

	for (let p = first_page; p <= last_page; p++)
	{
		disabled = p > total_pages;
		pagination_content.push(`
			<li class="page-number${page==p && !disabled ? ' active':''} ${disabled ? ' disabled' : ''}">
				<a href="javascript:;" ${page==p || disabled ? '' : `onclick="changePage(${p})"`}>${p}</a>
			</li>
		`);
	}
	
	disabled = total_pages < last_page;
	pagination_content.push(`
		<li>
			<a class="page-last ${disabled ? ' disabled' : ''}" href="javascript:;" ${disabled ? '' : ` onclick="changePage(${total_pages})"` }>>></a>
		</li>`);

	pagination_ul.append(pagination_content.join("\n"));
}

function changePage(page)
{
	if (history.pushState) {
		var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname
		+ `?search=${searchQry}` + `&page=${page}`;
		window.history.pushState({path:newurl},'',newurl);
	}

	loadContacts(token, searchQry, page);
}



	// // List of random contacts
	// // let contacts = [...Array(CONTACTS_PER_PAGE)].map(() => ({
	// // 	id: faker.random.number(),
	// // 	firstName: faker.name.firstName(),
	// // 	lastName: faker.name.lastName(),
	// // 	phone: faker.phone.phoneNumberFormat(1),
	// // 	address: faker.address.streetAddress(),
	// // 	email: faker.internet.email()
	// // }));

	// console.log("Contacts", contacts);

	// // let contacts = [
	// // 	{
	// // 		"name" : 
	// // 	}
	// // ];

	// // $.get(uri, JSON.stringify(payload))
	// // 	.done(function (res){
	// // 		console.log(res);
	// // 		contacts = res;
	// // 	})
	// // 	.fail(function (jqXHR, textStatus, errorThrown) {
	// // 		// TODO : handle error
	// // 		errMsg = jqXHR.responseJSON && jqXHR.responseJSON.error ? jqXHR.responseJSON.error + "😢" : "An error has occured 😟";
	// // 		console.log(jqXHR); console.log(textStatus); console.log(errorThrown);

	// // 		// Display error
	// // 		showError($("#signup-error"), errMsg)
	// // 	});

	// // payload = {userId: userId, page: page}
	// // alert("getContacts() not functional yet");