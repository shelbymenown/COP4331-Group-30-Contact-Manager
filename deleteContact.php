<?php
	$conn = new mysqli("spadecontactmanager.com", "cop4311g_30", "Copcop24!!","cop4311g_contactmanager");
	$serverKey = '5f2b5cdbe5194f10b3241568fe4e2b24';

	$inData = getRequestInfo();

	parse_str($_SERVER['QUERY_STRING'], $inData);

	$userId = check_token($_SERVER["HTTP_X_ACCESS_TOKEN"]);
	
	//Throwing error if id is not thrown in
	if (IsNullOrEmptyString($inData["Username"]))
	{
		// Bad Request
		http_response_code ( 400 );
		returnWithError( "Contact id is missing" );
	}


	if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$inData = json_decode(file_get_contents("php://input"));
  
		// delete query
		$sql = "DELETE FROM
					Contact
				WHERE
					UserID = '" . $userId . "' AND ContactID = '" . $inData["id"] . "'";
		$result = $conn->query($sql);
		
		if($result != TRUE)
		{
			http_response_code ( 400 );
			returnWithError( "Failed to delete contact." );
		}
		else
		{
			http_response_code ( 202 );
			sendResultInfoAsJson('{}');
		}
			
		// Cleanup
		$conn->close();
	}
	
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error" :"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
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
?>