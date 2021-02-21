
/*********************************************************************************/
/****************************** Spiral Designs v2 ********************************/
/*********************************************************************************/


/****************************** Main Application ********************************/
class SpiralDesign {
    constructor() {
        this.canvas = this.createCanvas();
        this.toolbarMenu = document.getElementById("toolbar-menu");

        this.offsetWidth = (this.canvas.width / 2);
        this.offsetHeight = this.canvas.height / 2;
        this.contex = this.canvas.getContext("2d");

        this.controller = new Controller;
        this.spiral = new Spiral(this.offsetWidth, this.offsetHeight);
        this.pen = new Pen();
    }

    /***************************** Create Canvas *****************************/
    createCanvas() {
        const div = document.getElementById("spiral-designs");
        const canvas = document.createElement("canvas");
        canvas.id = "spiral-design-canvas";
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        div.appendChild(canvas);

        return canvas
    }

    /***************************** Animation Loop *****************************/
    loop() {
        let frameCount = 0;
        const frameRateDivisor = 6; // Sets frame rate to 10fps.

        let animate = () => {
            frameCount++;
            requestAnimationFrame(animate);
            if((frameCount % frameRateDivisor) === 0) {
                this.clearCanvas();
                this.renderSpiral(frameCount / frameRateDivisor);
            }
        }
        animate();
    };

    /***************************** Render Spiral *****************************/
    renderSpiral(frameCount) {
        this.spiral.createCoordinates(frameCount);
        let l = this.spiral.coordinates.length;

        for(let i = 0; i < l; i++) {
            // Update controller
            this.controller.update();

            // Update pen
            this.pen.rgb = [this.controller.penRed, this.controller.penGreen, this.controller.penBlue];
            this.pen.size = [this.controller.penWidth, this.controller.penLength];
            this.toolbarMenu.style.color = `rgb(${this.controller.penRed}, ${this.controller.penGreen}, 
                ${this.controller.penBlue})`;

            // Update background colors
            this.canvas.style.backgroundColor = `rgb(${this.controller.bgRed}, ${this.controller.bgGreen}, 
                ${this.controller.bgBlue})`;
            this.toolbarMenu.style.backgroundColor = `rgb(${this.controller.bgRed}, ${this.controller.bgGreen}, 
                ${this.controller.bgBlue})`;

            // Update spiral
            this.spiral.width = this.controller.spiralWidth;
            this.spiral.length = this.controller.spiralLength;

            // Draw
            this.pen.position = this.spiral.coordinates[i];
            this.contex.fillStyle = this.pen.rgb;
            this.contex.fillRect(this.pen.x, this.pen.y, this.pen.width, this.pen.length);
        }
    }

    /***************************** Clear Canvas *****************************/
    clearCanvas() {
        this.contex.globalCompositeOperation = 'destination-out';
        this.contex.fillStyle = "rgb(0, 0, 0)";
        this.contex.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.contex.globalCompositeOperation = 'source-over';
    };
}


/****************************** Controller Class ********************************/
class Controller {
    constructor() {
        this.update();
    }

    /***************************** Update Controller *****************************/
    update() {
        this.penRed = document.getElementById("spiral-red").value;
        this.penGreen = document.getElementById("spiral-green").value;
        this.penBlue = document.getElementById("spiral-blue").value;

        this.penWidth = document.getElementById("point-width").value;
        this.penLength = document.getElementById("point-length").value;

        this.bgRed = document.getElementById("bg-red").value;
        this.bgGreen = document.getElementById("bg-green").value;
        this.bgBlue = document.getElementById("bg-blue").value;

        this.spiralWidth = document.getElementById("spiral-width").value;
        this.spiralLength = document.getElementById("spiral-length").value;
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
    constructor(offsetWidth, offsetHeight) {
        this.width = 1;
        this.length = 2;
        this.spacing = 6; // Interval of theta increments
        this.offsetWidth = offsetWidth;
        this.offsetHeight = offsetHeight;
        this.halfCircle = 180; // Degrees
    }

    /************************ Calculate Spiral Coordinates ************************/
    createCoordinates(frameCount) {
        this.coordinates = [];
        this.theta = 1; // Degrees

        // Populate array with cartesian coordinates
        while(this.theta < this.length) {
            // Convert theta from degrees to radians
            const thetaRadians = (this.theta * (Math.PI / this.halfCircle));

            const x = (this.width * thetaRadians) * (Math.cos(thetaRadians - frameCount)) + this.offsetWidth;
            const y = (this.width * thetaRadians) * (Math.sin(thetaRadians - frameCount)) + this.offsetHeight;

            const coordinates = [x.toFixed(4), y.toFixed(4)];
            this.coordinates.push(coordinates);

            this.theta += this.spacing;
        }
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


/******************************** Check Canvas Support *********************************/
const isCanvasSupport = () => document.createElement("canvas").getContext


/****************************** Event Listeners ********************************/
window.addEventListener("load", function () {
    if (isCanvasSupport()) {
        const spiral = new SpiralDesign();

        rAF();
        spiral.loop();
    } else {
        document.getElementById("spiral-designs").innerHTML = "Canvas not supported, this app requires it.";
    }
});