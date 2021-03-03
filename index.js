//préparation des url produit
let urlProduct = ''

// préparation du prix total
let totalPrice = 0

//création du localStorage
if(localStorage.getItem("LSCartProducts")){
    console.log("LocalStorage possède déjà LSCartProducts !")
    }else{
        let cartProducts = []
        localStorage.setItem("LSCartProducts", JSON.stringify(cartProducts))
        console.log(cartProducts + 'Message pour le LSCartProducts')
    }

//création du panier
let cartProducts = JSON.parse(localStorage.getItem("LSCartProducts"))

// fonction AJAX appel des produits

let getProducts = function(){
    return new Promise(function(resolve){
        let request = new XMLHttpRequest()
        request.onreadystatechange = function(){
            if(request.readyState === XMLHttpRequest.DONE && request.status == 200){
                resolve(JSON.parse(request.responseText))
            } else {
                console.log("request says error")
            }
        }

        request.open("GET", "http://localhost:3000/api/teddies" + '/' + urlProduct)
        request.send()
    })
}

// préparation pour la page d'accueil

const indexTeddyBear = document.getElementById('index_oursEnPeluche')

// appel des produits et mise en page
async function getIndex(){
    if(indexTeddyBear != null){
        const allProducts = await getProducts()

        for(i=0; i < allProducts.length; i++) {

            let createdLi = document.createElement("li")
            let createdA = document.createElement("a")
            let createdFigure = document.createElement("figure")
            let createdImg = document.createElement("img")
            let createdFigcaption = document.createElement("figcaption")
            let createdName = document.createElement("h3")
            let createdPrice = document.createElement("p")

            indexTeddyBear.appendChild(createdLi)
            createdLi.classList.add("createdLi")
            createdLi.appendChild(createdA)
            createdA.appendChild(createdFigure)
            createdFigure.appendChild(createdImg)
            createdFigure.appendChild(createdFigcaption)
            createdFigcaption.appendChild(createdName)
            createdFigcaption.appendChild(createdPrice)
            createdPrice.classList.add("createdPrice")

            createdName.innerHTML = allProducts[i].name
            createdPrice.innerHTML = parseInt(allProducts[i].price / 100).toFixed(2) + ' €'
            createdImg.setAttribute('src', allProducts[i].imageUrl)
            createdA.setAttribute('href', 'produit.html?id='+allProducts[i]._id)
        }
    } else{
        console.log("INDEXTEDDYBEAR isn't exist")
    }
}

getIndex()

// fonction pour la page Produit.html
// mise en page et création de l'URL

async function pageProduct(){
    if(document.getElementById("produit_photo") != null){
        let url = window.location.search
        const urlParams = new URLSearchParams(url)
        urlProduct = urlParams.get('id')
        
        const allProducts = await getProducts()
    
        document.getElementById("produit_photo").setAttribute('src', allProducts.imageUrl)
        document.getElementById("produit_nom").innerHTML = allProducts.name
        document.getElementById("produit_description").innerHTML = allProducts.description
        document.getElementById("produit_prix").innerHTML = parseInt(allProducts.price / 100).toFixed(2) + ' €'
    
        // pour l'ajout des options de couleur
        allProducts.colors.forEach(function(product){
            let optionColor = document.createElement("option")
            document.getElementById("color").appendChild(optionColor).innerHTML = product
        })  
    }
}

// appel de la page produit au clic des <li>
createdLi = document.getElementsByClassName("createdLi")
createdLi = addEventListener('click', pageProduct())

// Ajout au panier
if(document.getElementById('produit_bouton') != null){
    const produit_bouton = document.getElementById('produit_bouton')

    produit_bouton.addEventListener('click', async function(){
        console.log('le bouton marche !')
        const allProducts = await getProducts()

        cartProducts.push(allProducts)
        localStorage.setItem("LSCartProducts", JSON.stringify(cartProducts))
        let messageAddToCart = document.getElementById('messageAddToCart')
        messageAddToCart.style.display = 'block'
        
        console.log('Ajout au panier réussi !')
        console.log(cartProducts + " sont dans le panier")
    })
}

const mainCart = document.getElementById('mainCart')

// vérifier si qqch est dans le panier afin d'en ajouter
if(cartProducts.length > 0 && mainCart != null){

    let form = document.getElementById('form')
    form.style.display = 'flex'
    let textFinalPrice = document.getElementById('finalPrice')
    textFinalPrice.style.display = 'block'
    let estVide = document.getElementById('estVide')
    estVide.style.display = 'none'

    for(let i = 0; i < cartProducts.length; i++){ 

        // mise en page du panier

        let sectionCartArticle = document.createElement('section')
        mainCart.appendChild(sectionCartArticle)
        sectionCartArticle.classList.add('cart_Article')
        let imgCart = document.createElement("img")
        sectionCartArticle.appendChild(imgCart)
        imgCart.id = 'cart_photo'
        imgCart.setAttribute('src', cartProducts[i].imageUrl)
        let h1Cart = document.createElement("h1")
        sectionCartArticle.appendChild(h1Cart)
        h1Cart.innerHTML = cartProducts[i].name
        let priceCart = document.createElement('p')
        sectionCartArticle.appendChild(priceCart)
        priceCart.id = 'cart_prix'
        priceCart.innerHTML = parseInt(cartProducts[i].price / 100).toFixed(2) + '€'
        let buttonCartTrash = document.createElement('button')
        sectionCartArticle.appendChild(buttonCartTrash)
        let iTrash = document.createElement('span')
        buttonCartTrash.appendChild(iTrash)
        iTrash.classList.add('fas', 'fa-trash')

        // afficher le prix total à l'utilisateur
        totalPrice += cartProducts[i].price
        console.log(totalPrice)
        let finalPrice = document.getElementById('totalPrice')
        finalPrice.innerHTML = ' ' + parseInt(totalPrice / 100).toFixed(2) + ' €'
        console.log(i + ' numéro ourson')
        // supprimer un élément du panier
        
        buttonCartTrash.addEventListener('click', () => {
            cartProducts.splice(i,1) //supprimer l'élément
            console.log('element ' + cartProducts.name + 'supprimé !')
            localStorage.clear() // nettoyer le localStorage
            localStorage.setItem('LSCartProducts', JSON.stringify(cartProducts)) // réactualiser le panier
            window.location.reload() // afficher la nouvelle fenêtre
        })
    }
}

// finalisation : page de confirmation et requête POST
 // créations éléments de réponse de l'API
 let contact = {}
 let products = []
 console.log(contact, products)

 // vérifier les indications du formulaire
 formChecker = () =>{

    // regex
    const lettersChecker = /[a-zA-Z]/
    const symbolsChecker = /[§!@#$%^&*(),.?":{}|<>]/
    const numbersChecker = /[1-9]/
    const emailChecker = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/

    // récupération des valeurs inscrites
    let firstNameValue = document.getElementById('firstName').value
    let lastNameValue = document.getElementById('lastName').value
    let addressValue = document.getElementById('address').value
    let cityValue = document.getElementById('city').value
    let emailValue = document.getElementById('email').value

    let messageAlert = ""

    // vérifications des valeurs nécessaires: nom et adresse, et numéro supérieur à 0 (les autres sont vérifiées par le HTML5)
    if(lettersChecker.test(firstNameValue) == true && symbolsChecker.test(firstNameValue) == false && numbersChecker.test(firstNameValue) == false && firstNameValue != ""){
        console.log('firstNameValue est OK')
    }else{
        messageAlert = 'Le prénom renseigné est invalide : seules les lettres sont acceptées.'
        alert(messageAlert)
    }

    if(lettersChecker.test(lastNameValue) == true && symbolsChecker.test(lastNameValue) == false && numbersChecker.test(lastNameValue) == false && lastNameValue != ""){
        console.log('lastNameValue est OK')
    }else{
        messageAlert = 'Le nom renseigné est invalide : seules les lettres sont acceptées.'
        alert(messageAlert)
    }

    if(lettersChecker.test(cityValue) == true && symbolsChecker.test(cityValue) == false && numbersChecker.test(cityValue) == false && cityValue != ""){
        console.log('cityValue est OK')
    }else{
        messageAlert = 'La ville renseignée est invalide : seules les lettres sont acceptées.'
        alert(messageAlert)
    }

    if(lettersChecker.test(addressValue) == true && symbolsChecker.test(addressValue) == false && addressValue != ""){
        console.log('addresseValue est OK')
    }else{
        messageAlert = "l'adresse renseignée est invalide : les caractères spéciaux ne sont pas acceptés"
        alert(messageAlert)
    }
    if(emailChecker.test(emailValue) == true && emailValue != null){
        console.log('email est OK')
    }else{
        messageAlert = "l'adresse mail renseignée est invalide"
        alert(messageAlert)
    }

    if(messageAlert != ""){
        alert("le formulaire n'est pas conforme : veuillez resaisir les informations demandées.")
    }else{
        contact = {
            firstName: firstNameValue,
            lastName: lastNameValue,
            address: addressValue,
            city: cityValue,
            email: emailValue,
        }
        return contact
    }
}

// vérification du panier : est-il vide ?
let emptyCartChecker = JSON.parse(localStorage.getItem("LSCartProducts"))

let noEmptyCart = () =>{
    if(emptyCartChecker == null){
        alert("Erreur : votre panier est vide")
        return false
    }else{
        cartProducts.forEach(function(product){
            products.push(product._id)
            console.log(product._id)
        })
    return true
    }
} 

// envoi de la requête POST
let sendForm = function(sendValues){
    return new Promise(function(resolve){
        let request = new XMLHttpRequest()
        request.onreadystatechange = function(){
            if(request.readyState === XMLHttpRequest.DONE && request.status == 201){
                sessionStorage.setItem('confirmation', request.responseText)

                document.forms["form"].action = 'confirmation.html'
                document.forms["form"].submit()

                resolve(JSON.parse(request.responseText))
            }
        }
        request.open("POST", "http://localhost:3000/api/teddies/order")
        request.setRequestHeader("Content-Type", "application/json")
        request.send(sendValues)
    })
}

// vérifier la validité du formulaire
let formValider = () =>{

    let validationButton = document.getElementById('validationButton')
    validationButton.addEventListener('click', () =>{
        if(formChecker() != null && noEmptyCart() == true){
            // si envoi possible : ces données sont envoyées stringifiées
            let values = {contact, products}
            console.log(values)

            let sendValues = JSON.stringify(values)
            sendForm(sendValues)

            // réinitialisation des éléments après envoi du formulaire
            contact = {}
            products = []
            localStorage.clear()
        }else{
            alert('Erreur : try again !')
            console.log('GAME OVER')
        }
    })
}

// ouvrir la page de confirmation (nouvel onglet ou non)
let showConfirmation = () =>{
    if(sessionStorage.getItem('confirmation') != null){
        let confirm = JSON.parse(sessionStorage.getItem('confirmation'))
        let mainConfirm = document.getElementById('mainConfirm')

        // afficher les informations nécessaires
        mainConfirm.innerHTML = `<h2>Informations sur la commande</h2>
        <p>Nom et prénom : ${confirm.contact.firstName} ${confirm.contact.lastName}</p>
        <p>Adresse : ${confirm.contact.address} ${confirm.contact.city}</p>
        <p>Email : ${confirm.contact.email}</p>
        <p>Numéro de commande : ${confirm.orderId}</p>`
    } else {
        alert("Wrong way, we're sorry !")
        window.open('index.html')
    }
}

