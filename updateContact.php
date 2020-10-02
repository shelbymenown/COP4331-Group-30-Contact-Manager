<?php
	$conn = new mysqli("spadecontactmanager.com", "cop4311g_30", "Copcop24!!","cop4311g_contactmanager");
  
	$serverKey = '5f2b5cdbe5194f10b3241568fe4e2b24';

	$inData = getRequestInfo();
	$userId = check_token($_SERVER["HTTP_X_ACCESS_TOKEN"]);
    $validPhone = (strlen($inData["phone"]) == 10 && ctype_digit($inData["phone"])) || preg_match('~^\([0-9]{3}\)[- ][0-9]{3}-[0-9]{4}$~', $inData["phone"]);

	if (IsNullOrEmptyString($inData["firstName"])) {
		// Bad Request
		http_response_code ( 400 );
		returnWithError("Contact must have a first name!");
	}
	if (IsNullOrEmptyString($inData["phone"])) {
		// Bad Request
		http_response_code ( 400 );
		returnWithError("New contact must have a phone number!");
	}
	if (!$validPhone) {
		// Bad Request
		http_response_code ( 400 );
		returnWithError("Phone number is invalid!");
	}

	$inData["phone"] = preg_replace('/\D+/', '', $inData["phone"]);

	if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		// update query
		$sql = "UPDATE
					Contact
				SET
					FirstName='{$inData["firstName"]}',
					LastName='{$inData["lastName"]}',
					EmailAddress='{$inData["email"]}',
					PhoneNumber='{$inData["phone"]}',
					Address='{$inData["address"]}'
				WHERE
					UserID = {$userId} AND ContactID = {$inData["id"]}";
		$result = $conn->query($sql);
		
		if($result != TRUE)
		{
			http_response_code ( 400 );
			returnWithError( "Failed to update contact." );
		}
		else
		{
			http_response_code ( 204 );
			sendResultInfoAsJson('{}');
		}
			
		// Cleanup
		$conn->close();
	}
	
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function check_token($token)
	{
		global $serverKey;
		require_once('jwt.php');

		// Decode token
		try { return JWT::decode($token, $serverKey, array('HS256'))->userId; }
		catch(Exception $e)
		{
			// Unauthorized
			http_response_code( 401 );
			returnWithError( "TOKEN ERROR: {$e->getMessage()}" );
		}
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
		exit();
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error" :"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	function IsNullOrEmptyString($str){
		return (!isset($str) || trim($str) === '');
	}
?>