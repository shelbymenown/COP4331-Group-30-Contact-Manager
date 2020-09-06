<?php

	$inData = getRequestInfo();

	$UserID = 0;
	$Username = "";
	$Password = "";

	$conn = new mysqli("localhost", "cop4311group30", "Cop!'43119'", "cop4311g_contactmanager");
	if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$sql = "SELECT UserID,Username,Password FROM Users where Username='" . $inData["Username"] . "' and Password='" . $inData["Password"] . "'";
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
			returnWithError( "No Records Found" );
		}
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
		$retValue = '{"UserID":0,"Username":"","Password":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

	function returnWithInfo( $Username, $Password, $UserID )
	{
		$retValue = '{"UserID":' . $UserID . ',"Username":"' . $Username . '","Password":"' . $Password . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}

?>
