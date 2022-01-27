const { join } = require("path");
const { readdirSync } = require("fs");
const Canvas = require("canvas");

async function getBg(path) {
    const bgImg = await Canvas.loadImage(path);
    const bgCanvas = Canvas.createCanvas(bgImg.width, bgImg.height);
    const context = bgCanvas.getContext("2d", { alpha: false });
    context.imageSmoothingEnabled = false;
    context.drawImage(bgImg, 0, 0);
    return bgCanvas;
}

async function getGlyphs(path) {
    const glyphs = require(join(path, "sizes.json"));
    for (glyphName in glyphs) {
        const glyph = await Canvas.loadImage(join(path, glyphName + ".png"));
        const glyphCanvas = Canvas.createCanvas(glyph.width, glyph.height);
        const context = glyphCanvas.getContext("2d");
        context.imageSmoothingEnabled = false;
        context.drawImage(glyph, 0, 0);
        glyphs[glyphName] = { ...glyphs[glyphName], glyph: glyphCanvas };
    }
    return glyphs;
}

module.exports = async (
    bgPath = join(
        __dirname,
        "..",
        "..",
        "assets",
        "dialogue_frames",
        "orange.jpg"
    ),
    glyphsPath = join(
        __dirname,
        "..",
        "..",
        "assets",
        "glyphs",
        "Press Start 2P"
    )
) => {
    return {
        bg: await getBg(bgPath),
        glyphs: await getGlyphs(glyphsPath),
    };
};
