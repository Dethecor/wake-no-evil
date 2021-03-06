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
	this.image.src = 'resources/dwarf.idle.png';
	this.nFrames = 4;
    }else if( status == "mining" ){
	this.image.src = 'resources/dwarf.002.png';
	this.nFrames = 4;
    }else if( status == "rock" ){
	this.image.src = 'resources/rock.tiles.png';
	this.nFrames = 8;
    }else if( status == "monkey" ){
	this.image.src = 'resources/demon.monkey.png';
	this.nFrames = 1;
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
    for( var tidx = 0; tidx < miningQueue.length; ++tidx ){
	var x = tileToPx( miningQueue[tidx][0] );
	var y = tileToPx( miningQueue[tidx][1] );
	dwarfContext.beginPath();
	dwarfContext.rect(x+1, y+1, tileSize-2, tileSize-2);
	dwarfContext.strokeStyle = 'rgba( 128, 24, 24, 128 )';
	dwarfContext.stroke();
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
	miningQueue.push([i,j])
    }
};

var dwarfCanvas;
var worldCanvas;
var dwarfContext;
var worldcontext;
var dwarves = new Array();
var animatedDwarves;

var theWorld;
var miningQueue = new Array();
function randomWorld( xSize, ySize ){
    var tmp = [];
    for( var i = 0; i < xSize; ++i ){
	tmp[i] = [];
	for( var j = 0; j < ySize; ++j ){
	    tmp[i][j] = 1;//Math.round(Math.random());
	}
    }
    return tmp;
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
		if( theWorld[i][j] ){
		    worldContext.drawImage(tileImage, 0, 0, imageTileSize, imageTileSize, x, y, tileSize, tileSize); //draw the fill of squares
		    if( i > 0){
			if( theWorld[i-1][j] ){
			    worldContext.drawImage(tileImage, imageTileSize, 0, imageTileSize, imageTileSize, x, y, tileSize, tileSize); //draw the top side
			}
		    }
		    if( j < theWorld[i].length - 1 ){
			if( theWorld[i][j+1] ){
			    worldContext.drawImage(tileImage, 2*imageTileSize, 0, imageTileSize, imageTileSize, x, y, tileSize, tileSize); //draw the right side
			}
		    }
		    if( i < theWorld.length - 1 ){
			if( theWorld[i+1][j] ){
			    worldContext.drawImage(tileImage, 3*imageTileSize, 0, imageTileSize, imageTileSize, x, y, tileSize, tileSize); //draw the bottom side
			}
		    }
		    if( j > 0 ){
			if( theWorld[i][j-1] ){
			    worldContext.drawImage(tileImage, 4*imageTileSize, 0, imageTileSize, imageTileSize, x, y, tileSize, tileSize); //draw the left side
			}
		    }
		}
	    }
	}
    };
    tileImage.src = "resources/rock.tiles.simple.png";
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

    theWorld[4][4] = 0;
    spawnDwarf(4,4);
    spawnDwarf(7,7);
    spawnDwarf(8,9);
    dwarves[2].setStatus("monkey");
    theWorld[8][9] = 0;
    animatedDwarves = new MiniDaemon( dwarves, animate, 500 );
    animatedDwarves.start();
    renderWorld( worldCanvas );
});
