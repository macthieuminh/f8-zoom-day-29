const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const productsAPI = "https://dummyjson.com/products"
const detailHTML = "./detail.html"

function renderProduct(data) {
    data.products.forEach((product) => {
        const grid = document.getElementById("product-grid")
        const card = document.createElement("div")
        const star = "⭐"
        card.className = "product-card"
        card.dataset.id = product.id
        card.innerHTML = `
        <div class="thumb-wrapper">
            <img src="${product.thumbnail || "images/default.jpg"}" alt="${
            product.title
        }" />
            <span class="discount-percent">-${product.discountPercentage}%</span>
        </div>
        <div class="product-name">${product.title}</div>
        <div class="product-price">${product.price} $</div>
        <div class="product-rating">${star.repeat(product.rating.toFixed(1))}</div>
    `
        grid.appendChild(card)
        card.addEventListener("click", (e) => {
            const id = card.dataset.id
            console.log(id)
            window.location.href = `detail.html?id=${id}`
        })
    })
}
function send(method = "GET", url) {
    return (promise = new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status <= 400) {
                const type = xhr.getResponseHeader("Content-Type")
                const isJSON = type && type.includes("application/json")

                if (isJSON) {
                    resolve(JSON.parse(xhr.responseText))
                } else {
                    resolve(xhr.responseText)
                }
            } else {
                reject(`Lỗi kết nối : ${xhr.status}`)
            }
        }
        xhr.open(method, url, true)
        xhr.send()
    }))
}
send("GET", productsAPI, renderProduct)
// send("GET", detailHTML)

const product = send("GET", productsAPI)
product.then(renderProduct).catch((error) => {
    console.log(error)
})
