var urlBase = 'http://spadecontactmanager.com/LAMPAPI';
var extension = 'php';

var userID = 0;
var Username = "";
var Password = "";

function doLogin(e)
{
	e.preventDefault();
	
	// Clear previous login attempt
	document.getElementById("loginResult").innerHTML = "";

    userID = 0;
    Username = "";
    Password = "";

    var Username = document.getElementById("Username").value;
    var Password = document.getElementById("Password").value;

// document.getElementById("loginResult").innerHTML = ""; Allows to change HTML within

    var jsonPayload = '{"Username" : "' + Username + '", "Password" : "' + Password + '"}';
    var url = urlBase + '/Login.' + extension;

    //Exchanges the data between the web data and the server. 
    var xhr = new XMLHttpRequest();

    xhr.open("POST", url, false);

    xhr.setRequestHeader("Content-type", "application/json; charset = UTF-8");

    console.log("Request sent out");
    try
    {
        console.log("Entered try block");
        console.log(jsonPayload);
        xhr.send(jsonPayload);

		var res = JSON.parse(xhr.responseText);
		console.log(res);
		
		if (res.id && res.id >= 0 && !res.error)
		{
			// TODO : log in!
		}
		else document.getElementById("loginResult").innerHTML = res.error;

    }
    catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}
}