var URL_BASE = 'http://spadecontactmanager.com/LAMPAPI';
var API_EXTENSION = 'php';

var userId = 0;
var loadedContacts = [];
var container;

// Handle page load
$(document).ready(function () {
	userId = Cookies.get("userId");
	// page = queryParams("page")

	// TODO : Change page to /contacts??
	if (!userId || userId < 0)
	{
		alert("You must log in to view this page!");
		window.location.pathname = "";
	}

	// TODO : get page number and get according contacts
	// TODO : Modify Pagination at the bottom

	// TODO : Load Contacts from API!!!!!
	loadedContacts = getContacts(userId, page);

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

function getContacts(userId, page) {
	// payload = {userId: userId, page: page}
	alert("getContacts() not functional yet");
	return [];
}