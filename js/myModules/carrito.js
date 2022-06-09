import STRIPE_KEYS from "./stripe-keys.js"

const d = document;
const carrito = d.querySelector("#carrito");
const template = d.querySelector("#templateProducts");
const $totalProduct = d.querySelector('.container-total__price-total');
const fragment = d.createDocumentFragment();

const array = localStorage.getItem('dataProduct');
d.addEventListener('DOMContentLoaded',()=>{
    console.log(JSON.parse(array))
    
    pintarCarrito(JSON.parse(array))
});

let productsAll = [];
const pintarCarrito = (carritoArray) => {
    carrito.textContent = "";
    let priceProduct = 0
    let totalPrice = [];
    // recorremos el carrito y pintamos elementos:
    carritoArray.forEach((item) => {
        priceProduct = item.price.slice(1,-7) * item.quantity
        const clone = template.content.cloneNode(true);
        clone.querySelector(".text-white .lead").textContent = item.name;
        clone.querySelector(".rounded-pill").textContent = item.quantity;
        clone.querySelector("div .lead span").textContent = `$${priceProduct}.00 mxn`;
        clone.querySelector(".btn-success").dataset.priceid = item.priceId;
        clone.querySelector(".btn-danger").dataset.priceid = item.priceId;
        
        let objectProduct = {
            price : item.priceId,
            quantity : item.quantity
        }
        totalPrice.push(priceProduct)
        productsAll.push(objectProduct);
        fragment.appendChild(clone);
        
    });
    $totalProduct.textContent = `$${totalPrice.reduce((vActual, vAcumulador) => vActual + vAcumulador)}.00 mxn`;
    carrito.appendChild(fragment);
};

d.addEventListener('click', (e)=>{
    if(e.target.matches('.btn-comprar')){
        postPurchase();
    }

    if(e.target.matches('.btn-sum')){

        let newArray = JSON.parse(localStorage.getItem('dataProduct'));
        let findProduct = newArray.find((element)=> element.priceId === e.target.dataset.priceid); 
        if(findProduct !== undefined){
            findProduct.quantity++;
            localStorage.setItem('dataProduct', JSON.stringify(newArray));
            location.reload();
            
        }

    }
    if(e.target.matches('.btn-min')){
        let newArray = JSON.parse(localStorage.getItem('dataProduct'));
        let findProduct = newArray.find((element)=> element.priceId === e.target.dataset.priceid); 
        if(findProduct !== undefined){
            findProduct.quantity--;
            localStorage.setItem('dataProduct', JSON.stringify(newArray));
            console.log(findProduct.quantity--)
            if(findProduct.quantity-- <= -1){
                let i = newArray.indexOf( findProduct );
                
                if ( i !== -1 ) {
                    newArray.splice( i, 1 );
                    localStorage.setItem('dataProduct', JSON.stringify(newArray));
                    location.reload();
                    console.log('eliminado')
                }
            }
            location.reload();
        }
    }
});

const postPurchase = ()=>{
    console.log(productsAll)
    if(productsAll.length > 0){
        Stripe(STRIPE_KEYS.publicKey)
        .redirectToCheckout({
            lineItems:productsAll,
            mode:'payment',
            successUrl:'http://127.0.0.1:5500/success.html',
            cancelUrl: 'http://127.0.0.1:5500/error.html'
        })
        .then((res)=>{
            console.log(res);
            if(res.error){
                console.log('algo salio mal')
            }
        })
    }else{
        alert('no tienes productos')
    }
   
}
