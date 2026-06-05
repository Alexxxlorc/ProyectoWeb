// ============================================
// CARRITO — Le Parfum Quotidien
// ============================================
 
const CART_KEY = 'lpq_cart';
 
// ---------- FUNCIONES BASE ----------
 
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
 
function removeFromCart(id) {
    const cart = getCart().filter(item => item.id !== id);
    saveCart(cart);
}
 
function updateCantidad(id, cantidad) {
    const cart = getCart();
    const item = cart.find(item => item.id === id);
    if (item) {
        item.cantidad = cantidad;
        if (item.cantidad <= 0) {
            removeFromCart(id);
            return;
        }
    }
    saveCart(cart);
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
 
// ---------- VISTA DEL CARRITO ----------
 
function crearFilaProducto(item) {
    return `
        <div class="card border-0 shadow-sm mb-3 p-3" style="border-radius: 0 !important;" id="item-${item.id}">
            <div class="row align-items-center g-3">
 
                <div class="col-3 col-md-2">
                    <img src="/${item.imagen}" 
                         alt="${item.nombre}"
                         class="img-fluid"
                         style="height: 80px; width: 100%; object-fit: cover;"
                         onerror="this.style.display='none'">
                </div>
 
                <div class="col-9 col-md-5">
                    <p class="mb-0 fw-bold" style="font-family: 'Cormorant Garamond', serif; font-size: 1.1rem;">
                        ${item.nombre}
                    </p>
                    <p class="mb-0 text-muted small">${item.marca}</p>
                    <p class="mb-0 text-muted small">${item.mililitros} ml</p>
                </div>
 
                <div class="col-6 col-md-3">
                    <div class="d-flex align-items-center gap-2">
                        <button class="btn btn-outline-secondary btn-sm" style="border-radius: 0 !important;"
                            onclick="cambiarCantidad(${item.id}, ${item.cantidad - 1})">−</button>
                        <span class="fw-bold">${item.cantidad}</span>
                        <button class="btn btn-outline-secondary btn-sm" style="border-radius: 0 !important;"
                            onclick="cambiarCantidad(${item.id}, ${item.cantidad + 1})">+</button>
                    </div>
                </div>
 
                <div class="col-4 col-md-1 text-end">
                    <p class="mb-0 fw-bold">${formatPrice(item.precio * item.cantidad)}</p>
                </div>
 
                <div class="col-2 col-md-1 text-end">
                    <button class="btn btn-sm" style="color: var(--rojo-intenso); background: none; border: none;"
                        onclick="eliminarProducto(${item.id})">✕</button>
                </div>
 
            </div>
        </div>
    `;
}
 
function renderCarrito() {
    const cart = getCart();
    const carritoVacio = document.getElementById('carritoVacio');
    const carritoContenido = document.getElementById('carritoContenido');
    const listaProductos = document.getElementById('listaProductos');
    const subtotalEl = document.getElementById('subtotal');
    const totalEl = document.getElementById('total');
 
    if (cart.length === 0) {
        carritoVacio.classList.remove('d-none');
        carritoContenido.classList.add('d-none');
        return;
    }
 
    carritoVacio.classList.add('d-none');
    carritoContenido.classList.remove('d-none');
 
    listaProductos.innerHTML = cart.map(item => crearFilaProducto(item)).join('');
 
    const total = getCartTotal(cart);
    subtotalEl.textContent = formatPrice(total);
    totalEl.textContent = formatPrice(total);
}
 
// ---------- ACCIONES ----------
 
function cambiarCantidad(id, nuevaCantidad) {
    if (nuevaCantidad <= 0) {
        eliminarProducto(id);
        return;
    }
    updateCantidad(id, nuevaCantidad);
    renderCarrito();
}
 
function eliminarProducto(id) {
    removeFromCart(id);
    renderCarrito();
}
 
// ---------- INICIO ----------
 
document.addEventListener('DOMContentLoaded', () => {
    renderCarrito();
});