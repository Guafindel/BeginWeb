// print process.argv
process.argv.forEach(function (val, index, array) {
    console.log(index + ': ' + val);
});

var args = process.argv;

console.log(args);