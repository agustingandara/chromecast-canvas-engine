/*	ENGINE 2D CHROMECAST/PC/MOBILE *
 *	NUMEN - AGUSTIN NAHUEL GANDARA */

//Variables
var canvas;
var context;
var fps = 60;
var totalResources = 0;
var numResourcesLoaded = 0;
var images = [];		//resources
var resources = [];		//resources
var elements = [];		//elements (render, delete, hide, etc)

//Loop
var input = function(){};
var update = function(){};
var load = function(){};

function loop() {
	//Declaration MANDATORY!
	input();
	update();
	//system
	updatesystem();
	render();
}

var updatesystem = function(){
	for (key in elements) {
		if(elements[key]._visible){
			elements[key].update();
		}
	}
};

var render = function render(){
	for (key in elements) {
		if(elements[key]._visible){
			elements[key].render(0, 0);
		}
	}
};

//Chromecast receiver load
function loadEngineDefault(){
	loadEngine('canvas-chromecast');
}

function loadEngine(div){
	
	if(WEB_CHROME_CAST){
		window.castReceiverManager = cast.receiver.CastReceiverManager.getInstance();
		var customMessageBus = castReceiverManager.getCastMessageBus('urn:x-cast:com.numen.castmessage');
		customMessageBus.onMessage = function(event) {
			var message = JSON.parse(event.data);
			keysDown = message.KeysDown;
		};
		window.castReceiverManager.start();
	}
	
	if(WEB_CHROME_PC){
		//Keyboard Listeners DEBUG MODE
		addEventListener("keydown", function(e) {
			keysDown[e.keyCode] = true;
		}, false);
		
		addEventListener("keyup", function(e) {
			delete keysDown[e.keyCode];
		}, false);
	}
	
	canvas = document.getElementById(div);
	context = canvas.getContext('2d');	// Canvas
}


function add(element){
	this.addCustom(element, elements);
}

function addCustom(element, array){
	var index = -1;
	if(element.type === ELEMENT_TYPE.GRUP){
		if(element.parent!==null){
			index = element.parent.indexOf(element);			
			if (index > -1) {
				element.parent.splice(index, 1);
			}
		}
		element.parent = this;
		array.push(element);
	}else{
		if(element.element.parent!==null){
			index = element.element.parent.indexOf(element);			
			if (index > -1) {
				element.element.parent.splice(index, 1);
			}
		}
		element.element.parent = this;
		array.push(element.element);
	}
	array.sort(function(a, b){return a.z-b.z; });
}


//Resource
function resourceLoaded() {

  	numResourcesLoaded += 1;
  	if(numResourcesLoaded === totalResources) {
		load();
		//Canvas chromecast loop
		setInterval(loop, 1000 / fps); 	// 30fps Canvas Intervale
  	}
}

function loadImage(name) {
	totalResources += 1;
	images[name] = new Image();
	images[name].onload = function() { 
		resourceLoaded();
	};
	images[name].src = RESOURCES_PATH + name + RESOURCES_IMAGE_EXT;
	return name;
}

function loadImageFormat(name, ext) {
	totalResources += 1;
	images[name] = new Image();
	images[name].onload = function() { 
		resourceLoaded();
	};
	images[name].src = RESOURCES_PATH + name + "." + ext;
	return name;
}

function loadJSON(name) {
	totalResources += 1;
    var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function()
    {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
				resources[name] = JSON.parse(xhr.responseText);
				resourceLoaded();
            }
        }
    };
    xhr.open("GET", RESOURCES_PATH + name + RESOURCES_IMAGE_JSON, false);
    xhr.send();
	return name;
}

function loadTileMap(name) {
	totalResources += 1;
    var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function()
    {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
				resources[name] = JSON.parse(xhr.responseText);
				if(resources[name].tilesets !== null) {
					for (key in resources[name].tilesets) {
						var tileset = resources[name].tilesets[key];
						totalResources += 1;
						images[tileset.name] = new Image();  
						images[tileset.name].onload = function() { 
							resourceLoaded();
						};
						images[tileset.name].src = RESOURCES_PATH + tileset.image;
					}
				}
				resourceLoaded();
            }
        }
    };
    xhr.open("GET", RESOURCES_PATH + name + RESOURCES_IMAGE_JSON, false);
    xhr.send();
	return name;
}

//Utils
function intersect(elementA, elementB){
	return tryIntersect(elementA, 0, 0, elementB);
}

function tryIntersect(elementA, _x, _y, elementB){
	return tryIntersectComplex(elementA, _x, _y, elementB, 0, 0);
}
	
function tryIntersectComplex(elementA, _x, _y, elementB, _x2, _y2){
	
	var mainelement = elementA.type === ELEMENT_TYPE.GRUP ? elementA : elementA.type === ELEMENT_TYPE.NONE ? elementA.element : elementA;
	var element = elementB.type === ELEMENT_TYPE.GRUP ? elementB : elementB.type === ELEMENT_TYPE.NONE ? elementB.element : elementB;
	var detect = false;
	
	if(mainelement.intersectavailable() && element.intersectavailable()){
		
		if(elementA.type === ELEMENT_TYPE.GRUP){ 		//Group vs Element/Group
			for (key in elementA.subelements) {
				detect = tryIntersect(elementA.subelements[key], _x + elementA.x, _y + elementA.y, elementB);
				if(detect) break;
			}
		}else if(elementB.type === ELEMENT_TYPE.GRUP){	//Element vs Group
			for (key in elementB.subelements) {
				detect = tryIntersectComplex(elementA, _x, _y, elementB.subelements[key], _x2 + elementB.x, _y2 + elementB.y);
				if(detect) break;
			}
		}else{											//Element vs Element
			
			if( (_x + mainelement.x >= _x2 + element.x && _x + mainelement.x <= _x2 + element.x + element.areaw) || 
			   (_x + mainelement.x + mainelement.areaw >= _x2 + element.x && _x + mainelement.x + mainelement.areaw <= _x2 + element.x + element.areaw)) {	//concat x
				
				if( (_y + mainelement.y >= _y2 + element.y && _y + mainelement.y <= _y2 + element.y + element.areah) || 
				   (_y + mainelement.y + mainelement.areah >= _y2 + element.y && _y + mainelement.y + mainelement.areah <= _y2 + element.y + element.areah)) {	//concat y
					
					detect = true;
				}
			}
		}
	}
	return detect;
}

//Game render engine entities
function SpriteElement(image, x, y, frames){
	this.element = new Element(x, y, images[image], frames, 'black', ELEMENT_TYPE.SPRI);
	
	this.ticks = function(ticksperframe){element.ticksPerFrame = ticksperframe;};
	this.reset = function(){this.element.frameIndex = 0;};
	this.play = function(){this.element.stopped = false;};
	this.stop = function(){this.element.stopped = true;};
	
	this.setX = function(param){this.element.x = param;};
	this.setY = function(param){this.element.y = param;};
	this.setZ = function(param){ this.element.setZ(param);};
	this.getX = function(){ return this.element.x;};
	this.getY = function(){ return this.element.y;};
	this.plusX = function(param){ this.element.x += param;};
	this.plusY = function(param){ this.element.y += param;};
	
	this.setVisibility = function (visibility) {this.element.visible(visibility);};
	this.remove = function(){this.element.remove();};
	
	this.type = ELEMENT_TYPE.NONE;
}

function ImageSplitElement(image, x, y, framesx, framesy, fx, fy){
	this.element = new Element(x, y, images[image], framesx, 'black', ELEMENT_TYPE.IMGC);
	this.element.stopped = true;
	this.element.dz = framesy;
	this.element.frameIndex = fx;
	this.element.frameIndey = fy;
	
	this.setIndexY = function(param){this.element.frameIndey = param;};
	this.setIndexX = function(param){this.element.frameIndex = param;};
	this.setX = function(param){this.element.x = param;};
	this.setY = function(param){this.element.y = param;};
	this.setZ = function(param){ this.element.setZ(param);};
	this.getX = function(){ return this.element.x;};
	this.getY = function(){ return this.element.y;};
	this.plusX = function(param){ this.element.x += param;};
	this.plusY = function(param){ this.element.y += param;};
	
	this.setVisibility = function (visibility) {this.element.visible(visibility);};
	this.remove = function(){this.element.remove();};
	
	this.type = ELEMENT_TYPE.NONE;
}

function ImageElement(image, x, y){
	this.element = new Element(x, y, images[image], -1, 'black', ELEMENT_TYPE.IMAG);
	
	this.setX = function(param){this.element.x = param;};
	this.setY = function(param){this.element.y = param;};
	this.setZ = function(param){ this.element.setZ(param);};
	this.getX = function(){ return this.element.x;};
	this.getY = function(){ return this.element.y;};
	this.plusX = function(param){ this.element.x += param;};
	this.plusY = function(param){ this.element.y += param;};
	
	this.setVisibility = function (visibility) {this.element.visible(visibility);};
	this.remove = function(){this.element.remove();};
	
	this.type = ELEMENT_TYPE.NONE;
}

function CircleElement(x, y, radio, color){
	this.element = new Element(x, y, radio, -1, color, ELEMENT_TYPE.OVAL);
	
	this.setColor = function(param){this.element.color = param;};
	this.setX = function(param){this.element.x = param;};
	this.setY = function(param){this.element.y = param;};
	this.setZ = function(param){ this.element.setZ(param);};
	this.getX = function(){ return this.element.x;};
	this.getY = function(){ return this.element.y;};
	this.plusX = function(param){ this.element.x += param;};
	this.plusY = function(param){ this.element.y += param;};
	
	this.setVisibility = function (visibility) {this.element.visible(visibility);};
	this.remove = function(){this.element.remove();};
	
	this.type = ELEMENT_TYPE.NONE;
}

function TextElement(x, y, text, size, color){
	this.element = new Element(x, y, text, size, color, ELEMENT_TYPE.TEXT);
	
	this.setFont = function(param){this.element.font = param;};
	this.setSize = function(param){this.element.dy = param;};
	this.setColor = function(param){this.element.color = param;};
	this.setX = function(param){this.element.x = param;};
	this.setY = function(param){this.element.y = param;};
	this.setZ = function(param){ this.element.setZ(param);};
	this.getX = function(){ return this.element.x;};
	this.getY = function(){ return this.element.y;};
	this.plusX = function(param){ this.element.x += param;};
	this.plusY = function(param){ this.element.y += param;};
	
	this.setVisibility = function (visibility) {this.element.visible(visibility);};
	this.remove = function(){this.element.remove();};
	
	this.type = ELEMENT_TYPE.NONE;
}

function RectLinedElement(x, y, width, height, color, linecolor){
	this.element = new Element(x, y, width, height, color, ELEMENT_TYPE.RELN);
	this.element.colorln = linecolor;
	
	this.setWidth = function(param){this.element.dx = param;};
	this.setHeight = function(param){this.element.dy = param;};
	this.setColor = function(param){this.element.color = param;};
	this.setColorLine = function(param){this.element.colorln = param;};
	this.setX = function(param){this.element.x = param;};
	this.setY = function(param){this.element.y = param;};
	this.setZ = function(param){ this.element.setZ(param);};
	this.getX = function(){ return this.element.x;};
	this.getY = function(){ return this.element.y;};
	this.plusX = function(param){ this.element.x += param;};
	this.plusY = function(param){ this.element.y += param;};
	
	this.setVisibility = function (visibility) {this.element.visible(visibility);};
	this.remove = function(){this.element.remove();};
	
	this.type = ELEMENT_TYPE.NONE;
}

function LineElement(x, y, width, height, color){
	this.element = new Element(x, y, width, height, color, ELEMENT_TYPE.LINE);
	this.element.dz = 3;
	
	this.setWidthLine = function(param){this.element.dz = param;};
	this.setWidth = function(param){this.element.dx = param;};
	this.setHeight = function(param){this.element.dy = param;};
	this.setColor = function(param){this.element.color = param;};
	this.setX = function(param){this.element.x = param;};
	this.setY = function(param){this.element.y = param;};
	this.setZ = function(param){ this.element.setZ(param);};
	this.getX = function(){ return this.element.x;};
	this.getY = function(){ return this.element.y;};
	this.plusX = function(param){ this.element.x += param;};
	this.plusY = function(param){ this.element.y += param;};
	
	this.setVisibility = function (visibility) {this.element.visible(visibility);};
	this.remove = function(){this.element.remove();};
	
	this.type = ELEMENT_TYPE.NONE;
}

function RectElement(x, y, width, height, color){
	this.element = new Element(x, y, width, height, color, ELEMENT_TYPE.RECT);
	this.element.dz = 3;
	
	this.setWidthLine = function(param){this.element.dz = param;};
	this.setWidth = function(param){this.element.dx = param;};
	this.setHeight = function(param){this.element.dy = param;};
	this.setColor = function(param){this.element.color = param;};
	this.setX = function(param){this.element.x = param;};
	this.setY = function(param){this.element.y = param;};
	this.setZ = function(param){ this.element.setZ(param);};
	this.getX = function(){ return this.element.x;};
	this.getY = function(){ return this.element.y;};
	this.plusX = function(param){ this.element.x += param;};
	this.plusY = function(param){ this.element.y += param;};
	
	this.setVisibility = function (visibility) {this.element.visible(visibility);};
	this.remove = function(){this.element.remove();};
	
	this.type = ELEMENT_TYPE.NONE;
}

function GroupElement(_x, _y){
	
	//indexing
	this.parent = null;
	this.x = _x;
	this.y = _y;
	this.z = 0;
	
	//private
	this.type = ELEMENT_TYPE.GRUP;
	this.subelements = [];
	this._visible = true;
	this.areaw = 0;
	this.areah = 0;
	
	this.setX = function(param){this.x = param;};
	this.setY = function(param){this.y = param;};
	this.getX = function(){ return this.x;};
	this.getY = function(){ return this.y;};
	this.plusX = function(param){ this.x += param;};
	this.plusY = function(param){ this.y += param;};
	
	this.setZ = function(_z){
		this.z = _z;
		if(this.parent !== null) this.parent.subelements.sort(function(a, b){return a.z-b.z; });
		else elements.sort(function(a, b){return a.z-b.z; });
	};
	
	this.add = function(element){
		addCustom(element, this.subelements);
	};
	
	this.update = function(){
		for (key in this.subelements) {
			if(this.subelements[key]._visible){
				this.subelements[key].update();
			}
		}
	};
	
	this.render = function(_x, _y){
		for (key in this.subelements) {
			if(this.subelements[key]._visible){
				this.subelements[key].render(_x + this.x, _y + this.y);
			}
		}
	};
	
	this.remove = function(){
		for (key in this.subelements) {
			this.subelements[key].remove();
		}
		if(this.parent === null){
			var index = elements.indexOf(this);			
			if (index > -1) {
				elements.splice(index, 1);
			}
		}else{
			var index = this.subelements.indexOf(this);			
			if (index > -1) {
				this.subelements.splice(index, 1);
			}
		}
	};
	
	this.setVisibility = function (visibility) {
		this._visible = visibility;
    };
	
	this.intersectavailable = function(){
		return this._visible;
	};
}

var ELEMENT_TYPE = {"LINE": 0, "RECT" : 1, "RELN" : 2, "TEXT" : 3, "OVAL" : 4, "IMAG" : 5, "SPRI" : 6, "IMGC" : 7, "NONE" : 9, "GRUP" : 10} ;
function Element(_x, _y, _param1, _param2, _color, _type){
	
	//indexing
	this.parent = null;	
	this.x = _x;			//Y position
	this.y = _y;			//X position
	this.z = 0;
	
	this.dx = _param1;		//width	 //text //radio	//source //source	//source
	this.dy = _param2;		//height //font //oval	//none	 //frames	//split height
	this.dz = 0;			//line width					 			//split width
	this.color = _color;	//main color
	this.colorln = 'black';	//default for rect lined (line color)
	this.font = "Arial";	//font text
	
	//private
	this.areaw = 0;
	this.areah = 0;
	this.frameIndey = 0;
	this.frameIndex = 0;
    this.tickCount = 0;
	this.ticksPerFrame = 1;
	this.stopped = false;
	this._visible = true;
	
	this.type = _type;
	
	this.setZ = function(_z){
		this.z = _z;
		if(this.parent !== null) this.parent.subelements.sort(function(a, b){return a.z-b.z; });
		else elements.sort(function(a, b){return a.z-b.z; });
	};
	
	this.update = function () {
		if(!this.stopped){
			this.tickCount += 1;
				
			if (this.tickCount > this.ticksPerFrame) {
				this.tickCount = 0;
				this.frameIndex += 1; 
				if(this.frameIndex >= this.dy) this.frameIndex = 0;
			}
		}
    }; 
	
	this.visible = function (visibility) {
		this._visible = visibility;
    };
	
	this.remove = function(){
		if(this.parent === null){ 
			var index = elements.indexOf(this);			
			if (index > -1) {
				elements.splice(index, 1);
			}
		}else{ 
			var index = this.parent.subelements.indexOf(this);			
			if (innd > -1) {
				this.parent.subelements.splice(index, 1);
			}
		}
	};

	this.render = function(_x, _y){
		context.beginPath();
		if(this.type == ELEMENT_TYPE.RECT){
			context.rect(_x + this.x, _y + this.y, _x + this.dx, _y + this.dy);
			context.fillStyle = this.color;
			context.fill();
		}else if(this.type == ELEMENT_TYPE.RELN){
			context.rect(_x + this.x, _y + this.y, _x + this.dx, _y + this.dy);
			context.fillStyle = this.color;
			context.fill();
			context.lineWidth = this.dz;
			context.strokeStyle = this.colorln;
			context.stroke();
		}else if(this.type == ELEMENT_TYPE.LINE){
			context.moveTo(_x + this.x, _y + this.y);
			context.lineTo(_x + this.dx, _y + this.dy);
			context.lineWidth = this.dz;
			context.strokeStyle = this.color;
			context.stroke();
		}else if(this.type == ELEMENT_TYPE.TEXT){
			context.font = this.dy + "px " + this.font;
			context.fillStyle = this.color;
			context.fillText(this.dx, _x + this.x, _y + this.y);
		}else if(this.type == ELEMENT_TYPE.OVAL){
			context.arc(_x + this.x, _y + this.y, this.dx, 0, 2*Math.PI);
			context.strokeStyle = this.color;
			context.stroke();
		}else if(this.type == ELEMENT_TYPE.IMAG){
			context.drawImage(this.dx, _x + this.x, _y + this.y);
		}else if(this.type == ELEMENT_TYPE.SPRI){
			context.drawImage(this.dx, this.frameIndex * this.dx.width / this.dy, 0, 
							  this.dx.width / this.dy, this.dx.height, _x + this.x, _y + this.y, 
							  this.dx.width / this.dy, this.dx.height);
		}else if(this.type == ELEMENT_TYPE.IMGC){
			context.drawImage(this.dx, this.frameIndex * this.dx.width / this.dy, this.frameIndey * this.dx.height / this.dz, 
							  this.dx.width / this.dy, this.dx.height / this.dz, _x + this.x, _y + this.y, 
							  this.dx.width / this.dy, this.dx.height / this.dz);
		}
	};
	
	this.intersectavailable = function(){
			
		if(this.type == ELEMENT_TYPE.RECT){
			
			this.areaw = this.dx;
			this.areah = this.dy;
			return this._visible;
		}else if(this.type == ELEMENT_TYPE.RELN){
			
			this.areaw = this.dx;
			this.areah = this.dy;
			return this._visible;
		}else if(this.type == ELEMENT_TYPE.LINE){
			
		}else if(this.type == ELEMENT_TYPE.TEXT){
			
		}else if(this.type == ELEMENT_TYPE.OVAL){
			
			this.areaw = this.dx;
			this.areah = this.dx;
			return this._visible;
		}else if(this.type == ELEMENT_TYPE.IMAG){
			
			this.areaw = this.dx.width;
			this.areah = this.dx.height;
		}else if(this.type == ELEMENT_TYPE.SPRI){
			
			this.areaw = this.dx.width / this.dy;
			this.areah = this.dx.height;
			return this._visible;
		}else if(this.type == ELEMENT_TYPE.IMGC){
			
			this.areaw = this.dx.width / this.dy;
			this.areah = this.dx.height / this.dz;
			return this._visible;
		}
		return false;
	};
}