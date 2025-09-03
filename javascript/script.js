
document.addEventListener('DOMContentLoaded', function() {
    
    // Funcionalidad para el menú móvil (hamburguesa)
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    menuToggle.addEventListener('click', function() {
        mainNav.classList.toggle('active');
    });

    // Funcionalidad simulada para el cambio de idioma
    const langButtons = document.querySelectorAll('.lang-btn');

    langButtons.forEach(button => {
        button.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            let languageName = '';

            switch (lang) {
                case 'es':
                    languageName = 'Español';
                    break;
                case 'en':
                    languageName = 'Inglés';
                    break;
                case 'pt':
                    languageName = 'Portugués';
                    break;
            }

            // En un proyecto real, aquí iría la lógica para cambiar el contenido.
            // Por ahora, solo mostramos una alerta para confirmar la selección.
            alert(`Idioma cambiado a ${languageName}.`);
        });
    });

});