/**
 * Wrapper for Markov string generator.
 * See markovTest.js for example usage.
 */
const fs = require('fs-extra');
const Markov = require('markov-strings');

const defaultCorpusPath = 'src/services/defaultCorpus.txt';

// Load default data
const defaultData = { path: defaultCorpusPath };

// Some options to generate Twitter-ready strings
const defaultOptions = {
    minLength: 100,
    maxLength: 156
};

module.exports = { init };

async function init(data, options) {
    try {
        data = data || defaultData;
        options = options || defaultOptions;

        // Allow file paths
        if (data.path) data = (await fs.readFile(data.path)).toString();

        data = clean(data);

        options = setFilter(options, data);

        // Construct (potentially slow)
        const markov = new Markov(data, options);
        await markov.buildCorpus();

        // Convenience method
        markov.string = opt => markov.generateSentence(opt).then(r => r.string);

        return markov;
    } catch (err) {
        console.error('Markov died:\n', err);
    }
}

function clean(data) {
    // For arrays of strings containing \n
    if (Array.isArray(data)) data = data.join('\n');

    // Convert to string if unexpected input
    if (typeof data !== 'string') data = data.toString();

    // Convert to array of strings, remove empty strings
    return data.split('\n').filter(Boolean);
}

function setFilter(options, data) {
    const existingFilter = options.filter;
    options.filter = result => {
        // Existing filter
        if (existingFilter && !existingFilter(result)) return false;
        // Not quoting corpus
        return data.indexOf(result.string) === -1;
    }
    return options;
}

console.log('Initializing Markov');
module.exports.default = init().then(console.log('Markov is ready'));