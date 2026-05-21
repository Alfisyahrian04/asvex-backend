const {
  MeiliSearch
} = require('meilisearch');

const client =
new MeiliSearch({

  host:
    process.env.MEILI_HOST,

  apiKey:
    process.env.MEILI_KEY

});

module.exports = client;
