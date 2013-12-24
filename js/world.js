
function World( xSize, ySize, zSize, evil, seed = 23 ){
    this.dimensions = new Position( xSize, ySize, zSize ); // although this works well we use Position unintendedly here o.O
    this.baselineEvil = evil;
    this.rock = numeric.rep([xSize, ySize, zSize], 1);
    this.evil = numeric.add(numeric.random([xSize, ySize, zSize]), this.baselineEvil);
    this.wealth = numeric.random([xSize, ySize, zSize]);
};

World.prototype.dig( x, y, z, rate){
    var current = this.rock[x,y,z];
    if( current - rate <= 0 ){ //This tile is empty now
	this.rock[x,y,z] = 0;
	player.wealth += this.wealth[x,y,z];
	this.wealth[x,y,z] = 0; //Take out all the gold
    }

};
