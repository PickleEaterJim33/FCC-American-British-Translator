const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js")
const britishOnly = require('./british-only.js')

const britishToAmericanSpelling =
    swapKeysAndValues(americanToBritishSpelling);
const britishToAmericanTitles =
    swapKeysAndValues(americanToBritishTitles);

const AB = 'american-to-british';

class Translator {

    highlight(str) {
        return `<span class="highlight">${str}</span>`;
    }

    translate(text, locale) {
        return locale === AB
            ? this.analyzeAndTranslate(text, locale, americanOnly, americanToBritishSpelling, americanToBritishTitles)
            : this.analyzeAndTranslate(text, locale, britishOnly, britishToAmericanSpelling, britishToAmericanTitles);
    }

    analyzeAndTranslate(text, locale, langOnly, spelling, titles) {
        let translation = text
                            .replace(/\n+/g, '')
                            .replace(/ {2,}/, ' ')
                            .trim();

        const langOnlyKeys = Object.keys(langOnly);
        const spellingKeys = Object.keys(spelling);
        const titlesKeys = Object.keys(titles);

        const specialLookbehind = '(?<!((\\w)|(\\<span class\\="highlight">)))(';
        const specialLookahead = ')(?!((\\w)|(\</span>)))';

        for (let key of langOnlyKeys) {
            translation = translation.replace(
                new RegExp(specialLookbehind + key + specialLookahead, 'gi'),
                this.highlight(langOnly[key])
            );
        }

        for (let key of spellingKeys) {
            translation = translation.replace(
                new RegExp('(?<!\\w)(' + key + ')(?!\\w)', 'gi'),
                this.highlight(spelling[key])
            );
        }

        
        for (let key of titlesKeys) {
            translation = translation.replace(
                new RegExp('(?<!\\w)' + (locale === AB ? `(${key.substring(0, key.length - 1)}\\.)` : `(${key})(?!\\w)`), 'gi'),
                this.highlight(titles[key].charAt(0).toUpperCase() + titles[key].slice(1))
            );
        }

        const timeMatches = translation.match(
            locale === AB ? (/[0-9]{1,2}\:[0-9]{1,2}/g) : (/[0-9]{1,2}\.[0-9]{1,2}/g)
        );
        if (timeMatches !== null) {
            for (let match of timeMatches) {
                translation = translation.replace(
                    match,
                    this.highlight(match.replace(
                        locale === AB ? ':' : '.',
                        locale === AB ? '.' : ':'
                    ))
                );
            }
        }

        if (/^[a-z]/.test(translation)) {
            translation = translation.charAt(0).toUpperCase() + translation.slice(1);
        }

        return { text: text, translation: translation };
    }
}

function swapKeysAndValues(obj) {
    let swap = {};

    for (let key in obj) {
        swap[obj[key]] = key;
    }

    return swap;
}

module.exports = Translator;