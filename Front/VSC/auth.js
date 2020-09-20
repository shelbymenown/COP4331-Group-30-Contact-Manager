var URL_BASE = 'http://spadecontactmanager.com/LAMPAPI';
var API_EXTENSION = 'php';

var userId = 0;
var signUpButton;
var signInButton;
var container;

var __uRgx = /^[a-zA-Z0-9]+([_ -]?[a-zA-Z0-9])*$/


var submitted_signup = false;
var submitted_login = false;

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
	userId = Cookies.get("userId");

	// TODO : Change page to /contacts??
	if (userId && userId >= 0)
	{
		alert("You are already logged in!");
		window.location.pathname = "/contacts.html"
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
	$("#signup-form").on('submit', doSignup);
	$("#login-form").on('submit', doLogin);
});


function doSignup(e) {
	e.preventDefault();

	// Hide old error
	if (submitted_signup) fadeError($("#signup-error"));
	else submitted_signup = true;

	let name = $("#signup-form :input[name='name']").val();
	let username = $("#signup-form :input[name='username']").val();
	let password = $("#signup-form :input[name='password']").val();

	let uri = `${URL_BASE}/Signup${API_EXTENSION ? "." : ""}${API_EXTENSION}`
	let payload = { Name: name, Username: username, Password: password };

	$.post(uri, JSON.stringify(payload))
		.done(function (res){
			// TODO : nicer alert
			alert("User was successfuly created!\nYou can now log in.");

			// Go to login section
			$("#container").removeClass("right-panel-active");

			// Empty sign up from
			$("#signup-form :input[name='name']").val('');
			$("#signup-form :input[name='username']").val('')
			$("#signup-form :input[name='password']").val('')
		})
		.fail(function (jqXHR, textStatus, errorThrown) {
			errMsg = jqXHR.responseJSON && jqXHR.responseJSON.error ? jqXHR.responseJSON.error + "😢" : "An error has occured 😟";
			console.log(jqXHR); console.log(textStatus); console.log(errorThrown);

			// Display error
			showError($("#signup-error"), errMsg)
		});
}

function doLogin(e) {
	e.preventDefault();

	// Hide old error
	if (submitted_login) fadeError($("#login-error"));
	else submitted_login = true;


	// TODO : loading state to true

	let username = $("#login-form :input[name='username']").val();
	let password = $("#login-form :input[name='password']").val();
	
	let uri = `${URL_BASE}/Login${API_EXTENSION ? "." : ""}${API_EXTENSION}`
	let payload = { Username: username, Password: password };

	$.post(uri, JSON.stringify(payload))
		.done(function (res) {
			token = res.token;

			if (token) {
				Cookies.set("token", token);
				window.location.pathname = "/contacts.html"
			}
			else {
				// Display error
				showError($("#login-error"), "Unexpected result from API 😮")
			}
		})
		.fail(function (jqXHR, textStatus, errorThrown) {
			errMsg = jqXHR.responseJSON && jqXHR.responseJSON.error ? jqXHR.responseJSON.error + "😢" : "An error has occured 😟";
			console.log(jqXHR); console.log(textStatus); console.log(errorThrown);

			// Display error
			showError($("#login-error"), errMsg)
		});
}