document.addEventListener("DOMContentLoaded", function() {

const salon = document.getElementById("salon");

const comanda = document.getElementById("comanda");

const listaItems = document.getElementById("lista-items");

const barraFunciones = document.getElementById("funciones");

const infoMesa = document.getElementById("info-mesa");

class Mesa {
    constructor(numero, ocupado, cantSillas, comanda = null) {
        this.numero = numero;
        this.ocupado = ocupado;
        this.cantSillas = cantSillas;
        this.comanda = comanda instanceof Comanda ? comanda : new Comanda([]); // Si no hay comanda, inicializa una vacía
    }

    mostrarMesa() {
        console.log(`Mesa: ${this.numero}, Sillas: ${this.cantSillas}, Estado: ${this.ocupado}`);
        if (this.tieneComanda()) {
            console.log("Comanda:");
            this.comanda.mostrarComanda();
        } else {
            console.log("Sin comanda asignada.");
        }    
    }    

    toJSON() {
        return {
            numeroMesa: this.numero,
            ocupado: this.ocupado,
            cantSillas: this.cantSillas,
            comanda: this.comanda ? this.comanda.toJSON() : null
        };
    }

    enviarComanda() {
        // Aquí puedes gestionar la lógica para tomar una comanda
        localStorage.setItem("mesa", JSON.stringify(this));

        // Redirigir a comanda.html o gestionar el estado de la comanda
        window.location.href = "page/comanda.html"; // Puedes redirigir a la página de comanda
    }
}

class Comanda {
    constructor(items) {
        this.items = items || []; // Asegura que 'items' sea un array vacío si no se provee
    }

    toJSON() {
        return {
            items: this.items
        };
    }

    agregarItem(cantItem, item, precio) {
        this.items.push({ cantItem, item, precio});
    }

    // Método para visualizar la comanda completa
    mostrarComanda() {
        this.items.forEach(pedido => {
            const listaComanda = document.createElement("ul");
            const itemsLista = document.createElement("li");

            itemsLista.innerText = `${pedido.cantItem}  ${pedido.item}`;

            listaComanda.appendChild(itemsLista);
        });
    }
}

const mesas = [
    new Mesa(1, true, 4, new Comanda([
        { cantItem: 2, item: "agua", precio: 100 },
        { cantItem: 1, item: "Milanesa con Pure", precio: 200 },
        { cantItem: 1, item: "Fideos con Tuco", precio: 200 }
    ])),
    new Mesa(2, true, 4, new Comanda([
        { cantItem: 2, item: "refresco", precio: 100 },
        { cantItem: 2, item: "Sushi", precio: 250 },
        { cantItem: 1, item: "Brotola", precio: 250 }
    ])),
    new Mesa(3, false, 0, new Comanda([])), // Sin comanda
    new Mesa(4, true, 2, new Comanda([
        { cantItem: 2, item: "cafe", precio: 50 },
        { cantItem: 1, item: "Medialuna", precio: 70 },
        { cantItem: 1, item: "Alfajor", precio: 50 }
    ])),
    new Mesa(5, false, 0, new Comanda([])), // Sin comanda
    new Mesa(6, false, 0, new Comanda([])), // Sin comanda
    new Mesa(7, true, 2, new Comanda([
        { cantItem: 1, item: "agua", precio: 100 },
        { cantItem: 1, item: "refresco", precio: 100 },
        { cantItem: 1, item: "Ojo de bife", precio: 250 },
        { cantItem: 1, item: "Ravioles con salsa blanca", precio: 200 }
    ])),
    new Mesa(8, false, 0, new Comanda([])), // Sin comanda
];

const menú = [
    { 
        nombre: "Agua", 
        precio: 100,
        tipo: "bebida"
    },
    { 
        nombre: "Refresco", 
        precio: 100,
        tipo: "bebida"
    },
    { 
        nombre: "Café", 
        precio: 50,
        tipo: "bebida"
    },
    {
        nombre: "Medialuna",
        precio: 70,
        tipo: "merienda"
    },
    {
        nombre: "Alfajor",
        precio: 50,
        tipo: "merienda"
    },
    { 
        nombre: "Milanesa con Puré",
        precio: 200,
        tipo: "principal"
    },
    { 
        nombre: "Fideos con Tuco",
        precio: 200,
        tipo: "principal"
    },
    { 
        nombre: "Ravioles con salsa blanca",
        precio: 200,
        tipo: "principal"
    },
    { 
        nombre: "Ojo de bife",
        precio: 250,
        tipo: "principal"
    },
    { 
        nombre: "Sorrentinos de cordero",
        precio: 250,
        tipo: "principal"
    },
    {
        nombre: "Pan pita con hummus",
        precio: 170,
        tipo: "principal"
    },
    {
        nombre: "Flan",
        precio: 100,
        tipo: "postre"
    },
    {
        nombre: "Helado",
        precio: 100,
        tipo: "postre"
    }
];

// Verificar qué HTML se está cargando
if (salon) {
    // Código para index.html
    crearMesas();
} else if (comanda) {
    // Código para comanda.html
    cargarInfoMesa();
    crearListaItems();
    crearBarraFunciones();
    llenarListaPedido();
} else {
    console.error("Ningún contexto válido encontrado.");
}

// crear salon con mesas
function crearMesas() {
    mesas.forEach(mesa => {
        const mesaButton = document.createElement("button");
        mesaButton.className = "mesa";
        mesaButton.innerText = mesa.numero;
        // Llamar a tomarComanda desde la instancia
        mesaButton.addEventListener("click", () => mesa.enviarComanda()); 
        
        if (mesa.ocupado) {
            mesaButton.style.backgroundColor = "rgb(20, 42, 187)";
        }else{
            mesaButton.style.backgroundColor = "rgb(198, 95, 95)";
        }

        salon.appendChild(mesaButton);
    });
}

function cargarInfoMesa(){
    const mesaGuardada = JSON.parse(localStorage.getItem("mesa"));
    
    const numeroMesa = document.createElement("div");
    numeroMesa.className = "divs-info";
    numeroMesa.innerText = `Mesa: ${mesaGuardada.numeroMesa}`;

    const cantComensales = document.createElement("div");
    cantComensales.className = "divs-info";
    cantComensales.innerText = `Cantidad de Comensales: ${mesaGuardada.cantSillas}`;

    infoMesa.appendChild(numeroMesa);
    infoMesa.appendChild(cantComensales);
}

// crear lista de items para comandar
function crearListaItems() {
    menú.forEach(el => {
        const item = document.createElement("button");
        item.className = "item";

        // Llamar a tomarComanda desde la instancia
        item.addEventListener("click", () => agregarItemALista(el)); 

        const nombre = document.createElement("p");
        nombre.innerText = el.nombre;
        

        const precio = document.createElement("p");
        precio.innerText = `$${el.precio}`;

        if (el.tipo === "bebida") {
            item.style.backgroundColor = "rgb(136, 170, 200)";
        } else {
            if (el.tipo === "merienda") {
                item.style.backgroundColor = "rgb(153, 149, 41)"; // Corregido aquí
            } else {
                if (el.tipo === "principal") {
                    item.style.backgroundColor = "rgb(84, 154, 41)"; // Corregido aquí
                } else {
                    if (el.tipo === "postre") {
                        item.style.backgroundColor = "rgb(159, 83, 45)"; // Corregido aquí
                    }
                }
            }
        }

        item.appendChild(nombre);
        item.appendChild(precio);

        listaItems.appendChild(item);
    });
}
// crear barra de funciones
function crearBarraFunciones(){
    const botonMesas = document.createElement("button");
    botonMesas.className = "funcion";
    botonMesas.innerText = "Volver";
    botonMesas.addEventListener("click", () => window.location.href = "../index.html"); 
    barraFunciones.appendChild(botonMesas);
}

function llenarListaPedido(){
    const mesaGuardada = JSON.parse(localStorage.getItem("mesa"));

    mesaGuardada.comanda.items.forEach(pedido => {
        // Crear un elemento <p> para cada item
        const itemLista = document.createElement("p");
        itemLista.className = "items-lista";

        // Añadir detalles del item al <p>
        itemLista.innerText = `${pedido.cantItem} x ${pedido.item}  $${pedido.precio}`;

        // Agregar el <p> al div
        comanda.appendChild(itemLista);
    });

}

function agregarItemALista(itemAAgregar){
    const mesaGuardada = JSON.parse(localStorage.getItem("mesa"));

    const nuevoItem = {
        cantItem: 1,
        item: itemAAgregar.nombre,
        precio: itemAAgregar.precio
    };
    
    mesaGuardada.comanda.items.push(nuevoItem);

    localStorage.setItem("mesa", JSON.stringify(mesaGuardada));

    const itemNuevo = document.createElement("p");
    itemNuevo.className = "items-lista";
    
    itemNuevo.innerText = `${nuevoItem.cantItem} x ${nuevoItem.item}  $${nuevoItem.precio}`;

    comanda.appendChild(itemNuevo);
}
    
});