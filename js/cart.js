document.addEventListener("DOMContentLoaded", function () {
    const cartURL = "https://japceibal.github.io/emercado-api/user_cart/25801.json";

    let cart = []; // Inicializamos un carrito vacío

    // Realiza la solicitud web
    fetch(cartURL)
        .then((response) => response.json())
        .then((data) => {
            // Procesa los datos del carrito desde la URL externa
            const cartItemsFromURL = data.articles; // Tomamos todos los artículos desde la URL

            // Obtén el carrito actual almacenado localmente o crea uno nuevo
            let cart = JSON.parse(localStorage.getItem("cart")) || [];

            if (cart.length === 0) {
                // Si el carrito local está vacío, simplemente copia los elementos de la URL externa
                cart = cartItemsFromURL.map((cartItemFromURL) => {
                    cartItemFromURL.price = cartItemFromURL.unitCost; // Realiza la conversión
                    return cartItemFromURL;
                });
            } else {
                // Si ya hay elementos en el carrito local, verifica si los elementos de la URL externa ya están en el carrito local
                cartItemsFromURL.forEach((cartItemFromURL) => {
                    const existingCartItem = cart.find((item) => item.id === cartItemFromURL.id);

                    if (!existingCartItem) {
                        // Si el producto no está en el carrito local, agrégalo
                        cartItemFromURL.price = cartItemFromURL.unitCost; // Realiza la conversión
                        cart.push(cartItemFromURL);
                    }
                });
            }

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
                      Premium 2 a 5 días (15%)
                    </label><br>
                    <label>
                        <input type="radio" name="tipoEnvio" value="envioExpress">
                        Express 5 a 8 días (7%)
                        </label><br>

                    <label>
                      <input type="radio" name="tipoEnvio" value="retiroLocal">
                      Standard 12 a 15 días (5%)
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
                    let subtotal = 0;
                    cantidadInputs.forEach((cantidadInput, index) => {
                        const newCount = parseInt(cantidadInput.value);
                        const newSubtotal = cart[index].price * newCount;

                        if (!isNaN(newSubtotal)) {
                            subtotal += newSubtotal;
                            subtotalElements[index].textContent = `${newSubtotal.toFixed(2)} ${cart[index].currency}`;
                            cart[index].count = newCount;
                            cart[index].subtotal = newSubtotal.toFixed(2); // Asegura que el subtotal tenga 2 decimales
                        }
                    });
                    localStorage.setItem("cart", JSON.stringify(cart));

                    const shippingOption = document.querySelector('input[name="tipoEnvio"]:checked');
                    let shippingPercentage = 0;

                    if (shippingOption) {
                        if (shippingOption.value === "envioNormal") {
                            shippingPercentage = 0.15; // 5% de costo de envío
                        } else if (shippingOption.value === "envioExpress") {
                            shippingPercentage = 0.07; // 7% de costo de envío
                        } else if (shippingOption.value === "retiroLocal") {
                            shippingPercentage = 0.05; // 15% de costo de envío
                        }
                    }

                    const shippingCost = subtotal * shippingPercentage;
                    const totalAmount = subtotal + shippingCost;

                    document.getElementById("subtotalAmount").textContent = `$${subtotal.toFixed(2)}`;
                    document.getElementById("shippingCost").textContent = `$${shippingCost.toFixed(2)}`;
                    document.getElementById("totalAmount").textContent = `$${totalAmount.toFixed(2)}`;
                };

                // Agrega un event listener a todos los inputs de cantidad para actualizar los subtotales
                cantidadInputs.forEach((cantidadInput) => {
                    cantidadInput.addEventListener("input", calculateSubtotals);
                });
                const shippingOptions = document.querySelectorAll('input[name="tipoEnvio"]');
                shippingOptions.forEach((option) => {
                    option.addEventListener("change", calculateSubtotals);
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

    // ... (código del modal)

    // Agrega un evento al botón para abrir el modal de selección de forma de pago
    const openPaymentModalButton = document.createElement("button");
    openPaymentModalButton.innerText = "Seleccionar forma de pago";
    openPaymentModalButton.className = "btn btn-primary";
    openPaymentModalButton.addEventListener("click", function () {
        // Abre el modal
        $('#paymentModal').modal('show');
    });
    document.getElementById("modals").appendChild(openPaymentModalButton);

    // Agrega un evento para actualizar los campos de forma de pago
    document.getElementById("paymentMethod").addEventListener("change", function () {
        const selectedPaymentMethod = this.value;
        const creditCardFields = document.getElementById("creditCardFields");
        const bankTransferFields = document.getElementById("bankTransferFields");
        const selectedPaymentMethodLabel = document.getElementById("selectedPaymentMethod");
    
        // Oculta y deshabilita todos los campos y títulos
        creditCardFields.classList.add("d-none");
        creditCardFields.querySelectorAll("input").forEach((input) => (input.disabled = true));
        bankTransferFields.classList.add("d-none");
    
        // Muestra y habilita los campos y títulos correspondientes a la forma de pago seleccionada
        if (selectedPaymentMethod === "creditCard") {
            creditCardFields.classList.remove("d-none");
            creditCardFields.querySelectorAll("input").forEach((input) => (input.disabled = false));
            selectedPaymentMethodLabel.textContent = "Método de pago seleccionado: Tarjeta de Crédito";
        } else if (selectedPaymentMethod === "bankTransfer") {
            bankTransferFields.classList.remove("d-none");
            selectedPaymentMethodLabel.textContent = "Método de pago seleccionado: Transferencia Bancaria";
        } else {
            selectedPaymentMethodLabel.textContent = "No se ha seleccionado ningún método de pago";
        }
    });
    
    

    // Agrega un evento para manejar el envío de los datos de pago
    document.getElementById("submitPayment").addEventListener("click", function () {
        const paymentMethod = document.getElementById("paymentMethod").value;
        const creditCardNumber = document.getElementById("creditCardNumber").value;
        const bankAccount = document.getElementById("bankAccount").value;

        // Aquí puedes realizar acciones basadas en la forma de pago seleccionada y los datos ingresados
        console.log("Forma de pago seleccionada: " + paymentMethod);
        console.log("Número de tarjeta de crédito: " + creditCardNumber);
        console.log("Número de cuenta bancaria: " + bankAccount);

        // Cierra el modal
        $('#paymentModal').modal('hide');
        
    });
    document.getElementById("confirmPurchase").addEventListener("click", function () {
        const calleInput = document.getElementById("calle");
        const numeroInput = document.getElementById("numero");
        const esquinaInput = document.getElementById("esquina");
        const selectedPaymentMethod = document.getElementById("paymentMethod").value;
        const selectedShippingOption = document.querySelector('input[name="tipoEnvio"]:checked');
        const cantidadInputs = document.querySelectorAll(".cantidad");

    
        // Validación de campos de dirección
        if (calleInput.value === "" || numeroInput.value === "" || esquinaInput.value === "") {
            alert("Por favor, complete todos los campos de dirección.");
            return;
        }
    
        // Validación de forma de envío
        if (!selectedShippingOption) {
            alert("Por favor, seleccione una forma de envío.");
            return;
        }
    
        // Validación de cantidad para cada artículo
        for (const cantidadInput of cantidadInputs) {
            const cantidad = parseInt(cantidadInput.value);
            if (isNaN(cantidad) || cantidad <= 0) {
                alert("La cantidad para cada artículo debe ser un número mayor a 0.");
                return;
            }
        }
    
        // Validación de forma de pago
        if (selectedPaymentMethod === "creditCard") {
            const creditCardNumber = document.getElementById("creditCardNumber").value;
            const cvv = document.getElementById("cvv").value;
            const expirationDate = document.getElementById("expirationDate").value;
    
            if (creditCardNumber === "" || cvv === "" || expirationDate === "") {
                alert("Por favor, complete los campos del metodo de pago.");
                return;
            }
        } else if (selectedPaymentMethod === "bankTransfer") {
            const bankAccount = document.getElementById("bankAccount").value;
    
            if (bankAccount === "") {
                alert("Por favor, complete los campos del metodo de pago.");
                return;
            }
        }
    
        // Si todas las validaciones son exitosas, puedes continuar con la compra
        alert("Compra confirmada. ¡Gracias!");
    
        // Aquí puedes agregar el código para enviar los datos de la compra al servidor o realizar otras acciones necesarias.
    });
    
});
