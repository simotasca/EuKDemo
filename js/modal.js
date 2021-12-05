let modals = document.querySelectorAll(".rav-modal");
let overlay = document.querySelector("#modal-overlay");

function closeAllModals() {
  for (let modal of modals) {
    console.log(modal)
    modal.classList.remove("rav-modal--open");
  }
  overlay.classList.remove("modal-overlay--open")
  document.querySelector("html").style.overflow = "auto";
}

function openModal(id) {
  let target = document.querySelector("#" + id);
  if (!target) return;
  target.classList.add("rav-modal--open");
  overlay.classList.add("modal-overlay--open");

  document.querySelector("html").style.overflow = "hidden";
}

overlay.onclick = closeAllModals;

for (let i = 0; i < modals.length; i++) {
  let modal = modals[i];
  modal.querySelector(".rav-modal__toggler").onclick = closeAllModals;
}

for (let button of document.querySelectorAll(".ventaglio-item")) {
  button.onclick = () => {
    openModal(button.dataset.target);
  }
}