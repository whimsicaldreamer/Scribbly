/*!
* Scribbly.js
* @author  Ayan_Dey
* @version 0.0.1
*/

(function (root, factory) {
    if ( typeof define === "function" && define.amd ) {
        define([], factory(root));
    } else if ( typeof exports === "object" ) {
        module.exports = factory(root);
    } else {
        root.Scribbly = factory(root);
    }
})(typeof global !== "undefined" ? global : this.window || this.global, function (root) {

    "use strict";

    /**
     * Variables
     */
    let board,
        ctx,
        opts,
        isDrawing = false,
        isDragging = false,
        startX,
        startY,
        curTool,
        curStrokeSize,
        curStrokeColor;

    // Constructor
    function Scribbly(options) {

        // Default settings
        let defaults = {
            canvas: "",
            canvasBg: "#FFFFFF",
            lineThickness: 2,
            lineColor: "#000000",
            toolbar: true
        };

        // extend config
        opts = extend(defaults, options || {} );

        // initialize plugin
        this.init();
    }


    /**
     *  Public Methods
     */

    Scribbly.prototype.init = function () {
        // Get the canvas ready to draw
        board = document.getElementById(opts.canvas);
        ctx = board.getContext("2d");

        // Set background colour of canvas
        board.style.backgroundColor = opts.canvasBg;

        // Default stroke size
        curStrokeSize = opts.lineThickness;

        // Default brush color
        curStrokeColor = opts.lineColor;

        if(opts.toolbar) {
            buildToolbar();

            let clearBtn = document.getElementById("clearBtn");
            let eraseBtn = document.getElementById("eraseBtn");
            let markerBtn = document.getElementById("markerBtn");
            let strokeSizeSlider = document.getElementById("strokeSizeSlider");
            let colorPalette = document.getElementById("colorPalette");
            let saveBtn = document.getElementById("saveBtn");

            clearBtn.addEventListener("click", function () {
                Scribbly.prototype.setTool("clear");
            }, false);
            eraseBtn.addEventListener("click", function () {
                Scribbly.prototype.setTool("eraser", curStrokeSize);
            }, false);
            markerBtn.addEventListener("click", function () {
                Scribbly.prototype.setTool("marker", curStrokeSize, curStrokeColor);
            }, false);
            strokeSizeSlider.addEventListener("input", function () {
                curStrokeSize = this.value;
            }, false);
            colorPalette.addEventListener("input", function () {
                curStrokeColor = this.value;
            }, false);
            saveBtn.addEventListener("click", function () {
                Scribbly.prototype.save();
            })

        }

        // Add mouse event listeners to canvas element
        board.addEventListener("mousedown", press, false);
        board.addEventListener("mousemove", drag, false);
        board.addEventListener("mouseup", release);
        board.addEventListener("mouseout", cancel, false);

        // Add touch event listeners to canvas element
        board.addEventListener("touchstart", press, false);
        board.addEventListener("touchmove", drag, false);
        board.addEventListener("touchend", release, false);
        board.addEventListener("touchcancel", cancel, false);
    };

    // Set a specific tool to use on canvas
    Scribbly.prototype.setTool = function(tool, size, color) {
        if(tool === "clear") {
            Scribbly.prototype.clear();
        }
        else if(tool === "eraser") {
            curTool = tool;
            curStrokeSize = size;
        }
        else if(tool === "marker") {
            curTool = tool;
            curStrokeSize = size;
            curStrokeColor = color;
        }
    };

    // Clear the canvas
    Scribbly.prototype.clear = function() {
        ctx.clearRect(0, 0, board.width, board.height);
        curTool = "marker";
    };

    /**
     * Save the image
     * Currently save the image by downloading it
     * ToDo Decide whether this function should be a part of setTool method
     */
    Scribbly.prototype.save = function (filename) {
        if(!filename) {
            filename = "My Scribble";
        }

        //get the current ImageData for the canvas.
        let data = ctx.getImageData(0, 0, board.width, board.height);

        //store the current globalCompositeOperation
        let compositeOperation = ctx.globalCompositeOperation;

        //set to draw behind current content
        ctx.globalCompositeOperation = "destination-over";

        //set background color
        ctx.fillStyle = opts.canvasBg;

        //draw background / rect on entire canvas
        ctx.fillRect(0, 0, board.width, board.height);

        //get the image data from the canvas
        let imageData = board.toDataURL("image/png");

        //clear the canvas
        ctx.clearRect (0, 0, board.width, board.height);

        //restore it with original / cached ImageData
        ctx.putImageData(data, 0,0);

        //reset the globalCompositeOperation to what it was
        ctx.globalCompositeOperation = compositeOperation;

        let image = new Image();
        image.src = imageData;

        let link = document.createElement('a');
        link.setAttribute("href", image.src);
        link.setAttribute("download", filename+".png");

        link.style.display = "none";
        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);
    };


    /**
     *  Private Methods
     */

    /**
     * Merge two or more objects. Returns a new object.
     */
    const extend = function () {

        // Variables
        let extended = {};
        let deep = false;
        let i = 0;
        let length = arguments.length;

        // Check if a deep merge
        if ( Object.prototype.toString.call( arguments[0] ) === "[object Boolean]" ) {
            deep = arguments[0];
            i++;
        }

        // Merge the object into the extended object
        let merge = function (obj) {
            for ( let prop in obj ) {
                if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
                    // If deep merge and property is an object, merge properties
                    if ( deep && Object.prototype.toString.call(obj[prop]) === "[object Object]" ) {
                        extended[prop] = extend( true, extended[prop], obj[prop] );
                    } else {
                        extended[prop] = obj[prop];
                    }
                }
            }
        };

        // Loop through each object and conduct a merge
        for ( ; i < length; i++ ) {
            let obj = arguments[i];
            merge(obj);
        }

        return extended;

    };

    const buildToolbar = function () {
        let rect = board.getBoundingClientRect();
        let toolbarWrapper = document.createElement("div");
        let clearBtn = document.createElement("div");
        let eraseBtn = document.createElement("div");
        let markerBtn = document.createElement("div");
        let strokeSizeSlider = document.createElement("input");
        let colorPalette = document.createElement("input");
        let saveBtn = document.createElement("div");

        toolbarWrapper.setAttribute("id", "toolbarWrapper");
        clearBtn.setAttribute("id", "clearBtn");
        eraseBtn.setAttribute("id", "eraseBtn");
        markerBtn.setAttribute("id", "markerBtn");
        strokeSizeSlider.setAttribute("id", "strokeSizeSlider");
        colorPalette.setAttribute("id", "colorPalette");
        saveBtn.setAttribute("id", "saveBtn");

        colorPalette.setAttribute("type", "color");
        colorPalette.setAttribute("value", opts.lineColor);

        strokeSizeSlider.setAttribute("type", "range");
        strokeSizeSlider.setAttribute("min", "1");
        strokeSizeSlider.setAttribute("max", "50");
        strokeSizeSlider.setAttribute("value", opts.lineThickness);

        clearBtn.setAttribute("class", "btn");
        eraseBtn.setAttribute("class", "btn");
        markerBtn.setAttribute("class", "btn");
        saveBtn.setAttribute("class", "btn");

        clearBtn.textContent = "Clear";
        eraseBtn.textContent = "Eraser";
        markerBtn.textContent = "Marker";
        saveBtn.textContent = "Save";

        toolbarWrapper.style.width = rect.width + "px";
        toolbarWrapper.style.left = rect.left + 'px';

        toolbarWrapper.appendChild(clearBtn);
        toolbarWrapper.appendChild(eraseBtn);
        toolbarWrapper.appendChild(markerBtn);
        toolbarWrapper.appendChild(strokeSizeSlider);
        toolbarWrapper.appendChild(colorPalette);
        toolbarWrapper.appendChild(saveBtn);
        document.body.appendChild(toolbarWrapper);
    };

    // Get the coordinates of the mouse click
    const getMousePos = function(evt) {
        let rect = board.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    };

    // Get the coordinates of the tap
    const getTouchPos = function(evt) {
        let rect = board.getBoundingClientRect();
        return {
            x: evt.touches[0].clientX - rect.left,
            y: evt.touches[0].clientY - rect.top
        };
    };

    // Mouse press/ touchstart event
    const press = function(e) {
        let pos;
        isDrawing = true;

        if(e.type === "touchstart") {
            pos = getTouchPos(e);
        }
        else {
            pos = getMousePos(e);
        }

        startX = pos.x;
        startY = pos.y;

        draw(startX, startY);
    };

    // Mouse/ touch drag event
    const drag = function(e) {
        if(isDrawing) {
            let pos;
            isDragging = true;

            if(e.type === "touchmove") {
                pos = getTouchPos(e);
            }
            else {
                pos = getMousePos(e);
            }

            draw(pos.x, pos.y);
        }
    };

    // Mouse release/ touchend event
    const release = function(e) {
        isDrawing = false;
        isDragging = false;

        startX = null;
        startY = null;
    };

    // When mouse or touch goes out of the canvas
    const cancel = function(e) {
        isDrawing = false;
        isDragging = false;
    };

    const draw = function(x, y) {
        ctx.lineJoin = "round";
        ctx.lineWidth = curStrokeSize;
        ctx.strokeStyle = curStrokeColor;

        if(curTool === "eraser") {
            ctx.strokeStyle = opts.canvasBg;
        }
        else if(curTool === "marker") {
            ctx.strokeStyle = curStrokeColor;
        }

        ctx.beginPath();

        if(isDragging) {
            ctx.moveTo(startX, startY);
            startX = x;
            startY = y;
        }
        else {
            ctx.moveTo(x, y);
        }
        ctx.lineTo(x, y);
        ctx.closePath();
        ctx.stroke();
    };


    /**
     * Public APIs
     */

    return Scribbly;

});