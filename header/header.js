// Creación del header
let header = document.createElement('header');
header.className = 'game-header';

// Contenido del header
let headerContent = `
    <div class="header-container">
        <h1 class="logo">Tiro Blanco</h1>
        <nav class="header-nav">
            <button class="nav-btn" id="btn-inicio">Inicio</button>
            <button class="nav-btn" id="btn-puntajes">Puntajes</button>
            <button class="nav-btn" id="btn-info">Info</button>
        </nav>
    </div>
`;

header.innerHTML = headerContent;

// Insertar el header al inicio del body
document.body.insertBefore(header, document.body.firstChild);

// Eventos para los botones (puedes expandir esta funcionalidad)
document.getElementById('btn-inicio').addEventListener('click', () => {
    console.log('Ir a inicio');
});

document.getElementById('btn-puntajes').addEventListener('click', () => {
    console.log('Mostrar puntajes');
});

document.getElementById('btn-info').addEventListener('click', () => {
    console.log('Mostrar información');
});