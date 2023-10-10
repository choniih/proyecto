 document.addEventListener("DOMContentLoaded", function () {
            const cartURL =
                "https://japceibal.github.io/emercado-api/user_cart/25801.json";

            // Realiza la solicitud web
            fetch(cartURL)
                .then((response) => response.json())
                .then((data) => {
                    // Procesa los datos del carrito desde la URL externa
                    const cartItemsFromURL = data.articles; // Tomamos todos los artículos desde la URL

                    // Obtén el carrito actual almacenado localmente o crea uno nuevo
                    let cart = JSON.parse(localStorage.getItem("cart")) || [];

                    cartItemsFromURL.forEach((cartItemFromURL) => {
                        const existingCartItem = cart.find((item) => item.id === cartItemFromURL.id);
                    
                        if (existingCartItem) {
                           
                        } else {
                            // Si el producto no está en el carrito, agrégalo
                            cartItemFromURL.price = cartItemFromURL.unitCost; // Realiza la conversión
                            cart.push(cartItemFromURL);
                        }
                    });
                    

                    // Función para renderizar el carrito
                    function renderCart() {
                        // Crea el HTML para mostrar la información del carrito en una tabla
                        let cartInfoHTML = `
                            <h2>Carrito de Compras</h2>
                            <table>
                              <tr>
                                <th> </th>
                                <th>Nombre</th>
                                <th>Costo</th>
                                <th>Cantidad</th>
                                <th>Subtotal</th>
                                <th> </th>
                              </tr>
                        `;

                        // Agrega información de cada producto a la tabla
                        cart.forEach((cartItem, index) => {
                            cartInfoHTML += `
                                <tr>
                                    <td><img src="${cartItem.image}" alt="${cartItem.name}"></td>
                                    <td>${cartItem.name}</td>
                                    <td>${cartItem.price} ${cartItem.currency}</td>
                                    <td><input type="number" class="cantidad" value="${cartItem.count}" data-index="${index}"></td>
                                    <td class="subtotal">${cartItem.subtotal} ${cartItem.currency}</td>
                                    <td><button class="eliminar-producto" data-index="${index}"> <i class="fas fa-trash-alt"></i> </button></td>
                                </tr>
                            `;
                        });

                        cartInfoHTML += `
                            </table>
                            
                            <br> <br>
                            
                            <h5>Tipo de envío:</h5>
                            <label>
                              <input type="radio" name="tipoEnvio" value="envioNormal">
                              Premium 2 a 5 días
                            </label><br>
                            <label>
                              <input type="radio" name="tipoEnvio" value="envioExpress">
                              Express 5 a 8 días
                            </label><br>
                            <label>
                              <input type="radio" name="tipoEnvio" value="retiroLocal">
                              Standard 12 a 15 días
                            </label>
                          </div>
                          <br><br>
                          <h5>Dirección de envío:</h5>
                          <label for="calle">Calle:</label>
                          <input type="text" id="calle" placeholder="Ingrese la calle">

                          <label for="numero">Número:</label>
                          <input type="text" id="numero" placeholder="Ingrese el número">

                          <label for="esquina">Esquina:</label>
                          <input type="text" id="esquina" placeholder="Ingrese la esquina"><br>
                        `;

                        // Agrega la información de la tabla al elemento HTML
                        document.getElementById("cartInfo").innerHTML = cartInfoHTML;

                        // Obtén todos los elementos de cantidad y subtotal después de agregarlos al DOM
                        const cantidadInputs = document.querySelectorAll(".cantidad");
                        const subtotalElements = document.querySelectorAll(".subtotal");

                        // Calcula y actualiza los subtotales para cada producto
                        const calculateSubtotals = () => {
                            cantidadInputs.forEach((cantidadInput, index) => {
                                const newCount = parseInt(cantidadInput.value);
                                const newSubtotal = cart[index].price * newCount;

                                if (!isNaN(newSubtotal)) {
                                    subtotalElements[index].textContent = `${newSubtotal.toFixed(2)} ${cart[index].currency}`;
                                    cart[index].count = newCount;
                                    cart[index].subtotal = newSubtotal.toFixed(2); // Asegura que el subtotal tenga 2 decimales
                                    localStorage.setItem("cart", JSON.stringify(cart));
                                }
                            });
                        };

                        // Agrega un event listener a todos los inputs de cantidad para actualizar los subtotales
                        cantidadInputs.forEach((cantidadInput) => {
                            cantidadInput.addEventListener("input", calculateSubtotals);
                        });

                        // Llama a la función calculateSubtotals una vez para mostrar los subtotales iniciales
                        calculateSubtotals();

                        // Agrega un event listener a todos los botones "Eliminar" para eliminar productos
                        const eliminarBotones = document.querySelectorAll(".eliminar-producto");
                        eliminarBotones.forEach((eliminarBoton) => {
                            eliminarBoton.addEventListener("click", (event) => {
                                const index = event.target.getAttribute("data-index");
                                if (index !== null) {
                                    // Elimina el producto del carrito
                                    cart.splice(index, 1);
                                    // Actualiza la tabla
                                    renderCart();
                                    // Actualiza el almacenamiento local
                                    localStorage.setItem("cart", JSON.stringify(cart));
                                }
                            });
                        });
                    }

                    // Llama a la función calculateSubtotals una vez para mostrar los subtotales iniciales
                    renderCart();
                })
                .catch((error) => {
                    console.error("Error al obtener la información del carrito:", error);
                });
        });
