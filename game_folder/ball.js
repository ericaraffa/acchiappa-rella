class MasterBall{
    constructor(){
        this.ballArr=[];
         /*crea palle*/  
        for (var i = 0; i<ballCoords.length; i++){
            this.ballArr.push(
                new Ball(
                    (ballCoords[i][0]-35)/2428*100,
                    (ballCoords[i][1]-35)/2140*100,
                    i+1                
                )
            );    
        this.ballArr[i].text.textContent = i+1;
        this.ballArr[i].elem.id = "ball-" + i;
        }
    }
    
    get(index){
        return this.ballArr[index];
    }
}

class Ball{
    constructor(l, t, n){
        this.top = t;
        this.left = l;
        this.num = n;
        //Elemento Svg
        this.elem = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this.elem.classList.add("ball");
        this.elem.style.top = this.top -1.0 + "%";
        this.elem.style.left = this.left -0.6 + "%";

        this.elem.addEventListener('click', function() {
            if(state.role && game[state.role].myTurn){
                updateBall(n-1);
            }
        })
        //Numero
        this.text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        //Sfasamento numeri doppi
        if(n<10) 
            this.text.setAttribute("x", (35 + (screen.width/1366 -1)) + "%"); 
        else this.text.setAttribute("x", (21 + (screen.width/1366 -1)) + "%"); 
        this.text.setAttribute("y",  (68 + (screen.height/720 -1)) + "%");
        this.text.style.fontSize = (screen.width/1366 * 90) + "%";

        //Elemento cerchio
        this.circElem = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        this.circElem.setAttribute("cx", "50%");
        this.circElem.setAttribute("cy", "50%");
        this.circElem.setAttribute("r", "40%");

        this.elem.appendChild(this.circElem);
        this.elem.appendChild(this.text);
        wrapperElem.appendChild(this.elem);
    }

    setTemp() {
        this.elem.classList.add('temp-ball')
    }

    setMr_R() {
        this.elem.classList.add('mr_R-ball')
    }

    setPolizia() {
        this.elem.classList.add('polizia-ball')
    }

    resetMr_R() {
        this.elem.classList.remove('mr_R-ball')
    }

    resetPolizia() {
        this.elem.classList.remove('polizia-ball')
    }

    resetTemp() {
        this.elem.classList.remove('temp-ball')
    }
}