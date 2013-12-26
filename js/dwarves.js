var tileSize = 40;

function pxToTile( posInPx ){
    return Math.floor( posInPx/tileSize );
};

function tileToPx( tilePos ){
    return tilePos*tileSize;
};


function tile( x, y ){
  return [pxToTile(x),pxToTile(y)];
};

function Dwarf( x, y, status ){
    this.x = x;
    this.y = y;
    this.image = new Image();
    this.selected = false;
    this.setStatus( status );
};

Dwarf.prototype.setStatus = function( status ){
    if( status == "idle" ){
	this.image.src = 'resources/dwarf.001.png';
	this.nFrames = 1;
    }else if( status == "mining" ){
	this.image.src = 'resources/dwarf.002.png';
	this.nFrames = 4;
    }else if( status == "rock" ){
	this.image.src = 'resources/rock.tiles.png';
	this.nFrames = 8;
    }else{ //default to idle state
	this.setStatus( "idle" );
    }
};

function animate( index, length, backwards ){
    for( var didx = 0; didx < dwarves.length; ++didx ){
	var dwarf = dwarves[didx];
	var x = tileToPx(dwarf.x);
	var y = tileToPx(dwarf.y);
	dwarfContext.clearRect(x, y, tileSize, tileSize); // clear canvas
	var tick = index % dwarf.nFrames;
	var dwarfSize = dwarf.image.height;

	var tileImage = new Image();
	tileImage.src = "resources/rock.tiles.png";
	var imageTileSize = tileImage.height;

	dwarfContext.drawImage(dwarf.image, dwarfSize*tick, 0, dwarfSize, dwarfSize, x, y, tileSize, tileSize);
	if( dwarf.selected ){
	    dwarfContext.beginPath();
	    dwarfContext.rect(x+1, y+1, tileSize-2, tileSize-2);
	    dwarfContext.strokeStyle = 'rgba( 48, 128, 84, 128 )';
	    dwarfContext.stroke();
	}
    }
};

/*c.addEventListener("touchend", handleEnd, false);
c.addEventListener("touchcancel", handleCancel, false);
c.addEventListener("touchleave", handleEnd, false);
c.addEventListener("touchmove", handleMove, false);
*/

function handleStart( event ){
    event.preventDefault();
    var touches = event.targetTouches;
    for( var i = 0; i < touches.length; ++i ){
	var touchedTile = tile( touches[i].pageX, touches[i].pageY );
	var touchedDwarf = false;
	for( var j = 0; j < dwarves.length; ++j){
	    if( dwarves[j].x == touchedTile[0] && dwarves[j].y == touchedTile[1]){
		console.log( "Dwarf hit!" );
        dwarves[j].selected = true && !(dwarves[j].selected);
	    }
	}
	console.log( "Touched tile:" + touchedTile[0] + "-" + touchedTile[1] );
    }
};

var dwarfCanvas;
var worldCanvas;
var dwarfContext;
var worldcontext;
var dwarves = new Array();
var animatedDwarves;

var theWorld;

function randomWorld( xSize, ySize ){
    var tmp = [];
    for( var i = 0; i < xSize; ++i ){
	tmp[i] = [];
	for( var j = 0; j < ySize; ++j ){
	    tmp[i][j] = Math.round(Math.random());
	}
    }
    return tmp;
};

function getWorldTileTick( x, y ){
    var neighbourhood = theWorld.slice( Math.max( x - 1, 0), Math.min( x + 1, theWorld.length) ); //TODO: Add failsafes for border conditions
    neighbourhood = neighbourhood.map( function(a) { return a.slice( Math.max(0, y - 1), Math.min( y + 1, a.length) );});
    var nSum = neighbourhood.reduce(function(a,b) {return a + b});
    console.log( x + "-" + y + ":" + nSum);
    return 0;
};

function renderWorld(){
    var tileImage = new Image();
    tileImage.onload = function(){
	console.log("tileImage loaded!");
        var imageTileSize = tileImage.height;
	for( var i = 0; i < theWorld.length; ++i ){
	    for( var j = 0; j < theWorld[i].length; ++j ){
		var x = tileToPx( i );
		var y = tileToPx( j );
		var tick = 0;
		if( theWorld[i][j] == 1){
		    tick = getWorldTileTick( i, j );
		    worldContext.drawImage(tileImage, imageTileSize*tick, 0, imageTileSize, imageTileSize, x, y, tileSize, tileSize);
		}
	    }
	}
    };
    tileImage.src = "resources/rock.tiles.png";
};

function spawnDwarf( tileX, tileY ){
    var status;
    if( theWorld[tileX][tileY] == 1 ){
	status = "mining";
    }else{
	status = "idle"
    }
    dwarves.push( new Dwarf( tileX, tileY, status ) );
};

$(function() {
    dwarfCanvas = document.getElementById('anim');
    dwarfCanvas.width = window.innerWidth;
    dwarfCanvas.height = window.innerHeight;
    dwarfContext = dwarfCanvas.getContext('2d');
    dwarfContext.globalCompositeOperation = 'destination-over';
    dwarfCanvas.addEventListener("touchstart", handleStart, false);    

    theWorld = randomWorld( pxToTile(window.innerWidth), pxToTile(window.innerHeight) );
    
    worldCanvas = document.getElementById('world');
    worldCanvas.width = window.innerWidth;
    worldCanvas.height = window.innerHeight;
    worldContext = worldCanvas.getContext('2d');
    worldContext.clearRect(0, 0, worldCanvas.width, worldCanvas.height); // clear canvas


    spawnDwarf(2,4);
    spawnDwarf(3,7);
    spawnDwarf(5,5);

    animatedDwarves = new MiniDaemon( dwarves, animate, 500 );
    animatedDwarves.start();
    renderWorld( worldCanvas );
});
