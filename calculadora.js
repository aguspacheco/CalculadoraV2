const multiplicador = 2.5;
const porc_preferencial = 500;

/*Modulos Mensura */
const modulos = [
  { rango: [0, 5], valor: 750 },
  { rango: [6, 20], valor: 625 },
  { rango: [21, 50], valor: 550 },
  { rango: [51, Infinity], valor: 500 },
];

/* Defino constantes de modulos */
const valor_modulo_ddjj = 200 * multiplicador;
const valor_modulo_ufuncional = 500 * multiplicador;
const valor_modulo_cementerio = 100 * multiplicador;
const valor_modulo_parcelario = 1500 * multiplicador;
const valor_modulo_estudio = 700 * multiplicador;
const valor_modulo_vir = 700 * multiplicador;
const valor_modulo_valor_fiscal = 600 * multiplicador;
const valor_modulo_valuacion_fiscal = 500 * multiplicador;
const valor_modulo_ganadera = 500 * multiplicador;

/*Defino constantes de mensura */
const formularioMensura = document.getElementById("formularioMensura");
const resultadosMensura = document.getElementById("resultadosMensura");
const tablaResultadosMensura = document.getElementById("tablaMensura");

const formularioValuaciones = document.getElementById("formularioValuaciones");
const resultadosValuaciones = document.getElementById("resultadosValuaciones");
const tablaValuaciones = document.getElementById("tablaValuaciones");

/*Funciones Globales */

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
 * Visualiza el total a pagar en la página
 * @param {Number} total - El total a pagar
 * @param {Number} abonar - Contenedor del total
 */
function visualizarTotal(total, abonar) {
  const contenedor = document.getElementById(abonar);
  contenedor.innerText = formatoMoneda(total);
}

/**
 * Agrega una fila a la tabla de resultados con la información de una etiqueta, cantidad, valor modular y valor total.
 * @param {string} etiqueta - La etiqueta de la fila.
 * @param {number} cantidad - La cantidad ingresada en el formulario.
 * @param {number} valorModular - El valor modular de cada elemento de la fila.
 */
function agregarFila(etiqueta, cantidad, valorModular, tabla) {
  const fila = document.createElement("tr");
  fila.innerHTML = `
    <th class="texto-izquierda">${etiqueta}</th>
    <td>${cantidad}</td>
    <td>${formatoMoneda(valorModular)}</td>
    <td>${formatoMoneda(valorModular * cantidad)}</td>
  `;
  tabla.appendChild(fila);
}

function agregarFilaPreferencial(preferencial, monto, tabla) {
  const fila = document.createElement("tr");
  fila.innerHTML = `
    <th class="texto-izquierda">Preferencial</th>
    <td>${preferencial ? "SI" : "NO"}</td>
    <td>${preferencial ? porc_preferencial : 0}%</td>
    <td>${formatoMoneda(monto)}</td>
  `;
  tabla.appendChild(fila);
}

/* Seccion Mensura */

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
 * Obtiene los valores de entrada ingresados por el usuario en el formulario
 * @returns {Object} - Un objeto con los valores de entrada ingresados por el usuario en el formulario
 */
function obtenerValoresEntrada() {
  const origen = parseInt(document.getElementById("origen").value) || 0;
  const resultante = parseInt(document.getElementById("resultante").value) || 0;
  const ddjj = parseInt(document.getElementById("ddjj").value) || 0;
  const estudio = parseInt(document.getElementById("estudio").value) || 0;
  const funcional = parseInt(document.getElementById("ufuncional").value) || 0;
  const cementerio = parseInt(document.getElementById("cementerio").value) || 0;
  const parcelario =
    parseInt(document.getElementById("estadoParcelario").value) || 0;
  const preferencial = document.getElementById("preferencialMensura").checked;
  const parcelas = origen + resultante;
  return {
    origen,
    resultante,
    ddjj,
    estudio,
    funcional,
    cementerio,
    parcelario,
    preferencial,
    parcelas,
  };
}

/**
 * Calcula el total a pagar en base a los valores de entrada ingresados por el usuario
 * @param {Object} valoresEntrada - Un objeto con los valores de entrada ingresados por el usuario
 * @returns {Number} - El total a pagar en base a los valores de entrada ingresados por el usuario
 */
function calcularTotal({
  parcelas,
  ddjj,
  preferencial,
  funcional,
  cementerio,
  estudio,
  parcelario,
}) {
  let total =
    ddjj * valor_modulo_ddjj +
    funcional * valor_modulo_ufuncional +
    cementerio * valor_modulo_cementerio +
    parcelario * valor_modulo_parcelario +
    estudio * valor_modulo_estudio;
  console.log(parcelario);
  total +=
    cementerio *
    valor_modulo_cementerio *
    parcelas *
    funcional *
    valor_modulo_ufuncional;
  if (parcelas != 0) total += parcelasValorModular(parcelas) * parcelas;
  if (preferencial) total *= 1 + porc_preferencial / 100;
  console.log(total);
  return total;
}

function totalPreferencial(
  parcelas,
  ddjj,
  funcional,
  cementerio,
  estudio,
  parcelario
) {
  let total =
    ddjj * valor_modulo_ddjj +
    funcional * valor_modulo_ufuncional +
    cementerio * valor_modulo_cementerio +
    parcelario * valor_modulo_parcelario +
    estudio * valor_modulo_estudio;
  if (parcelas != 0) total += parcelasValorModular(parcelas) * parcelas;
  return (total * porc_preferencial) / 100;
}

/**
 * Crea una tabla con los resultados de cada elemento con su cantidad y valor modular,
 * y la agrega a la sección de resultados del HTML.
 *
 * @param {object} valoresEntrada - Objeto con los valores de entrada del formulario.
 */
function crearTablaResultados(valoresEntrada) {
  const {
    origen,
    resultante,
    ddjj,
    funcional,
    cementerio,
    parcelario,
    estudio,
    preferencial,
    parcelas,
  } = valoresEntrada;
  const valor_modulo_parcelas = parcelasValorModular(parcelas);

  agregarFila(
    "Parcelas Origen",
    origen,
    valor_modulo_parcelas,
    resultadosMensura
  );
  agregarFila(
    "Parcelas Resultante",
    resultante,
    valor_modulo_parcelas,
    resultadosMensura
  );
  agregarFila(
    "Unidad Funcional",
    funcional,
    valor_modulo_ufuncional,
    resultadosMensura
  );
  agregarFila(
    "Cementerio",
    cementerio,
    valor_modulo_cementerio,
    resultadosMensura
  );
  agregarFila(
    "Estudio de Titulo y Antecedente Dominal",
    estudio,
    valor_modulo_estudio,
    resultadosMensura
  );
  agregarFila(
    "Verificación Estado parcelario",
    parcelario,
    valor_modulo_parcelario,
    resultadosMensura
  );
  agregarFila("Declaracion Jurada", ddjj, valor_modulo_ddjj, resultadosMensura);

  const montoPreferencial = preferencial
    ? totalPreferencial(
        parcelas,
        ddjj,
        funcional,
        cementerio,
        parcelario,
        estudio
      )
    : 0;

  agregarFilaPreferencial(preferencial, montoPreferencial, resultadosMensura);
}

function mostrarTotalMensura() {
  const valoresEntrada = obtenerValoresEntrada();
  const total = calcularTotal(valoresEntrada);
  crearTablaResultados(valoresEntrada);
  visualizarTotal(total, "abonarMensura");
}

/* Botón de calcular */

const calcularBtnMensura = document.getElementById("calcular-btnMensura");
calcularBtnMensura.addEventListener("click", () => {
  formularioMensura.style.display = "none";
  borrarBtnMensura.style.display = "none";
  recalcularBtnMensura.style.display = "none";
  tablaMensura.style.display = "block";
  recalcularBtnMensura.style.display = "inline-block";
  mostrarTotalMensura();
});

/*Botón de borrar */

const borrarBtnMensura = document.getElementById("borrar-btnMensura");
borrarBtnMensura.addEventListener("click", () => {
  const elementos = [
    "origen",
    "resultante",
    "ddjj",
    "ufuncional",
    "cementerio",
    "estadoParcelario",
    "estudio",
    "preferencialMensura",
  ];

  elementos.forEach((elemento) => {
    document.getElementById(elemento).value = "";
  });

  document.getElementById("preferencialMensura").checked = false;
});

const recalcularBtnMensura = document.getElementById("recalcular-btnMensura");
recalcularBtnMensura.addEventListener("click", () => {
  resultadosMensura.innerHTML = "";
  tablaResultadosMensura.style.display = "none";
  recalcularBtnMensura.style.display = "none";
  formularioMensura.style.display = "flex";
  borrarBtnMensura.style.display = "inline-block";
  recalcularBtnMensura.style.display = "inline-block";
});

/* Sección de Valuaciones */

function obtenerValoresEntradaValuaciones() {
  const ddjj =
    parseInt(document.getElementById("declaracionesJuradas").value) || 0;
  const valorFiscal =
    parseInt(document.getElementById("valoresFiscales").value) || 0;
  const valuacionFiscal =
    parseInt(document.getElementById("pedidoValoresFiscales").value) || 0;
  const ganadera = parseInt(document.getElementById("ganadera").value) || 0;
  const vir = parseInt(document.getElementById("vir").value) || 0;
  const preferencial = document.getElementById(
    "preferencialValuaciones"
  ).checked;

  return { ddjj, valorFiscal, valuacionFiscal, ganadera, vir, preferencial };
}

function calcularValuaciones(valoresEntrada) {
  const { ddjj, valorFiscal, valuacionFiscal, ganadera, vir, preferencial } =
    valoresEntrada;
  let total =
    valor_modulo_ddjj * ddjj +
    valor_modulo_valor_fiscal * valorFiscal +
    valor_modulo_valuacion_fiscal * valuacionFiscal +
    valor_modulo_ganadera * ganadera +
    valor_modulo_vir * vir;

  if (preferencial) total *= 1 + porc_preferencial / 100;

  return total;
}

function preferencialValuaciones(
  ddjj,
  valorFiscal,
  valuacionFiscal,
  ganadera,
  vir
) {
  let total =
    ddjj * valor_modulo_ddjj +
    valorFiscal * valor_modulo_valor_fiscal +
    valuacionFiscal * valor_modulo_valuacion_fiscal +
    ganadera * valor_modulo_ganadera +
    vir * valor_modulo_vir;

  return (total * porc_preferencial) / 100;
}

function crearTablaResultadosValuaciones(valoresEntrada) {
  const { ddjj, valorFiscal, valuacionFiscal, ganadera, vir, preferencial } =
    valoresEntrada;

  agregarFila(
    "Declaraciones Juradas",
    ddjj,
    valor_modulo_ddjj,
    resultadosValuaciones
  );
  agregarFila(
    "Valores Fiscales",
    valorFiscal,
    valor_modulo_valor_fiscal,
    resultadosValuaciones
  );
  agregarFila(
    "Reconsideración",
    valuacionFiscal,
    valor_modulo_valuacion_fiscal,
    resultadosValuaciones
  );
  agregarFila(
    "Receptividad Ganadera",
    ganadera,
    valor_modulo_ganadera,
    resultadosValuaciones
  );
  agregarFila(
    "Reconsideración de Vir",
    vir,
    valor_modulo_vir,
    resultadosValuaciones
  );

  const montoPreferencial = preferencial
    ? preferencialValuaciones(ddjj, valorFiscal, valuacionFiscal, ganadera, vir)
    : 0;

  agregarFilaPreferencial(
    preferencial,
    montoPreferencial,
    resultadosValuaciones
  );
}

function mostrarTotalValuaciones() {
  const valoresEntrada = obtenerValoresEntradaValuaciones();
  const total = calcularValuaciones(valoresEntrada);
  crearTablaResultadosValuaciones(valoresEntrada);
  visualizarTotal(total, "abonarValuaciones");
}

/*Botón cálcular valuaciones */
const calcularBtnValuaciones = document.getElementById(
  "calcularBtn-valuaciones"
);
calcularBtnValuaciones.addEventListener("click", () => {
  formularioValuaciones.style.display = "none";
  calcularBtnValuaciones.style.display = "none";
  borrarBtnValuaciones.style.display = "none";
  tablaValuaciones.style.display = "block";
  recalcularBtnValuaciones.style.display = "block";
  mostrarTotalValuaciones();
});

const borrarBtnValuaciones = document.getElementById("borrarBtn-valuaciones");
borrarBtnValuaciones.addEventListener("click", () => {
  const elementos = [
    "declaracionesJuradas",
    "valoresFiscales",
    "pedidoValoresFiscales",
    "ganadera",
    "vir",
  ];

  elementos.forEach((elemento) => {
    document.getElementById(elemento).value = "";
  });

  document.getElementById("preferencialValuaciones").checked = false;
});

const recalcularBtnValuaciones = document.getElementById(
  "recalcularBtn-valuaciones"
);
recalcularBtnValuaciones.addEventListener("click", () => {
  resultadosValuaciones.innerHTML = "";
  tablaValuaciones.style.display = "none";
  recalcularBtnValuaciones.style.display = "none";
  formularioValuaciones.style.display = "block";
  calcularBtnValuaciones.style.display = "inline-block";
  borrarBtnValuaciones.style.display = "inline-block";
});
