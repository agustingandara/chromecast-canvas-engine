Receiver
Receiver APP is the app that will run on all devices. This is controlled by the Sender APP in the Chromecast case.

Receiver Imports


&lt;script src="//www.gstatic.com/cast/sdk/libs/receiver/2.0.0/cast\_receiver.js"&gt;



&lt;/script&gt;


> 

&lt;script type="text/javascript" src="../engine/engine-base.js"&gt;



&lt;/script&gt;


> > 

&lt;script type="text/javascript" src="../engine/engine-receiver.js"&gt;



&lt;/script&gt;



Receiver Configuration
Enable input for different devices

Example:

> 

&lt;script&gt;


> > WEB\_CHROME\_CAST = true;	//for Cromecast enable (sender)
> > WEB\_CHROME\_PC = true;	//for pc input enable


&lt;/script&gt;



Receiver Initialize
It’s simple, you have to initialize into window onload event. loadEngine(CANVAS\_HTML\_TAG\_ID) function initialize the receiver with the necessary functionality for the different devices, if you use loadEngineDefault() you have to use 'canvas-chromecast' ID for the canvas HTML5 tag.

loadEngine('CANVAS\_ID');
loadEngineDefault(); 	//Canvas ID default 'canvas-chromecast'

In addition, you have to load all the resources (from resources folder) before the app logic, so you can loadImage(RES\_NAME) or loadJSON(RES\_NAME). It’s easy RES\_NAME must be only the name of the file, without the extension.

var img\_reference = loadImage(‘coin-sprite’);		// domain.com/resources/coin-sprite.png
var img\_reference = loadImageFormat(‘coin-sprite’, ‘PNG’)	// domain.com/resources/coin-sprite.png
var json\_reference = loadJSON(‘map’);			// domain.com/resources/map.json

Is very important override any events that will provide you the times to work.
var input = function(){};		-	for calculate input keys, touch, or chromecast sender.
var update = function(){};		-	for calculate coordinates, and game or canvas logic.
var load = function(){};		-	this event is handled when all resources have been loaded

Example:

> 

&lt;script&gt;


window.onload = function() {
> > loadEngineDefault();
var imgcoin = loadImage("coin-sprite");
}


&lt;/script&gt;



Receiver Body
In the receiver body is completely mandatory add an HTML5 Canvas. Chromecast is an HD device, so the resolution is 720.



&lt;body style="background-color: black;"&gt;



> 

&lt;canvas id="canvas-chromecast" width="1280" height="720"/&gt;




&lt;/body&gt;



Receiver Objects and Groups
This is the most important part, the canvas objects and groups, whose names say everything, it’s simple with the next example you will understand each of them.

new SpriteElement(image, x, y, frames);			-	Sprite animation HORIZONTAL
new ImageSplitElement(image, x, y, framesx, framesy, fx, fy);	-	Split XY extraction part of image
new ImageElement(image, x, y);				-	Simple complete Image Element
new CircleElement(x, y, radio, color);				-	Simple Cirle
new TextElement(x, y, text, size, color);			-	Simple Text
new RectLinedElement(x, y, width, height, color, linecolor);		-	Rect with lined Bounds
new LineElement(x, y, width, height, color);			-	Simple Line
new RectElement(x, y, width, height, color);			-	Simple Rect
new GroupElement(_x,_y);					-	Group container of elements or other groups

Stage and groups
you can add elements or groups to stages or other groups very simply
this.add(ELEMENT\_OR\_GROUP)

Common properties
this.setX		-	Set X
this.setY		-	Set Y
this.setZ		-	Rendering order Z
this.getX		-	Get X
this.getY		-	Get Y
this.plusX		-	Plus coordinates
this.plusY	-	Plus coordinates
this.setVisibility	-	Rendering visibility
this.remove	-	Remove from Parent

Example:


&lt;script&gt;


> var background = new RectElement(0, 0, 1280, 720, 'red');

var group = new GroupElement(10, 10);
> var test = new SpriteElement(img\_reference , 0, 0, 10);
> group.add(test);

> add(background);
> add(group);
> 

&lt;/script&gt;



Collisions
This is the most useful part on games, where elementA and elementB can be Elements or Groups and x y is the new plus position of each Element.

intersect(elementA, elementB) - bool
tryIntersect(elementA, _x,_y, elementB) - bool
tryIntersectComplex(elementA, _x,_y, elementB, _x2,_y2) - bool

Generally we use it with plusX/plusY function, because tryIntersect Check if its posibble make a plus without intersect before the element move.

Example:
> if(!tryIntersect(group1, 0, -2, group2)) group1.plusY(-2);

Input
On Chromecast we have the possibility of receive different information, messages, or json objects, but by default we have a common array keysDown which have al the keyboard event, it work on PC, and by sender to Chromecast, it’s the same.
You have to compare with the different key codes

KEY\_NUMS.UP
KEY\_NUMS.DOWN
KEY\_NUMS.LEFT
KEY\_NUMS.RIGHT

Example
input = function(){
> if (KEY\_NUMS.UP in keysDown) { //UP
> > if(!tryIntersect(group1, 0, -2, group2)) group1.plusY(-2);

> }
> if (KEY\_NUMS.DOWN in keysDown) { //DOWN
> > if(!tryIntersect(group1, 0, 2, group2)) group1.plusY(2);

> }
}