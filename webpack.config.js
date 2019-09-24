const path = require('path');

module.exports = {
    entry: path.join(__dirname, "./example/assets/index.js"),
    output: {
        path: path.resolve(__dirname, './example/static'),
        filename: 'index.js'
    },
    mode:"development"
};