// Esperamos a que todo el HTML de la página esté completamente cargado
document.addEventListener("DOMContentLoaded", () => {
    cargarPerfumes();
});

// Función principal para jalar el JSON local
function cargarPerfumes() {
    // CORRECCIÓN DE RUTA: Salimos de 'views' con '../' y entramos a 'js/config.json'
    fetch('../js/config.json')
        .then(respuesta => {
            // Si el archivo no se encuentra, lanzamos el error para la consola
            if (!respuesta.ok) {
                throw new Error("No se pudo cargar el archivo config.json");
            }
            return respuesta.json(); // Convertimos el texto a un objeto de JavaScript
        })
        .then(datos => {
            const listaProductos = datos.productos;
            
            // 1. Detectamos en qué página está el usuario leyendo la URL actual
            const rutaActual = window.location.pathname;
            let categoriaFiltrar = "";

            if (rutaActual.includes("dama.html")) {
                categoriaFiltrar = "dama";
            } else if (rutaActual.includes("caballero.html")) {
                categoriaFiltrar = "caballero";
            } else if (rutaActual.includes("kits.html")) {
                categoriaFiltrar = "kits";
            }

            // 2. Filtramos el arreglo: solo nos quedamos con los 10 de esa categoría
            const productosFiltrados = listaProductos.filter(perfume => perfume.categoria === categoriaFiltrar);

            // 3. Mandamos a pintar esos perfumes en el HTML
            mostrarEnPantalla(productosFiltrados);
        })
        .catch(error => {
            console.error("Hubo un error al jalar los datos:", error);
        });
}

// Función encargada de crear las tarjetas de Bootstrap e inyectarlas en el HTML
function mostrarEnPantalla(perfumes) {
    // Buscamos el contenedor <div id="contenedor-perfumes"> en tu HTML
    const contenedor = document.getElementById("contenedor-perfumes");
    
    // Si la página actual no tiene ese contenedor, detenemos la función
    if (!contenedor) return;

    // Limpiamos el contenedor por si tuviera contenido viejo
    contenedor.innerHTML = "";

    // Recorremos los perfumes filtrados uno por uno
    perfumes.forEach(perfume => {
        
        // Creamos el diseño de la tarjeta utilizando tus clases de Bootstrap
        const tarjetaHTML = `
            <div class="col-md-4 col-sm-6">
                <div class="card h-100 shadow-sm border-0 rounded-3 overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=400" 
                         class="card-img-top" 
                         alt="${perfume.nombre}" 
                         style="height: 250px; object-fit: cover;">
                    <div class="card-body d-flex flex-column text-center p-3">
                        <small class="text-uppercase text-muted fw-bold mb-1 d-block" style="font-size: 0.75rem;">
                            ${perfume.marca}
                        </small>
                        <h5 class="card-title fw-bold mb-1 fs-5 text-dark">${perfume.nombre}</h5>
                        <p class="card-text text-muted small flex-grow-1 mb-2">${perfume.descripcion}</p>
                        <div class="d-flex justify-content-between align-items-center mt-3">
                            <span class="fw-bold text-dark fs-5">$${perfume.precio}</span>
                            <span class="badge bg-light text-dark border font-monospace">${perfume.mililitros}ml</span>
                        </div>
                    
                        <a href="text-center"></a>
                        <a href="detalle.html?id=${perfume.id}" class="btn btn-dark w-100 mt-3 rounded-pill py-2 small ${perfume.disponible ? '' : 'disabled'}">
                            ${perfume.disponible ? 'Ver Detalles' : 'Agotado'}
                        </a>
                    </div>
                </div>
            </div>
        `;
        
        // Inyectamos la tarjeta en el contenedor
        contenedor.innerHTML += tarjetaHTML;
    });
}

// === BLOQUE INDEPENDIENTE PARA LA PÁGINA DETALLE.HTML ===

// Comprobamos si el usuario está actualmente en la página de detalles
if (window.location.pathname.includes("detalle.html")) {
    // Ejecutamos la función de manera automática al cargar detalle.html
    document.addEventListener("DOMContentLoaded", cargarDetallePerfume);
}

function cargarDetallePerfume() {
    // 1. Extraemos el ID de la URL (ej: de '?id=3' obtenemos el '3')
    const parametrosURL = new URLSearchParams(window.location.search);
    const idBuscar = parseInt(parametrosURL.get("id"));

    if (!idBuscar) {
        document.getElementById("contenedor-detalle").innerHTML = "<p class='text-center text-danger'>Producto no encontrado.</p>";
        return;
    }

    // 2. Jalamos los datos de nuestro config.json
    fetch('../js/config.json')
        .then(res => res.json())
        .then(datos => {
            // 3. Buscamos el perfume exacto que coincida con el ID de la URL
            const perfume = datos.productos.find(p => p.id === idBuscar);

            if (!perfume) {
                document.getElementById("contenedor-detalle").innerHTML = "<p class='text-center text-danger'>El perfume solicitado no existe.</p>";
                return;
            }

            // 4. Inyectamos la información estructurada en el HTML en dos columnas organizadas
            const contenedor = document.getElementById("contenedor-detalle");
            contenedor.innerHTML = `
                <div class="col-md-5 text-center">
                    <img src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=600" 
                         class="img-fluid rounded p-3" 
                         alt="${perfume.nombre}" 
                         style="max-height: 400px; object-fit: cover;">
                </div>
                <div class="col-md-7">
                    <span class="badge bg-secondary text-uppercase mb-2">${perfume.marca}</span>
                    <h1 class="display-4 fw-bold text-dark mb-1">${perfume.nombre}</h1>
                    <p class="text-muted fs-5 font-monospace mb-4">Presentación de ${perfume.mililitros} ml</p>
                    
                    <h3 class="text-success fw-bold mb-4">$${perfume.precio} MXN</h3>
                    
                    <h5 class="fw-semibold text-dark">Descripción de la fragancia:</h5>
                    <p class="text-secondary fs-5 mb-5">${perfume.descripcion}</p>
                    
                    <div class="d-flex gap-3">
                        <button class="btn btn-dark btn-lg px-5 rounded-pill" onclick="alert('¡Añadido exitosamente al carrito!')">
                            Añadir al carrito
                        </button>
                        <a href="javascript:history.back()" class="btn btn-outline-secondary btn-lg px-4 rounded-pill">
                            Regresar
                        </a>
                    </div>
                </div>
            `;
        })
        .catch(error => {
            console.error("Error al cargar el detalle:", error);
        });
}