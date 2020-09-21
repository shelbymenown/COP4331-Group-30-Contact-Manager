<?php
  $conn = new mysqli("spadecontactmanager.com", "cop4311g_30", "Copcop24!!","cop4311g_contactmanager");
  
  if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$inData = json_decode(file_get_contents("php://input"));
		
	    $sql = "INSERT INTO Contact(UserID, FirstName, LastName, EmailAddress, PhoneNumber) 
				VALUES('" . $inData->userID . "','" . $inData->FirstName . "', '" . $inData->LastName . "', '" . $inData->Email . "', '" . $inData->Phone . "')";
		$result = $conn->query($sql);
		
		if ($result != TRUE)
		{
			http_response_code ( 400 );
			returnWithError( "Failed to add contact." );
		}
		else
		{
			// 201 - Created
			http_response_code ( 201 );
			sendResultInfoAsJson('{}');
		}

		// Cleanup
		$conn->close();
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