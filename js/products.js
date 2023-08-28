let  productsgeneral = document.getElementById("containerTotal")
const catID = localStorage.getItem("catID"); //no me había dado cuenta, en categories.js ya tenemos el catid para traer
const URL_PRODUCTS = "https://japceibal.github.io/emercado-api/cats_products/" + catID +".json";



function showCategories(element) { //modifiqué esto para que quede genérico según categoría
    let productArray = element.products
    let append = "";
    for (let i = 0; i < productArray.length; i++) {
        append += `
            <div class="list-group-item list-group-item-action cursor-active">
                <div class="row">
                    <div class="col-3">
                        <img src="${productArray[i].image}" alt="${productArray[i].description}" class="img-thumbnail">
                    </div>
                    <div class="col">
                        <div class="d-flex w-100 justify-content-between">
                            <h4 class="mb-1">${productArray[i].name} - ${productArray[i].currency}  ${productArray[i].cost}</h4>
                            <small class="text-muted">${productArray[i].soldCount} artículos</small>
                        </div>
                        <p class="mb-1">${productArray[i].description}</p>
                    </div>
                </div>
            </div>
            `
    }

    document.getElementById("containerTotal").innerHTML += append;
}

function nameCategoryTitle(element){ //para poder variar el titulo según la categoría que elija
    let category = document.getElementById("categoriaActiva")
    let append = `<h1>${element.catName}</h1>`
    category.innerHTML=append
}


fetch(URL_PRODUCTS)
    .then(res => res.json())
    .then(data => {showCategories(data), nameCategoryTitle(data)})
   
    
   /* document.addEventListener("DOMContentLoaded", (e) => {
        // Escribe tu solución aquí
        // Filtrar y ordenar los elementos de tipo String
          
          catID.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
    })
          // Mostrar la lista en pantalla
          showList(stringElements);
        });
        
        // Función que recibe por parámetro un array y muestra sus elementos en pantalla
        function showList(array) {
          const container = document.getElementById("list");
          container.innerHTML = "";
          array.forEach((element) => {
            const li = document.createElement("li");
            li.appendChild(document.createTextNode(element));
            container.appendChild(li);
          });
        }*/