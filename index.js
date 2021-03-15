//préparation des url produit
let urlProduct = ''

// préparation du prix total
let totalPrice = 0

//création du localStorage
if(localStorage.getItem("LSCartProducts")){

    }else{
        let cartProducts = []
        localStorage.setItem("LSCartProducts", JSON.stringify(cartProducts))
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
let sendValues

// regex de vérification
let lettersChecker = /[a-zA-Z\s]+/
let numbersChecker = /[0-9]/
let specialCharactersChecker = /[§!@#$%^&*(),.?":{}|<>]/
const emailChecker = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/

// préparations des vérifications
let formValidation = document.getElementById('validationButton')
let form = document.getElementById('form')
const mainConfirm = document.getElementById("mainConfirm")

if(formValidation != null){
    formValidation.addEventListener('click', (e)=>{
        e.preventDefault()

        let checkCart = () =>{
            if(cartProducts != null){
                return true
            }else{
                return false
            }
        }
        
        // vérifier les indications du formulaire et des valeurs demandées
        // récupération des valeurs inscrites
        let checkForm = () =>{
            
            if(cartProducts != null){
                console.log("EmailChecker == true")
                let firstNameValue = document.getElementById('firstName').value
                let lastNameValue = document.getElementById('lastName').value
                let addressValue = document.getElementById('address').value
                let cityValue = document.getElementById('city').value
                let emailValue = document.getElementById('email').value
        
                if(emailChecker.test(emailValue) == true && lettersChecker.test(firstNameValue) == true && numbersChecker.test(firstNameValue) == false && lettersChecker.test(lastNameValue) == true && numbersChecker.test(lastNameValue) == false && lettersChecker.test(cityValue) == true && numbersChecker.test(cityValue) == false){
        
                    contact = {
                        "firstName": firstNameValue,
                        "lastName": lastNameValue,
                        "address": addressValue,
                        "city": cityValue,
                        "email": emailValue
                    }
                }    
                return contact
            }
        }
        // préparation de l'objet à transmettre à l'API
        let sendForm = () =>{
            if(checkCart() != false && checkForm() != false){
                cartProducts.forEach(function(product){
                    products.push(product._id)
                })
        
                let values = {
                    contact,
                    products
                }
                sendValues = JSON.stringify(values)
                return sendValues
            }
        }
        sendForm()

        // requête POST : envoi à l'API
        let sendPost = function(sendValues){
            return new Promise(function(resolve){
                let request = new XMLHttpRequest()
                request.onreadystatechange = function(){
                    if(request.readyState === XMLHttpRequest.DONE && request.status == 201){
                        sessionStorage.setItem('order', this.responseText)
                        resolve(this.responseText)
                        window.location = 'confirmation.html'
                        localStorage.clear()
                    }
                }
                request.open("POST", "http://localhost:3000/api/teddies/order")
                request.setRequestHeader("Content-Type", "application/json")
                request.send(sendValues)
            })
        }
        sendPost(sendValues)
    })
}

// ouverture de la page de confirmation avec les éléments suivants :
getOrder = () =>{
    if(sessionStorage.getItem('order') != null){

        let order = JSON.parse(sessionStorage.getItem('order'))
        let priceToPay = 0
        order.products.forEach((item)=>{
            priceToPay += item.price
        })

        mainConfirm.innerHTML = `<h2>Informations sur la commande</h2>
        <p>Nom et prénom : ${order.contact.firstName} ${order.contact.lastName}</p>
        <p>Adresse : ${order.contact.address} ${order.contact.city}</p>
        <p>Email : ${order.contact.email}</p>
        <p>Total de la commande: ${parseInt(priceToPay / 100).toFixed(2) + ' €'}</p>
        <p>Numéro de commande :</p> 
        <span>${order.orderId}</span>`
    
        sessionStorage.removeItem('order')
    }else{
        alert("Vous êtes arrivé ici par erreur, toutes nos excuses !")
        window.location.href = "index.html"
    }
}



