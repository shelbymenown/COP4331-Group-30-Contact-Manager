<?php

	$inData = getRequestInfo();

	$UserID = 0;
	$Username = "";
	$Password = "";
    
	$conn = new mysqli("localhost", "cop4311g_30", "Pooppoop2424!", "cop4311g_contactmanager");
	
	if ($conn->connect_error)
	{
		// Server error
		http_response_code ( 500 );
		returnWithError( $conn->connect_error );
	    
	}
	else
	{
		$sql = "SELECT Username,Password FROM Users where Username='" . $inData["Username"] . "' and Password='" . $inData["Password"] . "'";
		$result = $conn->query($sql);
		
		if ($result->num_rows > 0)
		{
			$row = $result->fetch_assoc();
			$Username = $row["Username"];
			$Password = $row["Password"];
			$UserID = $row["UserID"];

			returnWithInfo($Username, $Password, $UserID );
		}
		else
		{
			// 401 - Unauthorized
			http_response_code ( 401 );
			returnWithError( "Username or password don't match" );
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

	function returnWithInfo( $Username, $Password, $UserID )
	{
		$retValue = '{"UserID":' . $UserID . ',"Username":"' . $Username . '","Password":"' . $Password . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}

?>
