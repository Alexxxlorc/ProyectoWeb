var configData;

fetch('./config.json')
    .then(response => response.json())
    .then(data => {
        configData = data;
        console.log('Config cargada:', data);    
        iniciarApp();
    })
    .catch(error => console.error('Error loading config.json:', error));

function iniciarApp() {
    console.log('API URL:', configData.apiUrl);
    
    // Ahora puedes usar la URL para hacer peticiones
    fetch(`${configData.apiUrl}${configData.usuariosEndpoint}`)
        .then(response => response.json())
        .then(usuarios => {
            console.log('Usuarios cargados:', usuarios);
        });
}