import { render, navigateToSet } from "/js/components/navigation/index.js"

//export from module to window
[navigateToSet, toggleThemes].forEach(func => {
    window[func.name] = func;
})

window.onpopstate = function () {
    render();
};


function toggleThemes(el) {
    const body = document.body
    if (el.classList.contains('green')) {

        el.classList.remove('green');
        el.classList.add('orange');
        if (body.classList.contains(el.dataset.on)) {
            body.classList.remove(el.dataset.on);
        }
        body.classList.add(el.dataset.off);

    } else if (el.classList.contains('orange')) {
        el.classList.remove('orange');
        el.classList.add('green')
        if (body.classList.contains(el.dataset.off)) {
            body.classList.remove(el.dataset.off);
        }
        body.classList.add(el.dataset.on);
    }
}
// end toggle theme
const toggleMenuInput = document.getElementById('toggle-menu');
const menuLinks = document.querySelectorAll('.header-link');
// (function hideMenu(){
menuLinks.forEach((el) => el.addEventListener('click', function () {
    toggleMenuInput.checked = false;
}));


