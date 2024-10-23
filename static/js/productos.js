
window.addEventListener('load', async () => {

  
    const userResponse = await fetch('/api/usuarios/current');
    if (!userResponse.ok) {
        alert('Error al obtener usuario');
        return;
    }
    const usuarioJson = await userResponse.json();
    const usuario = usuarioJson.payload;
   

    const carrito = await fetch(`/api/carrito/${usuario['_id']}`, {
        method: 'POST',
    });
    const cart = await carrito.json();

    const carritoId = cart.carrito['_id'];
    const response = await fetch('/api/productos', {
        method: 'GET',
    });

    const productos = await response.json();
    productosAddcarrito(productos, carritoId, usuario['email']);
});

function mostrarContenidoPremium() {
    // Muestra el contenido premium
    document.getElementById('premium-content').style.display = 'block';
}
function productosAddcarrito(productos, carritoId, email) {
    // Iteramos los productos y los mostramos en la vista, agregamos un botón a cada producto
    const container = document.getElementById('productos-container');

    productos.forEach((producto, index) => {
        const productoElem = document.createElement('div');

        const botonId = `miBoton-${index}`;
        const eliminarId = `eliminar-${index}`;

        productoElem.innerHTML = `
       <div class="producto-card">
                <div class="producto-header">
                    <h2 class="producto-title">${producto.title}</h2>
                   
                </div>
                <div class="producto-image-container">
                    <img src="/images/${producto.thumbnail}" alt="${producto.title}" class="thumbnail-image"/>
                </div>
                <p class="producto-stock">(${producto.stock} disponibles)</p>
                <p class="producto-owner">Por ${producto.owner}</p>
                <p class="producto-price">$${producto.price}</p>
                <div class="button-container">
                    <button id="${botonId}" type="button" class="add-to-cart-btn">Añadir al carrito</button>
                    ${
                        producto.owner === email
                            ? `<button id="${eliminarId}" type="button" class="eliminar-btn">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6 18L18 6M6 6l12 12" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                              </button>`
                            : ''
                    }
                </div>
            </div>
        `;

        container.appendChild(productoElem);

        const miBoton = document.getElementById(botonId);
miBoton.addEventListener('click', async () => {
    try {
        const response = await fetch(
            `api/carrito/addProduct/${carritoId}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ producto }),
            }
        );

        if (response.ok) {
            alert('Se agregó el producto al carrito');
            // Aquí puedes llamar a una función para actualizar solo el carrito en lugar de recargar la página
            actualizarCarrito(carritoId);
        } else {
            alert('Error al agregar producto al carrito');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});


        // Creamos el evento para el botón "Eliminar" si está presente
        const eliminarBtn = document.getElementById(eliminarId);
        if (eliminarBtn) {
            eliminarBtn.addEventListener('click', async () => {
                try {
                    const response = await fetch(
                        `/api/productos/${producto._id}`,
                        {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        }
                    );

                    if (response.status === 200) {
                        alert('Se eliminó el producto correctamente');
                        location.reload();
                    } else {
                        alert('Error al eliminar el producto');
                    }
                } catch (error) {
                    console.error(
                        'Hubo un problema con la operación fetch:',
                        error.message
                    );
                }
            });
        }
    });
}

async function actualizarCarrito(carritoId) {
    try {
        const response = await fetch(`/api/carrito/${carritoId}`);
        if (!response.ok) {
            throw new Error('Error al obtener el carrito');
        }
        const carrito = await response.json();
        // Aquí actualiza el DOM para reflejar los productos en el carrito
        mostrarProductosEnCarrito(carrito);
    } catch (error) {
        console.error('Error al actualizar el carrito:', error);
    }
}

function mostrarProductosEnCarrito(carrito) {
    const container = document.getElementById('productos-carrito');
    container.innerHTML = ''; // Limpiar el contenido actual

    carrito.productos.forEach(producto => {
        const productoElem = document.createElement('div');
        productoElem.innerHTML = `
            <p>${producto.title} - $${producto.price}</p>
            <button class="eliminar-btn" data-producto-id="${producto._id}">Eliminar</button>
        `;
        container.appendChild(productoElem);

        // Agregar el evento para eliminar el producto del carrito
        const eliminarBtn = productoElem.querySelector('.eliminar-btn');
        eliminarBtn.addEventListener('click', async () => {
            try {
                const response = await fetch(`/api/carrito/removeProduct/${carrito._id}/${producto._id}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    alert('Producto eliminado del carrito');
                    mostrarProductosEnCarrito(await carritoResponse.json()); // Actualizar carrito
                } else {
                    alert('Error al eliminar producto del carrito');
                }
            } catch (error) {
                console.error('Error al eliminar producto:', error);
            }
        });
    });
}
