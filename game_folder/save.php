<?php 
    session_start();
    if(isset($_GET['posMr_R']) &&
        isset($_GET['posPolizia']) &&
        isset($_GET['turn']) &&
        isset($_GET['tokenR']) &&
        isset($_GET['tokenP']) &&
        isset($_SESSION['curr_match'])){
        
        $servername = "127.0.0.1";
        $username = "root";
        $password = "";
        $myDB = "archive_matches";

        // Create connection
        $conn = new mysqli($servername, $username, $password, $myDB);
        
        // Check connection
        if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }

        $id_match = $_SESSION['curr_match'];
        //time
        //role
        $R_pos = $_GET['posMr_R'];
        $R_token = $_GET['tokenR'];
        $P_pos = $_GET['posPolizia'];
        $P_token = $_GET['tokenP'];
        $t = $_GET['turn'];
        $lastVisMr_R = $_GET['posVisMr_R'];

        $sql_R = "REPLACE INTO `Game` VALUE('$id_match', CURRENT_TIMESTAMP, 'Mr_R', '$R_pos', '$t', '$R_token', '$lastVisMr_R');";
        echo $sql_R;
        $sql_P = "REPLACE INTO `Game` VALUE('$id_match', CURRENT_TIMESTAMP, 'Polizia', '$P_pos', '$t', '$P_token', '$P_pos');";
        echo $sql_P;
        mysqli_query($conn, $sql_R);
        mysqli_query($conn, $sql_P);

        mysqli_close($conn);
    }
?>