# Scribbly
#### Simple Usage  

 - Declare the HTML5 canvas element as:  
 `<canvas id="drawingBoard" width="700" height="400"></canvas>`
    
 - Import `scribbly.js` as `<script src="scribbly.js"></script>`  

 - Then initialize your script with the HTML5 canvas element:
    
        var scribble = new Scribbly({     
            canvas: 'drawingBoard',
        });  
 
#### Options  

   | Options | Default | Description |
   | :---: | :---: | :---: |
   | `canvas` | null | Identify your drawing board. **Required** |
   | `lineThickness` | 2 | Stroke width |
   | `lineColor` | #000000 | Stroke colour |
   | `toolbar` | true | Show/ Hide the toolbar |  
   
#### Functions  

   | Function | Description |
   | :---: | :---: |
   | `clear` | Clears the whole canvas |