/* =====================================================
   ESTADO
   ===================================================== */

let opciones = null;      // catálogo cargado desde /api/opciones
let contadorElementos = 0;

const contenedor =
    document.getElementById("elementos-container");


/* =====================================================
   CARGA INICIAL DE OPCIONES
   ===================================================== */

async function cargarOpciones() {

    const respuesta =
        await fetch("/api/opciones");

    if (!respuesta.ok) {

        throw new Error(
            "No se pudieron cargar las opciones del servidor."
        );

    }

    opciones = await respuesta.json();

}


/* =====================================================
   CONSTRUIR SELECT A PARTIR DE UN DICCIONARIO
   { clave: { etiqueta, valor }, ... }
   ===================================================== */

function construirSelect(id, diccionario, valorPorDefecto) {

    const select =
        document.createElement("select");

    select.id = id;

    Object.entries(diccionario).forEach(
        ([clave, info]) => {

            const opcion =
                document.createElement("option");

            opcion.value = clave;
            opcion.textContent = info.etiqueta;

            if (clave === valorPorDefecto) {

                opcion.selected = true;

            }

            select.appendChild(opcion);

        }
    );

    return select;

}


/* =====================================================
   CREAR TARJETA DE ELEMENTO
   ===================================================== */

function crearTarjetaElemento() {

    contadorElementos += 1;

    const idElemento =
        `elemento-${contadorElementos}`;

    const tarjeta =
        document.createElement("article");

    tarjeta.className = "elemento-card";
    tarjeta.dataset.id = idElemento;


    /* --- Encabezado: nombre + eliminar --- */

    const encabezado =
        document.createElement("div");

    encabezado.className =
        "elemento-card-header";

    encabezado.innerHTML = `
        <div class="elemento-nombre-campo">
            <label>Nombre del elemento</label>
            <input
                type="text"
                class="elemento-nombre"
                placeholder="Ej. Tomar pieza y colocar en dispositivo"
            >
        </div>
    `;

    const botonEliminar =
        document.createElement("button");

    botonEliminar.className =
        "eliminar-elemento";

    botonEliminar.textContent =
        "Eliminar elemento";

    botonEliminar.addEventListener(
        "click",
        () => tarjeta.remove()
    );

    encabezado.appendChild(
        botonEliminar
    );

    tarjeta.appendChild(
        encabezado
    );


    /* --- Bloque: lecturas --- */

    const bloqueLecturas =
        document.createElement("div");

    bloqueLecturas.className =
        "elemento-bloque";

    bloqueLecturas.innerHTML = `
        <h3>Lecturas de tiempo</h3>
        <p class="elemento-bloque-ayuda">
            Captura cada ciclo cronometrado. Se recomienda al menos
            5 lecturas para una primera estimación.
        </p>
    `;

    const filaLecturas =
        document.createElement("div");

    filaLecturas.className =
        "fila-lecturas";

    const contenedorLecturas =
        document.createElement("div");

    contenedorLecturas.className =
        "lecturas-container";

    // 3 lecturas iniciales vacías
    for (let i = 0; i < 3; i++) {

        contenedorLecturas.appendChild(
            crearInputLectura()
        );

    }

    const botonAgregarLectura =
        document.createElement("button");

    botonAgregarLectura.type = "button";
    botonAgregarLectura.className = "add-lectura";
    botonAgregarLectura.textContent = "+ Lectura";

    botonAgregarLectura.addEventListener(
        "click",
        () => {

            contenedorLecturas.appendChild(
                crearInputLectura()
            );

        }
    );

    const selectUnidad =
        document.createElement("select");

    selectUnidad.className =
        "lectura-unidad-select";

    selectUnidad.innerHTML = `
        <option value="min">minutos</option>
        <option value="seg">segundos</option>
    `;

    filaLecturas.appendChild(contenedorLecturas);

    bloqueLecturas.appendChild(filaLecturas);

    const filaBotonUnidad =
        document.createElement("div");

    filaBotonUnidad.className = "fila-lecturas";

    filaBotonUnidad.appendChild(botonAgregarLectura);
    filaBotonUnidad.appendChild(selectUnidad);

    bloqueLecturas.appendChild(filaBotonUnidad);

    tarjeta.appendChild(bloqueLecturas);


    /* --- Bloque: calificación Westinghouse --- */

    const bloqueCalificacion =
        document.createElement("div");

    bloqueCalificacion.className =
        "elemento-bloque";

    bloqueCalificacion.innerHTML =
        "<h3>Calificación del desempeño (Westinghouse)</h3>";

    const gridCalificacion =
        document.createElement("div");

    gridCalificacion.className =
        "subgrupo-grid";

    const factores = [
        ["habilidad", "Habilidad", "D"],
        ["esfuerzo", "Esfuerzo", "D"],
        ["condiciones", "Condiciones", "D"],
        ["consistencia", "Consistencia", "D"],
    ];

    factores.forEach(([clave, etiqueta, porDefecto]) => {

        const grupo =
            document.createElement("div");

        grupo.className = "subgrupo";
        grupo.dataset.factor = clave;

        const label =
            document.createElement("label");

        label.textContent = etiqueta;

        grupo.appendChild(label);

        grupo.appendChild(
            construirSelect(
                `${idElemento}-${clave}`,
                opciones.westinghouse[clave],
                porDefecto
            )
        );

        gridCalificacion.appendChild(grupo);

    });

    bloqueCalificacion.appendChild(
        gridCalificacion
    );

    tarjeta.appendChild(
        bloqueCalificacion
    );


    /* --- Bloque: suplementos variables --- */

    const bloqueSuplementos =
        document.createElement("div");

    bloqueSuplementos.className =
        "elemento-bloque";

    bloqueSuplementos.innerHTML = `
        <h3>Suplementos</h3>
        <p class="elemento-bloque-ayuda">
            Se agrega automáticamente el 9% constante (necesidades
            personales + fatiga básica). Ajusta solo lo que aplique.
        </p>
    `;

    const gridSuplementos =
        document.createElement("div");

    gridSuplementos.className =
        "subgrupo-grid";

    Object.entries(opciones.suplementos.variables).forEach(
        ([clave, info]) => {

            const primeraOpcion =
                Object.keys(info.opciones)[0];

            const grupo =
                document.createElement("div");

            grupo.className = "subgrupo";
            grupo.dataset.suplemento = clave;

            const label =
                document.createElement("label");

            label.textContent = info.etiqueta;

            grupo.appendChild(label);

            grupo.appendChild(
                construirSelect(
                    `${idElemento}-sup-${clave}`,
                    info.opciones,
                    primeraOpcion
                )
            );

            gridSuplementos.appendChild(grupo);

        }
    );

    bloqueSuplementos.appendChild(
        gridSuplementos
    );

    tarjeta.appendChild(
        bloqueSuplementos
    );


    return tarjeta;

}


function crearInputLectura() {

    const input =
        document.createElement("input");

    input.type = "number";
    input.step = "0.001";
    input.min = "0";

    input.className = "lectura-input";
    input.placeholder = "0.00";

    return input;

}


/* =====================================================
   RECOLECTAR DATOS DE UNA TARJETA
   ===================================================== */

function leerTarjeta(tarjeta) {

    const nombre =
        tarjeta
            .querySelector(".elemento-nombre")
            .value
            .trim() || "Elemento sin nombre";

    const unidad =
        tarjeta
            .querySelector(".lectura-unidad-select")
            .value;

    let lecturas =
        Array.from(
            tarjeta.querySelectorAll(".lectura-input")
        )
        .map(input => parseFloat(input.value))
        .filter(valor => !Number.isNaN(valor));

    // Normalizamos todo a minutos para que el total tenga sentido
    if (unidad === "seg") {

        lecturas =
            lecturas.map(valor => valor / 60);

    }

    const calificacion = {};

    tarjeta.querySelectorAll("[data-factor]").forEach(
        (grupo) => {

            calificacion[grupo.dataset.factor] =
                grupo.querySelector("select").value;

        }
    );

    const suplementos = {};

    tarjeta.querySelectorAll("[data-suplemento]").forEach(
        (grupo) => {

            suplementos[grupo.dataset.suplemento] =
                grupo.querySelector("select").value;

        }
    );

    return {
        nombre,
        lecturas,
        unidad: "min",
        calificacion,
        suplementos,
    };

}


/* =====================================================
   RENDERIZAR RESULTADOS
   ===================================================== */

function renderizarResultados(datos) {

    const cuerpo =
        document.getElementById(
            "tabla-resultados-body"
        );

    cuerpo.innerHTML = "";

    datos.elementos.forEach((el) => {

        const fila =
            document.createElement("tr");

        const celdaObservaciones =
            el.muestra_suficiente
                ? `${el.n_lecturas}`
                : `${el.n_lecturas}`;

        fila.innerHTML = `
            <td>${el.nombre}</td>
            <td>${el.n_lecturas}</td>
            <td>${el.tiempo_observado_promedio.toFixed(4)} min</td>
            <td>${el.desviacion_estandar.toFixed(4)}</td>
            <td>${el.factor_calificacion.toFixed(3)}</td>
            <td>${el.tiempo_normal.toFixed(4)} min</td>
            <td>${el.porcentaje_suplementos.toFixed(1)}%</td>
            <td><strong>${el.tiempo_estandar.toFixed(4)} min</strong></td>
            <td class="${el.muestra_suficiente ? "" : "celda-alerta"}">
                ${el.numero_observaciones_recomendado}
                ${el.muestra_suficiente ? "" : " (faltan lecturas)"}
            </td>
        `;

        cuerpo.appendChild(fila);

    });

    document.getElementById("total-valor").textContent =
        `${datos.tiempo_estandar_total.toFixed(4)} min`;

    document
        .getElementById("resultados")
        .classList.remove("hidden");

    document
        .getElementById("resultados")
        .scrollIntoView({ behavior: "smooth", block: "start" });

}


/* =====================================================
   CALCULAR (llamada al backend)
   ===================================================== */

async function calcular() {

    const tarjetas =
        document.querySelectorAll(".elemento-card");

    if (tarjetas.length === 0) {

        alert(
            "Agrega al menos un elemento antes de calcular."
        );

        return;

    }

    const elementos =
        Array.from(tarjetas).map(leerTarjeta);

    const sinLecturas =
        elementos.find(el => el.lecturas.length === 0);

    if (sinLecturas) {

        alert(
            `El elemento "${sinLecturas.nombre}" no tiene lecturas ` +
            "numéricas válidas."
        );

        return;

    }

    const boton =
        document.getElementById("calcular");

    boton.disabled = true;
    boton.textContent = "Calculando…";

    try {

        const respuesta =
            await fetch("/api/tiempo-estandar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ elementos }),
            });

        if (!respuesta.ok) {

            const error = await respuesta.json();

            throw new Error(
                error.detail || "Error al calcular."
            );

        }

        const datos = await respuesta.json();

        renderizarResultados(datos);

    } catch (error) {

        alert(error.message);

    } finally {

        boton.disabled = false;
        boton.textContent = "Calcular tiempo estándar";

    }

}


/* =====================================================
   INICIALIZACIÓN
   ===================================================== */

async function iniciar() {

    try {

        await cargarOpciones();

    } catch (error) {

        contenedor.innerHTML = `
            <p style="color:#b00020;">
                No se pudo conectar con el servidor (${error.message}).
                Verifica que el backend esté corriendo
                (uvicorn main:app --reload).
            </p>
        `;

        return;

    }

    contenedor.appendChild(
        crearTarjetaElemento()
    );

    document
        .getElementById("agregar-elemento")
        .addEventListener("click", () => {

            contenedor.appendChild(
                crearTarjetaElemento()
            );

        });

    document
        .getElementById("calcular")
        .addEventListener("click", calcular);

}

iniciar();
