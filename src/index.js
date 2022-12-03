const path = require('path');
const { ConfigProvider, ExtendedClient } = require('@greencoast/discord.js-extended');

const config = new ConfigProvider({
  configPath: path.join(__dirname, '../config.json'),
  env: process.env,
  default: {
    TESTING_GUILD_ID: null,
    FREENALYTICS_API_URL: null,
    FREENALYTICS_DOMAIN: null
  },
  types: {
    TOKEN: 'string',
    TESTING_GUILD_ID: ['string', 'null'],
    FREENALYTICS_API_URL: ['string', 'null'],
    FREENALYTICS_DOMAIN: ['string', 'null']
  }
});

const client = new ExtendedClient({
  config,
  debug: process.argv.includes('--debug'),
  testingGuildID: config.get('TESTING_GUILD_ID'),
  intents: ['GUILD_MESSAGES', 'GUILDS', 'GUILD_VOICE_STATES']
});

client.registerDefaultEvents()
  .registerExtraDefaultEvents();

client.registry
  .registerGroups([
    ['misc', 'Miscellaneous Commands']
  ]);

client.login(config.get('TOKEN'));
