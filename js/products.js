const productContainer = document.getElementById("cat-list-container");
const catID = localStorage.getItem("catID");
const URL_PRODUCTS = "https://japceibal.github.io/emercado-api/cats_products/" + catID + ".json";

let productArray = [];

function showProducts(products) {
    productContainer.innerHTML = "";
    for (const product of products) {
        const productItem = document.createElement("div");
        productItem.className = "list-group-item list-group-item-action cursor-active";
        productItem.innerHTML = `
            <div class="row">
                <div class="col-3">
                    <img src="${product.image}" alt="${product.description}" class="img-thumbnail">
                </div>
                <div class="col">
                    <div class="d-flex w-100 justify-content-between">
                        <h4 class="mb-1">${product.name} - ${product.currency} ${product.cost}</h4>
                        <small class="text-muted">${product.soldCount} artículos</small>
                    </div>
                    <p class="mb-1">${product.description}</p>
                </div>
            </div>
        `;
        // Guardar id del producto y redirigir
        productItem.addEventListener("click", () => {
            localStorage.setItem("selectedProductID", product.id); 
            window.location.href = "product-info.html"; 
        });
        productContainer.appendChild(productItem);
    }
}

function applyFilters() {
    const minPrice = parseFloat(document.getElementById("rangeFilterCountMin").value) || 0;
    const maxPrice = parseFloat(document.getElementById("rangeFilterCountMax").value) || Number.MAX_VALUE;

    const filteredProducts = productArray.filter(product => {
        const productPrice = parseFloat(product.cost);
        return productPrice >= minPrice && productPrice <= maxPrice;
    });

    applySort(filteredProducts);
}

function applySort(products) {
    const sortBy = document.querySelector('input[name="options"]:checked').id;

    if (sortBy === "sortAsc") {
        products.sort((a, b) => parseFloat(a.cost) - parseFloat(b.cost));
    } else if (sortBy === "sortDesc") {
        products.sort((a, b) => parseFloat(b.cost) - parseFloat(a.cost));
    } else if (sortBy === "sortByCount") {
        products.sort((a, b) => parseInt(b.soldCount) - parseInt(a.soldCount));
    }

    showProducts(products);
}

document.getElementById("rangeFilterCount").addEventListener("click", applyFilters);
document.getElementById("clearRangeFilter").addEventListener("click", () => {
    showProducts(productArray);
    document.getElementById("rangeFilterCountMin").value = "";
    document.getElementById("rangeFilterCountMax").value = "";
});
document.querySelectorAll('input[name="options"]').forEach(input => {
    input.addEventListener("change", () => applySort(productArray));
});

fetch(URL_PRODUCTS)
    .then(res => res.json())
    .then(data => {
        productArray = data.products;
        showProducts(productArray);
        nameCategoryTitle(data);
    });

function nameCategoryTitle(element) {
    const categoryTitle = document.getElementById("categoriaActiva");
    categoryTitle.innerHTML = `<h1>${element.catName}</h1>`;
}



  const modoNocturnoButton = document.getElementById('modoNocturno');
const body = document.body;

const modoNocturnoEnabled = localStorage.getItem('modoNocturnoEnabled') === 'true';
function toggleModoNocturno() {
    body.classList.toggle('modo-nocturno');
    
    localStorage.setItem('modoNocturnoEnabled', body.classList.contains('modo-nocturno'));
}
if (modoNocturnoEnabled) {
    body.classList.add('modo-nocturno');
}
modoNocturnoButton.addEventListener('click', () => {
    toggleModoNocturno();
});

