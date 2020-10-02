var Game = /** @class */ (function () {
    function Game(secretSize, jquery, maxNumberOfMoves) {
        if (maxNumberOfMoves === void 0) { maxNumberOfMoves = 10; }
        this.secretSize = secretSize;
        this.jquery = jquery;
        this.secret = new Array(secretSize);
        this.maxNumberOfMoves = maxNumberOfMoves;
        this.numberOfMoves = 0;
        console.log('constructor1 ');
    }
    Game.prototype.start = function () {
        console.log('start game...');
        this.numberOfMoves = 0;
        this.initSecretCode();
    };
    Game.prototype.initSecretCode = function () {
        for (var i = 0; i < this.secretSize; i++) {
            this.secret[1] = this.generateRandom();
        }
    };
    Game.prototype.generateRandom = function () {
        return Math.floor((Math.random() * (this.secretSize + 1)) + 1);
    };
    return Game;
}());
export default Game;
