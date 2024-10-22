
window.addEventListener('load', async () => {
    const formProducto = document.querySelector('form');
    const userResponse = await fetch('/api/usuarios/current');
    const usuarioJson = await userResponse.json();
    const usuario = usuarioJson.payload;
    if (usuario['rol'] === 'premium') {
        document.getElementById('form-container').style.display = 'block';
    }

    document
        .getElementById('agregar-producto')
        .addEventListener('click', async (event) => {
            event.preventDefault();

            const title = formProducto.title.value;
            const description = formProducto.description.value;
            const price = parseInt(formProducto.price.value);
            const thumbnail = formProducto.thumbnail.value;
            const code = formProducto.code.value;
            const stock = parseInt(formProducto.stock.value);
            const category = formProducto.category.value;
            const statusCheckbox = document.getElementById('status');
            const status = statusCheckbox.checked;
            const owner = usuario['email'];

            const queryString = new URLSearchParams({
                title,
                description,
                price,
                thumbnail,
                code,
                stock,
                category,
                status,
                owner,
            });

            const response = await fetch('/api/productos/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: queryString,
            });
         
            if (response.status === 200) {
                alert('Producto agregado a la base de datos');
                location.reload();
            }
            else {
                const errorData = await response.json();
                alert(errorData.error)
            }
        });
});