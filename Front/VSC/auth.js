const URL_BASE = `http://spadecontactmanager.com/`;
const API_BASE = `${URL_BASE}LAMPAPI`;
const API_EXTENSION = 'php';

let USE_TOASTS = true;
let TOAST_ONLY_SIGNUP = true;
const MAX_TOASTS = 5;

var token;
var userId = 0;
var signUpButton;
var signInButton;
var container;

var __uRgx = /^[a-zA-Z0-9]+([_ -]?[a-zA-Z0-9])*$/


var submitted_signup = false;
var submitted_login = false;

// Toastr settings
toastr.options = {
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

function fadeError(element) {
	if (element)
	{
		element.addClass("error-hide");
		element.removeClass("error-show");
	}
}

function showError(element, error)
{
	if (element)
	{
		element.text(error);
		element.removeClass("error-hide");
		element.addClass("error-show");
	}
}

// Handle page load
$(document).ready(function () {
	// Keyboard listeners
	$(document).keyup(function(e)
	{
		if (e.code === "Escape")
		{
			if ($('#loggedInModal').is(':visible')) 	$('#loggedInModal').modal('hide');
			else if ($('#alertModal').is(':visible')) 	$('#alertModal').modal('hide');
		}
	});

	// Check for existing token
	token = Cookies.get("token");

	// Change page to /contacts if logged in
	$('#loggedInModal').on('hidden.bs.modal', function() { window.location.pathname = "/contacts.html"; });
	if (token)
	{
		Cookies.set("alreadyLoggedIn", "true");
		window.location.pathname = "/contacts.html";
		// $('#loggedInModal').modal('show');
		return;
	}

	if (Cookies.get("missingLogin") === "true")
	{
		toastr['warning']('Please log in to view the page', 'Unauthorized Access');
		Cookies.remove("missingLogin");
	}

	var signupBtn = $('#signup');
	var loginBtn = $('#login');
	var container = $('#container');

	signupBtn.click(function() {
		container.addClass("right-panel-active");
	});

	loginBtn.click(function() {
		container.removeClass("right-panel-active");
	});

	// Make sure errors are cleared
	$("#login-error").text("placeholder");
	$("#signup-error").text("placeholder");
	$("#login-error").removeClass("error-show");
	$("#signup-error").removeClass("error-show");

	
	// Add event listeners
	$('#alertModal').on('hide.bs.modal', onCloseAlert);
	$("#signup-form").on('submit', doSignup);
	$("#login-form").on('submit', doLogin);


});

function doSignup(e) {
	e.preventDefault();

	// Hide old error
	if (submitted_signup) fadeError($("#signup-error"));
	else submitted_signup = true;

	$('#loadingModal').modal({backdrop: 'static', keyboard: false});

	let name = $("#signup-form :input[name='name']").val();
	let username = $("#signup-form :input[name='username']").val();
	let password = $("#signup-form :input[name='password']").val();

	let uri = `${API_BASE}/Signup${API_EXTENSION ? "." : ""}${API_EXTENSION}`
	let payload = { Name: name, Username: username, Password: password };

	$.post(uri, JSON.stringify(payload))
		.done(function (res){
			if (USE_TOASTS && !isMobile())
			{
				onCloseAlert();
				toastr["info"]("You can now log in", "Sign Up Successful!");
			}
			else $('#alertModal').modal('show');
		})
		.fail(function (jqXHR, textStatus, errorThrown) {
			errMsg = jqXHR.responseJSON && jqXHR.responseJSON.error ? jqXHR.responseJSON.error : "An error has occured 😟";

			// Display error
			showError($("#signup-error"), errMsg + "😢")
			if (USE_TOASTS && !TOAST_ONLY_SIGNUP) toastr["warning"](errMsg, "Sign Up Failed!");
		})
		.always(function () { $('#loadingModal').modal('hide');});
}

function doLogin(e) {
	e.preventDefault();

	// Hide old error
	if (submitted_login) fadeError($("#login-error"));
	else submitted_login = true;

	$('#loadingModal').modal({backdrop: 'static', keyboard: false});

	let username = $("#login-form :input[name='username']").val();
	let password = $("#login-form :input[name='password']").val();
	
	let uri = `${API_BASE}/Login${API_EXTENSION ? "." : ""}${API_EXTENSION}`
	let payload = { Username: username, Password: password };

	$.post(uri, JSON.stringify(payload))
		.done(function (res) {
			token = res.token;

			if (token) {
				Cookies.set("token", token);
				Cookies.set("redirected", true);
				
				if (res.name) Cookies.set("name", res.name);
				if (res.lastLogin) Cookies.set("lastLogin", res.lastLogin);
				
				window.location.pathname = "/contacts.html"
			}
			else {
				// Display error
				showError($("#login-error"), "Unexpected result from API 😮")

				// Close loading modal only when login fails
				$('#loadingModal').modal('hide');

				if (USE_TOASTS && !TOAST_ONLY_SIGNUP) toastr["error"]("Unexpected result from API 😮", "Login Failed!");
			}
		})
		.fail(function (jqXHR, textStatus, errorThrown) {
			errMsg = jqXHR.responseJSON && jqXHR.responseJSON.error ? jqXHR.responseJSON.error : "An error has occured 😟";

			// Display error
			showError($("#login-error"), errMsg + "😢")

			// Close loading modal only when login fails
			$('#loadingModal').modal('hide');

			if (USE_TOASTS && !TOAST_ONLY_SIGNUP) toastr["warning"](errMsg, "Login Failed!");
		})
}

function onCloseAlert()
{
	setTimeout(() => {
		// Go to login section
		$("#container").removeClass("right-panel-active");

		// Empty sign up from
		$("#signup-form :input[name='name']").val('');
		$("#signup-form :input[name='username']").val('');
		$("#signup-form :input[name='password']").val('');
	}, 50);
}

function isMobile()
{
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}