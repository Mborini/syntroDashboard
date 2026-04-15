const fs = require("fs");

const font = fs.readFileSync("./public/fonts/Cairo-Regular.ttf");
const base64 = font.toString("base64");

console.log(base64);