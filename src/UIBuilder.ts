class UIBuilder {
    private secretSize: number;
    private jQuery: any;
    private mainDiv: string;

    private selectedCubes: any;
    private level: number;

    public constructor(mainDiv, jQuery, secretSize, level) {
        this.mainDiv = '#' + mainDiv;
        this.secretSize = secretSize + level;
        this.jQuery = jQuery;
        this.level = level;
    }

    public drawMainScreen() {
        this.jQuery(this.mainDiv).html(this.drawHeader() + this.drawContainer() + this.drawFooter() + this.initHelp());

        this.addListener();

    }

    private drawHeader() {

        let text = `
          <div id="game_header" class="menu">
                    <button onclick="Game.start()" class="btn left">New Game</button>
                    <button onclick="Game.help()" class="btn right">Help</button>
            </div>
        `;
        return '<div class="level">Level ' + this.level + '</div>' + text;
    }

    private drawFooter() {
        let result = '<div id="game_footer" style="text-align: center">';
        result += '<p>Choose colors:</p>';
        result += this.initCubes(true);
        result += '</div>';
        result += '<div id="footer_buttons" class="menu">';
        result += '<button class="btn left" id="validate" onclick="Game.validateLine()">Validate</button>';
        result += '<button class="btn right" id="reset" onclick="Game.resetLastLine()">Reset Line</button>';
        result += '</div>';
        result += '<div class="clearFix"></div>';


        return result;
    }

    private initCubes(withData) {
        let result = '';
        for (let i = 0; i < this.secretSize; i++) {
            result += '<div class="cube" ' + (withData ? ' data-id="' + i + '"' : '') + '></div>';
        }
        return result;
    }

    private drawContainer() {
        return '<div id="game_container">'
            + this.generateCubesRowLine()
            + '</div>';

    }

    private generateCubesRowLine() {
        return '<div class="cubes_row">'
            + this.initCubes(false)
            + '<div class="validation"></div>'
            + '</div>';
    }

    private addListener() {
        this.jQuery('#game_footer .cube').on('click', (event) => {
            let selectedId = this.jQuery(event.target).data('id');
            this.jQuery('.cubes_row:last .cube:not([data-id]):first').attr('data-id', selectedId);
        });
        this.jQuery('.info_close').on('click', (event) => {
            this.jQuery('.info').hide('slow');
        });
    }

    public resetLastLine() {
        this.jQuery('.cubes_row:last .cube').removeAttr('data-id');
    }

    public getSelectedCubes() {
        this.selectedCubes = [];
        this.jQuery('.cubes_row:last .cube[data-id]').each((index, element) => {
            this.selectedCubes[index] = this.jQuery(element).data('id');
        });

        return this.selectedCubes;
    }

    public displayValidation(correctPosition: number, incorrectPosition: number) {
        this.jQuery('.cubes_row:last .validation').html('Correct:' + correctPosition + ' Incorrect: ' + incorrectPosition);
        this.jQuery('#game_container').append(this.generateCubesRowLine());
    }

    initHelp() {
        return `
            <div class="info">
                <h1>Find the secret combination</h1>
                <p>At the bottom of the page you have multiple colors. Click on them to find de secret combination. After all boxes are filled, click on validate.</p>
                <p>After validation, you will get the following information:</p>
                <p> 
                    <ul>
                        <li>Correct: This means that some colors are on the right position</li>
                        <li>Incorrect: This means that some colors are correct, but are not on the right position.</li>
                    </ul>
                </p>
                <p>
                    The goal is to have all the colors on the correct positions. Once you find that, you will advance to the next level.
                </p>
                <p class="right">
                    <button class="btn info_close">Close</button>
                </p>
                <div class="clearFix"></div>
            </div>
        `
    }

    showHelp() {
        this.jQuery('.info').show('slow');
    }
}