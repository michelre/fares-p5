/*
	# FONCTION DE RECUPERATION DES INFOS DES PRODUITS DISPONIBLE A LA VENTE
	# PARAMETRES
		- _product  : [ teddies, cameras, furniture ]
		- _callback : fonction callback qui prend comme paramettre la reponse du serveur
	# RENVOIS
		- object = {
				status : 'val'             // OK, ER
				message: 'message erreur'  // MESSAGE D'ERREUR
				data   : 'json_data'       // DONNEE JSON RECU DU SERVEUR
	}
*/
function GetAllProduct(_product, _callback) {
    // ENVOIS DE LA COMMANDE AU SERVEUR
    var _req = {method: 'GET'};
    fetch("http://localhost:3000/api/" + _product, _req)
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
        });
}

/*
	# FONCTION D'AFFICHAGE DES PRODUITS DISPONIBLE A LA VENTE
	# PARAMETRES
		- object = {
				status : 'val'             // OK, ER
				message: 'message erreur'  // MESSAGE D'ERREUR
				data   : 'json_data'       // DONNEE JSON RECU DU SERVEUR
	}
*/
function ShowProductList(_object) {
    // VERIFIER SI UNE ERREUR EST SURVENU
    if (_object.status == "ER") {
        // AFFICHER MESSAGE D'ERREUR
        alert(_object.message);
    } else {
        try {
            // GET DATA
            var _section = '';
            var compteur = 7;
            for (i = 0; i < _object.data.length; i++) {
                /* GROUPER LES PRODUITS, CHAQUE CONTAINER DOIT CONTENIR AU MAX 8 PRODUIT */
                if (compteur == 7) {
                    _section += '<div class="container-fluid">\n';
                    _section += '<div class="row no-gutters">\n';
                }
                /* CREATION DU CODE HTML POUR L'AFFICHAGE DU PRODUIT */
                _section += '<div class="col-xl-2 col-lg-3 col-md-4 col-sm-6">\n';
                _section += '<div class="wrapper">\n';
                _section += '<div class="product">\n';
                _section += '<div class="overlay-product">\n';
                _section += '<div class="overlay-image"></div>\n';
                _section += '<input class="overlay-button" type="button" value="voir les options d\'achat" onclick="window.location.href=\'personalise.html?id=' + _object.data[i]._id + '\'">\n';
                _section += '</div>\n';
                _section += '<img src="' + _object.data[i].imageUrl + '" alt="" height="200" width="200" />\n';
                _section += '<div class="details-product">\n';
                _section += '<span class="price">' + _object.data[i].price + '€</span>\n';
                _section += '<span class="title truncate-title">' + _object.data[i].name + '</span>\n';
                _section += '<p class="truncate-description">' + _object.data[i].description + '</p>';
                _section += '</div>\n';
                _section += '</div>\n';
                _section += '</div>\n';
                _section += '</div>\n';
                /* GROUPER LES PRODUITS, CHAQUE CONTAINER DOIT CONTENIR AU MAX 8 PRODUIT */
                if (compteur == 0) {
                    _section += '</div>\n';
                    _section += '</div>\n';
                    compteur = 7;
                } else {
                    compteur--;
                }
            }
            /* FERMER LA DERNIERE DIV SI LE NOMBRE DE PRODUITS N'A PAS ATTENT 8 */
            if (compteur != 0) {
                _section.concat('</div>\n');
                _section.concat('</div>\n');
            }

            // AFFICHAGE DU RESULTAT
            document.getElementById("product_list").innerHTML = _section;

        } catch (err) {
            alert("Erreur : " + err);
        }
    }
}
