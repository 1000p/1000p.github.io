function ChoosingBoard() {
    this.tileMap = [];
    this.container;
    this.selectedTileFlag = false;
    this.bombedTile;
    this.bombedBoard;
    this.canShootFlag = false;
}

ChoosingBoard.prototype.generatePlayground =
    function () {
        Board.prototype.generatePlayground.call(this);
        let rows = this.tileMap.length;
        let cols = this.tileMap[0].length;

        for (let iRow = 0; iRow < rows; iRow++) {
            for (let iCol = 0; iCol < cols; iCol++) {
                this.tileMap[iRow][iCol].addEventListener("click", function () {
                    this.owner.getTile(this.owner.tileMap[iRow][iCol]);
                })
            }
        }
        this.container.style.display = "none";
    }

ChoosingBoard.prototype.getTile =
    function (tile) {
        if (gameEngine.canShootFlag === false) {
            return;
        }
        if (tile.damageType !== "tile") {
            return false;
        } else {

            tile.owner.damageTile(tile);
            return true;
        }
    }

ChoosingBoard.prototype.damageTile =
    function (tile) {
        if (tile.taken === true) {
            tile.damageType = "tile-hit";
            tile.classList = "tile-hit";
            tile.ship.takeDamage(tile);
            this.bombedTile = { X: tile.X, Y: tile.Y };
        } else {
            tile.damageType = "tile-missed-hit";
            tile.classList = "tile-missed-hit";
        }
        this.bombedBoard.tileMap[tile.X][tile.Y].classList =
            tile.classList;
        this.bombedBoard.tileMap[tile.X][tile.Y].damageType =
            tile.damageType;

        let computerTile = gameEngine.userBoard.getRandomTile();
        while (!this.getTile(computerTile)) {
            computerTile = gameEngine.userBoard.getRandomTile();
        }

        let overlay = document.createElement("div");
        overlay.classList = "overlay";
        document.body.prepend(overlay);

        if (gameEngine.checkForWinner()) {
            return;
        }
        setTimeout(function () {
            gameEngine.choosingBoard.container.style.display = "none";
            gameEngine.userBoard.container.style.display = "";
            document.body.removeChild(overlay);
            console.log("Tile at X:" + tile.X + ", Y:" + tile.Y + " was damaged!");
        }, 1000);
    }

ChoosingBoard.prototype.selectTile =
    function (attackerBoard, enemyBoard) {

        attackerBoard.container.style.display = "none";
        enemyBoard.container.style.display = "none";
        this.bombedBoard = enemyBoard;
        enemyBoard.tileMap.forEach(tileRow => {
            tileRow.forEach(tile => {
                if (tile.taken === false ||
                    tile.damageType === "tile-missed-hit" ||
                    tile.damageType === "tile-hit") {
                    this.tileMap[tile.X][tile.Y].classList = tile.classList;
                }
                this.tileMap[tile.X][tile.Y].taken = tile.taken;
                this.tileMap[tile.X][tile.Y].ship = tile.ship;
            });
        });
        this.container.style.display = "";
    }

function GameEngine() {
    this.userBoard = new Board("user");
    this.computerBoard = new Board("computer");
    this.choosingBoard = new ChoosingBoard();
    this.userBoard.generatePlayground();
    this.computerBoard.generatePlayground();
    this.choosingBoard.generatePlayground();

    this.computerBoard.container.style.display = "none";

    this.battleship1 = new Battleship();
    this.battleship2 = new Battleship();
    this.destroyer1 = new Destroyer();
    this.destroyer2 = new Destroyer();
    this.destroyer3 = new Destroyer();
    this.destroyer4 = new Destroyer();

    this.fleetUser = [this.battleship1, this.destroyer1, this.destroyer2]
    this.fleetComputer = [this.battleship2, this.destroyer3, this.destroyer4]

    this.gameStarted = false;
}

GameEngine.prototype.startGame =
    function () {
        if (!this.gameStarted) {
            this.userBoard.placeShipsRandomly(this.fleetUser);
            this.computerBoard.placeShipsRandomly(this.fleetComputer);
            this.gameStarted = true;
        }
    }

GameEngine.prototype.checkForWinner =
    function () {
        let flag = false;
        let msg;
        if (this.computerBoard.ships.length <= 0) {
            msg = "Winner winner chicken dinner! You WON!";
            flag = true;
        } else if (this.userBoard.ships.length <= 0) {
            msg = "Loser, Loser, Nyquil Boozer!";
            flag = true;
        }
        if (flag) {
            this.choosingBoard.container.style.display = "none";
            this.computerBoard.container.style.display = "none";
            this.userBoard.container.style.display = "none";
            let winMsg = document.getElementsByClassName("winMsg");
            winMsg[0].innerText = msg;
            winMsg[0].style.display = "";
            return true;
        }
    }

GameEngine.prototype.restartGame =
    function (callback) {
        if (this.gameStarted) {
            window.location.reload();
            return;
        }
    }

GameEngine.prototype.takeTurn =
    function (player) {
        player.board.reveal
    }

var gameEngine = new GameEngine();
gameEngine.startGame();

function Player(board) {
    this.board = board;
}

Player.prototype.takeTurn =
    function () {

    }