
/*********************************************************************************/
/****************************** Spiral Designs v1 ********************************/
/*********************************************************************************/
// Created by jodyanna
// GitHub: https://github.com/jodyanna


/****************************** Main Application ********************************/
class SpiralDesign {
    constructor() {
        this.ui = new UI();

        this.canvasWidth = this.ui.canvas.width;
        this.canvasHeight = this.ui.canvas.height;
        this.offset = this.canvasWidth / 2; // Offset for plotting points
        this.contex = this.ui.canvas.getContext("2d");

        this.controller = new Controller;
        this.spiral = new Spiral(this.offset);
        this.pen = new Pen();
    }

    /***************************** Animation Loop *****************************/
    loop = () => {
        let frameCount = 0;
        const speed = 6;

        let animate = () => {
            frameCount++;
            requestAnimationFrame(animate);
            if((frameCount % speed) === 0) {
                this.clearCanvas();
                this.renderSpiral(frameCount, speed);
            }
        }
        animate();
    };

    /***************************** Render Spiral *****************************/
    renderSpiral = (rotation, speed) => {
        this.spiral.createCoordinates(rotation, speed);
        let l = this.spiral.coordinates.length;

        for(let i = 0; i < l; i++) {
            // Update controller
            this.controller.update();

            // Update pen
            this.pen.rgb = [this.controller.penRed, this.controller.penGreen, this.controller.penBlue];
            this.pen.size = [this.controller.penWidth, this.controller.penLength];

            // Update background color
            this.ui.canvas.style.backgroundColor = `rgb(${this.controller.bgRed}, ${this.controller.bgGreen}, 
                                                                                            ${this.controller.bgBlue})`;

            // Update spiral
            this.spiral.width = this.controller.spiralWidth;
            this.spiral.length = this.controller.spiralLength;
            //this.spiral.spacing = this.controller.spacing;

            // Draw
            this.pen.position = this.spiral.coordinates[i];
            this.contex.fillStyle = this.pen.rgb;
            this.contex.fillRect(this.pen.x, this.pen.y, this.pen.width, this.pen.length);
        }
    }

    /***************************** Clear Canvas *****************************/
    clearCanvas = () => {
        this.contex.globalCompositeOperation = 'destination-out';
        this.contex.fillStyle = "rgb(0, 0, 0)";
        this.contex.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.contex.globalCompositeOperation = 'source-over';
    };
}


/****************************** Controller Class ********************************/
class Controller {
    constructor() {
        this.update();
    }

    /***************************** Update Controller *****************************/
    update = () => {
        // Input variables
        this.penRed = document.getElementById("pen-red").value;
        this.penGreen = document.getElementById("pen-green").value;
        this.penBlue = document.getElementById("pen-blue").value;

        this.penWidth = document.getElementById("pen-width").value;
        this.penLength = document.getElementById("pen-length").value;

        this.bgRed = document.getElementById("background-red").value;
        this.bgGreen = document.getElementById("background-green").value;
        this.bgBlue = document.getElementById("background-blue").value;

        this.spiralWidth = document.getElementById("spiral-width").value;
        this.spiralLength = document.getElementById("spiral-length").value;
        //this.spiralDensity = document.getElementById("spiral-density").value;
    }
}


/*********************************** Pen Class *************************************/
class Pen {
    constructor() {
        this.width = 2;
        this.length = 2;
        this.x = 0;
        this.y = 0;
        this.red = 0;
        this.green = 255;
        this.blue = 255;
    }

    // Getters
    get rgb() {
        return `rgb(${this.red}, ${this.green}, ${this.blue})`
    }

    // Setters
    set size(vals) {
        this.width = vals[0];
        this.length = vals[1];
    }
    set position(vals) {
        this.x = vals[0];
        this.y = vals[1];
    }
    set rgb(vals) {
        this.red = vals[0];
        this.green = vals[1];
        this.blue = vals[2];
    }
}


/********************************** Spiral Class ************************************/
class Spiral {
    constructor(offset) {
        this.width = 1;
        this.length = 2;
        this.spacing = 6; // Interval of theta increments
        this.offset = offset;
        this.coordinates = [];
        this.halfCircle = 180; // Degrees
    }

    /************************ Calculate Spiral Coordinates ************************/
    createCoordinates = (rotation, speed) => {
        // Init variables
        this.coordinates = [];
        this.theta = 1;

        // Populate array with cartesian coordinates
        while(this.theta < this.length) {
            // Convert theta from degrees to radians
            let thetaRadians = (this.theta * (Math.PI / this.halfCircle));

            let x = (this.width * thetaRadians) * (Math.cos(thetaRadians - (rotation / speed))) + this.offset;
            let y = (this.width * thetaRadians) * (Math.sin(thetaRadians - (rotation / speed))) + this.offset;

            let coordinates = [this.roundDecimal(x, 4), this.roundDecimal(y, 4)];
            this.coordinates.push(coordinates);

            this.theta += this.spacing;
        }
    }

    /***************************** Round Decimals *****************************/
    roundDecimal = (num, exp) => {
        let precision = Math.pow(10, exp);
        return Math.round((num + Number.EPSILON) * precision) / precision;
    }
}


/********************************** UI Class ************************************/
class UI {
    constructor() {
        this.mainContainer = document.getElementById("spiral-designs");
        this.canvas = this.renderCanvas();
        this.inputs = this.renderInputs();
        this.displayContainer = this.renderDisplay();
        this.editContainer = this.renderEdit();

        this.mainContainer.appendChild(this.displayContainer);
        this.mainContainer.appendChild(this.editContainer);
    }

    /***************************** Display *****************************/
    renderDisplay = () => {
        let displayContainer = document.createElement("div");
        let heading = this.renderText("Spiral Designs v1", "main-heading");

        displayContainer.id = "display";

        displayContainer.appendChild(heading);
        displayContainer.appendChild(this.canvas);

        return displayContainer
    }

    /***************************** Edit *****************************/
    renderEdit = () => {
        let editContainer = document.createElement("div");
        editContainer.id = "edit";

        editContainer.appendChild(this.inputs);

        return editContainer
    }

    /***************************** Span Text *****************************/
    renderText = (text, id, className) => {
        let span = document.createElement("span");
        span.id = id;
        span.className = className;
        span.innerHTML = text;

        return span
    }

    /***************************** Canvas *****************************/
    renderCanvas = () => {
        let canvas = document.createElement("canvas");
        canvas.id = "spiral-design-canvas";
        canvas.width = 400;
        canvas.height = 400;

        return canvas
    }

    /***************************** All Inputs *****************************/
    renderInputs = () => {
        let div = document.createElement("div");
        div.id = "inputs-container";

        let penColorInputs = this.renderPenColorInputs();
        let penSizeInputs = this.renderPenSizeInputs();
        let bgColorInputs = this.renderBGColorInputs();
        let spiralDesignInputs = this.renderSpiralDesignInputs();

        div.appendChild(penColorInputs);
        div.appendChild(penSizeInputs);
        div.appendChild(bgColorInputs);
        div.appendChild(spiralDesignInputs);

        return div
    }

    /***************************** Pen Colors *****************************/
    renderPenColorInputs = () => {
        let div = document.createElement("div");
        div.id = "pen-color-inputs";

        let heading = this.renderText("Pen Color", "pen-color-heading", "edit-heading");

        let red = this.renderRangeSlider("pen-red", 0, 255, 255);
        let green = this.renderRangeSlider("pen-green", 0, 255, 255);
        let blue = this.renderRangeSlider("pen-blue", 0, 255, 255);

        div.appendChild(heading);
        div.appendChild(red);
        div.appendChild(green);
        div.appendChild(blue);

        return div
    }

    /***************************** Pen Size *****************************/
    renderPenSizeInputs = () => {
        let div = document.createElement("div");
        div.id = "pen-size-inputs";

        let heading = this.renderText("Pen Size", "pen-size-heading", "edit-heading");

        let penWidth = this.renderRangeSlider("pen-width", 0, 50, 25);
        let penLength = this.renderRangeSlider("pen-length", 0, 50, 25);

        div.appendChild(heading);
        div.appendChild(penWidth);
        div.appendChild(penLength);

        return div
    }

    /***************************** Background Color *****************************/
    renderBGColorInputs = () => {
        let div = document.createElement("div");
        div.id = "background-color-inputs";

        let heading = this.renderText("Background Color", "background-color-heading", "edit-heading");

        let red = this.renderRangeSlider("background-red", 0, 255, 0);
        let green = this.renderRangeSlider("background-green", 0, 255, 0);
        let blue = this.renderRangeSlider("background-blue", 0, 255, 0);

        div.appendChild(heading);
        div.appendChild(red);
        div.appendChild(green);
        div.appendChild(blue);

        return div
    }

    /***************************** Spiral Parameters *****************************/
    renderSpiralDesignInputs = () => {
        let div = document.createElement("div");
        div.id = "spiral-design-inputs";

        let heading = this.renderText("Spiral", "spiral-heading", "edit-heading");

        let spiralWidth = this.renderRangeSlider("spiral-width", 1, 50, 10);
        let spiralLength = this.renderRangeSlider("spiral-length", 2, 3600, 1800);
        //let spiralDensity = this.renderRangeSlider("spiral-density", 1, 20, 5);

        div.appendChild(heading);
        div.appendChild(spiralWidth);
        div.appendChild(spiralLength);
        //div.appendChild(spiralDensity);

        return div
    }

    /***************************** Range Slider Input *****************************/
    renderRangeSlider = (name, minValue, maxValue, defaultValue) => {
        let div = document.createElement("div");
        div.className = "slider-container";

        let label = document.createElement("label");
        label.for = name;
        label.innerHTML = this.formatLabelName(name);

        let slider = document.createElement("input");
        slider.type = "range";
        slider.id = name;
        slider.className = "slider";
        slider.name = name;
        slider.min = minValue;
        slider.max = maxValue;
        slider.value = defaultValue;

        div.appendChild(label);
        div.appendChild(slider);

        return div
    }

    /***************************** Format Label Text *****************************/
    formatLabelName = (name) => {
        let strings = name.split("-");

        return strings[1].charAt(0).toUpperCase() + strings[1].slice(1) + " "
    }
}


/******************************** requestAnimationFrame Setup *********************************/
// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
const rAF = () => {
    let lastTime = 0;
    const vendors = ['ms', 'moz', 'webkit', 'o'];

    for (let x = 0; x < vendors.length && !window.requestAnimationFrame; x++) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
            || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback, element) {
            let currTime = new Date().getTime();
            let timeToCall = Math.max(0, 16 - (currTime - lastTime));
            let id = window.setTimeout(function() { callback(currTime + timeToCall); }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
};


/****************************** Event Listeners ********************************/
window.addEventListener("load", function () {
    let spiral = new SpiralDesign();

    rAF();
    spiral.loop();
});