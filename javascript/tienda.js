// Archivo: javascript/tienda.js

document.addEventListener('DOMContentLoaded', () => {
    // Base de datos de productos (aquí puedes modificar y añadir más)
    const products = {
        'camiseta-2025': {
            name: "Camiseta FlyHigh Edición 2025",
            price: "$20.000",
            description: "Algodón estampado de alta calidad. Ideal para entrenamientos intensos y partidos. Diseño exclusivo con el logo de FlyHigh.",
            image: "https://images.unsplash.com/photo-1582657596537-21a733c443b7?auto=format&fit=crop&w=800&q=80"
        },
        'buzo-warmup': {
            name: "Buzo con Capucha 'Warm-Up'",
            price: "$35.000",
            description: "Tejido de microfibra que mantiene el calor corporal antes de cada partido. Ligero, cómodo y con un corte atlético.",
            image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80"
        },
        'shorts-airflow': {
            name: "Shorts de Competición 'AirFlow'",
            price: "$15.000",
            description: "Diseñados para una máxima libertad de movimiento. La tecnología AirFlow asegura una ventilación constante durante el juego.",
            image: "https://images.unsplash.com/photo-1591195853828-11db59a43f65?auto=format&fit=crop&w=800&q=80"
        },
        'medias-rendimiento': {
            name: "Medias de Alto Rendimiento",
            price: "$8.000",
            description: "Compresión graduada para mejorar la circulación y reducir la fatiga. Refuerzos en talón y puntera para una mayor durabilidad.",
            image: "https://images.unsplash.com/photo-1606138023242-3c44c16da456?auto=format&fit=crop&w=800&q=80"
        }
    };

    // Lógica para la página de detalles del producto
    const productDetailContainer = document.querySelector('.product-detail-container');
    if (productDetailContainer) {
        const params = new URLSearchParams(window.location.search);
        const productId = params.get('item');
        const product = products[productId];

        if (product) {
            document.getElementById('product-img').src = product.image;
            document.getElementById('product-name').textContent = product.name;
            document.getElementById('product-price').textContent = product.price;
            document.getElementById('product-desc').textContent = product.description;

            // Configurar enlaces de contacto
            const emailBtn = document.getElementById('btn-email');
            const subject = encodeURIComponent(`Consulta por producto: ${product.name}`);
            emailBtn.href = `mailto:tu-correo@flyhigh.com?subject=${subject}`;
            
            const instagramBtn = document.getElementById('btn-instagram');
            instagramBtn.href = 'https://instagram.com/tu-usuario-flyhigh'; // Cambia esto por tu usuario de Instagram
            
        } else {
            // Si el producto no existe, muestra un mensaje
            productDetailContainer.innerHTML = '<h1>Producto no encontrado</h1><p>El producto que buscas no existe o ha sido movido.</p>';
        }
    }
});