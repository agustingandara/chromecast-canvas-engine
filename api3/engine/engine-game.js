/*	ENGINE 2D CHROMECAST/PC/MOBILE *
 *	NUMEN - AGUSTIN NAHUEL GANDARA */

/* TILE COMPATIBLE: TILE - POLYLINE - RECT - CIRCLE */
/* SOON: SOLID POLYLINE */

function createImageTileMap(tilemap, id, x, y){

	if(tilemap.tilesets !== undefined) {
		for (key in tilemap.tilesets) {
			var tile = tilemap.tilesets[key];
			var xw = (tile.imagewidth / tile.tilewidth);
			var yh = (tile.imageheight / tile.tileheight);
			var idcount = xw * yh;
			if(id >= tile.firstgid && id < tile.firstgid + idcount){
				var decimal = (id - tile.firstgid) % xw;
				var entero = (id - tile.firstgid - decimal) / xw;
				var box = new ImageSplitElement(tile.name, x, y, xw, yh, decimal, entero);
				return box;
			}
		}
	}
	return null;
}

TILEMAP_TYPE = {"ORTO" : "orthogonal"};
TILEMAP_LAYER_TYPE = {"OBJECT" : "objectgroup", "TILE" : "tilelayer"};
function TileMap(_tilemap){
	
	//indexing
	this.parent = null;
	this.tilemap = resources[_tilemap];
	this.x = 0;
	this.y = 0;
	this.z = -1;
	
	//private
	this.type = ELEMENT_TYPE.GRUP;
	this.subelements = [];
	this._visible = this.tilemap.orientation === TILEMAP_TYPE.ORTO;
	this.areaw = 0;
	this.areah = 0;
	
	this.add = function(element){
		addCustom(element, this.subelements);
	};
	
	this.load = function(){
		var zlayer = -1000;
		//tilemap structure
		this.background = new RectElement(0, 0, canvas.width, canvas.height, this.tilemap.backgroundcolor !== null ? this.tilemap.backgroundcolor : 'black');
		//layers 
		if(this.tilemap.layers !== null) {
			
			for (instance in this.tilemap.layers) {
				zlayer++;
				
				var instancelayer = this.tilemap.layers[instance];
				var instancegroup = new GroupElement(0, 0);
				instancegroup.setZ(zlayer);
				instancegroup.setVisibility(instancelayer.visible);
				instancegroup.layerTileMap = instancelayer;
				this.add(instancegroup);
			}
			
			
			for (key in this.subelements) {
				
				var group = this.subelements[key];
				var layer = group.layerTileMap;
				
				/*var layer = this.tilemap.layers[key];
				var group = new GroupElement(0, 0);
				group.setZ(zlayer);
				group.setVisibility(layer.visible);
				this.add(group);*/
				
				//using
				//layer.x
				//layer.y
				//layer.visible
				
				//not using
				//layer.opacity
				//layer.width
				//layer.height
				//name
				
				if(layer.type == TILEMAP_LAYER_TYPE.TILE){
					//layer.data
					
					var i = 0;
					for (data in layer.data) {
						var decimal = i % layer.width;
						var entero = (i - decimal) / layer.width;
						var box = createImageTileMap(this.tilemap, layer.data[data], layer.x + decimal * this.tilemap.tilewidth, layer.y + entero * this.tilemap.tileheight);
						if(box!==null) group.add(box);
						i++;
					}
				}else if(layer.type == TILEMAP_LAYER_TYPE.OBJECT){
					//layer.objects
					
					for (object in layer.objects) {
						
						if(layer.objects[object].polyline !== undefined){
							//polyline object
							
							var box = new GroupElement(layer.x + layer.objects[object].x, layer.y + layer.objects[object].y);
							box.setVisibility(layer.objects[object].visible);
							
							for(poly in layer.objects[object].polyline){
								var next = parseInt(poly)+1;
								if(next < layer.objects[object].polyline.length){
									var line = new LineElement(
										layer.objects[object].polyline[poly].x, layer.objects[object].polyline[poly].y,
										/*next < layer.objects[object].polyline.length ? */layer.objects[object].polyline[next].x/* : layer.objects[object].polyline[0].x*/, 
										/*next < layer.objects[object].polyline.length ? */layer.objects[object].polyline[next].y/* : layer.objects[object].polyline[0].y*/, 
										'blue');
									if(!DEBUG)line.element._renderenable = false;		//test this should be parametrized
									box.add(line);	
								}
							}
								 
							if(box!==null) {
								box.setVisibility(layer.objects[object].visible);
								group.add(box);
							}
							
						}else if(layer.objects[object].gid !== undefined){
							//gid object
							
							var box = createImageTileMap(this.tilemap, layer.objects[object].gid, layer.x + layer.objects[object].x, layer.y + layer.objects[object].y);
							if(box!==null) { 
								//PHYSICS PARAMS
								if(layer.objects[object].properties.gravity !== undefined) {
									box.element.gravity = parseInt(layer.objects[object].properties.gravity);
									
									if(layer.objects[object].properties.floorlayer !== undefined) {
										for (layernum in this.subelements){
											if(this.subelements[layernum].layerTileMap.name === layer.objects[object].properties.floorlayer){
												box.element.floor = this.subelements[layernum];
												box.element.update = function () {
													this.tickCount += 1;
													//sprite animation
													if (this.tickCount > this.ticksPerFrame) {
														this.tickCount = 0;
														
														//PHYSICS - PHYSICS - PHYSICS - PHYSICS - PHYSICS - PHYSICS - PHYSICS - PHYSICS - PHYSICS - PHYSICS - PHYSICS - PHYSICS
														if(!this.gravitystopped && this.gravity!==0 && this.floor !==null){
															var moved = false;
															for(var i = this.gravity*2 ; i > 0 && !moved ; i--){
																if(!tryIntersect(this, 0, i, this.floor)){ 
																	this.gravitylock = false;
																	this.y += i;
																	moved = true;;
																}else this.gravitylock = true;
															}
														}
														//PHYSICS - PHYSICS - PHYSICS - PHYSICS - PHYSICS - PHYSICS - PHYSICS - PHYSICS - PHYSICS - PHYSICS - PHYSICS - PHYSICS
														
														//sprite
														if(!this.stopped){
															this.frameIndex += 1; 
															if(this.frameIndex >= this.dy) this.frameIndex = 0;
														}
													}		
												}; 
												
												//PHYSICS - PHYSICS - PHYSICS - PHYSICS - PHYSICS - PHYSICS - PHYSICS - PHYSICS - PHYSICS - PHYSICS - PHYSICS - PHYSICS
												//box.element.gravity = 0;
												box.element.gravitylock = false;
												box.element.gravitystopped = false;
												//this.floor = null;
												//PHYSICS - PHYSICS - PHYSICS - PHYSICS - PHYSICS - PHYSICS - PHYSICS - PHYSICS - PHYSICS - PHYSICS - PHYSICS - PHYSICS
												break;
											}
										}
									}
								}
								box.setVisibility(layer.objects[object].visible);
								group.add(box);
							}
						}else{
							//box
							
							var box = new RectElement(layer.x + layer.objects[object].x, layer.y + layer.objects[object].y, 
													  layer.objects[object].width, layer.objects[object].height, 'blue');
							
							if(box!==null) {
								if(!DEBUG)box.element._renderenable = false;		//test this should be parametrized
								box.setVisibility(layer.objects[object].visible);
								group.add(box);
							}
						}
					}
				}
			}
		}
	};
	
	this.setX = function(param){this.x = param;};
	this.setY = function(param){this.y = param;};
	this.getX = function(){ return this.x;};
	this.getY = function(){ return this.y;};
	
	this.plusX = function(param){ 
		
		if((this.x + param) < 1) 
			this.x += param;	
	};
	
	this.plusY = function(param){ 
		
		if((this.y + param) < 1) 
			this.y += param;	
	};
	
	this.update = function(){
		for (key in this.subelements) {
			if(this.subelements[key]._visible){
				this.subelements[key].update();
			}
		}
	};
	
	this.render = function(_x, _y){
		if(this.background!==null) this.background.element.render(0, 0);
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
}