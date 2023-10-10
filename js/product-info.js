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

            const productImagesCarousel = document.querySelector("#product-images .carousel-inner");

            // Variable para rastrear la primera imagen para que sea activa
            let isFirstImage = true;
            
            for (const imageSrc of productInfo.images) {
                const carouselItem = document.createElement("div");
                carouselItem.classList.add("carousel-item");
            
                if (isFirstImage) {
                    carouselItem.classList.add("active");
                    isFirstImage = false;
                }
            
                const imageElement = document.createElement("img");
                imageElement.src = imageSrc;
                imageElement.classList.add("d-block", "w-100");
                
                carouselItem.appendChild(imageElement);
                productImagesCarousel.appendChild(carouselItem);
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

// Función para cargar los comentarios de un producto con estrellas
function loadProductComments(productId) {
  const commentList = document.getElementById("comment-list");
  const URL_Comentarios = `https://japceibal.github.io/emercado-api/products_comments/${productId}.json`;

  fetch(URL_Comentarios)
    .then((res) => res.json())
    .then((comments) => {
      commentList.innerHTML = "";

      if (comments.length === 0) {
        commentList.innerHTML = "<p>No hay comentarios disponibles.</p>";
      } else {
        comments.forEach((comment) => {
          const listItem = document.createElement("li");

          // Convierte el score numérico en estrellas visuales
          const stars = scoreToStars(comment.score);

          listItem.innerHTML = `
            <p><strong>${comment.user}</strong> - ${comment.dateTime} - ${stars}</p>
            <p>${comment.description}</p>
          `;
          commentList.appendChild(listItem);
        });
      }
    })
    .catch((error) => {
      console.error("Error al cargar los comentarios:", error);
    });
}

// Función para convertir el score numérico en estrellas visuales
function scoreToStars(score) {
  let stars = '';
  for (let i = 1; i <= 5; i++) {
    if (i <= score) {
      stars += '<span class="fa fa-star checked"></span>'; 
    } else {
      stars += '<span class="fa fa-star"></span>'; 
    }
  }
  return `${stars}`;
}

// Manejar el envío del formulario de comentario (simulación)
const commentForm = document.getElementById("comment-form");
commentForm.addEventListener("submit", (event) => {
  event.preventDefault(); // Evitar el envío del formulario real

  const ratingSelect = document.getElementById("comment-rating");
  const commentText = document.getElementById("comment-text");
  const usuariolocal = localStorage.getItem('username');

  const newComment = {
    user: usuariolocal, 
    score: parseInt(ratingSelect.value), 
    description: commentText.value,
    dateTime: new Date().toLocaleString(),
  };

  // Agregar el nuevo comentario a la lista de comentarios
  const commentList = document.getElementById("comment-list");
  const listItem = document.createElement("li");

  // Convierte el score numérico en estrellas visuales
  const stars = scoreToStars(newComment.score);

  listItem.innerHTML = `
    <p><strong>${newComment.user}</strong> - ${newComment.dateTime} - ${stars}</p>
    <p>${newComment.description}</p>
  `;
  commentList.appendChild(listItem);

  // Limpia el formulario después de agregar el comentario
  ratingSelect.value = "1";
  commentText.value = "";
  selectedStars.innerHTML = "";
});


// Llamar a la función para cargar los comentarios del producto seleccionado
if (selectedProductID) {
  loadProductComments(selectedProductID);
}

//  muestra el rango de estrellas seleccionadas
const ratingInput = document.getElementById("comment-rating");
const selectedStars = document.getElementById("selected-stars");

ratingInput.addEventListener("input", () => {
  const selectedRating = parseInt(ratingInput.value);
  selectedStars.innerHTML = scoreToStars(selectedRating);
  
});


// carrito

// Obtén el botón "Agregar al carrito"
const addToCartButton = document.getElementById("addToCartButton");

// Agregar un manejador de eventos al botón
addToCartButton.addEventListener("click", () => {
  // Obtén el producto actual desde la página de detalles
  const productName = document.getElementById("product-name").textContent;
  const productPrice = parseFloat(document.getElementById("product-price").textContent);
  const productCurrency = document.getElementById("product-currency").textContent;
  const productImage = document.querySelector("#product-images .carousel-item.active img").src;
  
  // Obtén el carrito actual desde el almacenamiento local o crea uno nuevo
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Busca si el producto ya está en el carrito
  const existingProductIndex = cart.findIndex((item) => item.name === productName);

  if (existingProductIndex !== -1) {
    // Si el producto ya está en el carrito, actualiza la cantidad y el subtotal
    cart[existingProductIndex].count += 1;
    cart[existingProductIndex].subtotal += productPrice;
  } else {
    // Si el producto no está en el carrito, agrégalo
    cart.push({
      name: productName,
      price: productPrice,
      image: productImage,
      currency: productCurrency,
      count: 1,
      subtotal: productPrice,
    });
  }

  // Guarda el carrito actualizado en el almacenamiento local
  localStorage.setItem("cart", JSON.stringify(cart));

  // Notifica al usuario que el producto se ha agregado al carrito (puedes usar una alerta o mensaje de éxito)
  alert("Producto agregado al carrito");

  // Redirige al usuario a la página del carrito
  window.location.href = "cart.html";
});
