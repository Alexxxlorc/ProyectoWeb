const headerPlaceholder = document.getElementById('header-placeholder');
const footerPlaceholder = document.getElementById('footer-placeholder');


fetch('/includes/header.html')
    .then(res => res.text())                 
    .then(html => {
        headerPlaceholder.innerHTML = html;  
        marcarLinkActivo();                  
    });


fetch('/includes/footer.html')
    .then(res => res.text())
    .then(html => {
        footerPlaceholder.innerHTML = html;
    });


function marcarLinkActivo() {
    const path = window.location.pathname; 
    document.querySelectorAll('#mainNav .nav-link').forEach(link => {
        if (path.endsWith(link.getAttribute('href').replace(/^\//, ''))) {
            link.classList.add('active');
        }
    });
}