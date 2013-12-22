var theWorld;
var tileSize = 20;
var currentPosition;
var currentView;

function Position( x, y, z ){
    this.x = x;
    this.y = y;
    this.z = z;
};

function Viewport( pos, width, height ){
    this.position = pos;
    this.width = width;
    this.height = height;
};

function Tile( x, y, density, evil = 23 ){
    this.x = x;
    this.y = y;
    this.d = density;
    this.e = evil;
};

Viewport.prototype.getFrom = function( world ){
    var pos = this.position;
    var height = this.height;
    var tmp = world.slice( pos.x, pos.x + this.width );
    tmp = tmp.map( function( a ){ return a.slice( pos.y, pos.y + height ) } );
    return tmp;
};

function loadWorld(){
    var rows = 100;
    var cols = 100;
    var tmp = [];
    for( var i = 0; i < cols; ++i ){
	tmp[i] = [];
	for( var j = 0; j < rows; ++j ){
	    tmp[i][j] = Math.random();
	}
    }
    return tmp;
};

function Color( r, g, b, a ){
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
};

Color.prototype.get = function(){
  return "rgba("   + this.r + "," + this.g + "," + this.b + "," + this.a + ")"
};

Tile.prototype.getColor = function(){
    var col = new Color( Math.round(255*this.e), 20, 20, this.d );
    return col.get();
};

function drawTile( tile, context ){
    context.fillStyle = tile.getColor();
    context.fillRect( tile.x * tileSize, tile.y * tileSize, tileSize, tileSize );
};

function drawScene( context ){
    var view = currentView.getFrom( theWorld );
    for( var i = 0; i < currentView.width; ++i ){
	for( var j = 0; j < currentView.height; ++j){
	    var tile = new Tile( i, j, view[i][j], Math.random() );
	    drawTile( tile, context );
	}
    }
};

var trackedTouches = new Array;

function handleTouchStart( event ){
    event.preventDefault();
    var touches = evt.changedTouches;
    for( var i=0; i < touches.length; i++ ) {
	ongoingTouches.push( copyTouch( touches[i] ) );
    }
}


$(function() {

    var canvas = document.getElementById("main");
    var ctx = canvas.getContext("2d");
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    
    canvas.addEventListener("touchstart", handleTouchStart, false);
    canvas.addEventListener("touchmove", handleTouchMove, false);
    canvas.addEventListener("touchend", handleTouchEnd, false);

    var tilesWide = Math.floor(canvas.width / tileSize);
    var tilesHigh = Math.floor(canvas.height / tileSize);

    theWorld = loadWorld();

    currentPosition = new Position( 50, 50, 0 );

    currentView = new Viewport( currentPosition, tilesWide, tilesHigh );

    drawScene( ctx );
});
