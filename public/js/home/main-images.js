function outerWordRight() {
	var words = document.getElementById("title").getElementsByTagName("*");
	var outer = 0;
	for (i = 0; i < words.length; ++i) {
		var spanR = words[i].getBoundingClientRect().right;
		if (outer < spanR) outer = spanR;
	}
	return outer;
}

function placeLogo() {
	let img = document.getElementById("main-image");
	let logo = document.getElementById("main-logo");
	let zero = document.getElementById("main-r-col").getBoundingClientRect();

	logo.style.width =
		img.getBoundingClientRect().x -
		outerWordRight() +
		img.clientWidth * 0.25 +
		"px";

	logo.style.maxWidth = img.clientWidth * 0.4 + "px";

	let xmin = outerWordRight() - zero.left;
	let xMax =
		img.getBoundingClientRect().x +
		img.clientWidth * 0.25 -
		logo.clientWidth -
		zero.left;
	let x = xmin + (xMax - xmin) / 2;
	let y =
		img.getBoundingClientRect().top +
		img.clientHeight * 0.25 -
		logo.clientHeight -
		zero.top;

	if (y < img.getBoundingClientRect().top - zero.top)
		y = img.getBoundingClientRect().top - zero.top;

	logo.style.transform = `translate(${x}px, ${y}px) scale(1)`;
  logo.style.visibility = 'visible';
}

function placeMainImage() {
	var col = document.getElementById("main-r-col");
	var img = document.getElementById("main-image");

	if (col.clientWidth < img.clientWidth) {
		img.style.transform = "scaleX(-1) translate(0%, 50%)";
		img.style.left = 0;
	} else {
		img.style.transform = "scaleX(-1) translate(50%, 50%)";
		img.style.left = "50%";
	}

  img.style.visibility = 'visible';
  // document.getElementById("loader").style.display = "none";
}

const placeImages = () => {
	placeMainImage();
	placeLogo();
};

window.addEventListener("load", placeImages);
window.addEventListener("resize", placeImages);
