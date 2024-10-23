
document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('toggleProfile');
    const cartButton = document.getElementById('toggleCarts');
    const profileInfo = document.getElementById('profileInfo');
    const cartInfo = document.getElementById('cartInfo');
    const overlay = document.getElementById('overlay');
    const spans = document.querySelectorAll('span');


    profileInfo.style.display = 'none';
    overlay.style.display = 'none';

    
    toggleButton.addEventListener('click', () => {
        if (profileInfo.classList.contains('open')) {
            profileInfo.classList.remove('open');
            overlay.style.display = 'none'; 
            setTimeout(() => {
                profileInfo.style.display = 'none';
            }, 500); 
            toggleButton.setAttribute('aria-expanded', 'false');
        } else {
            profileInfo.style.display = 'block';
            overlay.style.display = 'block'; 
            setTimeout(() => {
                profileInfo.classList.add('open');
            }, 0); 
            toggleButton.setAttribute('aria-expanded', 'true');
        }
        toggleButton.textContent = profileInfo.classList.contains('open')
            ? '❌'
            : '👤'; 
    });

    cartButton.addEventListener('click', () => {
        if (cartInfo.classList.contains('open')) {
            cartInfo.classList.remove('open');
            overlay.style.display = 'none'; // Oculta el overlay
            setTimeout(() => {
                cartInfo.style.display = 'none';
            }, 500); // Coincide con la duración de la transición CSS
            cartButton.setAttribute('aria-expanded', 'false');
        } else {
            cartInfo.style.display = 'block';
            overlay.style.display = 'block'; // Muestra el overlay
            setTimeout(() => {
                cartInfo.classList.add('open');
            }, 0); // Sin retardo, asegura que display: block se aplique antes de la animación
            cartButton.setAttribute('aria-expanded', 'true');
        }
        cartButton.textContent = cartInfo.classList.contains('open')
            ? '❌'
            : '🛒';
    });

    async function loadProfile() {
        try {
            const response = await fetch('/api/usuarios/current');
            if (response.status === 403) {
                alert('Necesitas loguearte para ver esta info!');
                window.location.href = '/login';
                return;
            }

            const result = await response.json();
            const usuario = result.payload;
            spans[0].textContent = usuario.nombre;
            spans[1].textContent = usuario.apellido;
            spans[2].textContent = usuario.email;
            spans[3].textContent = usuario.rol;
            localStorage.setItem('nombreUsuario', usuario.nombre);
            if (usuario.rol === 'premium') {
                var btnProductos = document.createElement('button');
                btnProductos.id = 'btnProductos';
                btnProductos.textContent = 'nuevo producto';
                btnProductos.onclick = function () {
                    window.location.href = '/productos';
                };
                var profileActions =
                    document.getElementById('buttonNewProducto');
                if (profileActions) {
                    profileActions.appendChild(btnProductos);
                }
            }

            updatePremiumButton(usuario.rol, usuario.email);

            document.getElementById('logout').addEventListener('click', logout);
            document
                .getElementById('btnProductos')
                .addEventListener(
                    'click',
                    () => (window.location.href = '/productos')
                );

            await loadCart(usuario['_id'], usuario.email);
        } catch (error) {
            console.error('Error cargando el perfil:', error);
        }
    }

    async function updatePremiumButton(rol, email) {
        const premiumButton = document.getElementById('btnPremium');
        premiumButton.textContent =
            rol === 'premium' ? 'Quitar Premium' : 'Hacerme Premium';
        premiumButton.addEventListener('click', () =>
            togglePremium(email, rol)
        );
    }

    async function togglePremium(email, rol) {
        try {
            const response = await fetch('/api/usuarios/premium', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, rol }),
            });

            if (response.ok) {
                const data = await response.json();
                alert(data.message);
                location.reload();
            } else {
                alert('Error al cambiar el estado Premium.');
            }
        } catch (error) {
            console.error('Error al actualizar Premium:', error);
        }
    }

    async function logout() {
        try {
            const response = await fetch('/api/sesiones/current', {
                method: 'DELETE',
            });

            if (response.ok) {
                window.location.href = '/login';
            } else {
                const error = await response.json();
                alert(error.message);
            }
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    }

    async function loadCart(userId, email) {
        try {
            const carritoResponse = await fetch(`/api/carrito/${userId}`, {
                method: 'POST',
            });
            const carrito = await carritoResponse.json();
            renderCartProducts(carrito.carrito, email);
        } catch (error) {
            console.error('Error cargando el carrito:', error);
        }
    }

    function renderCartProducts(productos, mail) {
        const container = document.getElementById('productos-carrito');
        let amount = 0;

        productos.products.forEach((producto) => {
            const totalProducto = producto.price * producto.quantity;
            amount += totalProducto;

            const productoElem = document.createElement('div');
            const botonIdDelete = `delete-${producto.idProduct}`;
            productoElem.innerHTML = `
                <div style="border: 1px solid #e0e0e0; padding: 12px; margin-bottom: 15px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                    <h2 style="font-size: 18px; margin-bottom: 8px; color: #333;">${producto.title}</h2>
                    <p style="font-size: 12px; color: #777;">${producto.description}</p>
                    <p style="font-size: 16px; font-weight: bold; color: #007bff;">ID: ${producto.idProduct} (Cantidad: ${producto.quantity})</p>
                    <p style="font-size: 14px; color: #333; font-weight: bold;">Total: $${totalProducto}
                        <button id="${botonIdDelete}" style="display: inline-block; border: 1px solid #007bff; padding: 6px 12px; border-radius: 6px; background-color: #ff0000; color: #fff; font-size: 14px; font-weight: bold; cursor: pointer;">Eliminar</button>
                    </p>
                </div>`;
            container.appendChild(productoElem);

            document
                .getElementById(botonIdDelete)
                .addEventListener('click', async () => {
                    try {
                        const response = await fetch(
                            `/api/carrito/${productos._id}/${producto.idProduct}`,
                            { method: 'DELETE' }
                        );
                        if (response.ok) {
                            location.reload();
                        } else {
                            alert('Error al eliminar el producto.');
                        }
                    } catch (error) {
                        console.error(
                            'Error al eliminar producto del carrito:',
                            error
                        );
                    }
                });
        });

        const precioFinalElem = document.createElement('div');
        precioFinalElem.innerHTML = `
            <div style="display: inline-block; border: 2px solid #007bff; padding: 16px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                <h1 style="font-size: 25px; font-weight: bold; color: #333; margin: 0;">TOTAL = $${amount}</h1>
                <button id="buyButton" style="display: inline-block; border: 2px solid #007bff; padding: 8px 16px; border-radius: 8px; background-color: #007bff; color: #fff; font-size: 16px; font-weight: bold; cursor: pointer;">Comprar</button>
            </div>`;
        container.appendChild(precioFinalElem);

        document
            .getElementById('buyButton')
            .addEventListener('click', async () => {
                try {
                    const response = await fetch(
                        `/api/carrito/purchase/${productos._id}`,
                        {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                products: productos.products,
                            }),
                        }
                    );

                    if (response.ok) {
                        const responseData = await response.json();
                        const amountCompra = responseData.payload.amount;

                        if (amountCompra === 0) {
                            alert(
                                'No hay stock de ningún producto que compraste.'
                            );
                        } else {
                            const ticket = await fetch('/api/ticket', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    code: responseData.payload.code,
                                    amount: responseData.payload.amount,
                                    purchaser: mail,
                                }),
                            });

                            if (ticket.ok) {
                                const ticketData = await ticket.json();

                                alert(ticketData.message);
                                await fetch(`/api/carrito/${productos._id}`, {
                                    method: 'DELETE',
                                });
                                location.reload();
                            } else {
                                alert('Error al generar el ticket.');
                            }
                        }
                    } else {
                        alert('Error al realizar la compra.');
                    }
                } catch (error) {
                    console.error('Error al procesar la compra:', error);
                }
            });
    }


    loadProfile();
});