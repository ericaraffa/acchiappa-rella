var wrapperElem;
var pathArr = [];
var playArr = []; 
var game;

/*Setup della board di gioco*/
function startBoard() {
    wrapperElem = document.getElementById("map-wrapper");
    game = new Game();
    if (state.role) {
        var info = JSON.parse(localStorage.getItem('match_info'));
        if(info){
            game.resumeMatch(info)
        } else {
            game.startNewMatch();
        }
    }


}
/*Aggiorna quando si ridimensiona la finestra*/
function updateSizes() {
    game.mp.pathSvg.style.height = document.getElementById("map-wrapper").clientHeight + "px";
    game.mp.pathSvg.style.width = document.getElementById("map-wrapper").clientWidth + "px"
    game.mp_color.pathSvg.style.height = document.getElementById("map-wrapper").clientHeight + "px";
    game.mp_color.pathSvg.style.width = document.getElementById("map-wrapper").clientWidth + "px"
}
/*Viene utilizzata sia da Ball sia dall'html*/
function updateBall(i) {
    if(i == -1) i = game[state.role].getPos();
    game.temporaryPath(i, state.role);
}

function addTextPath(role, array){
    /*Aggiungo il testo nella board*/
    var my_path = game.updateTextPath(array, role);
    var node = document.createElement("li"); //display
    var text = document.createTextNode(my_path);
    node.appendChild(text);
    document.getElementById("display-path").insertBefore(node, document.getElementById("display-path").firstChild)

}

/* Salva il percorso e aggiorna i colori delle posizioni */
function confirmPath(role) {
    if (game[role].movePath.length == 1) {
        return;
    }
    if(state.turn > 10) return

    var adv = (role == "mr_R") ? "polizia" : "mr_R";
    var path_array = game[role].getPath();

    addTextPath(role, path_array);

    /*Controllo vincita P->R*/
    if (game[role].isInPath(game[adv].getPos())) {
        gotcha();
        return;
    }

    var new_pos = game[role].getLastPos();
    var old_pos = path_array[0];
    resetMyPath(role);

    if(role == "polizia" || (role == "mr_R" && state.role == "mr_R")){
        game.resetPlayerBall(path_array[0], role)
    }

    // Aggiorniamo l'ultima posizione visibile di Mr_R
    prevVisiblePos = game.mr_R.lastVisiblePos
    if(role == "mr_R" && game.isMr_RVisible()){
        game.mr_R.lastVisiblePos = path_array[0];
    }

    //Aggiorniamo le palline
    if(role =="mr_R" && state.role == "polizia"){
        game.resetPlayerBall(prevVisiblePos, role)
        game.setPlayerBall(game.mr_R.lastVisiblePos, role)
    } else {
        game.setPlayerBall(new_pos, role)
    }

    game[role].setStartPos(new_pos); //set new pos
    updateTextToken();


    /*Controllo tokens*/
    if(game[role].runOut()){
        game[adv].win = true;
        alert("Gettoni finiti");
        endGame();
        return;
    }

    game.resetChoiceFrom(new_pos)

    /*Tocca all'avversario*/
    game.passTurn(role, adv);
    updateTurn(role);
    advPlay(role, adv);

    if(state.turn == 10 && role == "polizia"){
        alert("Mr_R è scappato!");
        return;
    }

}

function advPlay(role, adv){
    if (role == state.role && state.turn != 10) {
        setTimeout(function(){
            game.makeMove(adv);
            game.chooseBallFrom(game[role].getPos());
        }, 1500);
    }
}

function updateTurn(role){
        /*Scatta il turno quando finisce polizia*/
        updateLastPos()
        if (role == "polizia" && state.turn < 10) {
            state.turn++;
        }
        updateTextTurn();
}

/* Aggiorno i colori delle posizioni e dei percorsi*/
function resetMyPath(role, arr_ball_index) {
    if ((game[role].movePath.length == 1)) return;
    arr_ball_index = (arr_ball_index == undefined) ? 0 : arr_ball_index;
    let my_Arr = game[role].movePath;
    my_Arr = my_Arr.filter((x, i) => {
        if (i >= arr_ball_index) {
            game.setColorPath(x, my_Arr[i + 1], "no_fill");
            if (i == arr_ball_index) {
                return true;
            } 
            game.resetTempBall(x)
            game.resetColorPath(x);
            return false;            
        } else return true;
    });
    game[role].movePath = my_Arr;
}

function updateTextToken() {
    document.getElementById("p-token").textContent = game.getToken();
    document.getElementById("r-token").textContent = game.getToken(true);
}

function gotcha() {
    game.polizia.win = true;
    alert("Polizia win!")
    endGame();
    //se polizia becca mr_R
}

/*Count turn*/
function updateTextTurn() {
    document.getElementById("turn").textContent = "Turno n°: " + state.turn + "/10";
}

/*Get last pos*/
function updateLastPos(){
    document.getElementById("pos_mr_R").textContent = "Mr.R era qui: " + (game.mr_R.lastVisiblePos + 1);
    document.getElementById("pos_polizia").textContent = "La polizia si trova qui: " + (game.polizia.getPos() + 1);
}

/*Login/Logout*/
function openForm(id) {
    document.getElementById(id).style.display = "block";
}
function closeForm(id) {
    document.getElementById(id).style.display = "none";
}
function matchArchive(){
    if(state.role){
        alert("Prima esci dalla partita");
        return;
    }
    ajaxList(); 
    openForm('load-match-form'); 
}
function displayUsr(id) {
    var prec = document.getElementById(id);
    if (!prec.style.display || prec.style.display == "none") prec.style.display = "block";
    else if (prec.style.display == "block") prec.style.display = "none";
}
function logout() {
    window.location.href = "http://localhost/index.php?logout=1";
}
function endGame(){
    window.location.href = "http://localhost/index.php?endgame=1";
}

