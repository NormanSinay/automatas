// script.js
// Función para procesar el contenido del archivo
function procesarContenido(contenido) {
    const lineas = contenido.split('\n');
    const vectorRectangular = {
        Q: [],
        F: [],
        i: null,
        A: [],
        W: []
    };

    lineas.forEach((linea) => {
        if (linea.includes('Q=')) {
            const contenidoQ = linea.match(/\{(.*?)\}/);
            if (contenidoQ) {
                vectorRectangular.Q = contenidoQ[1].split(',').map((element) => element.trim());
            }
        } else if (linea.includes('F=')) {
            const contenidoF = linea.match(/\{(.*?)\}/);
            if (contenidoF) {
                vectorRectangular.F = contenidoF[1].split(',').map((element) => element.trim());
            }
        } else if (linea.includes('i=')) {
            const contenidoI = linea.match(/i=([A-Za-z]+)/);
            if (contenidoI) {
                vectorRectangular.i = contenidoI[1];
            }
        } else if (linea.includes('A=')) {
            const contenidoA = linea.match(/\{(.*?)\}/);
            if (contenidoA) {
                vectorRectangular.A = contenidoA[1].split(',').map((element) => element.trim());
            }
        } else if (linea.includes('W=')) {
            const contenidoW = linea.match(/\{(.*?)\}/);
            if (contenidoW) {
                vectorRectangular.W = contenidoW[1].split(',').map((element) => element.trim());
            }
        }
    });

    return vectorRectangular;
}

// Event listener para el input de archivo y el área de arrastrar y soltar
const fileInput = document.getElementById("input-file-now");
const contentDisplay = document.getElementById("content-display");
const qTableBody = document.getElementById("q-table-body");
const fTableBody = document.getElementById("f-table-body");
const iTableBody = document.getElementById("i-table-body");
const aTableBody = document.getElementById("a-table-body");
const wTableBody = document.getElementById("w-table-body");
const container = document.getElementById("container");

// Evitar que el navegador abra el archivo en una ventana al arrastrar
container.addEventListener("dragover", (e) => {
    e.preventDefault();
});

// Cambiar el evento change para que también se active al soltar un archivo en el área de arrastrar y soltar
container.addEventListener("drop", (e) => {
    e.preventDefault();
    fileInput.files = e.dataTransfer.files;
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const contenido = event.target.result;
            contentDisplay.textContent = contenido;
            const vectorRectangular = procesarContenido(contenido);

            // Mostrar los vectores en las tablas
            mostrarVectorEnTabla(vectorRectangular.Q, qTableBody);
            mostrarVectorEnTabla(vectorRectangular.F, fTableBody);
            mostrarVectorEnTabla([vectorRectangular.i], iTableBody); // El estado inicial es un solo valor
            mostrarVectorEnTabla(vectorRectangular.A, aTableBody);
            mostrarMatrizEnTabla(vectorRectangular.W, wTableBody);
        };
        reader.readAsText(file);
    }
});

// Función para mostrar un vector en una tabla vertical
function mostrarVectorEnTabla(vector, tbody) {
    tbody.innerHTML = ""; // Limpiar el tbody
    vector.forEach((element) => {
        const tableRow = document.createElement("tr");
        const tableData = document.createElement("td");
        tableData.textContent = element;
        tableRow.appendChild(tableData);
        tbody.appendChild(tableRow);
    });
}

// Función para mostrar la matriz en una tabla
function mostrarMatrizEnTabla(matriz, tbody) {
    tbody.innerHTML = ""; // Limpiar el tbody
    let tableRow = document.createElement("tr");
    for (let i = 0; i < matriz.length; i++) {
        const elemento = matriz[i].replace(/[()]/g, ''); // Eliminar paréntesis
        const tableData = document.createElement("td");
        tableData.textContent = elemento;
        tableRow.appendChild(tableData);
        if ((i + 1) % 3 === 0 || i === matriz.length - 1) {
            tbody.appendChild(tableRow);
            tableRow = document.createElement("tr");
        }
    }
}
