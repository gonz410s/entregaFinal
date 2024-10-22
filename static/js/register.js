
const formRegister = document.querySelector('form');

formRegister?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const response = await fetch('/api/usuarios', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        // @ts-ignore
        body: new URLSearchParams(new FormData(formRegister)),
        /*Especifica el tipo de contenido que se está enviando, que en este caso es application/x-www-form-urlencoded.
              Esto es comúnmente utilizado para enviar datos de formulario.
              body: new URLSearchParams(new FormData(formRegister)): Construye el cuerpo de la solicitud utilizando 
              los datos del formulario. FormData se utiliza para recopilar todos los campos del formulario, 
              y URLSearchParams convierte esos datos en una cadena con formato application/x-www-form-urlencoded. */
    });

    if (response.status === 201) {
        window.location.href = '/profile';
    } else {
        const error = await response.json();
        alert(error.message);
    }
});