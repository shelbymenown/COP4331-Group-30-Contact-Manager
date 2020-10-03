<?php
	$inData = getRequestInfo();

	$UserID = 0;
	$Username = "";
	$Name = "";

	//Making sure only method called is POST
	if ($_SERVER['REQUEST_METHOD'] != 'POST') 
	{
		exit;
	}
	
	if (IsNullOrEmptyString($inData["Username"]))
	{
		// Bad Request
		http_response_code ( 400 );
		returnWithError( "Username is required for Signup!" );
	}
	elseif (IsNullOrEmptyString($inData["Password"]))
	{
		// Bad Request
		http_response_code ( 400 );
		returnWithError( "Password is required for Signup!" );
	}
	elseif (IsNullOrEmptyString($inData["Name"]))
	{
		// Bad Request
		http_response_code ( 400 );
		returnWithError( "Name is required for Signup!" );
	}

	else
	{

		$conn = new mysqli("localhost", "cop4311g_30", "Copcop24!!", "cop4311g_contactmanager");
		
		if ($conn->connect_error)
		{
			// Server error
			http_response_code ( 500 );
			returnWithError( $conn->connect_error );
		}
		else
		{
			$sql = "SELECT * FROM User WHERE Username='" . $inData["Username"] . "'";
			$result = $conn->query($sql);
			
			if ($result->num_rows > 0)
			{
				// 409 - Conflict
				http_response_code ( 409 );
				returnWithError( "Username already exists" );
			}
			else
			{
				$sql = "INSERT INTO User(Username, Password, Name) VALUES('" . $inData["Username"] . "', '" . $inData["Password"] . "', '" . $inData["Name"] . "')";
				$result = $conn->query($sql);
	 

				if ( ! $result )
				{
					http_response_code ( 500 );
					returnWithError( $conn->error );
				}
				else
				{
					// 201 - Created
					http_response_code ( 201 );
					sendResultInfoAsJson('{}');
				}
			}
			
			// Cleanup
			$conn->close();
		}
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

	function returnWithInfo( $UserID, $Username )
	{
		$retValue = '{"UserID":' . $UserID . ',"Username":"' . $Username . ', "Name": "' . $Name . '"}';
		sendResultInfoAsJson( $retValue );
	}

	function IsNullOrEmptyString($str){
		return (!isset($str) || trim($str) === '');
	}
?>
