/*!
* Scribbly.js
* @author  Ayan_Dey
* @version 0.0.1
*/

(function (root, factory) {
    if ( typeof define === 'function' && define.amd ) {
        define([], factory(root));
    } else if ( typeof exports === 'object' ) {
        module.exports = factory(root);
    } else {
        root.Scribbly = factory(root);
    }
})(typeof global !== 'undefined' ? global : this.window || this.global, function (root) {

    'use strict';

    /**
     * Variables
     */
    let board,
        ctx,
        opts,
        isDrawing = false,
        isDragging = false,
        startX,
        startY;

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
            let clearBtn = document.getElementById('clearBtn');
            let eraseBtn = document.getElementById('eraseBtn');

            clearBtn.addEventListener('click', this.clear, false);
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

        // letiables
        let extended = {};
        let deep = false;
        let i = 0;
        let length = arguments.length;

        // Check if a deep merge
        if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
            deep = arguments[0];
            i++;
        }

        // Merge the object into the extended object
        let merge = function (obj) {
            for ( let prop in obj ) {
                if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
                    // If deep merge and property is an object, merge properties
                    if ( deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
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
        let toolbarWrapper = document.createElement('div');
        let clearBtn = document.createElement('div');
        clearBtn.setAttribute('id', 'clearBtn');
        let eraseBtn = document.createElement('div');
        eraseBtn.setAttribute('id', 'eraseBtn');

        clearBtn.textContent = "Clear";
        eraseBtn.textContent = "Eraser (coming soon)";

        toolbarWrapper.style.width = rect.width + 'px';
        toolbarWrapper.style.height = "30px";
        toolbarWrapper.style.position = "relative";
        toolbarWrapper.style.left = rect.left + 'px';
        toolbarWrapper.style.backgroundColor = "yellow";
        toolbarWrapper.style.display = 'flex';
        toolbarWrapper.style.flexDirection = 'row';

        clearBtn.style.minWidth = "50px";
        eraseBtn.style.minWidth = "50px";

        clearBtn.style.backgroundColor = "#ffffff";
        eraseBtn.style.backgroundColor = "#ffffff";

        clearBtn.style.marginLeft = "10px";
        eraseBtn.style.marginLeft = "10px";

        clearBtn.style.textAlign = "center";
        eraseBtn.style.textAlign = "center";

        clearBtn.style.lineHeight = "30px";
        eraseBtn.style.lineHeight = "30px";

        clearBtn.style.cursor = "pointer";
        eraseBtn.style.cursor = "pointer";

        toolbarWrapper.appendChild(clearBtn);
        toolbarWrapper.appendChild(eraseBtn);
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
        isDrawing = true;

        if(e.type === 'touchstart') {
            startX = getTouchPos(e).x;
            startY = getTouchPos(e).y;
        }
        else {
            startX = getMousePos(e).x;
            startY = getMousePos(e).y;
        }

        draw(startX, startY);
    };

    // Mouse/ touch drag event
    const drag = function(e) {
        if(isDrawing) {
            isDragging = true;

            if(e.type === 'touchmove') {
                draw(getTouchPos(e).x, getTouchPos(e).y);
            }
            else {
                draw(getMousePos(e).x, getMousePos(e).y);
            }
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
        ctx.lineWidth = opts.lineThickness;
        ctx.strokeStyle = opts.lineColor;

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