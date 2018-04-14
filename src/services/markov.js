const fs = require("fs");
const Markov = require('markov-strings');

const defaultCorpusPath = 'src/services/defaultCorpus.txt';

// Load default data
const defaultData = fs
    .readFileSync(defaultCorpusPath)
    .toString()
    .split('\n')
    .filter(Boolean);

// Some options to generate Twitter-ready strings
const defaultOptions = {
    minWords: 10,
    maxLength: 280
};

module.exports = { init };

async function init(data, options) {
    try {
        data = data || defaultData;
        options = options || defaultOptions;

        const existingFilter = options.filter;

        options.filter = result => {
            // Existing filter
            if (existingFilter && !existingFilter(result)) return false;
            // Not quoting corpus
            return data.indexOf(result.string) === -1;
        }

        const markov = new Markov(data, options);
        await markov.buildCorpus();
        markov.string = opt => markov.generateSentence(opt).then(r => r.string);
        return markov;
    } catch (err) {
        console.error('Markov died:\n', err);
    }
}

console.log('Initializing Markov');
init().then(console.log('Markov is ready'));