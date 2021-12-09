function setToggle() {
	Array.from(document.querySelectorAll(".toggle")).forEach(tog => {
		tog.onclick = () => document.getElementById(tog.dataset.target).classList.toggle("d-none");
	});
}