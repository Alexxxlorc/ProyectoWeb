const CART_KEY = 'lpq_cart';

function getCart() {
    try {
        return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(cart, producto) {
    const existe = cart.find(item => item.id === producto.id);
    if (existe) {
        existe.cantidad += 1;
        return [...cart];
    }
    return [...cart, { ...producto, cantidad: 1 }];
}

function removeFromCart(cart, id) {
    return cart.filter(item => item.id !== id);
}

function getCartTotal(cart) {
    return cart.reduce((total, item) => total + item.precio * item.cantidad, 0);
}

function formatPrice(precio) {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
        minimumFractionDigits: 2
    }).format(precio);
}

function filtrarProductos(productos, query) {
    const term = query.trim().toLowerCase();
    if (!term) return productos;
    return productos.filter(p =>
        p.nombre.toLowerCase().includes(term) ||
        p.notas.toLowerCase().includes(term) ||
        p.categoria.toLowerCase().includes(term)
    );
}

function filtrarPorCategoria(productos, categoria) {
    if (!categoria || categoria === 'todos') return productos;
    return productos.filter(p => p.categoria === categoria);
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function mostrarAlerta(mensaje, tipo = 'success') {
    const alerta = document.createElement('div');
    alerta.className = `alert alert-${tipo} alert-dismissible fade show position-fixed bottom-0 end-0 m-3`;
    alerta.style.zIndex = '9999';
    alerta.innerHTML = `${mensaje}<button type="button" class="btn-close" data-bs-dismiss="alert"></button>`;
    document.body.appendChild(alerta);
    setTimeout(() => alerta.remove(), 3000);
}

function slugify(texto) {
    return texto.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
}
