<?php
  $conn = new mysqli("spadecontactmanager.com", "cop4311g_30", "Copcop24!!","cop4311g_contactmanager");
  
  $serverKey = '5f2b5cdbe5194f10b3241568fe4e2b24';

  $inData = getRequestInfo();

  parse_str($_SERVER['QUERY_STRING'], $inData);

  $userId = check_token($_SERVER["HTTP_X_ACCESS_TOKEN"]);

  if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}
	else
	{	
	    $sql = "INSERT INTO Contact(UserID, FirstName, LastName, EmailAddress, PhoneNumber)
				VALUES('" . $userId . "','" . $inData->FirstName . "', '" . $inData->LastName . "', '" . $inData->Email . "', '" . $inData->Phone . "')";
		$result = $conn->query($sql);


		if ($result != TRUE)
		{
			http_response_code ( 400 );
			returnWithError( "Failed to add contact." );
		}
		else
		{
			//$id = mysqli_insert_id($conn);
			$id = 7;
			// 201 - Created
			http_response_code ( 201 );
			sendResultAsJson('{"id":' . $id . '}');
		}

		// Cleanup
		$conn->close();
	}
	
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function returnWithError( $err )
	{
		$retValue = '{"error" :"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

    function returnWithInfo( $userID, $contactFirstName )
    {
        $retValue = '{"UserID":' . $UserID . ',"First Name":"' . $contactFirstName . '"}';
        sendResultInfoAsJson( $retValue );
    }
	
	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}

?>