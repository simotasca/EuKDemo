var offcanvas = document.getElementById('offcanvas');
const togglers = document.getElementsByClassName('offcanvasToggler');

function toggleOffcanvas() {
  offcanvas.classList.toggle('open');
}

for (let i = 0; i < togglers.length; i++) {
  togglers[i].addEventListener('click', function () {
    toggleOffcanvas();
  });
}