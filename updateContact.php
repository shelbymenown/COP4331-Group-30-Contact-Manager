<?php
	$conn = new mysqli("spadecontactmanager.com", "cop4311g_30", "Copcop24!!","cop4311g_contactmanager");
  
	if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$inData = json_decode(file_get_contents("php://input"));
  
		// update query
		$sql = "UPDATE
					Contact
				SET
					 FirstName = '" . $inData->FirstName . "',
					 LastName = '" . $inData->LastName . "',
					 EmailAddress = '" . $inData->Email . "',
					 PhoneNumber = '" . $inData->Phone . "'
				WHERE
					ContactID = '" . $inData->ContactID . "'";
		$result = $conn->query($sql);
		
		if($result != TRUE)
		{
			http_response_code ( 400 );
			returnWithError( "Failed to update contact." );
		}
		else
		{
			http_response_code ( 201 );
			sendResultInfoAsJson('{}');
		}
			
		// Cleanup
		$conn->close();
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
?>