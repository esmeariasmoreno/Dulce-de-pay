
const postres = [

    {
        nombre: "Pay de limón",

        ingredientes: [
            ["Lechera", "1 lata (387 g)", 29],
            ["Limones", "4 piezas (aprox. 100 ml de jugo)", 20],
            ["Leche evaporada", "1 lata (360 ml)", 46],
            ["Galletas María", "1 paquete (170 g)", 50]
        ],

        total: 145,

        desechables: [
            ["Desechable por rebanada", "1 pieza", 15],
            ["Desechable completo", "1 pieza", 30]
        ],

        ventas: [
            ["Precio de venta completo", "1 pay", 300],
            ["Precio de venta por rebanada", "1 rebanada", 40]
        ]
    },

    {
        nombre: "Fresas con crema",

        ingredientes: [
            ["Fresas", "1 kg", 80],
            ["Crema", "500 ml", 45],
            ["Lechera", "1 lata (387 g)", 29],
            ["Vainilla", "5 ml (1 cucharadita)", 8]
        ],

        total: 162,

        desechables: [
            ["Desechable por recipiente", "1 pieza", 8]
        ],

        ventas: [
            ["Precio de venta por recipiente", "1 recipiente", 45]
        ]
    },

    {
        nombre: "Ensalada de manzana",

        ingredientes: [
            ["Manzanas", "1 kg (aprox. 5–6 piezas)", 60],
            ["Crema", "500 ml", 45],
            ["Lechera", "1 lata (387 g)", 29],
            ["Piña", "250 g escurrida", 25],
            ["Nuez", "100 g", 20]
        ],

        total: 179,

        desechables: [
            ["Desechable por recipiente", "1 pieza", 8]
        ],

        ventas: [
            ["Precio de venta por recipiente", "1 recipiente", 50]
        ]
    },

    {
        nombre: "Pay de Oreo",

        ingredientes: [
            ["Galletas Oreo", "2 paquetes (aprox. 308 g)", 50],
            ["Mantequilla", "90 g", 30],
            ["Queso crema", "190 g", 45],
            ["Lechera", "1 lata (387 g)", 29],
            ["Crema para batir", "250 ml", 48],
            ["Grenetina", "10 g", 10]
        ],

        total: 212,

        desechables: [
            ["Desechable por rebanada", "1 pieza", 15],
            ["Desechable completo", "1 pieza", 30]
        ],

        ventas: [
            ["Precio de venta completo", "1 pay", 380],
            ["Precio de venta por rebanada", "1 rebanada", 50]
        ]
    }

];


// FUNCIÓN PARA CREAR LAS TABLAS

function crearTabla(titulo, elementos) {

    const filas = elementos.map(e => `
        <tr>
            <td>${e[0]}</td>
            <td>${e[1]}</td>
            <td>$${Number(e[2]).toFixed(2)}</td>
        </tr>
    `).join("");

    return `
        <h4>${titulo}</h4>

        <div class="tabla-contenedor">

            <table>

                <thead>
                    <tr>
                        <th>Concepto</th>
                        <th>Cantidad utilizada</th>
                        <th>Costo</th>
                    </tr>
                </thead>

                <tbody>
                    ${filas}
                </tbody>

            </table>

        </div>
    `;
}


// MOSTRAR LAS TABLAS DE PRECIOS

const contenedorCostos = document.getElementById("tablas-costos");

if (contenedorCostos) {

    postres.forEach(postre => {

        const tarjeta = document.createElement("article");

        tarjeta.className = "tabla-costos";

        tarjeta.innerHTML = `
            <h3>${postre.nombre}</h3>

            ${crearTabla("Ingredientes", postre.ingredientes)}

            <p class="total">
                Total de ingredientes: $${postre.total.toFixed(2)}
            </p>

            ${crearTabla("Material desechable", postre.desechables)}

            ${crearTabla("Precios de venta", postre.ventas)}
        `;

        contenedorCostos.appendChild(tarjeta);

    });

}


// APARTADO DE RESEÑAS

const formularioResena = document.getElementById("form-resena");

const listaResenas = document.getElementById("lista-resenas");

if (formularioResena && listaResenas) {

    const claveResenas = "dulceDePayResenas";

    let resenas = [];

    try {
        resenas = JSON.parse(
            localStorage.getItem(claveResenas) || "[]"
        );
    } catch {
        resenas = [];
    }


    // MOSTRAR LAS RESEÑAS

    function mostrarResenas() {

        listaResenas.replaceChildren();

        if (!resenas.length) {

            const vacio = document.createElement("p");

            vacio.className = "sin-resenas";

            vacio.textContent =
                "Todavía no hay reseñas. ¡Sé la primera persona en compartir tu opinión!";

            listaResenas.appendChild(vacio);

            return;
        }


        [...resenas].reverse().forEach(r => {

            const tarjeta = document.createElement("article");

            tarjeta.className = "resena";


            const titulo = document.createElement("h3");

            titulo.textContent = `${r.nombre} · ${r.producto}`;


            const estrellas = document.createElement("p");

            estrellas.className = "estrellas";

            estrellas.textContent =
                "★".repeat(r.calificacion) +
                "☆".repeat(5 - r.calificacion);


            const comentario = document.createElement("p");

            comentario.textContent = r.comentario;


            const fecha = document.createElement("small");

            fecha.textContent = r.fecha;


            tarjeta.append(
                titulo,
                estrellas,
                comentario,
                fecha
            );

            listaResenas.appendChild(tarjeta);

        });

    }


    // GUARDAR UNA NUEVA RESEÑA

    formularioResena.addEventListener("submit", event => {

        event.preventDefault();

        const datos = new FormData(formularioResena);

        const nueva = {

            nombre: String(datos.get("nombre")).trim(),

            producto: String(datos.get("producto")),

            calificacion: Number(datos.get("calificacion")),

            comentario: String(datos.get("comentario")).trim(),

            fecha: new Date().toLocaleDateString("es-MX")

        };


        if (
            !nueva.nombre ||
            !nueva.producto ||
            !nueva.calificacion ||
            !nueva.comentario
        ) {
            return;
        }


        resenas.push(nueva);

        try {

            localStorage.setItem(
                claveResenas,
                JSON.stringify(resenas)
            );

            formularioResena.reset();

            mostrarResenas();

            alert("¡Gracias! Tu reseña se publicó en este navegador.");

        } catch {

            alert(
                "No se pudo guardar la reseña. Revisa la configuración de almacenamiento del navegador."
            );

        }

    });


    mostrarResenas();

}
