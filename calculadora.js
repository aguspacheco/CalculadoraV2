const multiplicador = 2.5;

const modulos = [
  { rango: [0, 5], valor: 750 },
  { rango: [6, 20], valor: 625 },
  { rango: [21, 50], valor: 550 },
  { rango: [51, Infinity], valor: 500 },
];

const valor_modulo_ddjj = 200 * multiplicador;
const porc_preferencial = 500;

const valor_modulo_ufuncional = 500 * multiplicador;

const formulario = document.getElementById("formulario");
const resultados = document.getElementById("resultados");
const container_resultados = document.getElementById("container-resultados");

/**
 * Retorna el valor modular correspondiente a la cantidad de parcelas recibidas
 * @param {Number} parcelas - La cantidad de parcelas a considerar
 * @returns {Number} - El valor modular correspondiente a la cantidad de parcelas recibidas
 */
function parcelasValorModular(parcelas) {
  const moduloEncontrado = modulos.find((modulo) => {
    const [min, max] = modulo.rango;
    return parcelas >= min && parcelas <= max;
  });
  return moduloEncontrado.valor * multiplicador;
}

/**
 * Formatea un monto en una cadena con el formato de moneda argentina
 * @param {Number} monto - El monto a formatear
 * @returns {String} - El monto formateado como cadena con el formato de moneda argentina
 */
function formatoMoneda(monto) {
  return (
    "$ " +
    monto.toLocaleString("es-AR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

/**
 * Obtiene los valores de entrada ingresados por el usuario en el formulario
 * @returns {Object} - Un objeto con los valores de entrada ingresados por el usuario en el formulario
 */
function obtenerValoresEntrada() {
  const origen = parseInt(document.getElementById("origen").value) || 0;
  const resultante = parseInt(document.getElementById("resultante").value) || 0;
  const ddjj = parseInt(document.getElementById("ddjj").value) || 0;
  const funcional = parseInt(document.getElementById("ufuncional").value) || 0;
  const preferencial = document.getElementById("preferencial").checked;
  const parcelas = origen + resultante;

  return { origen, resultante, ddjj, funcional, preferencial, parcelas };
}

/**
 * Calcula el total a pagar en base a los valores de entrada ingresados por el usuario
 * @param {Object} valoresEntrada - Un objeto con los valores de entrada ingresados por el usuario
 * @returns {Number} - El total a pagar en base a los valores de entrada ingresados por el usuario
 */
function calcularTotal({ parcelas, ddjj, preferencial, funcional }) {
  let total = ddjj * valor_modulo_ddjj + funcional * valor_modulo_ufuncional;
  if (parcelas != 0) total += parcelasValorModular(parcelas) * parcelas;
  if (preferencial) total *= 1 + porc_preferencial / 100;

  return total;
}

function totalPreferencial(parcelas, ddjj, funcional) {
  let total = ddjj * valor_modulo_ddjj + funcional * valor_modulo_ufuncional;
  if (parcelas != 0) total += parcelasValorModular(parcelas) * parcelas;
  return (total * porc_preferencial) / 100;
}

/**
 * Visualiza el total a pagar en la página
 * @param {Number} total - El total a pagar
 */
function visualizarTotal(total) {
  const contenedor = document.getElementById("resultado");
  contenedor.innerHTML = "";
  contenedor.innerText = formatoMoneda(total);
}

/**
 * Agrega una fila a la tabla de resultados con la información de una etiqueta, cantidad, valor modular y valor total.
 * @param {string} etiqueta - La etiqueta de la fila.
 * @param {number} cantidad - La cantidad ingresada en el formulario.
 * @param {number} valorModular - El valor modular de cada elemento de la fila.
 */
function agregarFila(etiqueta, cantidad, valorModular) {
  const fila = document.createElement("tr");
  fila.innerHTML = `
    <th class="texto-izquierda">${etiqueta}</th>
    <td>${cantidad}</td>
    <td>${formatoMoneda(valorModular)}</td>
    <td>${formatoMoneda(valorModular * cantidad)}</td>
  `;
  resultados.appendChild(fila);
}

function agregarFilaPreferencial(preferencial, monto) {
  const fila = document.createElement("tr");
  fila.innerHTML = `
    <th class="texto-izquierda">Preferencial</th>
    <td>${preferencial ? "SI" : "NO"}</td>
    <td>${preferencial ? porc_preferencial : 0}%</td>
    <td>${formatoMoneda(monto)}</td>
  `;
  resultados.appendChild(fila);
}

/**
 * Crea una tabla con los resultados de cada elemento con su cantidad y valor modular,
 * y la agrega a la sección de resultados del HTML.
 *
 * @param {object} valoresEntrada - Objeto con los valores de entrada del formulario.
 */
function crearTablaResultados(valoresEntrada) {
  const { origen, resultante, ddjj, funcional, preferencial, parcelas } =
    valoresEntrada;
  const valor_modulo_parcelas = parcelasValorModular(parcelas);

  agregarFila("Parcelas Origen", origen, valor_modulo_parcelas);
  agregarFila("Parcelas Resultante", resultante, valor_modulo_parcelas);
  agregarFila("Unidad Funcional", funcional, valor_modulo_ufuncional);
  agregarFila("Declaracion Jurada", ddjj, valor_modulo_ddjj);

  const montoPreferencial = preferencial
    ? totalPreferencial(parcelas, ddjj, funcional)
    : 0;

  agregarFilaPreferencial(preferencial, montoPreferencial);
}

function mostrarTotal() {
  const valoresEntrada = obtenerValoresEntrada();
  const total = calcularTotal(valoresEntrada);
  crearTablaResultados(valoresEntrada);
  visualizarTotal(total);
}

const calcularBtn = document.getElementById("calcular-btn");
calcularBtn.addEventListener("click", () => {
  formulario.style.display = "none";
  container_resultados.style.display = "block";
  mostrarTotal();
});

const limpiarBtn = document.getElementById("limpiar-btn");
limpiarBtn.addEventListener("click", () => {
  const elementos = ["origen", "resultante", "ddjj", "ufuncional"];

  elementos.forEach((elemento) => {
    document.getElementById(elemento).value = "";
  });

  document.getElementById("preferencial").checked = false;
});

const recalcularBtn = document.getElementById("recalcular-btn");
recalcularBtn.addEventListener("click", () => {
  resultados.innerHTML = "";
  container_resultados.style.display = "none";
  formulario.style.display = "block";
});
