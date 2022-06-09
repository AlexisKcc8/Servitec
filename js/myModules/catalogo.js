import STRIPE_KEYS from "./stripe-keys.js"
export const name2 = "alexis";
const d = document;
const $containerProducts = d.getElementById('container-products-catalogo');
const $templateProducts = d.getElementById('my-product-catalogo').content;
const $fragmentProduct = d.createDocumentFragment();
const $cards = d.querySelectorAll('.card-product');


const fechtOptions = {
    headers: {
        Authorization: `Bearer ${STRIPE_KEYS.secretKey}`
    }
};
d.addEventListener('DOMContentLoaded', (e)=>{
    getData();
})
export const moneyFormat = (money)=> `$${money.slice(0,-2)}.${money.slice(-2)}`;
let products, prices;
const getData = ()=>{
    Promise.all([
        fetch('https://api.stripe.com/v1/products?limit=1000', fechtOptions),
        fetch('https://api.stripe.com/v1/prices?limit=1000', fechtOptions)
    ])
    .then((response) => Promise.all(response.map((res)=>res.json())))
    .then((res)=>{
        paintProductsCatalogo(res);
        
    })
    .catch((error)=>{
        console.log(error)
        let message = error.statusText || "Error al conectarse al API de Stripe"
        $containerProducts.innerHTML = `<p>Error ${error.status}: ${message}</p>`
    })
}


const paintProductsCatalogo = (res)=>{

    products = res[0].data;
    prices = res[1].data;
    let productData = [];
    prices.forEach((el) =>{
        productData = products.filter((product) => product.id === el.product);

        const $cloneTemplate = $templateProducts.cloneNode(true);
        $cloneTemplate.querySelector('.btn-add-car').setAttribute('data-priceId', el.id);
        $cloneTemplate.querySelector('.btn-add-car').setAttribute('data-nameP', productData[0].name);
        $cloneTemplate.querySelector('.btn-add-car').setAttribute('data-priceP', `${moneyFormat(el.unit_amount_decimal)} ${el.currency}`);
        $cloneTemplate.querySelector('.product-img__img').src = productData[0].images[0];
        $cloneTemplate.querySelector('.product-category').textContent = productData[0].description;
        $cloneTemplate.querySelector('.product-name').textContent = productData[0].name;
        $cloneTemplate.querySelector('.product-price').textContent = `${moneyFormat(el.unit_amount_decimal)} ${el.currency}`;
        $fragmentProduct.appendChild($cloneTemplate);
    })
    $containerProducts.appendChild($fragmentProduct);

    $cards.forEach((el)=>{
        console.log(el.id)
    })
}



const carritoArray = [];
d.addEventListener("click", (e)=>{
    if(e.target.matches('.btn-add-car') || e.target.matches(`.btn-add-car *`)){
        agregarCarrito(e)
        
    }
    if(e.target.matches('.input-check__input')){
        console.log(e.target.textContent);
    }
    
});

const agregarCarrito = (e) => {
    let priceId = e.target.dataset.priceid;
    let name = e.target.dataset.namep;
    let price = e.target.dataset.pricep;
    let objectProduct = {
        priceId,
        quantity: 1,
        name,
        price
    }
        // buscamos el indice
        let newArray = JSON.parse(localStorage.getItem('dataProduct')); 
        if(newArray === null){
            const index = carritoArray.findIndex((item) => item.priceId === objectProduct.priceId);
            console.log(index)
            // si no existe empujamos el nuevo elemento
            if (index === -1) {
                carritoArray.push(objectProduct);
                localStorage.setItem('dataProduct', JSON.stringify(carritoArray));
                alert('añadido al carrito')
                location.reload();
            } else {
                // en caso contrario aumentamos su cantidad
                carritoArray[index].quantity++;
                localStorage.setItem('dataProduct', JSON.stringify(carritoArray));
                alert('añadido al carrito')
                location.reload();
            }
        }else{
            const index = newArray.findIndex((item) => item.priceId === objectProduct.priceId);
            console.log(index)
            // si no existe empujamos el nuevo elemento
            if (index === -1) {
                newArray.push(objectProduct);
                localStorage.setItem('dataProduct', JSON.stringify(newArray));
                alert('añadido al carrito')
                location.reload();
            } else {
                // en caso contrario aumentamos su cantidad
                newArray[index].quantity++;
                localStorage.setItem('dataProduct', JSON.stringify(newArray));
                alert('añadido al carrito')
                location.reload();
            }
            console.log(newArray);
        }
};


