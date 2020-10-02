var UIBuilder = (function () {
    function UIBuilder(mainDiv, jQuery, secretSize, level) {
        this.mainDiv = '#' + mainDiv;
        this.secretSize = secretSize + level;
        this.jQuery = jQuery;
        this.level = level;
    }
    UIBuilder.prototype.drawMainScreen = function () {
        this.jQuery(this.mainDiv).html(this.drawHeader() + this.drawContainer() + this.drawFooter() + this.initHelp());
        this.addListener();
    };
    UIBuilder.prototype.drawHeader = function () {
        var text = "\n          <div id=\"game_header\" class=\"menu\">\n                    <button onclick=\"Game.start()\" class=\"btn left\">New Game</button>\n                    <button onclick=\"Game.help()\" class=\"btn right\">Help</button>\n            </div>\n        ";
        return '<div class="level">Level ' + this.level + '</div>' + text;
    };
    UIBuilder.prototype.drawFooter = function () {
        var result = '<div id="game_footer" style="text-align: center">';
        result += '<p>Choose colors:</p>';
        result += this.initCubes(true);
        result += '</div>';
        result += '<div id="footer_buttons" class="menu">';
        result += '<button class="btn left" id="validate" onclick="Game.validateLine()">Validate</button>';
        result += '<button class="btn right" id="reset" onclick="Game.resetLastLine()">Reset Line</button>';
        result += '</div>';
        result += '<div class="clearFix"></div>';
        return result;
    };
    UIBuilder.prototype.initCubes = function (withData) {
        var result = '';
        for (var i = 0; i < this.secretSize; i++) {
            result += '<div class="cube" ' + (withData ? ' data-id="' + i + '"' : '') + '></div>';
        }
        return result;
    };
    UIBuilder.prototype.drawContainer = function () {
        return '<div id="game_container">'
            + this.generateCubesRowLine()
            + '</div>';
    };
    UIBuilder.prototype.generateCubesRowLine = function () {
        return '<div class="cubes_row">'
            + this.initCubes(false)
            + '<div class="validation"></div>'
            + '</div>';
    };
    UIBuilder.prototype.addListener = function () {
        var _this = this;
        this.jQuery('#game_footer .cube').on('click', function (event) {
            var selectedId = _this.jQuery(event.target).data('id');
            _this.jQuery('.cubes_row:last .cube:not([data-id]):first').attr('data-id', selectedId);
        });
        this.jQuery('.info_close').on('click', function (event) {
            _this.jQuery('.info').hide('slow');
        });
    };
    UIBuilder.prototype.resetLastLine = function () {
        this.jQuery('.cubes_row:last .cube').removeAttr('data-id');
    };
    UIBuilder.prototype.getSelectedCubes = function () {
        var _this = this;
        this.selectedCubes = [];
        this.jQuery('.cubes_row:last .cube[data-id]').each(function (index, element) {
            _this.selectedCubes[index] = _this.jQuery(element).data('id');
        });
        return this.selectedCubes;
    };
    UIBuilder.prototype.displayValidation = function (correctPosition, incorrectPosition) {
        this.jQuery('.cubes_row:last .validation').html('Correct:' + correctPosition + ' Incorrect: ' + incorrectPosition);
        this.jQuery('#game_container').append(this.generateCubesRowLine());
    };
    UIBuilder.prototype.initHelp = function () {
        return "\n            <div class=\"info\">\n                <h1>Find the secret combination</h1>\n                <p>At the bottom of the page you have multiple colors. Click on them to find de secret combination. After all boxes are filled, click on validate.</p>\n                <p>After validation, you will get the following information:</p>\n                <p> \n                    <ul>\n                        <li>Correct: This means that some colors are on the right position</li>\n                        <li>Incorrect: This means that some colors are correct, but are not on the right position.</li>\n                    </ul>\n                </p>\n                <p>\n                    The goal is to have all the colors on the correct positions. Once you find that, you will advance to the next level.\n                </p>\n                <p class=\"right\">\n                    <button class=\"btn info_close\">Close</button>\n                </p>\n                <div class=\"clearFix\"></div>\n            </div>\n        ";
    };
    UIBuilder.prototype.showHelp = function () {
        this.jQuery('.info').show('slow');
    };
    return UIBuilder;
}());
var Game = (function () {
    function Game(secretSize) {
        this.mainDivId = 'main_game';
        this.level = 0;
        this.MAX_LEVEL = 10;
        this.secretSize = secretSize;
    }
    Game.prototype.withJQuery = function (jQuery) {
        this.jquery = jQuery;
        return this;
    };
    Game.prototype.initUIBuilder = function () {
        this.UIBuilder = new UIBuilder(this.mainDivId, this.jquery, this.secretSize, this.level);
        return this;
    };
    Game.prototype.start = function () {
        this.secret = new Array(this.secretSize + this.level);
        this.initUIBuilder();
        this.initSecretCode();
        this.UIBuilder.drawMainScreen();
    };
    Game.prototype.resetLastLine = function () {
        this.UIBuilder.resetLastLine();
    };
    Game.prototype.getSecretSizeByLevel = function () {
        return this.secretSize + this.level;
    };
    Game.prototype.validateLine = function () {
        var selectedCubes = this.UIBuilder.getSelectedCubes();
        if (selectedCubes.length !== this.getSecretSizeByLevel()) {
            alert('You have to fill all the cubes.');
            return;
        }
        var correctPosition = [];
        var incorrect = 0;
        var incorrectValues = [];
        for (var i = 0; i < selectedCubes.length; i++) {
            if (selectedCubes[i] === this.secret[i]) {
                correctPosition.push(i);
            }
            else {
                incorrectValues.push(selectedCubes[i]);
            }
        }
        for (var j = 0; j <= this.secret.length; j++) {
            if (correctPosition.indexOf(j) !== -1) {
                continue;
            }
            if (incorrectValues.indexOf(this.secret[j]) !== -1) {
                incorrect++;
            }
        }
        if (this.getSecretSizeByLevel() === correctPosition.length) {
            alert('You won level ' + this.level + '!');
            this.level++;
            if (this.level > this.MAX_LEVEL) {
                alert('You completed all the game');
                return;
            }
            this.start();
            return;
        }
        this.UIBuilder.displayValidation(correctPosition.length, incorrect);
    };
    Game.prototype.initSecretCode = function () {
        for (var i = 0; i < this.getSecretSizeByLevel(); i++) {
            this.secret[i] = this.generateRandom();
        }
    };
    Game.prototype.generateRandom = function () {
        return Math.floor(Math.random() * this.getSecretSizeByLevel());
    };
    Game.prototype.help = function () {
        this.UIBuilder.showHelp();
    };
    return Game;
}());
