class Game{
    constructor(){
        this.mr_R;
        this.polizia;
        this.position;
        this.mb = new MasterBall();
        this.mp = new MasterPath(this, "black", 0.9);  
        this.mp_color = new MasterPath(this, "white", 0.4);
    }

    passTurn(role, adv){
        this.setTurn(role, false);
        this.setTurn(adv, true);
    }

    setTurn(p, v){
        this[p].myTurn = v;
    }

    setTempBall(position){
        this.mb.get(position).setTemp();
    }

    resetTempBall(position){
        this.mb.get(position).resetTemp()
    }

    setPlayerBall(pos, role){
        if(role == 'mr_R'){
            this.mb.get(pos).setMr_R()
        } else {
            this.mb.get(pos).setPolizia()
        }
    }

    resetPlayerBall(pos, role){
        if(role == 'mr_R'){
            this.mb.get(pos).resetMr_R()
        } else {
            this.mb.get(pos).resetPolizia()
        }
    }

    resetColorPath(position){
        this.mb.get(position).resetTemp();
    }

    isMr_RVisible(){
        if ((state.turn == 1)||(state.turn == 4)||(state.turn == 7)||(state.turn == 10)){
            return true
        }
        return false
    }

    getToken(x){
        if(x){
            var my_Token=
                "Rimanenti: "+ this.mr_R.tokenA +"  ";
            } else {
            var my_Token=
                "Rimanenti: "+ this.polizia.tokenA +"  ";
            }
        return my_Token;
    }

    startNewMatch(){
        this.initMatch();
        /*Genero la prima mossa di mr_R se non sono io*/
        if(state.role != "mr_R"){
            setTimeout(function(g){
                g.makeMove("mr_R");
                g.chooseBallFrom(g[state.role].getPos());
            }, 1500, this)
        } else this.chooseBallFrom(this[state.role].getPos());
        
    }

    resumeMatch(info){
        this.initMatch(info);
        this.chooseBallFrom(this[state.role].getPos());
    }

    initMatch(info){
        this.mr_R = new Player('Mr_R', true);
        this.polizia = new Player('Polizia', false);

        /*Pos di partenza*/
        if(info){
            this.mr_R.setStartPos(info['posR']);
            this.polizia.setStartPos(info['posP']);
            this.setTurn(state.role, true);
            this.mr_R.tokenA = info['tokenR'];
            this.polizia.tokenA = info['tokenP'];
            state.turn = info['turn'];
            this.mr_R.lastVisiblePos = info['visPosR'];
            if(state.role == 'polizia'){
                this.setPlayerBall(this.mr_R.lastVisiblePos, 'mr_R');
            } else {
                this.setPlayerBall(this.mr_R.getPos(), 'mr_R');
            }
        } else{
            this.position = Math.floor(Math.random()*ballCoords.length)
            this.mr_R.setStartPos(this.position)
            this.position += Math.floor((ballCoords.length/2 + Math.random()*16 - 7));
            this.position %= ballCoords.length;
            this.polizia.setStartPos(this.position)
            /*Setup dei turni*/
            this.setTurn("mr_R", true);
            this.setPlayerBall(this.mr_R.getPos(), 'mr_R');
            this.mr_R.lastVisiblePos = this.mr_R.getPos();
        }

        this.setPlayerBall(this.polizia.getPos(), 'polizia');    
        
        this.updateBoard();
    }

    updateBoard(){
        updateTextToken();
        updateLastPos();
        updateTextTurn();
    }

    /*Mostra le possibili posizioni in cui il giocatore puo' spostarsi*/
    chooseBallFrom(ball){
        let near = this.mp.findNear(ball);
        near.map((p) => {
            if(p != this[state.role].getPos() &&
               !this[state.role].isInPath(p)) {
                document.getElementById("ball-" + p).classList.add("possi-ball");
            }
        })

    }

    /*Resetta i percorsi possibili grigi*/
    resetChoiceFrom(ball){
        let near = this.mp.findNear(ball);
        near.map((p) => {
            if(p != this[state.role].getPos() /*&& p != prev*/){
                document.getElementById("ball-"+p).classList.remove("possi-ball");
            }
        })
    }

    /*Elimina palle grigie vecchie + seleziona le nuove*/
    updatePossiBall(lastPos, ball_index){
        this.resetChoiceFrom(lastPos, ball_index);
        this.chooseBallFrom(ball_index);
    }

    /*Gestione dei turni e delle mosse degli avversari*/
    generatePos(adv, pos){
        let offset = 0;
        let split = Math.floor((game.mp.findNear(pos).length)/2);

        /*mr_R scappa da polizia*/
        if(adv == "mr_R"){
            if(pos > this[state.role].currPos){
                offset = split;
            } //parte alta array
        } 

        /*polizia acchiappa mr_R*/
        if(adv == "polizia"){
            if(pos < this[state.role].currPos){
                offset = split;
            }
        }
        let newpos = this.mp.findNear(pos)[Math.floor(Math.random()*(this.mp.findNear(pos).length-split))+offset];

        return newpos;
    }

    makeMove(adv){
        var pos = this[adv].currPos;
        let lenPath = 3;
        var newpos = 0;
        for(let i = 0; i<lenPath; i++) {
            newpos = this.generatePos(adv, pos)
            if((newpos == this[state.role].getPos()) && adv == "mr_R"){
                    let samePos = newpos;
                    while(newpos == samePos){
                        newpos = this.generatePos(adv, pos)
                    }                
            } else {
                for(let j = 0; (this[adv].isInPath(newpos)) && j<4; j++){
                    newpos = this.generatePos(adv, pos)
                }
            }
            pos = newpos;
            this.temporaryPath(newpos, adv);
        }
        confirmPath(adv);
        this.passTurn(adv, state.role);        
    }

    /*Display percorso*/
    updateTextPath(array, role){
        var my_path = [];
        for(let i=0; i<array.length; i++){
             
            if(role == "polizia"){
                my_path += array[i]+1;
            } else {
                my_path += "?";
            }
            if(i<array.length-1){ 
                my_path = my_path + " -> ";
            }
            if(i>0) {
                this[role].delToken("A");
                if(role == "polizia") {
                    this.mr_R.addToken("A");
                }
            }
        }
        return role + ": " + my_path;
    }

    /*Alert*/
    checkMove(ball_index, role){
        let farPos = this.mp.findNear(this[role].getLastPos()).every((v) => v != ball_index)
        let noToken = (this[role].movePath.length - 1) == this[role].tokenA
        if((farPos||noToken) && !this[role].isInPath(ball_index) && role == state.role){
            if(farPos) {
                alert("Seleziona una posizione vicina"); return true;
            }
            if(noToken) {
                alert("Non hai abbastanza gettoni"); return true;
            }
        }
        if(role == state.role && role == "mr_R" && ball_index == this.polizia.getPos()) {
            alert("Non puoi passare sopra Polizia!")
            return true;
        }
        return false;
    }

    /* Selezione del percorso del giocatore, non ancora confermato */
    temporaryPath(ball_index, role){ 
        var ind = ball_index
        let lastPos = this[role].getLastPos();

        if(this.checkMove(ball_index, role)) return;

        if(this[role].isInPath(ball_index) || ball_index == -1){
            ind = (ball_index == -1) ? this[role].getPos() : ball_index;
            let index = this[role].movePath.indexOf(ball_index);
            resetMyPath(role, index);
        } else {
            let p = (this[role].pushPath(ball_index))
            if(p && role == state.role){
                this.setColorPath(lastPos, ball_index, "yellow");
                this.setTempBall(ball_index);
            }
        }
        /*Non mostra quelle dell'avversario*/
        if(role == state.role) {
            this.updatePossiBall(lastPos, ball_index)
        }
        return ind;
    }
    
    /* Colora il percorso selezionato */
    setColorPath(start, end, color){
        if(end >= 0) {
            var x1 = this.mb.get(start).left; //scompongo palle
            var y1 = this.mb.get(start).top;
            var x2 = this.mb.get(end).left;
            var y2 = this.mb.get(end).top;
            var my_line=this.mp_color.pathArr.findIndex((a)=>{
                return (a.startX==x1 && a.startY==y1 && a.finishX==x2 && a.finishY==y2)
                        || (a.startX==x2 && a.startY==y2 && a.finishX==x1 && a.finishY==y1);       
            })
            if(color == "no_fill") this.mp_color.pathArr[my_line].resetColor();
            else this.mp_color.pathArr[my_line].elem.style.stroke = color;
        }
    }
}