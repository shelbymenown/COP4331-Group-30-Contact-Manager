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
        //Grabbing the search field, page number needed, and token from user
        if(isset($inData['searchName'], $inData['page'], $inData['token']))
        {
            $searching = $inData['searchName'];
            $startingPage = 5 * page;
            //Replaces all characters that arent letters or numbers with space
            $sql = "SELECT * FROM Contact WHERE (FirstName LIKE '%$searching%' OR LastName LIKE  '%$searching%') LIMIT $startingPage,5 ";

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
                  while($row = mysqli_fetch_assoc($result)) 
                  {
                      $datas[] = $row;
                      
                      /*
                    echo "UserID: " . $row["UserID"]. " - FirstName: " . $row["FirstName"]. " " . $row["LastName"]. " Email Address: " . $row["EmailAddress"]. " Phone Number " . $row["PhoneNumber"]. " ";
                    */
                  }
            }
        }
        
    
        //Creating the pagination
        $results_per_page = 5;
        $num_of_results = mysqli_num_rows($result);

        $num_of_pages = ceil($num_of_results/$results_per_page);

        //Displaying the links to the pages
        for($page = 1; $page<=$num_of_pages; $page++)
        {
            echo '<a href="https://spadecontactmanager.com/LAMPAPI/randcontact.php?page=' . $page . '">' . $page . '</a>';
        }

        //Determining user page number currently
        if(!isset($_GET['page']))
        {
            //If no page is selected, default to first page
            $page = 1;
        }
        else
        {
            //Else, grab whatever page they're on
            $page = $_GET['page'];
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
