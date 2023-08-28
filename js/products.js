const ARTICULOS = "https://japceibal.github.io/emercado-api/cats_products/"+localStorage.getItem("catID")+".json"

const ORDER_ASC_BY_PRICE = "$A";
const ORDER_DESC_BY_PRICE = "$D";
const ORDER_BY_PROD_SOLDCOUNT = "Sold";
let productsArray = [];
let ordenado = [];
let minCount = undefined;
let maxCount = undefined;

function sortProducts(criteria, array){
    let result = [];
    if (criteria === ORDER_ASC_BY_PRICE)
    {
        result = array.sort(function(a, b) {
            if ( a.cost < b.cost ){ return -1; }
            if ( a.cost > b.cost ){ return 1; }
            return 0;
        });
    }else if (criteria === ORDER_DESC_BY_PRICE){
        result = array.sort(function(a, b) {
            if ( a.cost > b.cost ){ return -1; }
            if ( a.cost < b.cost ){ return 1; }
            return 0;
        });
    }else if (criteria === ORDER_BY_PROD_SOLDCOUNT){
        result = array.sort(function(a, b) {
            let aCount = parseInt(a.soldCount);
            let bCount = parseInt(b.soldCount);

            if ( aCount > bCount ){ return -1; }
            if ( aCount < bCount ){ return 1; }
            return 0;
        });
    }

    return result;
}

function showProductsList(array){
    let htmlContentToAppend = "";

    for(let i = 0; i < array.length; i++){ 
        let articulo = array[i];
       
        if (((minCount == undefined) || (minCount != undefined && parseInt(articulo.cost) >= minCount)) &&
           ((maxCount == undefined) || (maxCount != undefined && parseInt(articulo.cost) <= maxCount))){
       
            htmlContentToAppend += `
                <div class="list-group-item list-group-item-action">
                    <div class="row">
                        <div class="col-3">
                            <img src="` + articulo.image + `" alt="product image" class="img-thumbnail">
                        </div>
                         <div class="col">
                            <div class="d-flex w-100 justify-content-between">
                               <div class="mb-1">
                                    <h4>`+ articulo.name + ' - ' + articulo.currency + " " + articulo.cost + `</h4>
                                    <p> `+ articulo.description +`</p> 
                                </div>
                                <small class="text-muted">` + articulo.soldCount + ` artículos</small> 
                            </div>
                        </div>
                    </div>
                </div>
            `
        }

        document.getElementById("container").innerHTML = htmlContentToAppend; 
    }
}

function sortAndShowCategories(sortCriteria){
    
    ordenado = sortProducts(sortCriteria, productsArray.products);

    showProductsList(ordenado);
}


document.addEventListener("DOMContentLoaded", function(e){
    getJSONData(ARTICULOS).then(function(resultObj){
        if (resultObj.status === "ok")
        {
            productsArray = resultObj.data;
            showProductsList(productsArray.products); 
        }
    });

    document.getElementById("sortAsc").addEventListener("click", function(){
        sortAndShowCategories(ORDER_ASC_BY_PRICE);
    });

    document.getElementById("sortDesc").addEventListener("click", function(){
        sortAndShowCategories(ORDER_DESC_BY_PRICE);
    });

    document.getElementById("sortByCount").addEventListener("click", function(){
        sortAndShowCategories(ORDER_BY_PROD_SOLDCOUNT);
    });

    document.getElementById("clearRangeFilter").addEventListener("click", function(){
        document.getElementById("rangeFilterCountMin").value = "";
        document.getElementById("rangeFilterCountMax").value = "";

        minCount = undefined;
        maxCount = undefined;

        showProductsList(productsArray.products);
    });

    document.getElementById("rangeFilterCount").addEventListener("click", function(){
        minCount = document.getElementById("rangeFilterCountMin").value;
        maxCount = document.getElementById("rangeFilterCountMax").value;

        if ((minCount != undefined) && (minCount != "") && (parseInt(minCount)) >= 0){
            minCount = parseInt(minCount);
        }
        else{
            minCount = undefined;
        }

        if ((maxCount != undefined) && (maxCount != "") && (parseInt(maxCount)) >= 0){
            maxCount = parseInt(maxCount);
        }
        else{
            maxCount = undefined;
        }

        showProductsList(productsArray.products);
    });
});

const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');

searchInput.addEventListener('input', ()=> {
  let searchText = searchInput.value.toLowerCase();

  let a = productsArray.products.filter(product => product.name.toLowerCase().includes(searchText));
  showProductsList(a);
});
