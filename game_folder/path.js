class Path{
    constructor(x1,y1,x2,y2){
        this.startX = x1;
        this.startY = y1;
        this.finishX = x2;
        this.finishY = y2;

        this.elem = document.createElementNS("http://www.w3.org/2000/svg", "line");
        this.elem.setAttribute("x1", this.startX + 1.65 + "%");
        this.elem.setAttribute("y1", this.startY + 1.65 + "%");
        this.elem.setAttribute("x2", this.finishX + 1.65 + "%");
        this.elem.setAttribute("y2", this.finishY + 1.65 + "%");  
    }

    resetColor() {
        this.elem.style.removeProperty('stroke')
    }
}

class MasterPath{
    constructor(game,col,str){
        this.pathArr=[];

        this.pathSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this.pathSvg.classList.add("path");
        this.pathSvg.style.top =  0 + "%";
        this.pathSvg.style.left = 0 + "%";
        this.pathSvg.style.height = document.getElementById("map-wrapper").clientHeight + "px";
        this.pathSvg.style.width = document.getElementById("map-wrapper").clientWidth + "px";
        this.pathSvg.style.stroke = col;
        this.pathSvg.style.strokeWidth = str + "%";
        wrapperElem.appendChild(this.pathSvg);

        /*crea linea tra le palle*/
        for(var i = 0; i<paths.length; i++){
            this.pathArr.push(
                new Path(
                        game.mb.get(paths[i][0]-1).left,
                        game.mb.get(paths[i][0]-1).top,
                        game.mb.get(paths[i][1]-1).left,
                        game.mb.get(paths[i][1]-1).top
                        )
            );
            this.pathSvg.appendChild(this.pathArr[i].elem);

        }
    }

    /*Calcola le posizioni in cui il giocatore puo' spostarsi*/
    findNearPaths(my_pos){
        return paths.filter((path) =>{
                return (path[0]-1 == my_pos) || (path[1]-1 == my_pos);
            })
 
    }
    findNear(my_pos){
        let my_paths = this.findNearPaths(my_pos);
        return my_paths.map((path)=>{ //ritorna tutti i punti disponibili
            if((path[0]-1) == my_pos) return path[1]-1;
            return path[0]-1;
        })
    }
}