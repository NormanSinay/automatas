function procesarContenido(contenido) {
    const lineas = contenido.split('\n');
    const vectorRectangular = {
        Q: [],
        F: [],
        i: null,
        A: [],
        W: []
    };
    let contenidoValido = true;

    if (
        !lineas.some(linea => linea.includes('Q=')) ||
        !lineas.some(linea => linea.includes('F=')) ||
        !lineas.some(linea => linea.includes('i=')) ||
        !lineas.some(linea => linea.includes('A=')) ||
        !lineas.some(linea => linea.includes('W='))
    ) {
        contenidoValido = false;
    }

    if (contenidoValido) {
        lineas.forEach((linea) => {
            if (linea.includes('Q=')) {
                const contenidoQ = linea.match(/\{(.*?)\}/);
                if (contenidoQ) {
                    vectorRectangular.Q = contenidoQ[1].split(',').map((element) => element.trim());
                } else {
                    contenidoValido = false;
                }
            } else if (linea.includes('F=')) {
                const contenidoF = linea.match(/\{(.*?)\}/);
                if (contenidoF) {
                    vectorRectangular.F = contenidoF[1].split(',').map((element) => element.trim());
                } else {
                    contenidoValido = false;
                }
            } else if (linea.includes('i=')) {
                const contenidoI = linea.match(/i=([A-Za-z]+)/);
                if (contenidoI) {
                    vectorRectangular.i = contenidoI[1];
                } else {
                    contenidoValido = false;
                }
            } else if (linea.includes('A=')) {
                const contenidoA = linea.match(/\{(.*?)\}/);
                if (contenidoA) {
                    vectorRectangular.A = contenidoA[1].split(',').map((element) => element.trim());
                } else {
                    contenidoValido = false;
                }
            } else if (linea.includes('W=')) {
                const contenidoW = linea.match(/\{(.*?)\}/);
                if (contenidoW) {
                    const matrizW = contenidoW[1].split('),').map((element) => element.trim());
                    vectorRectangular.W = matrizW.map((fila) => {
                        const elementos = fila.split(',');
                        return elementos.map((element) => element.trim().replace(/[()]/g, ''));
                    });
                } else {
                    contenidoValido = false;
                }
            }
        });
    }

    if (!contenidoValido) {
        alert("El contenido del archivo no es correcto.");
        return null;
    }

    return contenidoValido ? vectorRectangular : null;
}

const fileInput = document.getElementById("input-file-now");
const qTableBody = document.getElementById("q-table-body");
const fTableBody = document.getElementById("f-table-body");
const iTableBody = document.getElementById("i-table-body");
const aTableBody = document.getElementById("a-table-body");
const wTableBody = document.getElementById("w-table-body");
const container = document.getElementById("container");
const errorMessage = document.getElementById("error-message");
const contentCard = document.getElementById("content-card");

container.addEventListener("dragover", (e) => {
    e.preventDefault();
});

container.addEventListener("drop", (e) => {
    e.preventDefault();
    fileInput.files = e.dataTransfer.files;
    validarYProcesarArchivo();
});

fileInput.addEventListener("change", () => {
    validarYProcesarArchivo();
});

function agregarTitulo(tablaId, titulo) {
    const tabla = document.getElementById(tablaId);
    const tituloExistente = tabla.querySelector('caption');
    if (tituloExistente) {
        tituloExistente.remove();
    }
    const caption = document.createElement('caption');
    caption.textContent = titulo;
    tabla.appendChild(caption);
}

function mostrarElemento(elemento) {
    elemento.style.display = "block";
}

function ocultarElemento(elemento) {
    elemento.style.display = "none";
}

function validarYProcesarArchivo() {
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const contenido = event.target.result;
            const contentDisplay = document.getElementById("content-display");
            contentDisplay.textContent = contenido;
            const vectorRectangular = procesarContenido(contenido);

            if (!vectorRectangular) {
                errorMessage.style.display = "block";
                contentCard.style.display = "none";
                eliminarTitulosColumnas();
                limpiarTablaW();
                return;
            }

            errorMessage.style.display = "none";
            mostrarElemento(contentCard); 
            eliminarTitulosColumnas();
            limpiarTablaW();

            agregarTitulo('q-table', 'Estados (Q)');
            agregarTitulo('f-table', 'Alfabeto (F)');
            agregarTitulo('i-table', 'Estado inicial (i)');
            agregarTitulo('a-table', 'Estado de Aceptación (A)');
            agregarTitulo('w-table', 'Matriz de Transición (W)');

            mostrarVectorEnTabla(vectorRectangular.Q, qTableBody);
            mostrarVectorEnTabla(vectorRectangular.F, fTableBody);
            mostrarVectorEnTabla([vectorRectangular.i], iTableBody);
            mostrarVectorEnTabla(vectorRectangular.A, aTableBody);
            mostrarMatrizEnTabla(vectorRectangular.W, wTableBody, vectorRectangular.Q, vectorRectangular.F);
        };
        reader.readAsText(file);
    }
}

function eliminarTitulosColumnas() {
    const tablas = document.querySelectorAll('table');
    tablas.forEach(tabla => {
        const caption = tabla.querySelector('caption');
        if (caption) {
            caption.remove();
        }
    });
}

function limpiarTablaW() {
    const wTableBody = document.getElementById("w-table-body");
    wTableBody.innerHTML = ""; 
}

function mostrarVectorEnTabla(vector, tbody) {
    tbody.innerHTML = "";
    vector.forEach((element) => {
        const tableRow = document.createElement("tr");
        const tableData = document.createElement("td");
        tableData.textContent = element;
        tableRow.appendChild(tableData);
        tbody.appendChild(tableRow);
    });
}

function mostrarMatrizEnTabla(matriz, tbody, encabezadosQ, encabezadosF) {
    if (tbody.querySelector("th") === null) {
        const headerRow = document.createElement("tr");
        headerRow.innerHTML = "<th>Estado</th>";

        encabezadosF.forEach((element) => {
            const tableHeader = document.createElement("th");
            tableHeader.textContent = element;
            headerRow.appendChild(tableHeader);
        });

        tbody.appendChild(headerRow);
    }

    const filaIndiceMap = {};
    encabezadosQ.forEach((estado, indice) => {
        filaIndiceMap[estado.trim()] = indice;
    });

    const tablaFormato = [];
    encabezadosQ.forEach(() => {
        const fila = [];
        encabezadosF.forEach(() => {
            fila.push(""); 
        });
        tablaFormato.push(fila);
    });

    matriz.forEach((filaW) => {
        const estadoOrigen = filaW[0].trim();
        const simbolo = filaW[1].trim();
        const estadoDestino = filaW[2].trim();

        const indiceFila = filaIndiceMap[estadoOrigen];
        const indiceColumna = encabezadosF.indexOf(simbolo);

        tablaFormato[indiceFila][indiceColumna] = estadoDestino;
    });

    encabezadosQ.forEach((estado, indice) => {
        const tableRow = document.createElement("tr");
        const tableDataEstado = document.createElement("td");
        tableDataEstado.textContent = estado;
        tableRow.appendChild(tableDataEstado);

        tablaFormato[indice].forEach((elemento) => {
            const tableData = document.createElement("td");
            tableData.textContent = elemento;
            tableRow.appendChild(tableData);
        });

        tbody.appendChild(tableRow);
    });
}

ocultarElemento(contentCard);