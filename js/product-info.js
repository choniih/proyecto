const productInfoContainer = document.getElementById("product-info-container");
const selectedProductID = localStorage.getItem("selectedProductID");

if (!selectedProductID) {
} else {
    const URL_PRODUCT_INFO = `https://japceibal.github.io/emercado-api/products/${selectedProductID}.json`;

    fetch(URL_PRODUCT_INFO)
        .then(res => res.json())
        .then(productInfo => {
            // Rellenar los campos con la información del producto
            document.getElementById("product-name").textContent = productInfo.name;
            document.getElementById("product-description").textContent = productInfo.description;
            document.getElementById("product-price").textContent = productInfo.cost;
            document.getElementById("product-currency").textContent = productInfo.currency;
            document.getElementById("product-soldCount").textContent = productInfo.soldCount;
            document.getElementById("product-category").textContent = productInfo.category;

            // Rellenar las imágenes del producto
            const productImagesContainer = document.getElementById("product-images");
            for (const imageSrc of productInfo.images) {
                const imageElement = document.createElement("img");
                imageElement.src = imageSrc;
                productImagesContainer.appendChild(imageElement);
            }

            // Rellenar los productos relacionados
            const relatedProductsList = document.getElementById("related-products");
            for (const relatedProduct of productInfo.relatedProducts) {
                const listItem = document.createElement("li");
                listItem.dataset.productId = relatedProduct.id;
                listItem.innerHTML = `
                    <h3>${relatedProduct.name}</h3>
                    <img src="${relatedProduct.image}" alt="${relatedProduct.name}" class="img-thumbnail">
                `;
                relatedProductsList.appendChild(listItem);

                //Ir al producto relacionado
                listItem.addEventListener("click", () => {
                    localStorage.setItem("selectedProductID", relatedProduct.id);
                    window.location.href = "product-info.html"; 
                });
            }
            
            
        })
        .catch(error => {
            console.error("Error al cargar la información del producto:", error);
        });
}

