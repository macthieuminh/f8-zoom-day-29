const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

function getProductIdFromURL() {
    const params = new URLSearchParams(window.location.search)
    return params.get("id")
}

async function fetchProductDetail(id) {
    const res = await fetch(`https://dummyjson.com/products/${id}`)
    if (!res.ok) throw new Error("Không tìm thấy sản phẩm")
    return res.json()
}

function renderReviews(reviews) {
    const reviewsContainer = $("#product-reviews")
    if (!reviews || reviews.length === 0) {
        reviewsContainer.innerHTML += `<p>Chưa có đánh giá nào.</p>`
        return
    }

    reviews.forEach((review) => {
        const item = document.createElement("div")
        const star = "⭐"
        item.className = "review-item"
        item.innerHTML = `
            <div class="reviewer">${review.reviewerName || "Ẩn danh"}</div>
            <div class="review-rating">${star.repeat(review.rating)}</div>
            <p>${review.comment}</p>
    `
        reviewsContainer.appendChild(item)
    })
}

document.addEventListener("DOMContentLoaded", async () => {
    const id = getProductIdFromURL()
    if (!id) {
        alert("Thiếu ID sản phẩm trên URL")
        return
    }

    try {
        const product = await fetchProductDetail(id)
        const star = "⭐"

        $("#product-title").textContent = product.title
        $("#product-image").src = product.thumbnail
        $("#product-brand").textContent = `Thương hiệu: ${product.brand}`
        $("#product-price").textContent = `$${product.price.toFixed(2)}`
        $("#product-discount").textContent = `-${product.discountPercentage}%`
        $("#product-rating").textContent = `${star.repeat(product.rating.toFixed(1))}`
        $("#product-stock").textContent = `Tình trạng: ${
            product.availabilityStatus || "Còn hàng"
        } (${product.stock} sản phẩm)`
        $("#product-description").textContent = product.description

        renderReviews(product.reviews)
    } catch (err) {
        document.body.innerHTML = `<h2>Lỗi: ${err.message}</h2>`
    }
})
