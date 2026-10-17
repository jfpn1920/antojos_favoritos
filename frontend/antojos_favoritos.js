//-------------------------------------//
//--|funcionalidad_antojos_favoritos|--//
//-------------------------------------//
const CLAVE = "antojosFavoritos";
const INICIALES = [
    "Pizza",
    "Hamburguesa",
    "Arepa con queso",
    "Empanada",
    "Helado",
    "Chocolate",
    "Patacón",
    "Churros"
];
let lista = [];
const inputNuevo = document.getElementById("nuevo");
const mensaje = document.getElementById("mensaje");
const contador = document.getElementById("contador");
const ul = document.getElementById("lista");
const resumen = document.getElementById("resumen");
//-------------------------// 
//--|crear_lista_inicial|--//
//-------------------------//
function listaInicial() {
    return INICIALES.map(function(nombre) {
        return {
            nombre: nombre,
            elegido: false
        };
    });
}
//----------------------------//
//--|cargar_datos_guardados|--//
//----------------------------//
function cargarDatos() {
    try {
        const guardado = localStorage.getItem(CLAVE);
        if (guardado) {
            lista = JSON.parse(guardado);
        } else {
            lista = listaInicial();
        }
    } catch (error) {
        lista = listaInicial();
    }
}
function guardarDatos() {
    localStorage.setItem(CLAVE, JSON.stringify(lista));
}
//---------------------------------//
//--|mostrar_antojos_en_pantalla|--//
//---------------------------------//
function pintar() {
    ul.innerHTML = "";
    lista.forEach(function(antojo, posicion) {
        const li = document.createElement("li");
        const etiqueta = document.createElement("label");
        const casilla = document.createElement("input");
        const texto = document.createElement("span");
        etiqueta.className = "antojo";
        if (antojo.elegido) {
            etiqueta.classList.add("elegido");
        }
        casilla.type = "checkbox";
        casilla.checked = antojo.elegido;
        casilla.dataset.posicion = posicion;
        texto.textContent = antojo.nombre;
        etiqueta.appendChild(casilla);
        etiqueta.appendChild(texto);
        li.appendChild(etiqueta);
        ul.appendChild(li);
    });
    const elegidos = lista.filter(function(antojo) {
        return antojo.elegido;
    });
    contador.textContent = elegidos.length + " de " + lista.length + " elegidos";
    if (elegidos.length > 0) {
        resumen.textContent = elegidos.map(function(antojo) {
            return antojo.nombre;
        }).join(", ");
    } else {
        resumen.textContent = "Aún no has elegido ningún antojo.";
    }
}
//--------------------------//
//--|agregar_nuevo_antojo|--//
//--------------------------//
document.getElementById("btnAgregar").addEventListener("click", function() {
    const nombre = inputNuevo.value.trim();
    if (nombre === "") {
        mensaje.textContent = "Escribe el nombre de una comida.";
        return;
    }
    const existe = lista.some(function(antojo) {
        return antojo.nombre.toLowerCase() === nombre.toLowerCase();
    });
    if (existe) {
        mensaje.textContent = "Esta comida ya está en la lista.";
        return;
    }
    lista.push({
        nombre: nombre,
        elegido: false
    });
    inputNuevo.value = "";
    mensaje.textContent = "";
    guardarDatos();
    pintar();
});
//----------------------------------//
//--|seleccionar_o_quitar_antojos|--//
//----------------------------------//
ul.addEventListener("change", function(evento) {
    if (evento.target.matches('input[type="checkbox"]')) {
        const posicion = Number(evento.target.dataset.posicion);
        lista[posicion].elegido = evento.target.checked;
        guardarDatos();
        pintar();
    }
});
document.getElementById("btnTodos").addEventListener("click", function() {
    lista.forEach(function(antojo) {
        antojo.elegido = true;
    });
    guardarDatos();
    pintar();
});
document.getElementById("btnLimpiar").addEventListener("click", function() {
    lista.forEach(function(antojo) {
        antojo.elegido = false;
    });
    guardarDatos();
    pintar();
});
//------------------------//
//--|iniciar_aplicacion|--//
//------------------------//
cargarDatos();
pintar();