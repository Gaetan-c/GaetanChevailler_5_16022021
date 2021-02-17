// création du panier
let cart = {}
let cartProducts = []

//création du localStorage
if(localStorage != null){
    console.log("LocalStorage n'est pas vide !")
    localStorage.cartProducts = cartProducts
    console.log(cartProducts)
} else {
    localStorage.cartProducts = []
}

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

        request.open("GET", "http://localhost:3000/api/teddies")
        request.send()
    })
}

// préparation pour la page d'accueil

const indexTeddyBear = document.getElementById('index_oursEnPeluche')

// appel des produits et mise en page
async function getIndex(){
    if(indexTeddyBear != null){
        const products = await getProducts()

        products.forEach(function(product) {

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

            createdName.innerHTML = product.name
            createdPrice.innerHTML = parseInt(product.price / 100).toFixed(2) + ' €'
            createdImg.setAttribute('src', product.imageUrl)
            createdA.setAttribute('href', 'produit.html')
        })
    } else{
        console.log("INDEXTEDDYBEAR isn't exist")
    }
}

getIndex()

// fonction pour la page Produit.html
// mise en page et création de l'URL

async function pageProduct(){
    if(document.getElementById("produit_photo") != null){
        let urlProduct = location.search.toString()
        const theProduct = await getProducts()
    
        document.getElementById("produit_photo").setAttribute('src', theProduct.imageUrl)
        document.getElementById("produit_nom").innerHTML = theProduct.name
        document.getElementById("produit_description").innerHTML = theProduct.description
        document.getElementById("produit_prix").innerHTML = parseInt(theProduct.price / 100).toFixed(2) + ' €'
    
        // pour l'ajout des options de couleur
        theProduct.colors.forEach(function(product){
            let optionColor = document.createElement("option")
            getElementById("color").appendChild(optionColor).innerHTML = product
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
})


/*const produit_bouton = document.getElementById('produit_bouton');
const totalPrice = document.getElementById('totalPrice');
const add_produit = 

produit_bouton.addEventListener('click', function(){
    console.log('le bouton marche !')
});*/