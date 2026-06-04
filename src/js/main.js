// Base de datos de perfumes
const productos = [
    { id: 1, nombre: "Midnight Rose", categoria: "dama", notas: "Floral / Dulce", precio: 85, emoji: "🌹" },
    { id: 2, nombre: "Ocean Mist", categoria: "caballero", notas: "Cítrico / Fresco", precio: 75, emoji: "🌊" },
    { id: 3, nombre: "Golden Amber", categoria: "caballero", notas: "Amaderado", precio: 90, emoji: "🪵" },
    { id: 4, nombre: "Sweet Velvet", categoria: "dama", notas: "Vainilla / Frutal", precio: 80, emoji: "🍦" },
    { id: 5, nombre: "Citrus Bloom", categoria: "dama", notas: "Cítrico / Floral", precio: 70, emoji: "🍋" },
    { id: 6, nombre: "Deep Forest", categoria: "caballero", notas: "Especiado / Pino", precio: 95, emoji: "🌲" }
];

// Selectores globales
const searchInput = document.querySelector('input[type="search"]');
const searchForm = document.querySelector('form[role="search"]');
const categoryCards = document.querySelectorAll('.category-card');

/**
 * Crea el HTML para una tarjeta de producto
 */
const crearCardProducto = (perfume) => {
    return `
        <div class="col animate__animated animate__fadeIn">
            <div class="card h-100 border-0 shadow-sm">
                <div class="card-body text-center">
                    <div class="display-4 mb-2">${perfume.emoji}</div>
                    <h5 class="card-title fw-bold">${perfume.nombre}</h5>
                    <p class="card-text text-muted small">${perfume.notas}</p>
                    <p class="fw-bold text-primary">$${perfume.precio}.00</p>
                    <button class="btn btn-outline-dark btn-sm">Añadir al carrito</button>
                </div>
            </div>
        </div>
    `;
};

/**
 * Filtra y muestra productos según la búsqueda
 */
function ejecutarBusqueda(query) {
    const term = query.toLowerCase();
    const filtrados = productos.filter(p => 
        p.nombre.toLowerCase().includes(term) || 
        p.notas.toLowerCase().includes(term)
    );

    // Si quieres mostrar resultados en consola o un contenedor específico:
    if (filtrados.length > 0) {
        console.log("Resultados encontrados:", filtrados);
    } else {
        alert("No se encontraron perfumes que coincidan con: " + query);
    }
}

// Manejo del formulario de búsqueda
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (searchInput.value.trim() !== "") {
        ejecutarBusqueda(searchInput.value);
    }
});

// Efectos visuales en las tarjetas de categoría
categoryCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
        card.style.transition = 'transform 0.3s ease, shadow 0.3s ease';
        card.classList.add('shadow-lg');
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
        card.classList.remove('shadow-lg');
    });
});

// Mensaje de bienvenida e inicialización
document.addEventListener('DOMContentLoaded', () => {
    console.log("🌸 Le Parfum Quotidien: Sistema cargado.");
    
    // Suavizar el scroll para los enlaces del navbar
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
}); 