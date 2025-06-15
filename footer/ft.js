// Creación del footer
let footer = document.createElement('footer');
footer.className = 'game-footer';

// Contenido del footer
let footerContent = `
    <div class="footer-container">
        <div class="footer-section">
            <p>© ${new Date().getFullYear()} V Compu</p>
        </div>
        <div class="footer-section">
            <p>Tiro Blanco - Juego de puntería</p>
        </div>
        <div class="footer-section">
            <p>Versión 1.0</p>
        </div>
    </div>
`;

footer.innerHTML = footerContent;

// Insertar el footer al final del body
document.body.appendChild(footer);