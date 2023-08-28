const searchResultsDiv = document.getElementById("searchResults");
const searchTerm = decodeURIComponent(window.location.search.split("=")[1]);
const categoriesAndAPIs = [
    { category: "Autos", apiUrl: "https://japceibal.github.io/emercado-api/cats_products/101.json" },
    { category: "Juguetes", apiUrl: "https://japceibal.github.io/emercado-api/cats_products/102.json" },
    { category: "Muebles", apiUrl: "https://japceibal.github.io/emercado-api/cats_products/103.json" },
    { category: "Herramientas", apiUrl: "https://japceibal.github.io/emercado-api/cats_products/104.json" },
    { category: "Computadoras", apiUrl: "https://japceibal.github.io/emercado-api/cats_products/105.json" },
    { category: "Vestimenta", apiUrl: "https://japceibal.github.io/emercado-api/cats_products/106.json" },
    { category: "Electrodomesticos", apiUrl: "https://japceibal.github.io/emercado-api/cats_products/107.json" },
    { category: "Deportes", apiUrl: "https://japceibal.github.io/emercado-api/cats_products/108.json" },
    { category: "Celulares", apiUrl: "https://japceibal.github.io/emercado-api/cats_products/109.json" }
];

function searchInAllCategories() {
    const searchPromises = categoriesAndAPIs.map(category => {
        return fetch(category.apiUrl)
            .then(response => response.json())
            .then(data => {
                return {
                    category: category.category,
                    products: filterProductsBySearchTerm(data.products, searchTerm.toLowerCase())
                };
            })
            .catch(error => {
                console.error(`Error fetching ${category.category} API:`, error);
                return { category: category.category, products: [] };
            });
    });

    Promise.all(searchPromises)
        .then(results => {
            const combinedResults = results.flatMap(result => result.products);
            displaySearchResults(combinedResults);
        });
}

function displaySearchResults(products) {
    let append = "";
    if (products.length === 0) {
        append = `<p>No se encontraron resultados para la búsqueda.</p>`;
    } else {
        for (let i = 0; i < products.length; i++) {
            append += showProduct(products[i]);
        }
    }
    searchResultsDiv.innerHTML = append;
}

searchInAllCategories();


function showProduct(product) {
    return `
        <div class="list-group-item list-group-item-action cursor-active">
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
        </div>
    `;
}

function filterProductsBySearchTerm(products, searchTerm) {
    return products.filter(product => {
        return product.name.toLowerCase().includes(searchTerm) ||
               product.description.toLowerCase().includes(searchTerm);
    });
}
