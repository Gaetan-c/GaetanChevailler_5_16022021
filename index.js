//préparation des url produit
let urlProduct = ''

// création du panier
let cart = {}
let totalPrice = 0

//création du localStorage
if(localStorage.getItem("LSCartProducts")){
    console.log("LocalStorage possède déjà LSCartProducts !")
    }else{
        let LSCart = []
        localStorage.setItem("LSCartProducts", JSON.stringify(LSCart))
        console.log(LSCart + 'Message pour le LSCartProducts')
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
        const products = await getProducts()

        for(i=0; i < products.length; i++) {

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

            createdName.innerHTML = products[i].name
            createdPrice.innerHTML = parseInt(products[i].price / 100).toFixed(2) + ' €'
            createdImg.setAttribute('src', products[i].imageUrl)
            createdA.setAttribute('href', 'produit.html?id='+products[i]._id)
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
        
        const products = await getProducts()
    
        document.getElementById("produit_photo").setAttribute('src', products.imageUrl)
        document.getElementById("produit_nom").innerHTML = products.name
        document.getElementById("produit_description").innerHTML = products.description
        document.getElementById("produit_prix").innerHTML = parseInt(products.price / 100).toFixed(2) + ' €'
    
        // pour l'ajout des options de couleur
        products.colors.forEach(function(product){
            let optionColor = document.createElement("option")
            document.getElementById("color").appendChild(optionColor).innerHTML = product
        })  
    }
}

// appel de la page produit au clic des <li>
createdLi = document.getElementsByClassName("createdLi")
createdLi = addEventListener('click', pageProduct())

/*let createdA = document.createElement("a")
const goToProduct = document.getElementsByClassName(createdA)
createdA = addEventListener('click', function(){
    console.log('les liens fonctionnent bien !')
})*/

// const totalPriceAffichage = document.getElementById('totalPrice')

// Ajout au panier
if(document.getElementById('produit_bouton') != null){
    const produit_bouton = document.getElementById('produit_bouton')

    produit_bouton.addEventListener('click', async function(){
        console.log('le bouton marche !')
        const products = await getProducts()

        cartProducts.push(products)
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
    
    cartProducts.forEach(function(cartProduct){ 

        // mise en page du panier

        let sectionCartArticle = document.createElement('section')
        mainCart.appendChild(sectionCartArticle)
        sectionCartArticle.classList.add('cart_Article')
        let imgCart = document.createElement("img")
        sectionCartArticle.appendChild(imgCart)
        imgCart.id = 'cart_photo'
        imgCart.setAttribute('src', cartProduct.imageUrl)
        let h1Cart = document.createElement("h1")
        sectionCartArticle.appendChild(h1Cart)
        h1Cart.innerHTML = cartProduct.name
        let priceCart = document.createElement('p')
        sectionCartArticle.appendChild(priceCart)
        priceCart.id = 'cart_prix'
        priceCart.innerHTML = parseInt(cartProduct.price / 100).toFixed(2) + '€'
        let divCart = document.createElement('div')
        sectionCartArticle.appendChild(divCart)
        divCart.id = 'cart_chevrons'
        let buttonCartPlus = document.createElement('button')
        divCart.appendChild(buttonCartPlus)
        let iCartPlus = document.createElement('i')
        buttonCartPlus.appendChild(iCartPlus)
        iCartPlus.classList.add('fas', 'fa-chevron-up')
        let pNumberExemplaire = document.createElement('p')
        divCart.appendChild(pNumberExemplaire)
        let buttonCartMinus = document.createElement('button')
        divCart.appendChild(buttonCartMinus)
        let iCartMinus = document.createElement('i')
        buttonCartMinus.appendChild(iCartMinus)
        iCartMinus.classList.add('fas', 'fa-chevron-down')
        let buttonCartTrash = document.createElement('button')
        sectionCartArticle.appendChild(buttonCartTrash)
        let iTrash = document.createElement('span')
        buttonCartTrash.appendChild(iTrash)
        iTrash.classList.add('fas', 'fa-trash')

        // afficher le prix total à l'utilisateur
        totalPrice += cartProduct.price
        console.log(totalPrice)
        let finalPrice = document.getElementById('totalPrice')
        finalPrice.innerHTML = ' ' + parseInt(totalPrice / 100).toFixed(2) + ' €'

        // supprimer un élément du panier
        
        buttonCartTrash.addEventListener('click', function(i) { // a terminer !
            cartProducts.splice(i, 1) //supprimer l'élément
            localStorage.clear() // nettoyer le localStorage
            localStorage.setItem('LSCartProducts', JSON.stringify(cartProducts)) // réactualiser le panier
            window.location.reload() // afficher la nouvelle fenêtre
        })
    })
}
