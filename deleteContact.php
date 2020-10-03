<?php
	$conn = new mysqli("spadecontactmanager.com", "cop4311g_30", "Copcop24!!","cop4311g_contactmanager");
  
	$serverKey = '5f2b5cdbe5194f10b3241568fe4e2b24';

	$inData = getRequestInfo();
	$userId = check_token($_SERVER["HTTP_X_ACCESS_TOKEN"]);
	$validId = (!IsNullOrEmptyString($inData["id"]) && ctype_digit($inData["id"])) || (is_int($inData["id"]) && $inData["id"] >= 0);

	if (!$validId) {
		// Bad Request
		http_response_code ( 400 );
		returnWithError("Missing or invalid contact id!");
	}
	$inData["id"] = (int)$inData["id"];

	if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		// delete query
		$selectSQL = "SELECT * FROM Contact WHERE UserID = {$userId} AND ContactID = {$inData["id"]}";
		$sql = "DELETE FROM
					Contact
				WHERE
					UserID = {$userId} AND ContactID = {$inData["id"]}";
		$select = $conn->query($selectSQL);
		
		// Check if contact exists/belongs to user
		if (!$select->num_rows)
		{
			$selectSQL = "SELECT * FROM Contact WHERE ContactID = {$inData["id"]}";
			$select = $conn->query($selectSQL);

			// Return appropriate error
			if (!$select->num_rows)
			{
				http_response_code ( 422 );
				returnWithError( "Contact does not exist." );
			}
			else
			{
				http_response_code ( 403 );
				returnWithError( "Contact does not belong to user." );
			}
		}

		$conn->query($sql);

		// Failure
		if(!$conn->affected_rows)
		{
			http_response_code ( 400 );
			returnWithError( "Failed to delete contact." );
		}
		// Success
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
	function IsNullOrEmptyString($str){
		return (!isset($str) || trim($str) === '');
	}
?>