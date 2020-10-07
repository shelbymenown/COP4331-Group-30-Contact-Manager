const URL_BASE = `http://spadecontactmanager.com/`;
const API_BASE = `${URL_BASE}LAMPAPI`;
const API_EXTENSION = 'php';
const DEBUG = false;
// const DEBUG = true;
const CONTACTS_PER_PAGE = 5;
const RENDER_ANIMATION = false;
const USE_RANDOM_AVATAR = false;
let USE_TOASTS = false;
const MAX_TOASTS = 5;
const MAX_PAGES = 4;

// State
var loadedContacts = [];
var searchQry = ''
var page = 1;
var token;
var isLoading;

// Toastr settings
toastr.options = {
	"maxOpened": "2",
	"closeButton": false,
	"debug": false,
	"newestOnTop": false,
	"progressBar": false,
	"positionClass": "toast-bottom-left",
	"preventDuplicates": false,
	"onclick": null,
	"showDuration": "300",
	"hideDuration": "1000",
	"timeOut": "5000",
	"extendedTimeOut": "1000",
	"showEasing": "swing",
	"hideEasing": "linear",
	"showMethod": "fadeIn",
	"hideMethod": "fadeOut"
}

// Limit the number of toasts
toastr.subscribe(function(args) {
	if (args.state === 'visible')
	{
		var toasts = $("#toast-container > *:not([hidden])");
		if (toasts && toasts.length > MAX_TOASTS)
			toasts[0].hidden = true;
	}
});

function getPageNumber()
{
	var urlParams = new URLSearchParams(window.location.search);
	return urlParams.has("page") && urlParams.get("page") > 0 ? parseInt(urlParams.get("page")) : 1;
}

function mustLogIn()
{
	$("#alertModal-title").text("Unauthorized Access");
	$("#alertModal-body").text("You must log in to view this page!");
	$("#alertModal-error").hide();
	$("#alertModal-continue").hide();
	$("#alertModal-dismiss").text("Continue");
	$('#alertModal').on('hidden.bs.modal', () => {setTimeout(() => {window.location.pathname = "";}, 50)});
	$('#alertModal').modal('show');
}

// Handle page load
$(document).ready(function () {
	var urlParams = new URLSearchParams(window.location.search);
	var lastLogin = Cookies.get("lastLogin"), name = Cookies.get("name");
	token = Cookies.get("token");

	page = urlParams.has("page") && urlParams.get("page") > 0 ? urlParams.get("page") : 1;
	searchQry = urlParams.has("search") ? urlParams.get("search") : '';
	$("#search-form :input[name='search']").val(searchQry);

	// Change Auth page if not logged in
	if (!token && !DEBUG) {
		mustLogIn();
		return;
	}

	if (document.referrer.split(/[?#]/)[0] === URL_BASE && Cookies.get("redirected") === 'true' && name)
	{
		if (lastLogin)
			lastLogin = new Date(lastLogin).toLocaleDateString("en-US", { 
				weekday: 'short', year: 'numeric', month: 'long', day: 'numeric',
				hour: 'numeric', minute: 'numeric', hour12: true
			});

		toastr["info"](lastLogin ? `Last logged in on ${lastLogin}` : "", `Welcome ${name}!`);
	}
	Cookies.remove("redirected");
	Cookies.remove("lastLogin");

	// Add input mask for phone numbers
	$("#editCreateModal-form :input[name='phone']").mask('(000) 000-0000');

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

	loadContacts(token, searchQry, 1);
}

function loadContacts(token, search, page) {
	let uri = `${API_BASE}/contacts${API_EXTENSION ? "." : ""}${API_EXTENSION}`
	$.ajaxSetup({
		headers: {
			'x-access-token': token
		}
	});

	// Ensure page is valid
	page = parseInt(page);
	if (!page || page < 1) page = 1;
	
	// Update URL bar
	if (history.pushState) {
		var newurl = `${window.location.protocol}//${window.location.host}${window.location.pathname}`
						+ `?search=${searchQry}&page=${page}`
		window.history.pushState({path:newurl},'',newurl);
	}

	// Show loading modal and disable pagination
	$('#loadingModal').modal({backdrop: 'static', keyboard: false});
	disablePagination();
	
	if (!DEBUG) {

		$.get(uri, { search: search, page: page-1 })
		.done(function (res) {
			// HOTFIX total_pages bug
			if (res.total_pages < 1) res.total_pages = 1;

			// Display contacts
			displayContacts(res.contacts);
			displayPagination(page, res.total_pages ? res.total_pages : page + faker.random.number(4));
			disablePagination();
		})
		.fail(function (jqXHR, textStatus, errorThrown) {
			// TODO : handle error
			errMsg = jqXHR.responseJSON && jqXHR.responseJSON.error ? jqXHR.responseJSON.error : "An error has occured";

			// Empty contact list with error
			$("#contact-list").empty();
			$("#contact-list").append(`
				<div class="text-center">
					<h3 class="p-3 m-0">No contacts found</h3>
					<img src="/SVG/forever-alone-bw.svg" alt="forever alone" class="forever-alone">
					<span class="error">${errMsg + " 😟"}</span>
				</div>
			`);
		
			// Toast error
			if (USE_TOASTS) toastr["error"](errMsg, "Failed to Load Contacts!");
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
		disablePagination();
	}
}


// Formatting phone numbers
// https://stackoverflow.com/a/8358214/9382757
function normalize(phone)
{
    //normalize string and remove all unnecessary characters
    phone = phone.replace(/[^\d]/g, "");

    //check if number length equals to 10
    if (phone.length == 10) {
        //reformat and return phone number
        return phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
    }

    return phone;
}

function generateContact_avatar(contact)
{
	let FULL_NAME = [contact.firstName, contact.lastName].join(contact.firstName && contact.lastName ? " " : "");
	let initials = `${contact.firstName ? contact.firstName[0] : ''}${contact.lastName ? contact.lastName[0] : ''}`.toUpperCase() 
	
	return USE_RANDOM_AVATAR ? `
		<div class="col-12 col-sm-4 col-md-3 px-0">
			<img id=${`"contact-${contact.id}-img"`} src="${faker.image.avatar()}"
				alt="${FULL_NAME}" class="rounded-circle mx-auto d-block img-fluid">
		</div>
	` : `
		<div class="circle" style="background: ${stringToColor(FULL_NAME)}">
			<span class="initials">${initials}</span>
		</div>
	`;
}

function generateContact_li(contact, should_hide=true, li_tag=true)
{
	if (!contact)
		return;

	let FULL_NAME = [contact.firstName, contact.lastName].join(contact.firstName && contact.lastName ? " " : "");
	let date = new Date(contact.createDate ? contact.createDate.split(' ')[0] : Date.now())
					.toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })

	return `
		${li_tag ? `<li class="list-group-item" id="${`contact-${contact.id}`}" ${should_hide ? 'style="display: none"' : ''}>` : ''}
			<div class="row w-100">
				<div class="col-12 col-sm-4 col-md-3 px-0 d-flex">
					${generateContact_avatar(contact)}
				</div>
				<div class="col-12 col-sm-6 col-md-7 text-center text-sm-left">
					<label class="name lead" info="fullName">${FULL_NAME}</label>
					<br>
					<div class="contact-info">
						${contact.address ? `
							<span class="fa fa-map-marker fa-fw text-muted" data-toggle="tooltip" title=""
								data-original-title="${contact.address}"></span>
							<span class="text-muted" info="address">${contact.address}</span>
							<br>
						` : ``}
						${contact.phone ? `
							<span class="fa fa-phone fa-fw text-muted" data-toggle="tooltip" title=""
								data-original-title="${normalize(contact.phone)}"></span>
							<span class="text-muted small" info="phone">${normalize(contact.phone)}</span>
							<br>
						` : ``}
						${contact.email ? `
							<span class="fa fa-envelope fa-fw text-muted" data-toggle="tooltip"
								data-original-title="" title=""></span>
							<span class="text-muted small text-truncate" info="email">${contact.email}</span>
							<br>
							` : ``}
							<span class="fa fa-calendar fa-fw text-muted" data-toggle="tooltip"
								data-original-title="" title=""></span>
							<span class="text-muted small text-truncate" info="email">Since ${date}</span>
					</div>
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
		${li_tag ? `</li>` : ''}
	`;
}

function displayContacts(contacts) {
	var contact_list = $("#contact-list");
	var contact_list_html = [];
	var should_hide = RENDER_ANIMATION && !isMobile() && loadedContacts && loadedContacts.length;

	// Fade current contact list
	if (should_hide) $("#contact-list > li").hide('slow');

	loadedContacts = [...contacts];

	// Generate component html
	if (loadedContacts && loadedContacts.length) {
		contacts.forEach(contact => {
			contact_list_html.push(generateContact_li(contact, should_hide));
		});
	}
	else contact_list_html.push(`
		<div class="text-center" ${should_hide ? 'style="display: none"' : ''}>
			<h3 class="p-3 m-0">No contacts found</h3>
			<img src="/SVG/forever-alone-bw.svg" alt="forever alone" class="forever-alone">
		</div>
	`);

	// Render to DOM
	setTimeout(() => {
		contact_list.empty();
		contact_list.append(contact_list_html.join('\n'));
		setTimeout(() => {
			$("#contact-list > li, #contact-list > div").show('slow');
			activatePagination();
		}, 300);
		$('#loadingModal').modal('hide');
	}, should_hide ? 500 : 0);
}

function doLogout() {
	$("#alertModal-error").hide();
	$("#alertModal-title").text("Logout?");
	$("#alertModal-body").text("Are you sure you want to log out?");
	$("#alertModal-continue").text("Continue");
	$("#alertModal-continue").unbind();
	$("#alertModal-continue").click(submitLogout);
}

function doEdit(id)
{
	contact = loadedContacts.filter(contact => contact.id == id)[0];
	$("#editCreateModal-title").text(`Edit Contact (${[contact.firstName, contact.lastName].join(' ')})`);
	// $("#editCreateModal-title").text(`Edit Contact`);
	$("#editCreateModal-form :input[name='firstName']")	.val(contact.firstName);
	$("#editCreateModal-form :input[name='lastName']")	.val(contact.lastName);
	$("#editCreateModal-form :input[name='address']")	.val(contact.address);
	$("#editCreateModal-form :input[name='email']")		.val(contact.email);
	$("#editCreateModal-form :input[name='phone']")		.val(normalize(contact.phone));
	$("#editCreateModal-error").hide();

	$("#editCreateModal-continue").text("Save");
	$("#editCreateModal-continue").unbind();
	$("#editCreateModal-continue").click(() => submitEdit(id));
}

function doCreate()
{
	$("#editCreateModal-title").text(`Create New Contact`);
	$("#editCreateModal-form :input[name='firstName']")	.val('');
	$("#editCreateModal-form :input[name='lastName']")	.val('');
	$("#editCreateModal-form :input[name='address']")	.val('');
	$("#editCreateModal-form :input[name='email']")		.val('');
	$("#editCreateModal-form :input[name='phone']")		.val('');
	$("#editCreateModal-error").hide();

	$("#editCreateModal-continue").text("Create");
	$("#editCreateModal-continue").unbind();
	$("#editCreateModal-continue").click(submitCreate);
}

function doDelete(id)
{
	contact = loadedContacts.filter(contact => contact.id == id)[0];
	$("#deleteModal-body").text(
		`Are you sure you want to delete 
		${[contact.firstName, contact.lastName].join(" ")} 
		from your contacts?`
	);
	
	$("#deleteModal-error").hide();
	$("#deleteModal-continue").unbind();
	$("#deleteModal-continue").click(() => submitDelete(id));
}

function submitLogout()
{
	$('#alertModal').modal('hide');
	setTimeout(() => { token = undefined; Cookies.remove("token"); window.location.pathname = ""; }, 50);
}


function submitEdit(contactId)
{
	let uri = `${API_BASE}/contact${API_EXTENSION ? "." : ""}${API_EXTENSION}`
	$.ajaxSetup({
		headers: {
			'x-access-token': token
		}
	});

	// Hide old error
	$("#editCreateModal-error").hide("puff");

	// maintain same avatar (because of faker)
	var avatarSrc;
	var contactIdx;

	editedContact = {
		id: contactId,
		firstName: $("#editCreateModal-form :input[name='firstName']").val(),
		lastName: $("#editCreateModal-form :input[name='lastName']").val(),
		address: $("#editCreateModal-form :input[name='address']").val(),
		email: $("#editCreateModal-form :input[name='email']").val(),
		phone: $("#editCreateModal-form :input[name='phone']").cleanVal()
	};

	// Do ajax edit
	// On success:
	$.ajax({
		type: 'PUT',
		url: uri,
		contentType: 'application/json',
		data: JSON.stringify(editedContact),
		})
		// On success:
		.done(function(result) {
			// Close Modal
			$('#editCreateModal').modal('hide');

			// Close Modal
			$('#editCreateModal').modal('hide');

			// Update the contact in the loadedContacts array
			contactIdx = loadedContacts.findIndex((c => c.id == contactId))
			if (contactIdx >= 0) loadedContacts[contactIdx] = {...editedContact};

			// Keep old randomly loaded avatar
			if (USE_RANDOM_AVATAR) avatarSrc = $(`#contact-${contact.id}-img`).attr('src');

			// TODO : maybe just generate li content and switch it, no animation.
			$(`#contact-${contactId}`).html(generateContact_li(editedContact, false, false));

			// Maintain old avatar in edited contact
			if (USE_RANDOM_AVATAR) $(`#contact-${contact.id}-img`).attr('src', avatarSrc);

			// Toast success
			if (USE_TOASTS) toastr["info"]("", "Edit Completed!");
		})
		// On error:
		// Show error in red in modal
		.fail(function(err) {
			errMsg = err.responseJSON && err.responseJSON.error ? err.responseJSON.error : "An error has occured 😟";
			
			// Display error
			$("#editCreateModal-error").show("puff");
			$("#editCreateModal-error").text(errMsg);
			
			// Toast error
			if (USE_TOASTS) toastr["warning"](errMsg, "Edit Failed!");
		});
}
function submitCreate()
{
	let uri = `${API_BASE}/contact${API_EXTENSION ? "." : ""}${API_EXTENSION}`
	$.ajaxSetup({
		headers: {
			'x-access-token': token
		}
	});

	// Hide old error
	$("#editCreateModal-error").hide("puff");

	createContact = {
		firstName: $("#editCreateModal-form :input[name='firstName']").val(),
		lastName: $("#editCreateModal-form :input[name='lastName']").val(),
		address: $("#editCreateModal-form :input[name='address']").val(),
		email: $("#editCreateModal-form :input[name='email']").val(),
		phone: $("#editCreateModal-form :input[name='phone']").cleanVal()
	};

	// Do ajax create
	$.post(uri, JSON.stringify(createContact))
		// On success:
		.done(function(result) {
			// Close Modal
			$('#editCreateModal').modal('hide');

			// Capture id
			createContact.id = result.id;

			// There are no contacts on display
			if (!loadedContacts.length)
				$("#contact-list > *").hide("puff").delay(10).queue(function() {$(this).remove();});

			// Append new contact to loadedContacts
			loadedContacts = [...loadedContacts, createContact]

			// Append new contact to display
			$("#contact-list").append(generateContact_li(createContact));
			$(`#contact-${createContact.id}`).show('puff');

			// Toast success
			if (USE_TOASTS) toastr["success"]("", "Creation Completed!");
		})
		// On error:
		// Show error in red in modal
		.fail(function(err) {
			errMsg = err.responseJSON && err.responseJSON.error ? err.responseJSON.error : "An error has occured 😟";
			
			// Display error
			$("#editCreateModal-error").show("puff");
			$("#editCreateModal-error").text(errMsg);

			// Toast error
			if (USE_TOASTS) toastr["warning"](errMsg, "Creation Failed!");

		});
}

function submitDelete(contactId)
{
	var payload = {id: contactId};
	let uri = `${API_BASE}/contact${API_EXTENSION ? "." : ""}${API_EXTENSION}`
	$.ajaxSetup({
		headers: {
			'x-access-token': token
		}
	});

	// Hide old error
	$("#deleteModal-error").hide("puff");

	// Do ajax delete
	// On success:
	$.ajax({
		type: 'DELETE',
		url: uri,
		contentType: 'application/json',
		data: JSON.stringify(payload),
		})
		.done(function(result) {
			// Close Modal
			$('#deleteModal').modal('hide');

			// Remove contact from DOM
			var contact_li = $(`#contact-${contactId}`);
			if (contact_li)	$(`#contact-${contactId}`).hide("puff").delay(10).queue(function(){$(this).remove();});
			
			// Remove contact from loaded contacts
			if (loadedContacts)
			{
				// Remove deleted contact from loadedContacts
				loadedContacts = loadedContacts.filter(c => c.id != contactId);

				// Load previous page if page is empty
				if (!loadedContacts.length) loadContacts(token, searchQry, getPageNumber() - 1);

				// Toast success
				if (USE_TOASTS) toastr["error"]("", "Deletion Successful!");
			}
			else loadContacts(token, searchQry, getPageNumber() - 1);
		})
		// On error:
		// Show error in red in modal
		.fail(function(err) {
			errMsg = err.responseJSON && err.responseJSON.error ? err.responseJSON.error : "An error has occured 😟";
			
			// Display error
			$("#deleteModal-error").show("puff");
			$("#deleteModal-error").text(errMsg);

			// Toast error
			if (USE_TOASTS) toastr["warning"](errMsg, "Deletion Failed!");
		});
}

function displayPagination(page, total_pages)
{
	page = parseInt(page);
	total_pages = parseInt(total_pages);
	
	let pagination_ul = $("#pagination ul");
	let pagination_content = [];
	pagination_ul.empty();
	
	let first_page = page > ~~(MAX_PAGES / 2) ? page - ~~(MAX_PAGES / 2) : 1;
	let last_page = page > ~~(MAX_PAGES / 2) ? page + ~~(MAX_PAGES / 2) : MAX_PAGES;
	
	disabled = page == 1;
	pagination_content.push(`
		<li>
			<a class="page-first${disabled ? ' disabled' : ' flag'}" href="javascript:;" ${disabled ? '' : 'onclick="changePage(1)"'}><<</a>
		</li>
	`);

	for (let p = first_page; p <= last_page; p++)
	{
		disabled = p > total_pages;
		mobile = Math.abs(p - page) <= 1;
		pagination_content.push(`
			<li class="page-number${page==p && !disabled ? ' active':''}${disabled ? ' disabled' : ' flag'}${mobile ? ' mobile' : ''}">
				<a href="javascript:;" ${page==p || disabled ? '' : `onclick="changePage(${p})"`}>${p}</a>
			</li>
		`);
	}
	
	disabled = page >= total_pages;
	pagination_content.push(`
		<li>
			<a class="page-last${disabled ? ' disabled' : ' flag'}" href="javascript:;"${disabled ? '' : ` onclick="changePage(${total_pages})"` }>>></a>
		</li>`);

	pagination_ul.append(pagination_content.join("\n"));
}

function changePage(page)
{
	if (isLoading)
		return;

	// $('html,body').animate({ scrollTop: 0 }, 'slow');
	loadContacts(token, searchQry, page);
}

function disablePagination()
{
	if (!RENDER_ANIMATION)
		return;

	// $("#pagination > ul > li.flag").removeClass("active");
	$("#pagination > ul > li > a.flag").addClass("disabled");
	$("#pagination > ul > li.flag:not(.active)").addClass("disabled");
	isLoading = true;
}

function activatePagination()
{
	if (!RENDER_ANIMATION)
		return;

	// $("#pagination > ul > li.flag").removeClass("active");
	$("#pagination > ul > li > a.flag").removeClass("disabled flag");
	$("#pagination > ul > li.flag").removeClass("disabled flag");
	isLoading = false;
}

function isMobile()
{
	return typeof window.orientation !== 'undefined';
}

const stringToColor = str => {
    let hash = 0;
    let color = '#';

    if (str)
        for (let i = 0; i < str.length; i++)
            hash = str.charCodeAt(i) + ((hash << 5) - hash);


    for (let i = 0; i < 3; i++) {
        let value = (hash >> (i * 8)) & 0xFF;
        color += ('00' + value.toString(16)).substr(-2);
    }

    return color;
}