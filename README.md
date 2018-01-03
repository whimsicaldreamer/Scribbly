# Scribbly
#### Simple Usage  

 - Declare the HTML5 canvas element as:  
 `<canvas id="drawingBoard" width="700" height="400"></canvas>`
    
 - Import `scribbly.js` as `<script src="scribbly.js"></script>`  
 
 - Import `scribbly.css` as `<link rel="stylesheet" href="scribbly.css">` if `toolbar` is not set to `false`

 - Then initialize your script with the HTML5 canvas element:
    
        var scribble = new Scribbly({     
            canvas: 'drawingBoard',
        });  
 
#### Options  

   | Options | Default | Description |
   | :---: | :---: | :---: |
   | `canvas` | null | Identify your drawing board. **Required** |
   | `canvasBg` | #FFFFFF | Background colour for the drawing canvas |
   | `lineThickness` | 2 | Stroke width |
   | `lineColor` | #000000 | Stroke colour |
   | `toolbar` | true | Show/ Hide the toolbar |  
   
#### Functions  

   | Function | Description |
   | :---: | :---: |
   | `clear()` | Clears the whole canvas |
   | `save(filename)` | Saves the canvas and downloads the image. <br> Parameter `filename` is optional |
   | `setTool(tool, size)` | **Tools available are :** `clear`, `eraser`, `marker`, `brushSize`.<br>Parameter `size` sets the stroke size  | 