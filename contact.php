<?php
	// User actions on a particular contact
	// All methods require a JWT token (userid)
	// 
	// GET - Method not supported
	// 
	// POST - Create contact
	// 
	// PUT - Update contact
	// 
	// DELETE - Delete contact
	// 
	// 
	// 
	// ANY OTHER METHOD - "Method Not Supported"
	// 
	$conn = new mysqli("spadecontactmanager.com", "cop4311g_30", "Copcop24!!","cop4311g_contactmanager");
	
	$serverKey = '5f2b5cdbe5194f10b3241568fe4e2b24';

	$inData = getRequestInfo();
	$userId = check_token($_SERVER["HTTP_X_ACCESS_TOKEN"]);

	switch ($_SERVER['REQUEST_METHOD'])
	{
		case 'POST':
			$validPhone = (strlen($inData["phone"]) == 10 && ctype_digit($inData["phone"])) || preg_match('~^\([0-9]{3}\)[- ][0-9]{3}-[0-9]{4}$~', $inData["phone"]);

			if (IsNullOrEmptyString($inData["firstName"])) {
				// Bad Request
				http_response_code ( 400 );
				returnWithError("New contact must have a first name!");
			}
			if (!IsNullOrEmptyString($inData["phone"]) && !$validPhone) {
				// Bad Request
				http_response_code ( 400 );
				returnWithError("Phone number is invalid!");
			}
		
			$inData["phone"] = preg_replace('/\D+/', '', $inData["phone"]);
		
			if ($conn->connect_error) {
				returnWithError($conn->connect_error);
			} else {
		
				$sql = "INSERT INTO Contact(UserID, FirstName, LastName, EmailAddress, PhoneNumber, Address)
						VALUES(
							'{$userId}',
							'{$inData["firstName"]}',
							'{$inData["lastName"]}',
							'{$inData["email"]}',
							'{$inData["phone"]}',
							'{$inData["address"]}'
						)";
		
				$conn->query($sql);
		
				if(!$conn->affected_rows)
				{
					http_response_code(400);
					returnWithError("Failed to add contact.");
				} else {
					http_response_code(201);
					sendResultInfoAsJson('{"id":' . mysqli_insert_id($conn) . '}');
				}
		
				// Cleanup
				$conn->close();
			}
			break;
		case 'PUT':
			$validId = (!IsNullOrEmptyString($inData["id"]) && ctype_digit($inData["id"])) || (is_int($inData["id"]) && $inData["id"] >= 0);
			$validPhone = (strlen($inData["phone"]) == 10 && ctype_digit($inData["phone"])) || preg_match('~^\([0-9]{3}\)[- ][0-9]{3}-[0-9]{4}$~', $inData["phone"]);

			if (!$validId ) {
				// Bad Request
				http_response_code ( 400 );
				returnWithError("Missing or invalid contact id!");
			}
			if (IsNullOrEmptyString($inData["firstName"])) {
				// Bad Request
				http_response_code ( 400 );
				returnWithError("Contact must have a first name!");
			}
			if (!IsNullOrEmptyString($inData["phone"]) && !$validPhone) {
				// Bad Request
				http_response_code ( 400 );
				returnWithError("Phone number is invalid!");
			}

			$inData["phone"] = preg_replace('/\D+/', '', $inData["phone"]);
			$inData["id"] = (int)$inData["id"];

			if ($conn->connect_error)
			{
				returnWithError( $conn->connect_error );
			}
			else
			{
				// update query
				$selectSQL = "SELECT * FROM Contact WHERE UserID = {$userId} AND ContactID = {$inData["id"]}";
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
				
				if(!$conn->affected_rows)
				{
					http_response_code ( 400 );
					returnWithError( "Nothing to update." );
				}
				else
				{
					http_response_code ( 204 );
					sendResultInfoAsJson('{}');
				}
					
				// Cleanup
				$conn->close();
			}
			break;
		case 'DELETE':
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
			break;
		default:
			http_response_code ( 405 );
			returnWithError( "Method '" . $_SERVER['REQUEST_METHOD'] . "' not supported!" );
			break;
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


