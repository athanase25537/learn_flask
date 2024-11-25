const inputs = document.querySelectorAll('div input')
inputs.forEach((input) => {
    input.addEventListener('focus', function () {
        this.nextElementSibling.classList.add('focus')
    })

    input.addEventListener('blur', function () {
        if(this.value == '') this.nextElementSibling.classList.remove('focus')
    })
})

const eye_show = document.getElementById('eye_show')
const eye_hide = document.getElementById('eye_hide')
const password = document.getElementById('password')
eye_hide.style.display = 'none'
eye_show.onclick = function () {
    this.style.display = 'none'
    eye_hide.style.display = 'block'
    password.setAttribute('type', 'text')
}

eye_hide.onclick = function () {
    this.style.display = 'none'
    eye_show.style.display = 'block'
    password.setAttribute('type', 'password')
}

const checkbox = document.getElementById('remember')
const username = document.getElementById('username')
const form = document.querySelector('form')
form.onsubmit = function (e) {
    e.preventDefault()

    cpt = 0
    formData = new FormData(this)
    if(formData.get('username') == '') {
        if(!username.classList.contains('error')) {
            username.classList.add('error')
        }
        cpt++
    } else {
        if(username.classList.contains('error')) {
            username.classList.remove('error')
        }
    }
    if(formData.get('password') == '') {
        if(!password.classList.contains('error')) {
            password.classList.add('error')
        }
        cpt++
    } else {
        if(password.classList.contains('error')) {
            password.classList.remove('error')
        }
    }

    console.log(cpt)

    if(cpt != 0) return

    fetch('/connect', {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if(data.status == 'success') {
            window.location.href = 'http://127.0.0.1:5000/'
        } else {
            if (!form.classList.contains('failed')) form.classList.add('failed')
        }
    })
    .catch(error => {
        console.log(error)
    })
}