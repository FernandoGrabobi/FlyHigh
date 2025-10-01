// Archivo: javascript/tienda.js (Versión Actualizada con tus Productos)

document.addEventListener('DOMContentLoaded', () => {
    // --- BASE DE DATOS DE PRODUCTOS ---
    // Cada clave (ej. 'white-crow') debe ser única y coincidir con el enlace en tienda.html
    const products = {
        'mystery-box': {
            name: "Caja Secreta FlyHigh",
            price: "$30.000",
            description: "¡Desata la emoción con nuestra Mystery Box! Cada caja es una sorpresa única que contiene: 1) Una de nuestras camisetas de diseño exclusivo, elegida al azar. 2) Una figura coleccionable de un personaje de Haikyuu, impresa en resina de alta calidad. ¿Estás listo para la sorpresa?",
            image: "../assets/ModelosTienda/Remeras/bannerMysteryBox.png"
        },
        'white-crow': {
            name: "'white crow'",
            price: "$15.000",
            description: "Camiseta de algodón premium con el emblemático diseño del cuervo. Perfecta para mostrar tu espíritu de equipo tanto dentro como fuera de la cancha.",
            image: "../assets/ModelosTienda/Remeras/cuervos_blanca.png"
        },
        'fly-high-white': {
            name: "'Fly High'",
            price: "$15.000",
            description: "El diseño clásico de FlyHigh en una impecable camiseta blanca. Un básico esencial para cualquier amante del voleibol.",
            image: "../assets/ModelosTienda/Remeras/flyHigh_Blanca.png"
        },
        'fly-high-black': {
            name: "'Fly High Black'",
            price: "$15.000",
            description: "Elegancia y rendimiento se unen en nuestra camiseta 'Fly High Black'. El mismo gran diseño, ahora en un audaz color negro.",
            image: "../assets/ModelosTienda/Remeras/flyHigh_negra.png"
        },
        'fly-high-woosh': {
            name: "'Fly High WOosh'",
            price: "$17.000",
            description: "Inspirada en la velocidad y el sonido del remate perfecto. Esta camiseta de edición especial captura la energía explosiva del juego.",
            image: "../assets/ModelosTienda/Remeras/Haikyuu_Negra.png"
        },
        'shoyofly': {
            name: "'ShoyoFly'",
            price: "$18.000",
            description: "Un homenaje al pequeño gigante. Canaliza la energía y la determinación de Shoyo con este diseño exclusivo.",
            image: "../assets/ModelosTienda/Remeras/hinataShoyo_negra.png"
        },
        'i-will-block-you': {
            name: "'I Will Block You'",
            price: "$8.000",
            description: "Una declaración de intenciones. Perfecta para centrales y para cualquiera que domine la red. ¡Que el rival sepa a qué atenerse!",
            image: "../assets/ModelosTienda/Remeras/I Will Block You Beach Volleyball Player Funny T-shirt _ Beach-volleyball-block.jpeg"
        },
        'jus-do-it-hinata': {
            name: "'jus Do It Hinata'",
            price: "$8.000",
            description: "Motivación pura en una camiseta. Combina un lema icónico con la inspiración de una leyenda del anime.",
            image: "../assets/ModelosTienda/Remeras/jusDoItHinata_Negra.png"
        },
        'just-spike-it': {
            name: "'Just Spike It Volleyball'",
            price: "$8.000",
            description: "Simple, directo y lleno de actitud. Para aquellos que viven para el sonido del remate perfecto.",
            image: "../assets/ModelosTienda/Remeras/Just Spike It Volleyball Spikeball T-shirt _ Volleyball.jpeg"
        },
        'just-do-it-violeta': {
            name: "'Just Do It Violeta'",
            price: "$8.000",
            description: "Un toque de color y motivación. El diseño clásico en un vibrante tono violeta para destacar en cualquier lugar.",
            image: "../assets/ModelosTienda/Remeras/justDoIt_negra.png"
        },
        'karasuno-vc': {
            name: "'karasuno Volley Club'",
            price: "$8.000",
            description: "Forma parte del club. Muestra tu lealtad al equipo de los cuervos con este diseño clásico y reconocible.",
            image: "../assets/ModelosTienda/Remeras/karasunoVC_Negra.png"
        },
        'kiss-my-ace-2': {
            name: "'kiss My Ace 2'",
            price: "$8.000",
            description: "Una nueva versión de un clásico atrevido. Perfecto para los sacadores que juegan con confianza y un toque de picardía.",
            image: "../assets/ModelosTienda/Remeras/kissMyAce2_negra.png"
        },
        'kiss-my-ace': {
            name: "'kiss My Ace'",
            price: "$8.000",
            description: "El diseño original que lo empezó todo. Deja que tu saque hable por ti.",
            image: "../assets/ModelosTienda/Remeras/kissMyAce_negra.png"
        },
        'nishinoya-black': {
            name: "'Nishinoya Black'",
            price: "$18.000",
            description: "Homenaje al guardián de Karasuno. Una camiseta diseñada para los líberos y defensores que lo dejan todo en la cancha.",
            image: "../assets/ModelosTienda/Remeras/LiberoNishinoya_Negra.png"
        },
        'minustempo': {
            name: "'MinusTempo'",
            price: "$16.000",
            description: "Captura la esencia del ataque más rápido e impredecible. Un diseño para los verdaderos conocedores del juego.",
            image: "../assets/ModelosTienda/Remeras/MinusTempo_blanca.png"
        },
        'monster-block': {
            name: "'Monster Block'",
            price: "$16.000",
            description: "Para los que construyen muros en la red. Esta camiseta celebra el arte de un bloqueo dominante e intimidante.",
            image: "../assets/ModelosTienda/Remeras/MonterBlock_Negra.png"
        },
        'nekoma-team': {
            name: "'nekoma team'",
            price: "$16.000",
            description: "Muestra tu apoyo al equipo de los gatos con este diseño elegante y minimalista.",
            image: "../assets/ModelosTienda/Remeras/nekoma.png"
        },
        'litle-giant-white': {
            name: "'The Litle Giant White'",
            price: "$16.000",
            description: "Inspirada en la leyenda que lo cambió todo. Un diseño limpio para recordar que la altura no es un límite.",
            image: "../assets/ModelosTienda/Remeras/theLitleGigant_Blanca.png"
        },
        'volleyball-black': {
            name: "'Volleyball Black'",
            price: "$16.000",
            description: "Un diseño esencial y potente que celebra el deporte que amamos. Simple, audaz y directo.",
            image: "../assets/ModelosTienda/Remeras/volleyball_Negra.png"
        },
        'volleyball-chloe': {
            name: "'volleyball Chloe White'",
            price: "$16.000",
            description: "Un diseño artístico y elegante que combina la pasión por el voleibol con un toque de estilo único.",
            image: "../assets/ModelosTienda/Remeras/volleyballChloe_blancha.png"
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
            instagramBtn.href = 'https://instagram.com/tu-usuario-flyhigh';

            const whatsappBtn = document.getElementById('btn-whatsapp');
            const whatsappText = encodeURIComponent(`¡Hola! Estoy interesado/a en el producto: ${product.name}`);
            whatsappBtn.href = `https://wa.me/TU_NUMERO_AQUI?text=${whatsappText}`; // Reemplaza TU_NUMERO_AQUI
            
        } else {
            productDetailContainer.innerHTML = '<h1>Producto no encontrado</h1><p>El producto que buscas no existe o ha sido movido.</p>';
        }
    }
});