// ============================================================
//  UTILIDADES DE UI
// ============================================================

/**
 * Muestra u oculta un elemento con el atributo `hidden`.
 */
function mostrar(id)   { document.getElementById(id).hidden = false; }
function ocultar(id)   { document.getElementById(id).hidden = true;  }

/**
 * Muestra un mensaje de error en el contenedor indicado.
 */
function mostrarError(errorId, mensaje) {
  const el = document.getElementById(errorId);
  el.textContent = mensaje;
  el.hidden = false;
}

/**
 * Limpia error y resultado anteriores antes de un nuevo cálculo.
 */
function limpiarResultados(resultId, errorId) {
  ocultar(resultId);
  ocultar(errorId);
  document.getElementById(errorId).textContent = '';
}


// ============================================================
//  EJERCICIO 1 — TRANSFERENCIA DE CALOR
//  Fórmula: T = Ts + (T0 - Ts) * e^(-k * t)
// ============================================================

function calcularCalor() {
  limpiarResultados('result-heat', 'error-heat');

  // 1. Captura de valores desde el DOM
  const T0 = parseFloat(document.getElementById('T0').value);
  const Ts = parseFloat(document.getElementById('Ts').value);
  const k  = parseFloat(document.getElementById('k').value);
  const t  = parseFloat(document.getElementById('t').value);

  // 2. Validaciones
  if (isNaN(T0) || isNaN(Ts) || isNaN(k) || isNaN(t)) {
    mostrarError('error-heat', '⚠ Por favor, completa todos los campos con valores numéricos.');
    return;
  }
  if (k <= 0) {
    mostrarError('error-heat', '⚠ La constante k debe ser un valor positivo.');
    return;
  }
  if (t < 0) {
    mostrarError('error-heat', '⚠ El tiempo no puede ser negativo.');
    return;
  }

  // 3. Cálculo principal
  //    e^(-k * t) se calcula con Math.exp()
  const temperaturaFinal = Ts + (T0 - Ts) * Math.exp(-k * t);

  // 4. Redondeo al entero más cercano con Math.round()
  const resultado = Math.round(temperaturaFinal);

  // 5. Mostrar resultado en el DOM
  document.getElementById('heat-value').textContent = resultado + ' °C';
  mostrar('result-heat');
}


// ============================================================
//  EJERCICIO 2 — COMBINACIONES (SORTEO)
//  Fórmula: C(n, r) = n! / (r! * (n - r)!)
//  Total   = C(n1, r1) * C(n2, r2)
// ============================================================

/**
 * Calcula el factorial de un número entero no negativo.
 * Se implementa de forma ITERATIVA (sin librerías externas).
 * Devuelve un BigInt para manejar números muy grandes sin perder precisión.
 *
 * @param {number} n  Entero no negativo
 * @returns {BigInt}
 */
function factorial(n) {
  if (n < 0) throw new Error('El factorial no está definido para números negativos.');
  let resultado = 1n;           // BigInt para precisión exacta
  for (let i = 2n; i <= BigInt(n); i++) {
    resultado *= i;
  }
  return resultado;
}

/**
 * Calcula la combinación C(n, r) = n! / (r! * (n-r)!)
 * usando BigInt para evitar desbordamiento.
 *
 * @param {number} n  Total de elementos
 * @param {number} r  Elementos a elegir
 * @returns {BigInt}
 */
function combinacion(n, r) {
  if (r > n) throw new Error(`r (${r}) no puede ser mayor que n (${n}).`);
  return factorial(n) / (factorial(r) * factorial(n - r));
}

/**
 * Formatea un BigInt con separadores de miles para mejor legibilidad.
 * Ejemplo: 5006386600n → "5,006,386,600"
 */
function formatearBigInt(bigIntValue) {
  return bigIntValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function calcularCombinaciones() {
  limpiarResultados('result-combo', 'error-combo');

  // 1. Captura de valores desde el DOM
  const n1 = parseInt(document.getElementById('n1').value, 10);
  const r1 = parseInt(document.getElementById('r1').value, 10);
  const n2 = parseInt(document.getElementById('n2').value, 10);
  const r2 = parseInt(document.getElementById('r2').value, 10);

  // 2. Validaciones
  if (isNaN(n1) || isNaN(r1) || isNaN(n2) || isNaN(r2)) {
    mostrarError('error-combo', '⚠ Por favor, completa todos los campos con valores numéricos.');
    return;
  }
  if (n1 < 0 || r1 < 0 || n2 < 0 || r2 < 0) {
    mostrarError('error-combo', '⚠ Los valores de n y r no pueden ser negativos.');
    return;
  }
  if (r1 > n1) {
    mostrarError('error-combo', `⚠ En el Grupo 1, r₁ (${r1}) no puede ser mayor que n₁ (${n1}).`);
    return;
  }
  if (r2 > n2) {
    mostrarError('error-combo', `⚠ En el Grupo 2, r₂ (${r2}) no puede ser mayor que n₂ (${n2}).`);
    return;
  }

  try {
    // 3. Cálculo de cada grupo
    const c1 = combinacion(n1, r1);
    const c2 = combinacion(n2, r2);

    // 4. Total = C1 × C2
    const total = c1 * c2;

    // 5. Mostrar resultado
    document.getElementById('combo-value').textContent = formatearBigInt(total);
    document.getElementById('combo-detail').innerHTML =
      `C(${n1}, ${r1}) = ${formatearBigInt(c1)}<br>` +
      `C(${n2}, ${r2}) = ${formatearBigInt(c2)}<br>` +
      `Total = ${formatearBigInt(c1)} × ${formatearBigInt(c2)}`;

    mostrar('result-combo');

  } catch (err) {
    mostrarError('error-combo', '⚠ ' + err.message);
  }
}
