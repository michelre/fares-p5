/* VARIABLES GLOBALES */
var _selected_product = {id: "", color: "", name: "", price: ""};

function get(url){
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function(){
            if(xhr.status === 200 && xhr.readyState === XMLHttpRequest.DONE){
                resolve(JSON.parse(xhr.responseText))
            }
        }

        xhr.open('GET', url);
        xhr.send();
    })
}

/*
	# FONCTION DE RECUPERATION DES INFOS D'UN PRODUIT
	# PARAMETRES
		- _product : [ teddies, cameras, furniture ]
		- _id      : identifiant du produit
		- _callback : fonction callback qui prend comme paramettre la reponse du serveur
	# RENVOIS
		- object = {
				status : 'val'             // OK, ER
				message: 'message erreur'  // MESSAGE D'ERREUR
				data   : 'json_data'       // DONNEE JSON RECU DU SERVEUR
		}
*/
function GetProductById(_product, _id, _callback) {
    // ENVOIS DE LA COMMANDE AU SERVEUR
    var _req = {method: 'GET'};
    get("http://localhost:3000/api/" + _product + "/" + _id).then((data) => {
        _callback({status: "OK", message: "", data: data});
    })
    /*fetch("http://localhost:3000/api/" + _product + "/" + _id, _req)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                _callback({
                    status: "ER",
                    message: "Erreur: " + response.status + " " + response.statusText,
                    data: null
                });
            }
        })
        .then(data => {
            _callback({status: "OK", message: "", data: data});
        })
        .catch(function (error) {
            _callback({status: "ER", message: "Erreur: " + error, data: null});
        });*/
}

/*
	# FONCTION D'AFFICHAGE DU PRODUIT
	# PARAMETRE
		- object = {
				status : 'val'             // OK, ER
				message: 'message erreur'  // MESSAGE D'ERREUR
				data   : 'json_data'       // DONNEE JSON RECU DU SERVEUR
		}
*/
function ShowProduct(_object) {
    // VERIFIER SI UNE ERREUR EST SURVENU
    if (_object.status == "ER") {
        // AFFICHER MESSAGE D'ERREUR
        alert(_object.message);
    } else {
        try {
            // GENERATION DE CERCLE ROND CLOROIER SELON LES COULEURS DU TABLEAU _object.data.colors[] REPRESANTANT LES COULEURS DU PRODUIT DISPONIBLE
            var _section = '';
            for (i = 0; i < _object.data.colors.length; i++) {
                _section += '<li><input type="submit" value="" class="circle" style="background-color:' + _object.data.colors[i] + ';" onclick="UpdateSelectedColor(\'' + _object.data.colors[i] + '\');"></li>\n';
            }
            // INITAILISER UNE COULEUR PAR DEFAULT "LA PREMIER COULEUR DU TABLEAU RECU EST LA COULEUR PAR DEFAULT DU PRODUIT"
            if (_object.data.colors.length > 0) {
                _selected_product.color = _object.data.colors[0];
            }
            // ACTUALISER L'AFFICHAGE HTML
            document.getElementById("product_image").innerHTML = '<img src="' + _object.data.imageUrl + '" alt=""  height="300" width="300">';
            document.getElementById("product_info").innerHTML = '<h1>' + _object.data.name + '</h1><span>ID: ' + _object.data._id + '</span>';
            document.getElementById("product_price").innerHTML = '<span>' + _object.data.price + '</span> €';
            document.getElementById("product_description").innerHTML = _object.data.description;
            document.getElementById("product_color").innerHTML = _section;
            // SAUVEGARDE DES INFOS DU PRODUIT
            _selected_product.id = _object.data._id;
            _selected_product.name = _object.data.name;
            _selected_product.price = _object.data.price;
        } catch (err) {
            alert("Erreur : " + err);
        }
    }
}

/*
	# FONCTION D'ACTUALISATION DE LA COULEUR DU PRODUIT
	# PARAMETRE
		- _color : nouvelle couleur selectioner
*/
function UpdateSelectedColor(_color) {
    // MODIFIER LA COULEUR DU PRODUIT
    _selected_product.color = _color;
}

/*
	# FONCTION DE RECUPERAION DE L'ID DU PRODUIT A PARTIR DE L'URL DE LA PAGE
	# RENVOIS
		- string : contenant la valeur de l'id
*/
function GetProductId() {
    // EXTRAIRE L'URL
    var url_string = window.location.href
    var url = new URL(url_string);
    // EXTRAIRE L'ID DE L'URL
    var _id = url.searchParams.get("id");
    // RENVOYER LE RESULTAT
    return _id;
}

/*
	# FONCTION D'AJOUT DU PRODUIT AU PANIER
*/
function AddItemToCart() {
    // INITIALISATION DES VARIABLES
    var _cookie = [];
    var found = false;
    // RECUPERE LE COOKIE
    var _json = getCookie("ORINOCO-CART");
    // VERIFIER SI LA VALEUR EST VIDE
    if (_json == "") {
        // AJOUTER L'ELEMENT DANS LE TABLEAU
        _cookie.push(_selected_product);
        // SAUVEGARDER LE NOUVEAU COOKIE
        setCookie("ORINOCO-CART", _cookie);
        // ACTUALISER L'UI
        UpdateCartValue();
    } else {
        // CONVERTIR DE "JSON" VERS "ARRAY"
        _cookie = JSON.parse(_json);
        // AJOUTER L'ELEMENT DANS LE TABLEAU
        _cookie.push(_selected_product);
        // SAUVEGARDER LE NOUVEAU COOKIE
        setCookie("ORINOCO-CART", _cookie);
        // ACTUALISER L'UI
        UpdateCartValue();
    }
}
