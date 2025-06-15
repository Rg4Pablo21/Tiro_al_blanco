document.addEventListener("DOMContentLoaded", function() {
  const loginForm = document.getElementById("login-form");
  const codigoInput = document.getElementById("codigo");
  const loginDiv = document.getElementById("login");
  const juegoDiv = document.getElementById("juego");
  
  // Almacenará el nombre del jugador
  let nombreJugador = "";

  loginForm.addEventListener("submit", function(e) {
    e.preventDefault();
    
    const nombre = codigoInput.value.trim();
    
    if (nombre) {
      nombreJugador = nombre;
      
      // Efecto de desvanecimiento
      loginDiv.style.opacity = 0;
      
      setTimeout(function() {
        loginDiv.style.display = "none";
        juegoDiv.style.display = "block";
        
        setTimeout(function() {
          juegoDiv.style.opacity = 1;
          
          // Iniciar el juego principal
          if (typeof iniciarJuegoPrincipal === "function") {
            iniciarJuegoPrincipal();
          }
        }, 50);
      }, 300);
    } else {
      // Mostrar error si no se ingresó nombre
      codigoInput.style.border = "2px solid red";
      setTimeout(function() {
        codigoInput.style.border = "none";
      }, 1000);
    }
  });
});