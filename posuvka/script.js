
const defaultClosedX = -0.075;
const defaultOpenedX = 0.6;
const parts = [
    {src: 'img/telo.png', x: 0.03, y: 0.05, width: null, height: null, isDraggable: false, data: null},
    {
        src: 'img/horni-rameno.png',
        defaultX: defaultClosedX,
        maxX: defaultOpenedX,
        x: defaultClosedX,
        y: 0.049,
        width: null,
        height: null,
        isDraggable: true,
        data: null
    },
    {
        src: 'img/spodni-rameno.png',
        defaultX: defaultClosedX,
        maxX: defaultOpenedX,
        x: defaultClosedX,
        y: 0.05,
        width: null,
        height: null,
        isDraggable: true,
        data: null
    }
];

const unitMap = {
    "0.05": 0.000211,
    "0.1": 0.000422,
    "0.5": 0.00211,
    mm: 0.00422,
    cm: 0.0422
}

const canvas = document.getElementById('clipper');
const btnUp = document.getElementById('increaseBtn');
const btnDown = document.getElementById('decreaseBtn');
const unitSelectorElm = document.getElementById("unit");
const displayElm = document.getElementById("display");

const margin = {top: 0, length: 0};

function init() {
    resizeCanvas(canvas, parts);
}

function loadImage(canvas, image) {
    const img = new Image();
    img.src = image.src;
    image.data = img;

    img.onload = function () {
        const aspectRatio = img.naturalHeight / img.naturalWidth;
        image.height = image.width * aspectRatio;
        drawImage(image);
    };
}

function drawImage(image) {
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image.data, image.x * canvas.width, image.y * canvas.height, image.width, image.height);
}

function clearCanvas() {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function resizeCanvas(canvas, parts) {
    const dpr = window.devicePixelRatio || 1; 
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width;
    canvas.style.height = height;

    clearCanvas(canvas);
    for (const part of parts) {
        part.width = canvas.width;
        loadImage(canvas, part);
    }
}

function updateDisplay(elm, value) {

    if (!elm) return; 
    // Hodnota v pixelech + korekce posunu od nuly
    value += Math.abs(defaultClosedX);
    // Vypočteme hodnotu v milimetrech pomocí základní hodnoty 1mm
    const valueInMm = value / unitMap["mm"];
    // Zaokrouhlíme na 2 desetinná místa a zobrazíme v mm
    elm.textContent = `${valueInMm.toFixed(1)} mm`;
}

let isDragging = false;
let startX = 0;
let xPosition = defaultClosedX;
let closed = true;
let maxOpened = false;
let selectedUnit = "mm";

// Function to handle dragging
function handleDrag(event) {
    const ctx = canvas.getContext('2d');
    closed = false;
    maxOpened = false;

    const offsetX = event.offsetX !== undefined ? event.offsetX : event.touches[0].clientX - canvas.getBoundingClientRect().left;

    if (isDragging) {
        xPosition = (offsetX - startX) / canvas.width;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (const part of parts) {
            if (!part.isDraggable) {
                drawImage(part);
                continue;
            }

            if (xPosition <= part.defaultX) {
                part.x = part.defaultX;
                xPosition = part.x;
                closed = true;
            } else if (xPosition >= part.maxX) {
                part.x = part.maxX;
                xPosition = part.x;
                maxOpened = true;
            } else {
                part.x = xPosition;
            }

            drawImage(part);
            updateDisplay(displayElm, part.x);
        }
    }
}

// Mouse events
canvas.addEventListener('mousedown', (event) => {
    startX = event.offsetX - parts[1].x * canvas.width;
    isDragging = true;
});

canvas.addEventListener('mousemove', handleDrag);

canvas.addEventListener('mouseup', () => {
    isDragging = false;
    for (const part of parts) {
        drawImage(part);
    }
});

canvas.addEventListener('mouseout', () => {
    isDragging = false;
});

// Touch events
canvas.addEventListener('touchstart', (event) => {
    startX = event.touches[0].clientX - parts[1].x * canvas.width;
    isDragging = true;
    event.preventDefault(); // Prevent scrolling
});

canvas.addEventListener('touchmove', (event) => {
    handleDrag(event);
    event.preventDefault(); // Prevent scrolling
});

canvas.addEventListener('touchend', () => {
    isDragging = false;
    for (const part of parts) {
        drawImage(part);
    }
});

btnDown.addEventListener('click', () => {
    maxOpened = false;
    if (closed) {
        return;
    }

    xPosition -= unitMap[selectedUnit];

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const part of parts) {
        if (!part.isDraggable) {
            drawImage(part);
            continue;
        }
        part.x = xPosition;

        if (part.x <= -0.075) {
            part.x = part.defaultX;
            closed = true;
        }
        drawImage(part);
        updateDisplay(displayElm, part.x);
    }
});

btnUp.addEventListener('click', () => {
    closed = false;
    if (maxOpened) {
        return;
    }
    xPosition += unitMap[selectedUnit];
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const part of parts) {
        if (!part.isDraggable) {
            drawImage(part);
            continue;
        }
        part.x = xPosition;

        if (part.x >= part.maxX) {
            part.x = part.maxX;
            maxOpened = true;
        }
        drawImage(part);
        updateDisplay(displayElm, part.x);
    }
});

unitSelectorElm.addEventListener("change", (event) => {
    selectedUnit = event.target.value;
});


export function checkSliderPosition(expectedValue) {
    // Spočítaná reálná hodnota v mm nezávisle na vybraném kroku
    let currentValue = parts[1].x + Math.abs(defaultClosedX);
    const valueInMm = currentValue / unitMap["mm"]; // vždy se použije mm jako základ

    // Tolerance pro srovnání (0.1 mm je při nastavování)
    const tolerance = 0.8;
    return Math.abs(valueInMm - expectedValue) <= tolerance;
}



init();
window.addEventListener("resize", () => resizeCanvas(canvas, parts));