document.addEventListener('DOMContentLoaded', async () => {
    const contenedor = document.getElementById('contenedor-productos');

    try {
        const productos = await getProductosPorCategoria("women's clothing");

        contenedor.innerHTML = productos.map(p => `
            <div class="col-md-4 col-sm-6">
                <div class="card h-100 shadow-sm border-0 rounded-3 overflow-hidden">
                    <img src="${p.image}" class="card-img-top" style="height:250px;object-fit:cover">
                    <div class="card-body text-center p-3">
                        <h5 class="card-title fw-bold mb-1 fs-5">${p.title}</h5>
                        <p class="card-text text-muted small">$${p.price}</p>
                        <a href="#" class="btn btn-dark w-100 rounded-pill py-2 small">Ver Detalles</a>
                    </div>
                </div>
            </div>
        `).join('');

    } catch (error) {
        contenedor.innerHTML = `<p class="text-danger">Error al cargar productos</p>`;
    }
}); 