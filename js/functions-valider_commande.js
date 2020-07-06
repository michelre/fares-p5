/*
# FONCTION D'ENVOIS DE LA COMMANDE AU SERVEUR
# PARAMETRES
- _product : [ teddies, cameras, furniture ]
- _order   : {
contact: {
firstName: string,
lastName: string,
address: string,
city: string,
email: string
}
products: [string]
}
-_callback : fonction callback qui prend comme paramettre la reponse du serveur
# RENVOIS
- object = {
status : 'val'             // OK, ER
message: 'message erreur'  // MESSAGE D'ERREUR
data   : 'json_data'       // DONNEE JSON RECU DU SERVEUR
}
*/
function SendBuyRequest(_product, _callback) {
    // VERIFIER LA VALIDATION DU FORMULAIR
    if (ValidForm()) {

        // EXTRACTION DES DONNEES DU FORMULAIR & DU COOKIE
        var _order = ExtractDataAndConvertToJson();
        // ENVOIS DE LA COMMANDE AU SERVEUR
        var _req = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: _order
        };
        fetch("http://localhost:3000/api/" + _product + "/order", _req)
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
}

/*
# FONCTION D'EXTRACTION DES DONNEES A PARTIR DU FORMULAIR
# RENVOIS
- null
- json: {
contact: {
firstName: string,
lastName: string,
address: string,
city: string,
email: string
}
products: [string]
}
*/
function ExtractDataAndConvertToJson() {
    try {
        // INITIALISATION DES VARIABLES
        var _cookie = [];
        var _products = [];
        // RECUPERE LES DONNES DU COOKIE
        var _json = getCookie("ORINOCO-CART");
        // VERIFIER SI LA VALEUR EST VIDE
        if (_json != "") {
            // RECUPERE LES DONNEES DU FORMULAIR
            var _firstName = document.getElementById("nom").value;
            var _lastName = document.getElementById("prenom").value;
            var _address = document.getElementById("adresse").value;
            var _city = document.getElementById("ville").value;
            var _email = document.getElementById("email").value;

            // CONVERTIR DE "JSON" VERS "ARRAY"
            _cookie = JSON.parse(_json);
            for (i = 0; i < _cookie.length; i++) {
                _products.push(_cookie[i].id);
            }
            // CONVERT TO JSON
            var obj = {
                contact: {
                    firstName: _firstName,
                    lastName: _lastName,
                    address: _address,
                    city: _city,
                    email: _email
                }, products: _products
            };
            var myJSON = JSON.stringify(obj);
            // RENVOYER LE RESULTAT
            return myJSON;
        } else {
            return null;
        }
    } catch (err) {
        return null;
    }
}

/*
# FONCTION D'AFFICHAGE DE LA LISTE DES PRODUITS ENREGISTRER DANS LE PANIER
*/
function ShowCart() {
    // INITIALISATION DES VARIABLES
    var _cookie = [];
    var _total = 0;
    // RECUPERE LE COOKIE
    var _json = getCookie("ORINOCO-CART");
    // VERIFIER SI LA VALEUR EST VIDE
    _section = '<table style="margin:auto;width:400px;" border="0">';
    _section += '<tr>';
    _section += ' <th align="left" width="40%">Produit</th>';
    _section += ' <th align="left" width="30%">Couleur</th>';
    _section += ' <th align="right" width="25%">Prix</th>';
    _section += ' <th align="center" width="5%"></th>';
    _section += '</tr>';
    if (_json != "") {
        // CONVERTIR DE "JSON" VERS "ARRAY"
        _cookie = JSON.parse(_json);
        /* CREATION DU CODE HTML POUR L'AFFICHAGE DE LA LISTE DES PRODUITS ENREGISTRER DANS LE PANIER */
        for (i = 0; i < _cookie.length; i++) {
            _section += '<tr>';
            _section += ' <td align="left"><a href="#">' + _cookie[i].name + '</a></td>';
            _section += ' <td align="left">' + _cookie[i].color + '</td>';
            _section += ' <td align="right">' + _cookie[i].price + '€</td>';
            _section += ' <td align="center"><button type="submit" style="margin-left:10px;cursor:pointer;" onclick="DeleteProductFromCart(\'' + i + '\');"><i class="fas fa-trash"></i></button></td>';
            _section += '</tr>';
            // CALCULE DU TOTAL A PAYE
            _total += _cookie[i].price;
        }
    }
    _section += '<tr>';
    _section += ' <td colspan="2" style="padding-left:10px;"><b>Total<b></td>';
    _section += ' <td align="right"><b>' + _total + '€<b></td>';
    _section += ' <td></td>';
    _section += '</tr>';
    _section += '</table>';
    // AFFICHAGE DU RESULTAT
    document.getElementById("cart_item_list").innerHTML = _section;
    // DESACTIVE LES INPUT CAR LE PANIER EST VIDE
    if (_cookie.length == 0) {
        DisableInputs();
    }
}

/*
# FONCTION QUI DESACTIVE LES INPUT QUAND LE PANIER EST VIDE
*/
function DisableInputs() {
    /*
    document.getElementById("nom").disabled = true;
    document.getElementById("prenom").disabled = true;
    document.getElementById("adresse").disabled = true;
    document.getElementById("ville").disabled = true;
    document.getElementById("email").disabled = true;
    document.getElementById("btn_valider").disabled = true;
    */
}

/*
# FONCTION DE SPRESSION DE PRODUIT DU PANIER
# PARAMETRE
- _index :  l'index du produit a supprimer dans l'array cookie
*/
function DeleteProductFromCart(_index) {
    // INITIALISATION DES VARIABLES
    var _cookie = [];
    // RECUPERE LE COOKIE
    var _json = getCookie("ORINOCO-CART");
    // VERIFIER SI LA VALEUR EST VIDE
    if (_json != "") {
        // CONVERTIR DE "JSON" VERS "ARRAY"
        _cookie = JSON.parse(_json);
        // VERIFIER QUE LE TABLEAU N'EST PAS VIDE
        if (_cookie.length != 0) {
            // SUPPRIMER L'ELEMENT DU TABLEAU
            _cookie.splice(_index, 1);
            // SAUVEGARDER LA VALEUR DU NOUVEAU COOKIE
            setCookie("ORINOCO-CART", _cookie);
            // ACTUALISER L'AFFICHAGE DU MENU "Panier(n)"
            UpdateCartValue();
            // ACTUALISER L'AFFICHAGE DU PANIER
            ShowCart();
        }
    }
}

/*
    # FONCTION DE VALIDATION DU FORMULAIR
*/
function ValidForm() {
    return (validate("nom") && validate("prenom") && validate("adresse") && validate("ville") && validate("email"));
}

/*
# FONCTION DE VALIDATION DES INPUTS
# PARAMETRE
- _index : id de la balise html <input>
*/
function validate(_index) {
    // VERIFIER LES DONNEES SAISI DANS LA BALISE L'INPUT
    switch (_index) {
        case 'nom' :
        case 'prenom' :
        case 'adresse' :
        case 'ville' :
            // VERIFIER SI L'INPUT N'EST PAS VIDE
            if (document.getElementById(_index).value != "") {
                document.getElementById("ic-field_" + _index).className = "ic-field";
                document.getElementById("ic-message_" + _index).className = "ic-message";
                return true;
            } else {
                document.getElementById("ic-field_" + _index).className = "ic-field err-ic-field";
                document.getElementById("ic-message_" + _index).className = "ic-message err-ic-message";
                return false;
            }
            break;
        case 'email' :
            // INITIALISATION DE LA REGEX
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            // VERIFIER SI L'EMAIL EST VALIDE
            if (re.test(String(document.getElementById('email').value).toLowerCase())) {
                document.getElementById("ic-field_email").className = "ic-field";
                document.getElementById("ic-message_email").className = "ic-message";
                return true;
            } else {
                document.getElementById("ic-field_email").className = "ic-field err-ic-field";
                document.getElementById("ic-message_email").className = "ic-message err-ic-message";
                return false;
            }
            break;
    }
}

/*
# FONCTION D'AFFICHAGE DE LA REPONSE DU SERVEUR APRES LE PASSAGE DE LA COMMANDE
# PARAMETRE
- _object = {
status : 'val'             // OK, ER
message: 'message erreur'  // MESSAGE D'ERREUR
data   : 'json_data'       // DONNEE JSON RECU DU SERVEUR
}
*/
function ShowServerResponse(_object) {
    // VERIFIER SI UNE ERREUR EST SURVENU
    if (_object.status == "ER") {
        // AFFICHER MESSAGE D'ERREUR
        alert(_object.message);
    } else {
        // CONVERTIR L'OBJET EN JSON
        var _json = JSON.stringify(_object.data);
        // SAUVEGARDER LE JSON RENVOYER PAR LE SERVEUR DANS LA VARIABLES "srv-response"
        localStorage.setItem("srv-response", _json);
        // OUVRIR LA PAGE DE CONFIRAMTION
        location.href = 'confirmation_commande.html'
    }
}
