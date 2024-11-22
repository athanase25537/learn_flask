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