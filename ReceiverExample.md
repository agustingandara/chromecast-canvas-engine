

&lt;html&gt;




&lt;head&gt;


> 

&lt;title&gt;

ANG.CAST-RECEIVER

&lt;/title&gt;


> 

&lt;script src="//www.gstatic.com/cast/sdk/libs/receiver/2.0.0/cast\_receiver.js"&gt;



&lt;/script&gt;


> 

&lt;script type="text/javascript" src="../engine/engine-base.js"&gt;



&lt;/script&gt;


> > 

&lt;script type="text/javascript" src="../engine/engine-receiver.js"&gt;



&lt;/script&gt;




> 

&lt;script&gt;


> //debug flag
> WEB\_CHROME\_CAST = true;
> WEB\_CHROME\_PC = true;

> window.onload = function() {

> //Load Engine
> loadEngineDefault();

> //Load resources
> var imgcoin = loadImage("coin-sprite");
> var imgbackground = loadImage("mb-background");
> var json = loadJSON("map");

> //Object instances
> var background = new RectElement(0, 0, 1280, 720, 'red');

> var group1 = new GroupElement(10, 10);
> var test1 = new SpriteElement(imgcoin, 0, 0, 10);
> group1.add(test1);

> var group2 = new GroupElement(200, 200);
> var test2 = new ImageSplitElement(imgbackground, 0, 0, 10, 3, 2, 2);
> var test3 = new ImageSplitElement(imgbackground, 0, 100, 10, 3, 1, 1);
> group2.add(test2);
> group2.add(test3);

> add(background);
> add(group1);
> add(group2);

> //On input
> input = function(){

> if (KEY\_NUMS.UP in keysDown) { //UP
> > if(!tryIntersect(group1, 0, -2, group2)) group1.plusY(-2);

> }

> if (KEY\_NUMS.DOWN in keysDown) { //DOWN
> > if(!tryIntersect(group1, 0, 2, group2)) group1.plusY(2);

> }

> if (KEY\_NUMS.RIGHT in keysDown) { //RIGHT
> > if(!tryIntersect(group1, 2, 0, group2)) group1.plusX(2);

> }

> if (KEY\_NUMS.LEFT in keysDown) { //LEFT
> > if(!tryIntersect(group1, -2, 0, group2)) group1.plusX(-2);

> }
> }
> > }

> 

&lt;/script&gt;




&lt;/head&gt;


> 

&lt;body style="background-color: black;"&gt;


> > 

&lt;canvas id="canvas-chromecast" width="1280" height="720"/&gt;



> 

&lt;/body&gt;




&lt;/html&gt;

