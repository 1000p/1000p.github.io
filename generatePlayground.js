var browserViewportHeight = $(window).height();
var browserViewportWidth = $(window).width();

function Board(name) {
    this.tileMap = [];
    this.name = name;
    this.ships = [];
    this.bombedTiles = [];
}

Board.prototype.placeShipsRandomly =
    function (arrayOfShips) {
        arrayOfShips.forEach(ship => {
            let directions = ["horizontal", "vertical"];
            let direction = Math.floor(Math.random() * 2);

            let randomTile = this.getRandomTile();
            while (!randomTile.ship === undefined) {
                randomTile = this.getRandomTile();
            }

            let iRow = 0;
            let iCol = 0;
            switch (direction) {
                case 0:
                    iCol = 1;
                    break;
                case 1:
                    iRow = 1;
                    break;
            }

            let shipStartTile = { X: 0, Y: 0 };
            let canPlaceshipFlag = this.canPlaceShip(ship.length, randomTile, shipStartTile, iRow, iCol);
            while (canPlaceshipFlag === false) {
                randomTile = this.getRandomTile();
                canPlaceshipFlag = this.canPlaceShip(ship.length, randomTile, shipStartTile, iRow, iCol);
            }
            ship.placeShip(this.tileMap[shipStartTile.X][shipStartTile.Y], directions[direction], this);
            this.ships.push(ship);
        });
    }

Board.prototype.canPlaceShip =
    function (shipLenght, tile, startTile, iRow, iCol) {
        let result = false;
        let freeSpots = 0;
        startTile.X = tile.X;
        startTile.Y = tile.Y;

        let fitsInDirection = false;
        // Horizontaly
        if (iCol > 0) {
            //Right
            if (tile.Y + shipLenght <= this.tileMap[0].length) {
                fitsInDirection = true;
            } //Left
            else if (tile.Y - shipLenght >= 0) {
                fitsInDirection = true;
                iCol = -1;
            }
        }
        // Vertically
        else {
            //Down
            if (tile.X + shipLenght <= this.tileMap.length) {
                fitsInDirection = true;
            }
            //Up 
            else if (tile.X - shipLenght >= 0) {
                fitsInDirection = true;
                iRow = -1;
            }
        }

        if (fitsInDirection) {
            let i = 0;
            let movRow = 0;
            let movCol = 0;
            while (freeSpots != shipLenght || i < shipLenght) {
                if (this.tileMap[tile.X + movRow][tile.Y + movCol].taken ===
                    false) {
                    freeSpots++;
                } else {
                    console.log(this.tileMap[tile.X + movRow][tile.Y + movCol].X + " Y:" +
                        this.tileMap[tile.X + movRow][tile.Y + movCol].Y)
                    return false;
                }
                i++;
                movCol = movCol + iCol;
                movRow = movRow + iRow;
            }
            //Direction is vertical up
            if (iRow < 0) {
                startTile.X -= shipLenght - 1;
            }
            //Direction is horizontal left
            else if (iCol < 0) {
                startTile.Y -= shipLenght - 1;
            }
            result = true;
        }
        return result;
    }

Board.prototype.damageTile =
    function (tile) {
        if (tile.damageType === undefined) {
            console.log("stop");
        }
        if (tile.taken === true) {
            tile.damageType = "tile-hit";
            tile.classList = "tile-hit";
            tile.ship.takeDamage(tile);
        } else {
            tile.damageType = "tile-missed-hit";
            tile.classList = "tile-missed-hit";
        }
        if (gameEngine.checkForWinner()) {
            return;
        }
        setTimeout(function () {
            console.log("Tile at X:" + tile.X + ", Y:" + tile.Y + " was damaged!");
        }, 1000);
    }

Board.prototype.getRandomTile =
    function () {
        let row = Math.floor(Math.random() * this.tileMap
            .length);
        let col = Math.floor(Math.random() * this.tileMap[0]
            .length);
        let tile = this.tileMap[row][col];
        return tile;
    }

Board.prototype.generatePlayground =
    function () {
        let container = document.createElement("div");
        container.className = "container";
        let board = document.createElement("div");
        board.className = "board";
        container.appendChild(board);

        container.style.height = Math.floor(browserViewportHeight * 0.8) + "px";
        container.style.width = Math.floor(browserViewportHeight * 0.8) + "px";

        //Create top row notation tiles
        let tile = document.createElement("div");
        tile.className = "tile notation";
        board.appendChild(tile);
        for (let i = 0; i < 10; i++) {
            let notString = String.fromCharCode(65 + i);
            tile = document.createElement("div");
            tile.className = "tile notation";
            tile.id = notString;
            tile.innerText = notString;
            board.appendChild(tile);
        }
        //Create all other rows
        for (let row = 1; row < 11; row++) {
            tile = document.createElement("div");
            tile.className = "tile notation";
            tile.id = row;
            tile.innerText = row;
            board.appendChild(tile);

            this.tileMap.push([]);
            for (let d = 0; d < 10; d++) {
                tile = document.createElement("div");
                tile.className = "tile";
                tile.X = row - 1;
                tile.Y = d;
                tile.taken = false;
                tile.damageType = "tile";
                tile.owner = this;

                board.appendChild(tile);
                this.tileMap[row - 1].push(tile);
            }
        }
        this.container = container;

        let boardsCont = document.getElementById("boards-container");
        boardsCont.appendChild(container);
    }

Board.prototype.removeShips =
    function () {
        this.ships.forEach(ship => {
            for (let i = 0; i < ship.tiles.length; i++) {
                ship.tiles[i].classList.remove(ship.type + (i + 1), ship.direction);

            }
            ship.tiles = [];
        });
        while (this.ships.length > 0) {
            this.ships.pop();
        }
    }
