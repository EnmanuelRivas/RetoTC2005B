document.addEventListener('DOMContentLoaded', function() {
    // Obtener referencias a los elementos
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    
    // Verificar si hay una preferencia guardada
    const sidebarState = localStorage.getItem('sidebarState');
    
    // Aplicar el estado guardado o establecer el predeterminado
    if (sidebarState === 'collapsed') {
        sidebar.classList.add('collapsed');
        mainContent.classList.add('expanded');
    }
    
    // Manejar clic en el botón de alternar
    sidebarToggle.addEventListener('click', function() {
        // Alternar clases
        sidebar.classList.toggle('collapsed');
        mainContent.classList.toggle('expanded');
        
        // Guardar preferencia
        if (sidebar.classList.contains('collapsed')) {
            localStorage.setItem('sidebarState', 'collapsed');
        } else {
            localStorage.setItem('sidebarState', 'expanded');
        }
    });
    
    // Para dispositivos móviles, colapsar automáticamente la barra lateral
    function checkWindowSize() {
        if (window.innerWidth <= 768) {
            sidebar.classList.add('collapsed');
            mainContent.classList.add('expanded');
        }
    }
    
    // Verificar tamaño de ventana al cargar y redimensionar
    checkWindowSize();
    window.addEventListener('resize', checkWindowSize);
}); 