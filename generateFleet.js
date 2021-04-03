function Ship(length,type) {
    this.length = length;
    this.tiles = [];
    this.type = type;
    this.owner;
};
Ship.prototype.placeShip =
    function (tile, direction,owner) {
        switch (direction) {
            case "horizontal":
                for (let i = 0; i < this.length; i++) {
                    let mapTile = owner.tileMap[tile.X][tile.Y + i];
                    mapTile.classList.add(this.type + (i+1));
                    mapTile.classList.add("horizontal");
                    mapTile.taken = true;
                    mapTile.ship = this;
                    this.tiles.push(mapTile);
                }
                break;

            case "vertical":
                for (let i = 0; i < this.length; i++) {
                    let mapTile = owner.tileMap[tile.X + i][tile.Y];
                    mapTile.classList.add(this.type + (i+1));
                    mapTile.classList.add("vertical");
                    mapTile.taken = true;
                    mapTile.ship = this;
                    this.tiles.push(mapTile);
                }
                break;
        }
        this.direction = direction;
        this.owner = owner;
    }

Ship.prototype.takeDamage =
    function(tile) {
        this.tiles.pop();
        if(this.tiles.length === 0)
        {
            this.owner.ships.pop();
        }
        tile.style.classList = "tile-hit";
    }

function Battleship() {
    Ship.call(this, 5,"battleship");
};
Battleship.prototype = Object.create(Ship.prototype);
Object.defineProperty(Battleship.prototype, "constructor", {
    value: Battleship,
    enumerable: false,
    writable: true
});

function Destroyer() {
    Ship.call(this, 4,"destroyer");
};
Destroyer.prototype = Object.create(Ship.prototype);
Object.defineProperty(Destroyer.prototype, "constructor", {
    value: Destroyer,
    enumerable: false,
    writable: true
});