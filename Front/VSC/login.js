var URL_BASE = 'http://spadecontactmanager.com/LAMPAPI';
var API_EXTENSION = 'php';

var userId = 0;

// Handle page load
$(document).ready(function () {
	userId = Cookies.get("userId");

	// TODO : Change page to userhub??
	if (userId && userId >= 0)
		alert("You are already logged in!");

	// Make sure login result is empty
	$("#login_result").html("");

	// Otherwise continue with the page
	$("#login_form").on('submit', doLogin);
});

function doLogin(e) {
	e.preventDefault();

	// Clear previous login attempt
	$("#login_result").html("");

	// TODO : loading state to true

	let username = $("#username").val();
	let password = $("#password").val();
	let uri = `${URL_BASE}/Login${API_EXTENSION ? "." : ""}${API_EXTENSION}`
	let payload = { Username: username, Password: password };

	$.post(uri, JSON.stringify(payload))
		.done(function (res) {
			console.log(res);
			userId = res.UserID;
			alert(`Got ${userId} as a response`);

			if (res.UserID && res.UserID >= 0) {
				Cookies.set("userId", userId);
				// TODO : change page to hub/contacts/etc..
			}
			else {
				$("#login_result").html("Unexpected result from API 😮");
			}
		})
		.fail(function (jqXHR, textStatus, errorThrown) {
			errMsg = jqXHR.responseJSON && jqXHR.responseJSON.error ? jqXHR.responseJSON.error + "😢" : "An error has occured 😟";
			console.log(jqXHR); console.log(textStatus); console.log(errorThrown);
			$("#login_result").html(errMsg);
		});
}