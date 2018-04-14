/**
 * Run (or require) this file to output some test Markov strings to the console.
 */
const markov = require('./markov');
test();
async function test() {
    const m = await markov.init();

    console.log('TEST MARKOV DEFAULT:\n', await m.string());

    console.log('TEST MARKOV 50 CHAR:\n', await m.string({ maxLength: 50 }));

}