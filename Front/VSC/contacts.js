var URL_BASE = 'http://spadecontactmanager.com/LAMPAPI';
var API_EXTENSION = 'php';

var token;
var userId = 0;
var searchQry = ''
var page = 0;
var loadedContacts = [];
var container;

function getInt(val, def=0) {
	if (!isNaN(val) && parseInt(Number(val) == val) && !isNaN(parseInt(val, 10)))
		return parseInt(val, 10);
	else return def;
}

// Handle page load
$(document).ready(function () {
	var urlParams = new URLSearchParams(window.location.search);
	token = Cookies.get("token");

	page = urlParams.has("page") ? getInt(urlParams.get("page")) : 0;
	searchQry = urlParams.has("search") ? urlParams.get("search") : '';

	// Change Auth page if not logged in
	if (!token)
	{
		alert("You must log in to view this page!");
		window.location.pathname = "";
	}

	// TODO : Load Contacts from API!!!!!
	loadedContacts = getContacts(token, searchQry, page);

	// TODO : Display Contacts in page
	if (loadedContacts) {
		for (let contact in loadedContacts) {
			// Generate contact HTML
			// Unique id for buttons (#delete{contactId}), (#edit{contactId})
			// Append contact HTML to DOM
			
			// Bind delete with this contact.id
			// Bind edit with this contact.id
		}
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

	let contacts = [];

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