<?php
session_start();

/* session end */
if(isset($_GET['logout'])){
    unset($_SESSION['player']);
    unset($_SESSION['curr_match']);
    unset($_SESSION['role']);
}

else if(isset($_GET['endgame'])){
    unset($_SESSION['curr_match']);
    unset($_SESSION['role']);
}

/* Login + session start */
else if(isset($_POST['name']) && isset($_POST['pwd'])){ 
    /* Conn DB */
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
    
    //insert user
    $exists = 0;
    $name = $conn->real_escape_string($_POST['name']);
    $pwd = $conn->real_escape_string($_POST['pwd']);
    $q_pwd = "SELECT pwd FROM Player WHERE id = '$name';";
    $result_pwd = $conn->query($q_pwd);
    $exists = $result_pwd->num_rows != 0;
    if($exists){
        $row_pwd = $result_pwd->fetch_assoc();
        $pwdOk = ($pwd == $row_pwd['pwd']);
    }

    $err_msg = '';
    if($exists){  //username already existing, control pwd
            if(!$pwdOk)
                $err_msg = 'Wrong password, try again!';
            else
                $_SESSION['player'] = $name;
    } else { 
        $sql = "INSERT INTO Player VALUES('$name','$pwd');";
        if(mysqli_query($conn, $sql)){
            $_SESSION['player'] = $name;
        } else {
            $err_msg = "Can't register";
        }
    }
    mysqli_close($conn);
}

/* Character */
 
if(isset($_POST['role']) && !isset($_SESSION['curr_match'])){
            /* Conn DB */
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
    $name = $_SESSION['player'];
    $charPlay = ($_POST['role']==1)?'X':'R';
    $sql = "INSERT INTO `Match` VALUES(DEFAULT, '$name', '$charPlay');";
    mysqli_query($conn, $sql);
    $id = mysqli_insert_id($conn);
    $_SESSION['curr_match'] = $id;
    $_SESSION['role'] = $_POST['role'];
    mysqli_close($conn);
}


?>