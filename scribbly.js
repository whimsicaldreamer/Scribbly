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
        curTool;

    // Constructor
    function Scribbly(options) {

        // Default settings
        let defaults = {
            canvas: "",
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

        if(opts.toolbar) {
            buildToolbar();
            let clearBtn = document.getElementById("clearBtn");
            let eraseBtn = document.getElementById("eraseBtn");
            let markerBtn = document.getElementById("markerBtn");

            clearBtn.addEventListener("click", function () {
                toolSet("clear");
            }, false);
            eraseBtn.addEventListener("click", function () {
                toolSet("eraser");
            }, false);
            markerBtn.addEventListener("click", function () {
                toolSet("marker");
            }, false);
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

    // Clear the canvas
    Scribbly.prototype.clear = function() {
        ctx.clearRect(0, 0, board.width, board.height);
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

        toolbarWrapper.setAttribute("id", "toolbarWrapper");
        clearBtn.setAttribute("id", "clearBtn");
        eraseBtn.setAttribute("id", "eraseBtn");
        markerBtn.setAttribute("id", "markerBtn");

        clearBtn.setAttribute("class", "btn");
        eraseBtn.setAttribute("class", "btn");
        markerBtn.setAttribute("class", "btn");

        clearBtn.textContent = "Clear";
        eraseBtn.textContent = "Eraser";
        markerBtn.textContent = "Marker";

        toolbarWrapper.style.width = rect.width + "px";
        toolbarWrapper.style.left = rect.left + 'px';

        toolbarWrapper.appendChild(clearBtn);
        toolbarWrapper.appendChild(eraseBtn);
        toolbarWrapper.appendChild(markerBtn);
        document.body.appendChild(toolbarWrapper);
    };

    const toolSet = function(tool) {
        if(tool === "clear") {
            Scribbly.prototype.clear();
        }
        else if(tool === "eraser") {
            curTool = tool;
        }
        else if(tool === "marker") {
            curTool = tool;
        }
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

    //ToDo Decide whether to or not to expose this function
    const draw = function(x, y) {
        ctx.lineJoin = "round";
        ctx.lineWidth = opts.lineThickness;
        ctx.strokeStyle = opts.lineColor;

        if(curTool === "eraser") {
            ctx.strokeStyle = "#FFFFFF";
        }
        else if(curTool === "marker") {
            ctx.strokeStyle = opts.lineColor;
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