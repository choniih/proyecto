document.addEventListener('DOMContentLoaded', function () {
  // Mover las declaraciones de variables fuera de la función DOMContentLoaded
  let correoInput = document.getElementById("validationCustom05");
  let primerNombreInput = document.getElementById("validationCustom01");
  let segundoNombreInput = document.getElementById("validationCustom02");
  let primerApellidoInput = document.getElementById("validationCustom03");
  let segundoApellidoInput = document.getElementById("validationCustom04");
  let telefonoInput = document.getElementById("validationCustom06");

  let correoDelUsuario = localStorage.getItem("username");
  correoInput.value = correoDelUsuario;

  let nombre = localStorage.getItem("primerNombre");
  primerNombreInput.value = nombre;

  let sNombre = localStorage.getItem("segundoNombre");
  segundoNombreInput.value = sNombre;

  let apellido = localStorage.getItem("primerApellido");
  primerApellidoInput.value = apellido;

  let sApellido = localStorage.getItem("segundoApellido");
  segundoApellidoInput.value = sApellido;

  let telefono = localStorage.getItem("telefonoContacto");
  telefonoInput.value = telefono;

  // Verificar si hay una foto de perfil guardada en el almacenamiento local
var fotoPerfilGuardada = localStorage.getItem('fotoPerfil');
if (fotoPerfilGuardada) {
    // Mostrar la foto de perfil guardada
    imagenPre.src = fotoPerfilGuardada;
}

  // ...

  // Enviar formulario
  document.getElementById("botonEnviarForm").addEventListener("click", function () {
    // Validación de campos nombre, apellido y telefono
    if (primerNombreInput.value === "" || primerApellidoInput.value === "" || telefonoInput.value === "") {
      alert("Por favor, complete todos los campos requeridos.");
      return;
    } else {
      alert("Tus datos quedaron actualizados");
      localStorage.setItem("primerNombre", primerNombreInput.value);
      localStorage.setItem("segundoNombre", segundoNombreInput.value);
      localStorage.setItem("primerApellido", primerApellidoInput.value);
      localStorage.setItem("segundoApellido", segundoApellidoInput.value);
      localStorage.setItem("telefonoContacto", telefonoInput.value);
    }
  });
});

// JavaScript para la página de perfil de usuario


  // Obtener elementos del DOM
  var inputFile = document.getElementById('inputFile');
  var imagenPre = document.getElementById('imagenPre');

  // Manejador de eventos para el cambio de archivo
  inputFile.addEventListener('change', function () {
      // Verificar si se seleccionó un archivo
      if (inputFile.files.length > 0) {
          var file = inputFile.files[0];

          // Convertir la imagen a Base64
          convertirABase64(file, function (base64) {
              // Mostrar la imagen en la página
              imagenPre.src = base64;

              // Guardar la imagen en el almacenamiento local
              guardarEnLocal(base64);
          });
      }

  // Función para convertir una imagen a Base64
  function convertirABase64(file, callback) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        var base64 = reader.result;
        callback(base64);
    };
    reader.onerror = function (error) {
        console.error('Error al leer el archivo: ', error);
    };
}

// Función para guardar la imagen en el almacenamiento local
function guardarEnLocal(base64) {
    localStorage.setItem('fotoPerfil', base64);
}



});
