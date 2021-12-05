let prevScrollpos = 0;

window.addEventListener("scroll", () => {
  // hide on scrolldown & show on srollup
  let currentScrollPos = window.pageYOffset;
  let nav = document.getElementById("main-top-nav");

  if (prevScrollpos > currentScrollPos)
    nav.classList.remove("nav-closed");
  else nav.classList.add("nav-closed");

  prevScrollpos = currentScrollPos;
});