const menu_open = document.getElementById('menu_open')
const menu_close = document.getElementById('menu_close')
const nav = document.querySelector('nav')
menu_close.style.display = 'none'
menu_open.onclick = function () {
    this.style.display = 'none'
    menu_close.style.display = 'block'
    nav.classList.add('show')
}

menu_close.onclick = function () {
    this.style.display = 'none'
    menu_open.style.display = 'block'
    nav.classList.remove('show')
}