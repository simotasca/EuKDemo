function resetTextAreaHeight(textArea) {
  textArea.style.height = `0px`;
  textArea.style.height = `calc(${textArea.scrollHeight}px + 0.5rem)`;
}

/* 
 * TODO: Il problema potrebbe essere che,
 * se l'utente ridimensiona manualmente la textarea,
 * potrebbe dargli fastidio il ridimensionamento automatico.
 */
function initTextArea(className) {
  let tas = document.querySelectorAll(`.${className}`);

  Array.from(tas).forEach(ta => {
    resetTextAreaHeight(ta)
    ta.addEventListener("input", () => resetTextAreaHeight(ta))
  });
}