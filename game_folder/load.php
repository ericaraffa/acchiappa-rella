<?php
    session_start();
    if(isset($_SESSION['player'])){

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

        $id_player = $_SESSION['player'];
        $post_sql = " FROM `Player` P
                        INNER JOIN `Match` M
                        ON P.id = M.id_player
                        INNER JOIN `Game` G
                        ON G.id_match = M.id_match
                    WHERE G.turn < 10 AND P.id = '$id_player'
                    ";

        if(isset($_GET['id'])){
            $id_match = $_GET['id'];
            $sql = "SELECT *, M.role AS rolePlayer".$post_sql." AND M.id_match = '$id_match'";
            $result = mysqli_query($conn, $sql);
            $row1 = mysqli_fetch_array($result);
            $row2 = mysqli_fetch_array($result);
            
            if($row1['role'] == "Polizia"){
                $posP = $row1['pos'];
                $posR = $row2['pos'];
                $tokP = $row1['remaining_tokens'];
                $tokR = $row2['remaining_tokens'];
                $visPosR = $row2['visible_pos'];
            } else {
                $posP = $row2['pos'];
                $posR = $row1['pos'];
                $tokP = $row2['remaining_tokens'];
                $tokR = $row1['remaining_tokens'];
                $visPosR = $row1['visible_pos'];
            }
            $role = $row1['rolePlayer'];
            $turn = $row1['turn'];

            $json = '{
                "id_match": %d,
                "id_player": %d,
                "role": "%s",
                "posP": %d,
                "posR": %d,
                "tokenP": %d,
                "tokenR": %d,
                "turn": %d,
                "visPosR": %d
            }';
            echo sprintf($json, $id_match, $id_player, $role, $posP, $posR, $tokP, $tokR, $turn, $visPosR);
            $_SESSION['curr_match'] = $id_match;
            $_SESSION['role'] = ($role == 'X') ? 1 : 0;

        } else {
            $sql = "SELECT DISTINCT M.id_match, G.time".$post_sql;
            $result = mysqli_query($conn, $sql);

            $res_n = 0;
            echo '[';
            while($row = mysqli_fetch_array($result)){
                $id = $row['id_match'];
                $time = $row['time'];

                if($res_n != 0){
                    echo ', ';
                }

                echo "{
                    \"id\": $id,
                    \"time\": \"$time\"
                }";

                $res_n++;
            }
            echo ']';
        }

        mysqli_close($conn);
    }



?>