const fs = require('fs');
const path = require('path');
const glob = require('glob');

const includeFiles = [
    'package.json',
    'plugin-name/**',
];

const ignoreFiles = [
    'node_modules',
    'dist',
    'build',
    'lib',
    'es',
    'cjs',
    'umd',
    'vendor',
    '.*'
];

const searchWords = [
    'wordpress-plugin-boilerplate',
    'WordPress-Plugin-Boilerplate',
    'plugin-name-uri',
    'plugin-name',
    'Plugin_Name',
    'Plugin Name',
]

function formatReplacement(searchWord, newString) {

    let replace = newString

    if (searchWord.charAt(0) >= 'a' && searchWord.charAt(0) <= 'z') {
        replace = newString.toLowerCase();
    }
    else if (searchWord.charAt(0) >= 'A' && searchWord.charAt(0) <= 'Z') {

        replace = "";
        const replaceWords = newString.split(' ');

        replaceWords.forEach((word) => {
            replace += word.charAt(0).toUpperCase() + word.slice(1) + " ";
        })
        replace = replace.trim();
    }

    if (searchWord.includes('-')) {
        replace = replace.replace(/ /g, '-');
    }
    if (searchWord.includes('_')) {
        replace = replace.replace(/ /g, '_');
    }

    return replace;
}

function replaceString(directory, oldString, newString) {

    const files = glob.sync(includeFiles, { ignore: ignoreFiles });//.concat(__dirname + '/package.json');
    files.forEach((filePath) => {
        if (!fs.lstatSync(filePath).isFile()) {
            return;
        }

        let count = 0;
        let fileContent = fs.readFileSync(filePath, 'utf8');

        searchWords.forEach((searchWord) => {

            const replace = formatReplacement(searchWord, newString);

            const search = new RegExp(searchWord + '(?!:)', 'g');
            if (search.test(fileContent)) {
                fileContent = fileContent.replace(search, replace);
                count++;
            }
        })

        if (count) {
            console.log('Updated file:', filePath);
            fs.writeFileSync(filePath, fileContent, 'utf8');
        }

    });

}

if (require.main === module) {

    if (process.argv.length < 3) {
        console.error('Usage: node set.js <plugin-name>');
        process.exit(1);
    }

    let newString = ""
    for (let i = 2; i < process.argv.length; i++) {
        newString += process.argv[i] + " ";
    }

    newString = newString.trim();

    replaceString(__dirname, 'plugin-name', newString);

    console.log("\nPlease don't forget to update any URIs and descriptions manually.\n");
}