// Name: Nick Gebo
// VUNetID: gebons
// Email: nicholas.s.gebo@vanderbilt.edu
// Honor Statement: I pledge on my honor that I have neither given nor received unauthorized aid on
//                  this assignment.
import { GoogleTranslator } from '@translate-tools/core/translators/GoogleTranslator/index.js';

const DEBUG = false;

export async function hash(password, rounds) {
    if (typeof rounds !== 'number' || rounds < 1) {
        throw Error('rounds must be a positive integer.');
    }

    if (typeof password !== 'string' || !password.length) {
        throw Error('password must be a non-empty string.');
    }

    const translate = new GoogleTranslator();
    const hashLangs = [];
    // Get all supported languages
    const langs = translate.supportedLanguages();

    // Get languages to hash to
    while (hashLangs.length != rounds) {
        const lang = langs[Math.floor(Math.random() * langs.length)];
        if (!hashLangs.includes(lang)) {
            hashLangs.push(lang);
        }
    }

    // Add English to the start, as the start language
    hashLangs.unshift("en");

    // Hash the password
    for (let i = 0; i < hashLangs.length - 1; ++i) {
        if (DEBUG) console.log(hashLangs[i], hashLangs[i + 1]);
        password = await translate.translate(password, hashLangs[i], hashLangs[i + 1]);
        if (DEBUG) console.log(password);
    }

    return `$${hashLangs.join("$")}$${password}`;
}


export async function verify(password, hash) {
    if (typeof password !== 'string' || !password.length) {
        throw Error('password must be a non-empty string.');
    }

    if (typeof hash !== 'string' || !hash.length) {
        throw Error('hash must be a non-empty string.');
    }

    const translate = new GoogleTranslator();
    // Split hash string
    const splitHash = hash.split("$");
    // Get languages hash used
    const hashLangs = splitHash.slice(1, splitHash.length - 1);
    // Pull password off end
    const passwordHash = splitHash[splitHash.length - 1];

    // Hash the password
    for (let i = 0; i < hashLangs.length - 1; ++i) {
        if (DEBUG) console.log(hashLangs[i], hashLangs[i + 1]);
        password = await translate.translate(password, hashLangs[i], hashLangs[i + 1]);
        if (DEBUG) console.log(password);
    }

    return passwordHash === password;
}
