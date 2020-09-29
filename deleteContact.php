<?php
	$conn = new mysqli("spadecontactmanager.com", "cop4311g_30", "Copcop24!!","cop4311g_contactmanager");
  
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
					ContactID = '" . $inData->ContactID . "'";
		$result = $conn->query($sql);
		
		if($result != TRUE)
		{
			http_response_code ( 400 );
			returnWithError( "Failed to delete contact." );
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