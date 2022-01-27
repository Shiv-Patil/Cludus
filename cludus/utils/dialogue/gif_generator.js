const GIFEncoder = require("gif-encoder-2");
const Canvas = require("canvas");
const EventEmitter = require("events");

module.exports = class Generator extends EventEmitter {
    /**
     * @param {Canvas} bg           Background frame of dialog box
     * @param {object} glyphs       Glyphs in the form {"ascii code": {w: 69, h: 420, glyph: Image[]}, ...}
     * @param {number} width        Width of canvas in pixels
     * @param {number} height       Height of canvas in pixels
     * @param {number} letterDelay  delay between each frame/letter of the gif
     * @param {number} leftBorder   Left bounding border of canvas
     * @param {number} rightBorder  Right bounding border of canvas
     * @param {number} topBorder    Top bounding border of canvas
     * @param {number} lineHeight   Height of one line in the dialog box
     * @param {number} wordSpacing  Spacing between two words
     * @param {number} skip         Number of steps per gif frame
     * @param {number} endDelay     Delay at the end of gif
     */
    constructor(
        bg,
        glyphs,
        width = 350,
        height = 125,
        letterDelay = 50,
        leftBorder = 24,
        rightBorder = 24,
        topBorder = 36,
        lineHeight = 14,
        wordSpacing = 10,
        step = 2,
        endDelay = 2000
    ) {
        super();
        this.dialogWidth = width;
        this.dialogHeight = height;
        this.letterDelay = letterDelay;
        this.dialogLeftBorder = leftBorder;
        this.dialogRightBorder = rightBorder;
        this.dialogTopBorder = topBorder;
        this.lineHeight = lineHeight;
        this.wordSpacing = wordSpacing;
        this.step = step;
        this.endDelay = endDelay;
        this.dialogBg = bg;
        this.glyphs = glyphs;
        this.canvas = Canvas.createCanvas(this.dialogWidth, this.dialogHeight);
    }

    getCanvasContext() {
        if (!this.context) {
            this.context = this.canvas.getContext("2d", { alpha: "false" });
            this.context.imageSmoothingEnabled = false;
        }
        return this.context;
    }

    init() {
        this.encoder = new GIFEncoder(
            this.dialogWidth,
            this.dialogHeight,
            "octree"
        );
        this.encoder.setRepeat(-1); // Any value < 0 = no repeat
        this.rawText = ""; // text string passed to this.renderGif
        this.text = []; // Array of ["chr", Xpos, Ypos]
        this._step = this.step; // temp var to keep track of steps
        this.renderBg();
    }

    renderGif(text) {
        this.init();
        this.rawText = text + " ";
        this.processText(); // Calculate character positions
        this.encoder.start();
        this.renderFrames(); // Render individual gif frames
        this.encoder.finish();
        return this.encoder.out.getData();
    }

    processText() {
        const maxLineXpos = this.dialogWidth - this.dialogRightBorder;
        let xPos = this.dialogLeftBorder; // Current cursor x position
        let line = 0;
        let addLine = false; // Whether to add line
        let addSpacing = false; // Whether to add space
        let nextWord = ""; // Stores next word to render
        let nextWordLength = 0; // Length on next word in pixels
        let wordEnd = false; // whitespace indicating end of word

        for (let i = 0; i < this.rawText.length; ++i) {
            switch (this.rawText[i]) {
                case " ":
                    addSpacing = true;
                    wordEnd = true;
                    break;
                case "\n":
                    nextWord += "\\\\\\";
                    addLine = true;
                    wordEnd = true;
                    break;
                default:
                    if (
                        this.rawText[i].charCodeAt(0) in this.glyphs ||
                        this.rawText[i] === "\\"
                    )
                        nextWord += this.rawText[i];
            }
            if (wordEnd) {
                nextWordLength = this.getWordLength(nextWord);
                if (xPos + nextWordLength > maxLineXpos) {
                    xPos = this.dialogLeftBorder;
                    line += 1;
                }
                this.pushWordToText(nextWord, xPos, line);
                if (addSpacing) xPos += this.wordSpacing;
                wordEnd = false;
                xPos += nextWordLength;
                nextWord = "";
                if (addLine) {
                    line += 1;
                    addLine = false;
                    xPos = this.dialogLeftBorder;
                }
            }
        }
    }

    pushWordToText(word, xPos, line) {
        if (line >= 4) return;
        let chrWidth = 0;
        for (let chr of word) {
            chrWidth = this.getCharLength(chr);
            this.text.push([
                chr,
                xPos,
                line * this.lineHeight + this.dialogTopBorder,
            ]);
            xPos += chrWidth;
        }
    }

    getCharLength(chr) {
        if (chr === "\\") return 0;
        return this.glyphs[chr.charCodeAt(0)].w;
    }

    getWordLength(word) {
        let wordLength = 0;
        for (let chr of word) {
            wordLength += this.getCharLength(chr);
        }
        return wordLength;
    }

    renderBg() {
        this.getCanvasContext().drawImage(
            this.dialogBg,
            0,
            0,
            this.dialogWidth,
            this.dialogHeight
        );
    }

    renderFrames() {
        const frames = this.text.length + 1;
        let frame = 0;
        this.encoder.addFrame(this.getCanvasContext()); // Empty dialog

        for (let chr of this.text) {
            this.currentDelay += this.letterDelay;
            if (chr[0] === "\\") {
                this.currentDelay += this.letterDelay * 2;
                this._step = 1;
                continue;
            }
            if (--this._step <= 0) {
                this.encoder.setDelay(this.currentDelay);
                this.encoder.addFrame(this.getCanvasContext());
                this._step += this.step;
                this.currentDelay = 0;
            }
            let glyph = this.glyphs[chr[0].charCodeAt(0)].glyph;
            this.getCanvasContext().drawImage(glyph, chr[1], chr[2]);
            this.emit("progress", ++frame / frames);
        }
        this.encoder.setDelay(this.endDelay);
        this.encoder.addFrame(this.getCanvasContext()); // Long frame with whole text at the end
        this.emit("progress", 1);
    }
};
