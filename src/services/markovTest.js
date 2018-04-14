const markov = require('./markov');

async function test() {
    const mark = await markov.init();

    console.log('TEST MARKOV DEFAULT:\n', await mark.string());

    console.log('TEST MARKOV 50 CHAR:\n', await mark.string({ maxLength: 50 }));
}

test();