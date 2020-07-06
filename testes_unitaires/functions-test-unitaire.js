function SendRequest(){
	var items = document.getElementById("log_var").value;
	GetAllProduct(items, ShowObject);
}
function ShowObject(_object){
	// VERIFIER SI UNE ERREUR EST SURVENU
	if (_object.status=="ER"){
		// AFFICHER MESSAGE D'ERREUR
		document.getElementById("server_response").innerHTML = 'ERREUR';
	}else{		
		try {			
			// AFFICHAGE DU RESULTAT
			document.getElementById("server_response").innerHTML = JSON.stringify(_object.data, null, 4);			
		} catch (err) {
			alert("Erreur : " + err);
		}
	}	
}