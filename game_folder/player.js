class Player{
    constructor(n,x){
        this.name = n;
        this.role = x;
        this.win = false;

        if(x){ //Mr_X
            this.tokenA = 10; //by foot
            this.lastVisiblePos = 0;
        } else  {
            this.tokenA = 20; //by foot
        }
        this.myTurn = false; //is my turn?
        this.currPos = null; //initial pos
        this.movePath = [];
    }
   

    delToken(token){
        switch(token){
            case "A": this.tokenA--;
            break;
        }   
        if(this.role==0) return token; 
        else return 0;
    }

    /*posso aggiungerli solo a Mr.R*/
    addToken(token){ 
        if(this.role==1){
            switch(token){
                case "A": this.tokenA++;
                break;
            } 
        }
    }

    runOut(){
        if(this.tokenA <= 0) return true;
    }

    setStartPos(position){
        this.currPos = position; //anche l'array del path prende posizione
        this.movePath[0]= position;
    }

    getPos(){
        return this.currPos;
    }

    getLastPos(){
        return this.movePath[this.movePath.length - 1];

    }

    getPath(){
        return this.movePath;
    }

    pushPath(ball_index){
        if(this.isInPath(ball_index)) return false;
        if((this.movePath.length - 1) == this.tokenA) return false;
        this.movePath.push(ball_index);
        return true;
    }

    /* Controlla se la nuova pos e' gia' dentro il cammino selezionato */
    isInPath(ball_index){
        for(let i=0; i<this.movePath.length; i++){
            if(this.movePath[i]==ball_index) return true;
        }
        return false;
    }

}