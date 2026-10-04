// ===== Configuración inicial =====
const CLAVE = "antojosFavoritos"; // clave con la que se guarda en localStorage
// Comidas que aparecen la primera vez que se abre la página
const INICIALES = ["Pizza", "Hamburguesa", "Arepa con queso", "Empanada", "Helado", "Chocolate", "Patacón", "Churros"];
let lista = []; // cada elemento tiene la forma { nombre: "Pizza", elegido: false }
// ===== Referencias a elementos del HTML =====
const inputNuevo = document.getElementById("nuevo");
const mensaje = document.getElementById("mensaje");
const contador = document.getElementById("contador");
const ul = document.getElementById("lista");
const resumen = document.getElementById("resumen");
// ===== Funciones de localStorage =====
// Crea la lista inicial con ninguna comida elegida
function listaInicial() {
    return INICIALES.map(function (nombre) {
        return { nombre: nombre, elegido: false };
    });
}
// Lee la lista guardada; si no hay nada, usa la lista inicial
function cargarDatos() {
    try {
        const guardado = localStorage.getItem(CLAVE);
        lista = guardado ? JSON.parse(guardado) : listaInicial();
    } catch (error) {
      lista = listaInicial(); // si algo falla, empieza de cero
    }
}
// Guarda la lista como texto en localStorage
function guardarDatos() {
    localStorage.setItem(CLAVE, JSON.stringify(lista));
}
// ===== Función que dibuja todo en pantalla =====
function pintar() {
    ul.innerHTML = ""; // limpia la lista antes de dibujar
    lista.forEach(function (comida, posicion) {
        const li = document.createElement("li");
        const etiqueta = document.createElement("label");
        etiqueta.className = "antojo" + (comida.elegido ? " elegido" : "");
        // Casilla que indica si la comida está elegida
        const casilla = document.createElement("input");
        casilla.type = "checkbox";
        casilla.checked = comida.elegido;
        casilla.dataset.posicion = posicion; // guarda cuál comida es
        // Nombre de la comida (textContent evita código malicioso)
        const nombre = document.createElement("span");
        nombre.textContent = comida.nombre;
        etiqueta.append(casilla, nombre);
        li.appendChild(etiqueta);
        ul.appendChild(li);
    });
    // Contador y resumen con las comidas elegidas
    const elegidas = lista.filter(function (c) { return c.elegido; });
    contador.textContent = elegidas.length + " de " + lista.length + " elegidos";
    resumen.textContent = elegidas.length
        ? elegidas.map(function (c) { return c.nombre; }).join(", ")
        : "Aún no has elegido ningún antojo.";
}
// ===== Eventos =====
// Cada evento guarda los datos y vuelve a dibujar la pantalla
// Así lo que ves siempre coincide con lo guardado
// Agregar una comida nueva
document.getElementById("btnAgregar").addEventListener("click", function () {
    const nombre = inputNuevo.value.trim();
    // Validación: no puede estar vacío ni repetido
    if (!nombre) {
        ensaje.textContent = "Escribe el nombre de una comida.";
        eturn;
    }
    const repetido = lista.some(function (c) { return c.nombre.toLowerCase() === nombre.toLowerCase(); });
    if (repetido) {
        mensaje.textContent = "Esa comida ya está en la lista.";
        return;
    }
    lista.push({ nombre: nombre, elegido: false });
    inputNuevo.value = "";
    mensaje.textContent = "";
    guardarDatos();
    pintar();
});
// Elegir o quitar una comida: un solo evento en la lista detecta la casilla
ul.addEventListener("change", function (e) {
    lista[Number(e.target.dataset.posicion)].elegido = e.target.checked;
    guardarDatos();
    pintar();
});
// Elegir todas las comidas
document.getElementById("btnTodos").addEventListener("click", function () {
    lista.forEach(function (c) { c.elegido = true; });
    guardarDatos();
    pintar();
});
// Quitar la selección de todas
document.getElementById("btnLimpiar").addEventListener("click", function () {
    lista.forEach(function (c) { c.elegido = false; });
    guardarDatos();
    pintar();
});
// ===== Inicio de la app =====
cargarDatos(); // primero se lee lo guardado
pintar();      // luego se dibuja la pantalla