import STRIPE_KEYS from "./myModules/stripe-keys.js"

const d = document;
const $containerProducts = d.getElementById('container-products-catalogo');
const $templateProducts = d.getElementById('my-product-catalogo').content;
const $fragmentProduct = d.createDocumentFragment();
const fechtOptions = {
    headers: {
        Authorization: `Bearer ${STRIPE_KEYS.secretKey}`
    }
};

let products, prices;
Promise.all([
    fetch('https://api.stripe.com/v1/products?limit=1000', fechtOptions),
    fetch('https://api.stripe.com/v1/prices?limit=1000', fechtOptions)
])
.then((response) => Promise.all(response.map((res)=>res.json())))
.then((res)=>{
    paintProductsCatalogo(res);
    paintProductIndex()
})
.catch((error)=>{
    console.log(error)
    let message = error.statusText || "Error al conectarse al API de Stripe"
    $containerProducts.innerHTML = `<p>Error ${error.status}: ${message}</p>`
})


export const paintProductsCatalogo = (res)=>{

    products = res[0].data;
    prices = res[1].data;
    
    prices.forEach((el) =>{
        let productData = products.filter((product) => product.id === el.product);
        const $cloneTemplate = $templateProducts.cloneNode(true);
        $cloneTemplate.querySelector('.card-product').setAttribute('data-price', el.id);
        $cloneTemplate.querySelector('.product-img__img').src = productData[0].images[0];
        $cloneTemplate.querySelector('.product-category').textContent = productData[0].description;
        $cloneTemplate.querySelector('.product-name').textContent = productData[0].name;
        $cloneTemplate.querySelector('.product-price').textContent = `${el.unit_amount_decimal} ${el.currency}`;
        $fragmentProduct.appendChild($cloneTemplate);
    })
    $containerProducts.appendChild($fragmentProduct);
}
