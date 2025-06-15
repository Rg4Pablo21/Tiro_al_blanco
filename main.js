// Variables del juego
let nivel = 1;
let puntos = 0;
let tiempo = 0;
let objetivos = 0;
let combo = 0;
let maxCombo = 0;
let blancos = [];
let intervalo = null;
let reloj = null;
let activo = false;
let ultimoGolpeTiempo = 0; // Variable para controlar el combo

const niveles = [
  { objetivos: 8, tiempo: 45, tamaño: 80, velocidad: 0, puntosPorObjetivo: 10 },
  { objetivos: 10, tiempo: 40, tamaño: 70, velocidad: 0.5, puntosPorObjetivo: 12 },
  { objetivos: 12, tiempo: 35, tamaño: 65, velocidad: 0.8, puntosPorObjetivo: 15 },
  { objetivos: 14, tiempo: 35, tamaño: 60, velocidad: 1.0, puntosPorObjetivo: 18 },
  { objetivos: 16, tiempo: 30, tamaño: 55, velocidad: 1.3, puntosPorObjetivo: 20 },
  { objetivos: 18, tiempo: 30, tamaño: 50, velocidad: 1.6, puntosPorObjetivo: 22 },
  { objetivos: 20, tiempo: 25, tamaño: 45, velocidad: 1.9, puntosPorObjetivo: 25 },
  { objetivos: 22, tiempo: 25, tamaño: 40, velocidad: 2.2, puntosPorObjetivo: 28 },
  { objetivos: 25, tiempo: 20, tamaño: 35, velocidad: 2.5, puntosPorObjetivo: 30 },
  { objetivos: 30, tiempo: 20, tamaño: 30, velocidad: 3.0, puntosPorObjetivo: 35 }
];

// Elementos del DOM
const zona = document.querySelector(".zona-juego");
const tdNivel = document.querySelector(".nivel");
const tdPuntos = document.querySelector(".puntos");
const tdTiempo = document.querySelector(".tiempo");
const tdObjetivos = document.querySelector(".objetivos");
const pantallaInicio = document.querySelector(".inicio");
const pantallaFinNivel = document.querySelector(".fin-nivel");
const pantallaFin = document.querySelector(".fin-juego");

// Función para iniciar el juego principal
function iniciarJuegoPrincipal() {
  nivel = 1;
  puntos = 0;
  combo = 0;
  maxCombo = 0;
  ultimoGolpeTiempo = 0;
  
  pantallaFinNivel.style.display = "none";
  pantallaFin.style.display = "none";
  
  mostrarPantallaInicio();
}

// Mostrar pantalla de inicio de nivel
function mostrarPantallaInicio() {
  const cfg = niveles[nivel - 1];
  
  pantallaInicio.innerHTML = `
    <h1>Nivel ${nivel}</h1>
    <p>Objetivos: ${cfg.objetivos}</p>
    <p>Tiempo: ${cfg.tiempo}s</p>
    <p>Tamaño: ${cfg.tamaño}px</p>
    <p>Velocidad: ${cfg.velocidad.toFixed(1)}</p>
    <p>Puntos por blanco: ${cfg.puntosPorObjetivo}</p>
    <button class="btn-jugar">Comenzar</button>
  `;
  
  pantallaInicio.style.display = "flex";
  
  pantallaInicio.querySelector(".btn-jugar").onclick = iniciarNivel;
}

// Iniciar un nivel
function iniciarNivel() {
  activo = true;
  const cfg = niveles[nivel - 1];
  
  objetivos = cfg.objetivos;
  tiempo = cfg.tiempo;
  
  actualizarUI();
  pantallaInicio.style.display = "none";
  pantallaFinNivel.style.display = "none";
  pantallaFin.style.display = "none";
  
  limpiarBlancos();
  crearBlancos(cfg);
  
  // Iniciar el temporizador
  if (reloj) clearInterval(reloj);
  reloj = setInterval(actualizarTiempo, 1000);
}

// Crear los blancos en la zona de juego
function crearBlancos(cfg) {
  blancos = [];
  const { objetivos, tamaño, velocidad } = cfg;
  const zonaAncho = zona.clientWidth;
  const zonaAlto = zona.clientHeight;
  
  // Espacio mínimo entre blancos
  const espacioMinimo = tamaño * 1.5;
  
  for (let i = 0; i < objetivos; i++) {
    const blanco = document.createElement("div");
    blanco.className = "blanco";
    blanco.style.width = `${tamaño}px`;
    blanco.style.height = `${tamaño}px`;
    
    // Posicionamiento con verificación de colisión
    let x, y, colision;
    let intentos = 0;
    const maxIntentos = 100;
    
    do {
      colision = false;
      x = Math.random() * (zonaAncho - tamaño);
      y = Math.random() * (zonaAlto - tamaño);
      
      // Verificar colisión con otros blancos
      for (const otro of blancos) {
        const distancia = Math.sqrt(Math.pow(x - otro.x, 2) + Math.pow(y - otro.y, 2));
        if (distancia < espacioMinimo) {
          colision = true;
          break;
        }
      }
      
      intentos++;
    } while (colision && intentos < maxIntentos);
    
    blanco.style.left = `${x}px`;
    blanco.style.top = `${y}px`;
    
    let dx = velocidad ? (Math.random() - 0.5) * velocidad * 2 : 0;
    let dy = velocidad ? (Math.random() - 0.5) * velocidad * 2 : 0;
    
    blancos.push({
      elemento: blanco,
      x: x,
      y: y,
      dx: dx,
      dy: dy,
      tamaño: tamaño
    });
    
    blanco.onclick = () => {
      if (activo) golpear(blanco);
    };
    
    zona.appendChild(blanco);
  }
  
  // Iniciar movimiento si hay velocidad
  if (intervalo) clearInterval(intervalo);
  if (velocidad) {
    intervalo = setInterval(moverBlancos, 16);
  }
}

// Mover los blancos
function moverBlancos() {
  const zonaAncho = zona.clientWidth;
  const zonaAlto = zona.clientHeight;
  
  blancos.forEach(blanco => {
    // Actualizar posición
    blanco.x += blanco.dx;
    blanco.y += blanco.dy;
    
    // Rebotar en los bordes
    if (blanco.x < 0 || blanco.x > zonaAncho - blanco.tamaño) {
      blanco.dx = -blanco.dx;
      blanco.x = Math.max(0, Math.min(blanco.x, zonaAncho - blanco.tamaño));
    }
    
    if (blanco.y < 0 || blanco.y > zonaAlto - blanco.tamaño) {
      blanco.dy = -blanco.dy;
      blanco.y = Math.max(0, Math.min(blanco.y, zonaAlto - blanco.tamaño));
    }
    
    // Aplicar posición al elemento
    blanco.elemento.style.left = `${blanco.x}px`;
    blanco.elemento.style.top = `${blanco.y}px`;
  });
}

// Golpear un blanco (FUNCIÓN CRÍTICA CORREGIDA)
function golpear(blancoDom) {
  if (!activo) return;
  
  // Efecto visual
  blancoDom.classList.add("hit-effect");
  
  // Eliminar el blanco después de la animación
  setTimeout(() => {
    if (blancoDom.parentNode) {
      blancoDom.remove();
    }
  }, 300);
  
  // Actualizar estado del juego
  blancos = blancos.filter(b => b.elemento !== blancoDom);
  
  // Calcular combo
  const ahora = Date.now();
  if (ahora - ultimoGolpeTiempo < 1000) {
    combo++;
  } else {
    combo = 1;
  }
  ultimoGolpeTiempo = ahora;
  
  if (combo > maxCombo) {
    maxCombo = combo;
  }
  
  // Calcular puntos
  const puntosBase = niveles[nivel - 1].puntosPorObjetivo;
  const puntosGanados = puntosBase * combo;
  
  puntos += puntosGanados;
  objetivos--;
  
  actualizarUI();
  
  // Verificar si se completaron todos los objetivos
  if (objetivos <= 0) {
    finalizarNivel(true);
  }
}

// Actualizar el temporizador
function actualizarTiempo() {
  if (!activo) return;
  
  tiempo--;
  actualizarUI();
  
  if (tiempo <= 0) {
    finalizarNivel(false);
  }
}

// Función para finalizar el nivel (NUEVA Y MEJORADA)
function finalizarNivel(completadoPorObjetivos) {
  if (!activo) return;
  
  activo = false;
  
  // Detener todos los intervalos
  clearInterval(reloj);
  clearInterval(intervalo);
  reloj = null;
  intervalo = null;
  
  if (completadoPorObjetivos && nivel < niveles.length) {
    // Nivel completado con éxito
    pantallaFinNivel.innerHTML = `
      <h2>¡Nivel ${nivel} completado!</h2>
      <p>Puntos: ${puntos}</p>
      <p>Tiempo restante: ${tiempo}s</p>
      <p>Máximo combo: ${maxCombo}x</p>
      <button class="btn-siguiente">Siguiente nivel</button>
    `;
    pantallaFinNivel.style.display = "flex";
    pantallaFinNivel.querySelector(".btn-siguiente").onclick = () => {
      nivel++;
      iniciarNivel();
    };
  } else {
    // Juego terminado (por tiempo o último nivel completado)
    pantallaFin.innerHTML = `
      <h2>${completadoPorObjetivos ? '¡Juego completado!' : '¡Tiempo agotado!'}</h2>
      <p>Puntos finales: ${puntos}</p>
      <p>Nivel alcanzado: ${nivel}</p>
      <p>Máximo combo: ${maxCombo}x</p>
      <button class="btn-reinicio">Jugar de nuevo</button>
    `;
    pantallaFin.style.display = "flex";
    pantallaFin.querySelector(".btn-reinicio").onclick = iniciarJuegoPrincipal;
  }
}

// Limpiar todos los blancos
function limpiarBlancos() {
  zona.innerHTML = "";
  blancos = [];
}

// Actualizar la interfaz de usuario
function actualizarUI() {
  tdNivel.textContent = `Nivel: ${nivel}`;
  tdPuntos.textContent = `Puntos: ${puntos}`;
  tdTiempo.textContent = `Tiempo: ${tiempo}s`;
  tdObjetivos.textContent = `Objetivos: ${objetivos}`;
}

// Hacer la función accesible globalmente
window.iniciarJuegoPrincipal = iniciarJuegoPrincipal;