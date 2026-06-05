// Esperamos a que todo el HTML de la página esté completamente cargado
document.addEventListener("DOMContentLoaded", () => {
    cargarPerfumes();
});

// Función principal para jalar el JSON local
function cargarPerfumes() {
    // CORRECCIÓN DE RUTA: Salimos de 'views' con '../' y entramos a 'js/config.json'
    fetch('/src/js/config.json')
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
            // 1. Identificación de la vista del usuario
            // Si está en la raíz, en index.html o no especifica archivo (home en servidores de desarrollo)
            if (rutaActual === "/" || rutaActual.includes("index.html")) {
                
                // Para la landing page seleccionamos productos específicos (ej: IDs del 1 al 4)
                // Esto simula una consulta SQL de "Best Sellers" o productos destacados
                const destacados = listaProductos.filter(p => p.id === 1 || p.id === 2 || p.id === 11 || p.id === 12);
                
                // Mandamos a pintar al contenedor especial de la landing page
                mostrarEnPantalla(destacados, "productos-destacados", true);
                
            } else {
                // Lógica existente para las páginas de categorías en /views/
                let categoriaFiltrar = "";

                if (rutaActual.includes("dama.html")) {
                    categoriaFiltrar = "dama";
                } else if (rutaActual.includes("caballero.html")) {
                    categoriaFiltrar = "caballero";
                } else if (rutaActual.includes("kits.html")) {
                    categoriaFiltrar = "kits";
                }

                const productosFiltrados = listaProductos.filter(perfume => perfume.categoria === categoriaFiltrar);
                
                // Mandamos a pintar al contenedor por defecto de las categorías
                mostrarEnPantalla(productosFiltrados, "contenedor-perfumes", false);
            }
        })
        .catch(error => {
            console.error("Hubo un error al jalar los datos:", error);
        });
}

// Función encargada de crear las tarjetas de Bootstrap e inyectarlas en el HTML
function mostrarEnPantalla(perfumes, idContenedor, esLanding) {
    // Buscamos el contenedor <div id="contenedor-perfumes"> en tu HTML
    const contenedor = document.getElementById(idContenedor);
    
    // Si la página actual no tiene ese contenedor, detenemos la función
    if (!contenedor) return;

    // Limpiamos el contenedor por si tuviera contenido viejo
    contenedor.innerHTML = "";

    // Recorremos los perfumes filtrados uno por uno
    perfumes.forEach(perfume => {
        // CORRECCIÓN TÉCNICA DE RUTA DE ASSETS:
        // Si estamos en la landing (raíz), la ruta "src/media/..." es directa.
        // Si estamos dentro de la carpeta /views/, debemos anteponer "../" para subir un nivel.
        const rutaImagenCorrecta = esLanding ? `./${perfume.imagen}` : `../${perfume.imagen}`;
        
        // El enlace a detalles cambia si estamos en la raíz (index) o dentro de /views/
        const urlDetalle = esLanding ? `./src/views/producto.html?id=${perfume.id}` : `./producto.html?id=${perfume.id}`;

        const tarjetaHTML = `
            <div class="${esLanding ? 'col' : 'col-md-4 col-sm-6'}">
                <div class="card h-100 text-center shadow-sm border-0">
                    <div class="position-relative overflow-hidden" style="height: 280px; background-color: #fff;">
                        <img src="${rutaImagenCorrecta}" 
                             class="card-img-top p-3" 
                             alt="${perfume.nombre}" 
                             style="height: 100%; width: 100%; object-fit: contain;">
                    </div>
                    <div class="card-body d-flex flex-column justify-content-between p-3">
                        <div>
                            <h4 class="card-title h5 mb-1">${perfume.nombre}</h4>
                            <p class="text-muted small mb-2" style="letter-spacing: 0.1em; text-transform: uppercase;">${perfume.marca}</p>
                            <p class="card-text text-muted small mb-2 text-truncate-2">${perfume.descripcion}</p>
                        </div>
                        <div class="mt-3">
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <span class="fw-normal text-dark" style="font-family: 'Inter', sans-serif;">$${perfume.precio.toLocaleString('es-MX')} MXN</span>
                                <span class="badge bg-light text-dark border font-monospace small">${perfume.mililitros}ml</span>
                            </div>
                            
                            <div class="d-flex gap-2">
                                <a href="${urlDetalle}" class="btn ${esLanding ? 'btn-dark' : 'btn-dark'} w-100 py-2 small ${perfume.disponible ? '' : 'disabled'}">
                                    ${perfume.disponible ? 'Descubrir' : 'Agotado'}
                                </a>
                                <button class="btn btn-outline-dark py-2 small"
                                        onclick="agregarAlCarrito(${perfume.id})"
                                        ${perfume.disponible ? '' : 'disabled'}>
                                    🛒
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
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
    fetch('/src/js/config.json')
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
                    <img src="${perfume.imagen}" 
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
                        <button class="btn btn-dark btn-lg px-5 rounded-pill" onclick="agregarAlCarrito(${perfume.id})"> Añadir al carrito </button>
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