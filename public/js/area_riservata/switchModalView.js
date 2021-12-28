function switchModalView(elem) {
  Array.from(document.getElementsByClassName("modal__tab-toggler")).forEach(tab => {
    tab.classList.remove("modal__tab-toggler--selected");
  });
  elem.classList.add("modal__tab-toggler--selected")

  Array.from(document.getElementsByClassName("modal__inner")).forEach(tab => {
    tab.classList.add("d-none");
  });
  document.getElementById(elem.dataset.target).classList.remove("d-none");
}