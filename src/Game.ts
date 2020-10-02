class Game {
    private secretSize: number;
    private jquery: any;
    private secret: any;
    private UIBuilder: UIBuilder;
    private mainDivId = 'main_game';
    private level = 0;
    MAX_LEVEL = 10;

    public constructor(secretSize: number) {
        this.secretSize = secretSize;
    }

    public withJQuery(jQuery) {
        this.jquery = jQuery;

        return this;
    }

    private initUIBuilder() {
        this.UIBuilder = new UIBuilder(this.mainDivId, this.jquery, this.secretSize, this.level);

        return this;
    }

    public start() {
        this.secret = new Array(this.secretSize + this.level);
        this.initUIBuilder();
        this.initSecretCode();
        this.UIBuilder.drawMainScreen();
    }

    public resetLastLine() {
        this.UIBuilder.resetLastLine();
    }

    private getSecretSizeByLevel() {
        return this.secretSize + this.level;
    }

    public validateLine() {
        const selectedCubes = this.UIBuilder.getSelectedCubes();
        if (selectedCubes.length !== this.getSecretSizeByLevel()) {
            alert('You have to fill all the cubes.');
            return;
        }
        let correctPosition = [];
        let incorrect = 0;
        let incorrectValues = [];

        for (let i = 0; i < selectedCubes.length; i++) {
            if (selectedCubes[i] === this.secret[i]) {
                correctPosition.push(i);
            } else {
                incorrectValues.push(selectedCubes[i]);
            }
        }
        for (let j = 0; j <= this.secret.length; j++) {
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
            //TODO: mark row as completed
            return;
        }
        this.UIBuilder.displayValidation(correctPosition.length, incorrect);


    }

    private initSecretCode() {
        for (let i = 0; i < this.getSecretSizeByLevel(); i++) {
            this.secret[i] = this.generateRandom();
        }
    }

    private generateRandom() {
        return Math.floor(Math.random() * this.getSecretSizeByLevel());
    }

    public help() {
        this.UIBuilder.showHelp();
    }

}


