<?php
  //$inData = getRequestInfo();
  $inData = json_decode(file_get_contents("php://input"), true);
  $conn = new mysqli("spadecontactmanager.com", "cop4311g_30", "Copcop24!!","cop4311g_contactmanager");

    $datas = array();
  if ($conn->connect_error)
	{
	    // Server error
		http_response_code ( 500 );
		returnWithError( $conn->connect_error );
	}
  else
	{
        //Grabbing the search field
        if(isset($inData['searchName']))
        {
            $searching = $inData['searchName'];
            
            //Replaces all characters that arent letters or numbers with space
            $sql = "SELECT * FROM Contact WHERE FirstName LIKE '%$searching%' OR LastName LIKE  '%$searching%'";

            $result = $conn->query($sql);
            //echo  $result->num_rows;
            
            //If no search was found
            if($result->num_rows == 0)
            {
                //If no entries are found
                sendResultInfoAsJson('{}');
            }
            else
            {
                // output data of each row
                  while($row = mysqli_fetch_assoc($result)) {
                      $datas[] = $row;
                      
                      /*
                    echo "UserID: " . $row["UserID"]. " - FirstName: " . $row["FirstName"]. " " . $row["LastName"]. " Email Address: " . $row["EmailAddress"]. " Phone Number " . $row["PhoneNumber"]. " ";
                    */
                  }
            }
        }
        
        echo json_encode($datas);
		// Cleanup
		$conn->close();
	}

    function returnWithError( $err )
	{
		$retValue = '{"error" :"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

    function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}

?>
