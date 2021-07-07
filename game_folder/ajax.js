function ajaxSave(){
	try {
		xmlHttp=new XMLHttpRequest();
	} catch (e) {
		try {
			xmlHttp=new ActiveXObject("Msxml2.XMLHTTP");
			}           
		//IE (recent versions) 
		catch (e) {
			try {
				xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
				} 
			//IE (older versions)
			catch (e) {
				window.alert("Il browser non supporta AJAX!");
				return false;
			}
		}
	}

    params = "posMr_R=" + game.mr_R.getPos()
            + "&posPolizia=" + game.polizia.getPos()
            + "&posVisMr_R=" + game.mr_R.lastVisiblePos
            + "&turn=" + state.turn
            + "&tokenR=" + game.mr_R.tokenA
            + "&tokenP=" + game.polizia.tokenA;
	xmlHttp.open("GET", "save.php?"+params, true);
	xmlHttp.onreadystatechange = function(){
		endGame();
	}
	xmlHttp.send();
}

function ajaxList(){
	try {
		xmlHttp=new XMLHttpRequest();
	} catch (e) {
		try {
			xmlHttp=new ActiveXObject("Msxml2.XMLHTTP");
			}           
		//IE (recent versions) 
		catch (e) {
			try {
				xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
				} 
			//IE (older versions)
			catch (e) {
				window.alert("Il browser non supporta AJAX!");
				return false;
			}
		}
    }

    xmlHttp.open("GET", "load.php", true);
    xmlHttp.onreadystatechange = loadMatchTable;
    xmlHttp.send();   

    function loadMatchTable(){
        if(xmlHttp.readyState == 4){
            var tbody = document.getElementById("load-match-tbody");
            for(let i = tbody.childNodes.length-1; i > 1; --i){
                tbody.removeChild(tbody.childNodes[i])
            }
            document.getElementById("display-if-empty").style.display = "table-row";
            var lines = JSON.parse(xmlHttp.responseText);
            if(lines.length != 0){
                document.getElementById("display-if-empty").style.display = "none";
                for(let i = 0; i < lines.length; ++i){
                    var newRow = document.createElement("tr");
                    var id = document.createElement("td")
                    var time = document.createElement("td");
                    id.textContent = lines[i]['id'];
                    time.textContent = lines[i]['time'];
                    newRow.addEventListener("click", function(){
                        ajaxLoadMatch(lines[i]['id'])
                    })

                    newRow.appendChild(id);
                    newRow.appendChild(time);
                    tbody.appendChild(newRow);
                }
            }
        }
    }    
}

function ajaxLoadMatch(id){
	try {
		xmlHttp=new XMLHttpRequest();
	} catch (e) {
		try {
			xmlHttp=new ActiveXObject("Msxml2.XMLHTTP");
			}           
		//IE (recent versions) 
		catch (e) {
			try {
				xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
				} 
			//IE (older versions)
			catch (e) {
				window.alert("Il browser non supporta AJAX!");
				return false;
			}
		}
    }

    xmlHttp.open("GET", "load.php?id="+id, true);
    xmlHttp.onreadystatechange = loadMatch;
    xmlHttp.send();   

    function loadMatch(){
        if(xmlHttp.readyState == 4){
            localStorage.setItem('match_info', xmlHttp.responseText);
            window.location.href = '/index.php'
        }        
    }
}


