<!doctype html>
<?php include('openConn.php') ?>
<html lang = "it">
<head>
  <title>Acchiappa-Rella</title>
  <meta content="text/html;charset=utf-8" http-equiv="Content-Type">
  <link rel="stylesheet" href="./proj.css">
  <link href="https://fonts.googleapis.com/css?family=Permanent+Marker&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css?family=Shadows+Into+Light%7CSpecial+Elite&display=swap" rel="stylesheet">
  <script>
        var state = {
            <?php if(isset($_SESSION['curr_match'])) { ?>
            role: (<?php echo $_SESSION['role'] ?>) ? "mr_R" : "polizia",
            turn: 1
            <?php } ?>
        }
    </script>
    <script src="game.js"></script>
    <script src="consts.js"></script>
    <script src="proj.js"></script>
    <script src="path.js"></script>
    <script src="ball.js"></script>
    <script src="player.js"></script>
    <script src="ajax.js"></script>


</head>
<body onload="startBoard()" onresize="updateSizes()">
  <header>
    <hgroup>
      <h1 style="color:white">ACCHIAPPA-RELLA</h1>
    </hgroup>
  </header>
  <nav id="menuUp">
    <ul class="navBar">
      <li style="float:left">
        <?php if(!isset($_SESSION['curr_match'])){ ?>
          <a href="javascript:void(0);"  <?php if(isset($_SESSION['player'])) { ?> onclick="openForm('choose-form'); localStorage.removeItem('match_info');" <?php } ?> >
            Nuova Partita
          </a>              
      </li>
        <?php } else { ?>
          <li style="float:left">
            <a href="javascript:void(0);" onclick="openForm('end-match-form')">
              Termina Partita
            </a>
          </li>
          <li style="float:left">
            <a href="#">
              ID partita: <?php echo $_SESSION['curr_match']; ?>
            </a>
          </li>
        <?php } ?>
      <li style="float:left">
        <a href="readme.html" target = _blank>
          Regole
        </a>
      </li>
      <?php if(isset($_SESSION['player'])){ ?>
        <li id="user" style="float:right;">
          <a href="javascript:void(0);" style="padding:8px 40px" onclick="displayUsr('menu-usr')">
            Ciao
          <?php echo $_SESSION['player'] ?>
          </a>
          <div id="menu-usr" class="dropDown">
            <a onclick="matchArchive();">
              Archivio partite
            </a>
            <a href="javascript:void(0);" onclick="logout()">
              Logout
            </a>
          </div>
        </li>
      <?php } else { ?>
        <li id="login" style="float:right;">                
          <a href="javascript:void(0);" style="padding:8px 40px" onclick="openForm('login-form')">
            Login
          </a>
        </li>                      
      <?php } ?>
    </ul>
  </nav> <!--UP-->
                  
  <div id="choose-form" class="form-popup popupMessage">
    <form action="index.php" method="POST" class="form-container">    
      <h2 style="text-align:center;">
        Seleziona personaggio.
        </h2>          
      <button type="submit" name="role" value="1" class="btn">
        Mr.R
      </button>
      <button type="submit" name="role" value="0" class="btn">
        Polizia
      </button>
      <button type="button" class="btn cancel" onclick="closeForm('choose-form')">
        Chiudi
      </button>
      
    </form>
  </div> <!--Character-->

  <div id="end-match-form" class="form-popup popupMessage">
    <form action="javascript:void(0);" method="POST" class="form-container">    
      <h2 style="text-align:center;">
        Salvare?
        </h2>          
      <button class="btn" onclick="ajaxSave();">
        Salva partita
      </button>  
      <button class="btn" onclick="endGame()" >
        Esci
      </button>      
      <button type="button" class="btn cancel" onclick="closeForm('end-match-form')">
        Chiudi
      </button>
    </form>
  </div> <!--End-Match-->

  <div id="load-match-form" class="form-popup popupMessage">
    <form action="javascript:void(0);" class="form-container">    
      <h2 style="text-align:center;">
        Scegli la partita
      </h2>          
      <table id="load-match-table">
        <thead>
          <tr>
            <th>ID match</th>
            <th>Ultimo salvataggio</th>
          </tr>
        </thead>
        <tbody id="load-match-tbody">
          <tr id="display-if-empty">
            <td colspan="2">Nessuna partita da visualizzare</td>
          </tr>
        </tbody>
      </table>
      <button type="button" class="btn cancel" onclick="closeForm('load-match-form')">
        Chiudi
      </button>
    </form>
  </div> <!--Load-Match-->
                      
  <div id="login-form" class="form-popup  popupMessage" >
    <form action="index.php" method="POST"  class="form-container">    
      <h2 style="text-align:center;">Login.</h2>
      <label for="name">
        <b>Username</b>
      </label>
      <input id="name" type="text" placeholder="Enter Name" name="name" required>  

      <label for="psw">
        <b>Password</b>
      </label>
      <input id="psw" type="password" placeholder="Enter Password" name="pwd" required>            
      <button type="submit" class="btn">
        Login
      </button>
      <button type="button" class="btn cancel" onclick="closeForm('login-form')">
        Chiudi
      </button>
    </form>
  </div> <!--Form-->
                            
  <div id="gameBoard">
    <nav id="menuSx" class="sideMenuStyle">
      <?php if(isset($_SESSION['curr_match'])) { ?>
        <h2 class="sideMenuTitle">
          Turni:
        </h2>
        <ul class="sideMenu">
          <li id="turn"> </li>
        </ul>
        <h2 class="sideMenuTitle">
          Posizioni correnti:
        </h2>
        <ul class="sideMenu">
          <li id="pos"> 
          </li>
          <li id="pos_mr_R"> 
          </li>
          <li id="pos_polizia">
          </li>
        </ul>
      <?php } else {?>
        <p class="testo">
            <b>Cominciamo!</b> <br> <b>Mr.R</b> ad ogni turno inizia per primo, e sa che dovra' correre piu' veloce della polizia per 
            farla franca. <br> <b>Il poliziotto</b> di riflesso sa che dovra' fare di tutto per prevedere le mosse di Mr.R e stanarlo 
            prima di essere degradato a vigile urbano. 
        </p>
      <?php } ?>
    </nav> <!--SX-->
    <div id="map-wrapper"></div>            
    <nav id="menuDx" class="sideMenuStyle">
      <?php if(isset($_SESSION['curr_match'])) { ?>
        <h2 class="sideMenuTitle">Giocatori:</h2>
        <ul class="sideMenu">
          <li style="text-align: center;">
            Mr.R: 
            <?php if(isset($_SESSION['player']) && (isset($_SESSION['role']) && $_SESSION['role']=="1")) 
                      echo $_SESSION['player'] ?>
          </li> 
          <li style="text-align:left;">
            Gettoni:
          </li>
          <li id="r-token" style="text-align:right;"></li>
          <li style="text-align:center;">
            Polizia: 
            <?php if(isset($_SESSION['player']) && (isset($_SESSION['role']) && $_SESSION['role']=="0")) 
                      echo $_SESSION['player'] ?>
          </li>
          <li style="text-align:left;">
            Gettoni:
          </li>
          <li id="p-token" style="text-align:right;"></li>
        </ul>
        <h2 class="sideMenuTitle">Percorso:</h2>
        <div id="set-paths" class="form-container sideMenu">
            <button class="btn" 
              <?php if(isset($_SESSION['curr_match'])) { ?>
              onclick="confirmPath(state.role)"
              <?php } ?>
            >
              Ok
            </button>
            <button class="btn cancel" 
              <?php if(isset($_SESSION['curr_match'])) { ?>
              onclick="updateBall(-1)"
              <?php } ?>
            >
              Cancel
            </button>
          </div>
        <ul id="display-path" class="sideMenu"></ul>
      <?php } else {?>
        <p class="testo">
            <b>Accedi</b> o <b>registrati</b> inserendo un nuovo username e password, avvia una <b>nuova partita</b> e scegli il personaggio con cui vuoi giocare. Seleziona la tua mossa 
            prestando attenzione ai <b>gettoni</b> rimanenti. <br><br>
            (Clicca su "Regole" per leggere il manuale completo).
        </p>
      <?php } ?>
    </nav> <!--DX-->
  </div>        
  <?php 
      if(isset($err_msg) && $err_msg != '') {
        echo "<script type='text/javascript'>\n";
        echo "setTimeout(function(){\n";
        echo "alert(".json_encode($err_msg).");\n";
        echo "}, 300)";
        echo  "</script>\n";
      }
    ?>
</body>
                            
</html> 
                            
                            