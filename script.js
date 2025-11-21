var startBtn = document.getElementById('startBtn');
var stage = document.getElementById('stage');
var canvas = document.getElementById('pokecanvas');
var ctx = canvas.getContext('2d');
var caption = document.getElementById('caption');

// Colores clásicos (valores aproximados)


var COLOR_WHITE = '#FFFFFF';
var COLOR_RED   = '#DE1F1F'; // rojo clásico
var COLOR_BLACK = '#0A0A0A';
var COLOR_GRAY  = '#BDBDBD'; // para detalles / brillo
var COLOR_DARK  = '#4A4A4A'; // interior del botón central


// Parámetros pokeball
var size = 24; // 24x24 píxeles
var scale = 12; // tamaño visual = size * scale (controlado por CSS, pero útil si quieres cambiar)

function clearCanvas(){
  ctx.clearRect(0,0,canvas.width, canvas.height);
}

// Función que decide el color de cada píxel (x,y) en una pokeball 24x24
// La estrategia: usar geometría de círculo para la parte redonda y una banda horizontal.
// Centro aproximado en (11.5,11.5) porque 0..23
function pixelColorAt(x,y){
  // centro y radios en coordenadas del grid 0..23
  var cx = (size-1)/2.0;
  var cy = (size-1)/2.0;
  // radio exterior (ajustado para que quede buena forma en 24)
  var r = 10.2; // radio total
  // radio interior para la franja (para crear borde)
  var r_inner = r - 1.0;

  // distancia al centro
  var dx = x - cx;
  var dy = y - cy;
  var dist = Math.sqrt(dx*dx + dy*dy);

  // Línea central y empalme del "botón"
  // Decide si estamos en la franja horizontal del cierre
  // Usamos una banda ubicada aproximadamente en y == cy +/- 1.2
  var bandThickness = 2.0; // grosor de la franja negra
  var bandY = cy; // centro de la franja blanca/negra

  // Decide los colores por reglas:
  // - fuera del círculo: transparente (dejamos fondo cuadriculado visible)
  if(dist > r + 0.3) return null;

  // - contorno negro (grosor ~1)
  if(dist > r - 0.9) return COLOR_BLACK;

  // - franja horizontal negra (cierre): si y dentro de bandThickness alrededor de bandY
  if(Math.abs(y - bandY) <= bandThickness/2 + 0.2){
    // La franja tiene borde negro y una línea blanca en el centro para el brillo en el 'botón'
    return COLOR_BLACK;
  }

  // - arriba de la franja => rojo
  if(y < bandY){
    // para dar un borde inferior oscuro cercano a la franja, oscurecemos una fila
    if(dist > r_inner - 0.7) return '#b21a1a';
    return COLOR_RED;
  }

  // - abajo de la franja => blanco / claro (con leve gris para dar redondez)
  if(y > bandY){
    // sombreado inferior
    if(dist > r_inner - 0.6) return '#f0f0f0';
    return COLOR_WHITE;
  }

  // fallback
  return COLOR_WHITE;
}

// Dibuja gradualmente píxel a píxel para un efecto de generación.
// No usamos arrays de definición: la función pixelColorAt calcula color por coordenadas.
function drawPokeballAnimated(){
  clearCanvas();
  // orden de dibujo: desde arriba hacia abajo / izquierda a derecha
  var x = 0, y = 0;
  var delay = 8; // ms entre píxeles (ajusta para acelerar/ralentizar)
  function step(){
    var color = pixelColorAt(x,y);
    if(color !== null){
      ctx.fillStyle = color;
      ctx.fillRect(x, y, 1, 1);
    }
    x++;
    if(x >= size){
      x = 0;
      y++;
    }
    if(y < size){
      setTimeout(step, delay);
    } else {
      // después de terminar, dibujamos el botón central (círculo) con brillo
      drawCentralButton();
    }
  }
  step();
}

// Dibuja el botón central blanco/redondo y algunos detalles de borde
function drawCentralButton(){
  // botón en el centro: lo haremos con píxeles sobre el canvas
  var cx = (size-1)/2.0;
  var cy = (size-1)/2.0;
  // botón radio en pixeles de grid
  var br = 2.2;

  // relleno blanco con borde negro pequeño
  for(var px = Math.floor(cx - br -1); px <= Math.ceil(cx + br +1); px++){
    for(var py = Math.floor(cy - br -1); py <= Math.ceil(cy + br +1); py++){
      var dx = px - cx;
      var dy = py - cy;
      var d = Math.sqrt(dx*dx + dy*dy);
      if(d <= br){
        ctx.fillStyle = COLOR_WHITE;
        ctx.fillRect(px,py,1,1);
      } else if(d <= br + 0.9 && d > br - 0.2){
        ctx.fillStyle = COLOR_BLACK;
        ctx.fillRect(px,py,1,1);
      }
    }
  }

  // pequeño círculo oscuro interior
  for(var px = Math.floor(cx - 1.2); px <= Math.ceil(cx + 1.2); px++){
    for(var py = Math.floor(cy - 1.2); py <= Math.ceil(cy + 1.2); py++){
      var dx = px - cx;
      var dy = py - cy;
      var d = Math.sqrt(dx*dx + dy*dy);
      if(d <= 0.9){
        ctx.fillStyle = COLOR_DARK;
        ctx.fillRect(px,py,1,1);
      }
    }
  }

  // brillo: un par de píxeles blancos arriba a la izquierda del botón
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(Math.round(cx - 1.3), Math.round(cy - 1.8), 1,1);
  ctx.fillRect(Math.round(cx - 0.2), Math.round(cy - 1.6), 1,1);
}

// al dar click en Start
startBtn.addEventListener('click', function onStart(e){
  // ocultar botón con transición
  startBtn.style.display = 'none';

  // cambiar al fondo de papel cuadriculado
  stage.classList.add('paper');
  // mostrar canvas y caption
  stage.classList.add('showCanvas');

  // asegurar fondo blanco bajo el canvas
  canvas.style.background = 'transparent';

  // dibujar la pokeball con animación
  drawPokeballAnimated();
});

// Si quieres permitir reiniciar con doble click en el escenario (opcional)
stage.addEventListener('dblclick', function(){
  // volver a estado inicial: ocultar canvas, mostrar botón, quitar paper
  stage.classList.remove('paper');
  stage.classList.remove('showCanvas');
  startBtn.style.display = 'flex';
  clearCanvas();
});