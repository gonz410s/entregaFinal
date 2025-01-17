
const formResetPwd = document.querySelector('form')

formResetPwd?.addEventListener('submit', async event => {
  event.preventDefault()

  const response = await fetch('/api/usuarios/recuperarPassword', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    // @ts-ignore
    body: new URLSearchParams(new FormData(formResetPwd))
  })

  if (response.status === 200) {
    alert('Email de recuperacion enviado')
    window.location.href = '/login'
  } else {
    const error = await response.json()
    alert('no existe usuario con ese mail')
  }
})