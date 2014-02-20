function createImageTileMap(tilemap, id, x, y){

	if(tilemap.tilesets !== null) {
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
		var zlayer = -100;
		//tilemap structure
		this.background = new RectElement(0, 0, canvas.width, canvas.height, this.tilemap.backgroundcolor !== null ? this.tilemap.backgroundcolor : 'black');
		//layers 
		if(this.tilemap.layers !== null) {
			zlayer++;
			for (key in this.tilemap.layers) {
				
				var layer = this.tilemap.layers[key];
				var group = new GroupElement(0, 0);
				group.setZ(zlayer);
				group.setVisibility(layer.visible);
				this.add(group);
				
				if(layer.type == TILEMAP_LAYER_TYPE.TILE){
					var i = 0;
					for (data in layer.data) {
						var decimal = i % layer.width;
						var entero = (i - decimal) / layer.width;
						var box = createImageTileMap(this.tilemap, layer.data[data], layer.x + decimal * this.tilemap.tilewidth, layer.y + entero * this.tilemap.tileheight);
						if(box!==null) group.add(box);
						i++;
					}
				}else if(layer.tilelayer == TILEMAP_LAYER_TYPE.OBJECT){
					
				}
			}
		}
	};
	
	this.setX = function(param){this.x = param;};
	this.setY = function(param){this.y = param;};
	this.getX = function(){ return this.x;};
	this.getY = function(){ return this.y;};
	this.plusX = function(param){ if((this.x + param) < 1) this.x += param;};
	this.plusY = function(param){ if((this.y + param) < 1) this.y += param;};
	
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