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
});

// Llamar a la función para cargar los comentarios del producto seleccionado
if (selectedProductID) {
  loadProductComments(selectedProductID);
}
