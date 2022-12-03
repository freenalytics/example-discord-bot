const path = require('path');
const { ConfigProvider, ExtendedClient } = require('@greencoast/discord.js-extended');
const FreenalyticsClient = require('./third-party/freenalytics/FreenalyticsClient');

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
  ])
  .registerCommandsIn(path.join(__dirname, './commands'));

client.on('ready', async () => {
  if (config.get('TESTING_GUILD_ID')) {
    client.deployer.rest.setToken(config.get('TOKEN'));
    await client.deployer.deployToTestingGuild();
  }
});

// Create Freenalytics client if there's both the API_URL and the DOMAIN specified.
if (config.get('FREENALYTICS_API_URL') && config.get('FREENALYTICS_DOMAIN')) {
  client.analytics = new FreenalyticsClient(client, {
    apiUrl: config.get('FREENALYTICS_API_URL'),
    domain: config.get('FREENALYTICS_DOMAIN')
  });
  client.analytics.initialize();
}

client.login(config.get('TOKEN'));
