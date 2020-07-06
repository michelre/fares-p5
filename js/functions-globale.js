/*
	# FONCTION D'ACTUALISTAION DE LUI "ACTUALISER LA SECTION Panier(n) OU n EST LE NOMBRE D'ITEMS DANS LE PANIER"
*/
function UpdateCartValue(){
	// INITIALISATION DES VARIABLES
	var _cookie = [];
	// RECUPERE LE COOKIE
	var _json = getCookie("ORINOCO-CART");
	// VERIFIER SI LA VALEUR EST VIDE
	if (_json == ""){
		// AFFICHER & ACTUALISER LE COMPTEUR DU PANIER
		document.getElementById("cart_menu").innerHTML =  '<i class="fa" style="font-size:24px">&#xf07a;</i><span class="badge badge-warning" id="lblCartCount">0</span>'
	}else{
		// CONVERTIR L'OBJET "JSON" EN "ARRAY"
		_cookie = JSON.parse(_json);
		// AFFICHER & ACTUALISER LE COMPTEUR DU PANIER
		document.getElementById("cart_menu").innerHTML =  '<i class="fa" style="font-size:24px">&#xf07a;</i><span class="badge badge-warning" id="lblCartCount">'+_cookie.length+'</span>'
	}
}
/*
	# FONCTIONS D'INTIALISATION DES COOKIES
	# PARAMETRES
		- _varname   : nom du cookie
		- _varvalue  : valeur du cookie sous form d'un array {id : id_produit, color: color_produit, name : nom_produit, price: prix_produit}
*/
function setCookie(_varname, _varvalue) {
	// CALCULE DE LA DATE D'EXPIRATION A J+1 ET LA STOKER DANS "_expiration"
	var date = new Date();
	date.setTime(date.getTime() + 86400000);
	var _expiration = "expires="+ date.toUTCString();
	// INITAILISER LE COOKIE AVEC UNE DATE D'EXPIRATION J+1
	document.cookie = _varname + "=" + JSON.stringify(_varvalue) + ";" + _expiration + ";path=/";
}
/*
	# FONCTION DE RECUPERATION DE LA VALEUR DU COOKIE
	# PARAMETRES
		- _varname : nom du cookie
	# RENVOIS
		- json : valeur du cookie enregistré
*/
function getCookie(_varname) {
	// INITIALISATION DES VARIABLES
	var name = _varname + "=";
	// RECUPERE LES COOKIES
	var decodedCookie = decodeURIComponent(document.cookie);
	// DECOUPER LE STRING EN ";"
	var ca = decodedCookie.split(';');
	// RECHERCHER LE NOM DU COOKIE "_varname" DANS LES STRINGS du tableau "ca"
	for(var i = 0; i <ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			// RECUPERE & RENVOYER LA VALEUR DU COOKIE "_varname"
			return c.substring(name.length, c.length);
		}
	}
	return "";
}
/*
	# FONCTION DE SUPPRESSION DE COOKIE
	# PARAMETRES
		- _varname : nom du cookie
*/
function deleteCookie(_cookie){
	// SUPPRIMER LE COOKIE
	document.cookie = _cookie+"=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
}