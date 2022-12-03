const axios = require('axios');
const logger = require('@greencoast/logger');
const { Message } = require('discord.js');

const DEFAULT_INTERVAL = 10000;

class FreenalyticsClient {
  constructor(client, options) {
    FreenalyticsClient.validateOptions(options);
    
    this.client = client;
    this.apiUrl = options.apiUrl;
    this.domain = options.domain;
    this.interval = Math.floor(options.interval ?? DEFAULT_INTERVAL);

    this.rest = axios.create({
      baseURL: this.apiUrl
    });
  }

  initialize() {
    this.registerEvents();
    setInterval(this.postIntervalHandler.bind(this), this.interval);
  }

  registerEvents() {
    this.client.on('commandExecute', this.handleCommandExecution.bind(this));
    this.client.on('commandError', this.handleCommandError.bind(this));
  }

  handleCommandExecution(command, trigger) {
    const author = trigger instanceof Message ?
      `${trigger.author.username}#${trigger.author.discriminator}` :
      `${trigger.user.username}#${trigger.user.discriminator}`;

    return this.postPayload({
      command_name: command.name,
      command_author: author,
      command_success: true
    });
  }

  handleCommandError(error, command, trigger) {
    const author = trigger instanceof Message ?
      `${trigger.author.username}#${trigger.author.discriminator}` :
      `${trigger.user.username}#${trigger.user.discriminator}`;
      
    return this.postPayload({
      command_name: command.name,
      command_author: author,
      command_success: false,
      command_error_message: error?.message ?? 'An unknown error occurred.'
    });
  }

  postIntervalHandler() {
    const guildCount = this.client.guilds.cache.size;
    const memberCount = this.client.guilds.cache.reduce((sum, guild) => sum + guild.memberCount, 0);

    return this.postPayload({
      server_count: guildCount,
      member_count: memberCount
    });
  }

  async postPayload(payload) {
    try {
      await this.rest.post(`/applications/${this.domain}/data`, payload);
      logger.debug(`Successfully posted analytics with payload: ${JSON.stringify(payload)}`);
    } catch (error) {
      logger.error(error.message);
    }
  }

  static validateOptions(options) {
    if (!options.apiUrl) {
      throw new Error('options.apiUrl is required.');
    }
    
    if (!options.domain) {
      throw new Error('options.domain is required.');
    }

    if (options.interval) {
      if (isNaN(options.interval) || options.interval < 1) {
        throw new Error('options.interval should be a positive number.');
      }
    }
  }
}

module.exports = FreenalyticsClient;
