function ShowServerResponse(){
	// SUPPRIMER LE COOKIE
	deleteCookie("ORINOCO-CART");
	// SHOW CART MENU VALUE
	UpdateCartValue();
	// RECUPERE LA VALEUR DE LA VARIABLE SAUVEGARDER
	var _json = localStorage.getItem("srv-response");
	// SUPPRIMER LA VARIABLE SAUVEGARDER
	localStorage.removeItem("srv-response");
	// CONVERTIR DE JSON EN OBJECT
	var _data = JSON.parse(_json);
	// VERIFIER SI LA VARIABLE N'EST PAS NULL
	if (_data != null){
		// CALCULE DU PROX TOTAL
		var _total = 0;
		for(i=0; i<_data.products.length; i++){
			_total += _data.products[i].price;
		}
		// AFFICHER L'ID DE LA COMMANDE & LE PRIX TOTAL
		document.getElementById("total-price").innerHTML = _total;
		document.getElementById("command-id").innerHTML = _data.orderId;
	}else{
		// AFFICHER L'ID DE LA COMMANDE & LE PRIX TOTAL
		document.getElementById("total-price").innerHTML = "-";
		document.getElementById("command-id").innerHTML = "-";
	}	
}