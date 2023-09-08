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
                    vectorRectangular.W = contenidoW[1].split(',').map((element) => element.trim());
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

    return vectorRectangular;
}

const fileInput = document.getElementById("input-file-now");
const contentDisplay = document.getElementById("content-display");
const qTableBody = document.getElementById("q-table-body");
const fTableBody = document.getElementById("f-table-body");
const iTableBody = document.getElementById("i-table-body");
const aTableBody = document.getElementById("a-table-body");
const wTableBody = document.getElementById("w-table-body");
const container = document.getElementById("container");
const errorMessage = document.getElementById("error-message");

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

function validarYProcesarArchivo() {
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const contenido = event.target.result;
            const vectorRectangular = procesarContenido(contenido);

            if (!vectorRectangular) {
                errorMessage.style.display = "block";
                contentDisplay.textContent = "";
                qTableBody.innerHTML = "";
                fTableBody.innerHTML = "";
                iTableBody.innerHTML = "";
                aTableBody.innerHTML = "";
                wTableBody.innerHTML = "";
                return;
            }

            errorMessage.style.display = "none";
            contentDisplay.textContent = contenido;

            mostrarVectorEnTabla(vectorRectangular.Q, qTableBody);
            mostrarVectorEnTabla(vectorRectangular.F, fTableBody);
            mostrarVectorEnTabla([vectorRectangular.i], iTableBody);
            mostrarVectorEnTabla(vectorRectangular.A, aTableBody);
            mostrarMatrizEnTabla(vectorRectangular.W, wTableBody);
        };
        reader.readAsText(file);
    }
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

function mostrarMatrizEnTabla(matriz, tbody) {
    tbody.innerHTML = "";
    let tableRow = document.createElement("tr");
    for (let i = 0; i < matriz.length; i++) {
        const elemento = matriz[i].replace(/[()]/g, '');
        const tableData = document.createElement("td");
        tableData.textContent = elemento;
        tableRow.appendChild(tableData);
        if ((i + 1) % 3 === 0 || i === matriz.length - 1) {
            tbody.appendChild(tableRow);
            tableRow = document.createElement("tr");
        }
    }
}
