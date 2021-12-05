let container = document.getElementById("wrapper");
let content = document.getElementById('children');

function scaleProportionally() {
    let scale;
    let minScale = .7;

    function evt() {
        scale = 1;

        // if (container.clientWidth < content.clientWidth)
        scale = container.clientWidth / content.clientWidth;

        if (scale < minScale) scale = minScale;

        content.style.transform = "translate(-50%, -50%) scale(" + scale + ")";
        container.style.height = (content.clientHeight * scale) + "px";
    };

    window.addEventListener('load', evt);
    window.addEventListener('resize', evt);
}

function manageTouchRotation() {
    // variabili
    let tStart = null;

    let rotation = 0;
    let rotationMax = 150;
    let rotationFactor = .2;

    let timeout = null;
    let timeoutMs = 3000;

    const moveState = { ABORTED: 0, WAITING: 1, APPROVED: 2 }
    let movement = moveState.WAITING;

    // eventi
    container.ontouchstart = (event) => {
        timeout && clearTimeout(timeout);
        container.style.transition = "transform 0s";

        tStart = {
            x: event.touches[0].clientX,
            y: event.touches[0].clientY
        };
    };

    container.ontouchmove = (event) => {
        let delta = { x: event.touches[0].clientX - tStart.x, y: event.touches[0].clientY - tStart.y };

        tStart = { x: event.touches[0].clientX, y: event.touches[0].clientY };

        if (movement == moveState.WAITING) {
            movement = Math.abs(delta.y) >= Math.abs(delta.x) ?
                moveState.ABORTED :
                moveState.APPROVED;
        }

        if (movement == moveState.APPROVED) {
            event.preventDefault();

            rotation += delta.x;

            if (rotation > rotationMax) {
                rotation = rotationMax;
            } else if (rotation < -rotationMax) {
                rotation = -rotationMax;
            }

            container.style.transformOrigin = "center 130%"
            container.style.transform = `rotateZ(${rotation * rotationFactor}deg)`;
        }

    };

    window.addEventListener("touchend", () => {
        movement = moveState.WAITING;

        container.style.transition = `transform 0.4s ${timeoutMs}ms ease-in-out`;
        container.style.transform = `rotateZ(0deg)`;

        timeout = setTimeout(() => {
            rotation = 0;
        }, timeoutMs);
    })
}

scaleProportionally();
manageTouchRotation();