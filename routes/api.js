'use strict';

const Translator = require('../components/translator.js');

module.exports = function (app) {
  
  const translator = new Translator();

  app.route('/api/translate')
    .post((req, res) => {
      const text = req.body.text;
      const locale = req.body.locale;

      if (typeof text === 'undefined' || text === null
      || typeof locale === 'undefined' || locale === null) {
        return res.send({ error: 'Required field(s) missing' });
      }

      if (text === '') return res.send({ error: 'No text to translate' });

      if (locale !== 'american-to-british' && locale !== 'british-to-american') {
        return res.send({ error: 'Invalid value for locale field' });
      }

      const result = translator.translate(text, locale);
      if (result.text === result.translation) {
        result.translation = 'Everything looks good to me!';
      }

      return res.send(result);
    });
};
