
function World( xSize, ySize, zSize, evil, seed = 23 ){
    this.dimensions = new Position( xSize, ySize, zSize ); // although this works well we use Position unintendedly here o.O
    this.baselineEvil = evil;
    this.rock = numeric.rep(xSize, ySize, zSize, 1);
    this.evil = numeric.random();
    this.wealth = numeric.rep(xSize, ySize, zSize, 0);
}
