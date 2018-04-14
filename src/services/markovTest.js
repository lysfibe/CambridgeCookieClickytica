/**
 * Run (or require) this file to output some test Markov strings to the console.
 */
const markov = require('./markov');
test();
async function test() {

    // Test default model ------------------------------------------------------
    const dm = await markov.default;

    console.log('TEST MARKOV DEFAULT:\n', await dm.string());

    // Test new model ----------------------------------------------------------
    const m = await markov.init();

    console.log('TEST MARKOV NO-OPT:\n', await m.string());

    console.log('TEST MARKOV 50 CHAR:\n', await m.string({ maxLength: 50 }));

    // Test performance
    let start = Date.now();
    const tasks = [];
    for (let i = 0; i < 100; i++) {
        tasks.push(m.string());
    }
    await Promise.all(tasks);
    const diff = Date.now() - start;
    console.log('COMPLETED 100 MARKOVS IN ' + diff / 1000 + ' SECONDS');
}