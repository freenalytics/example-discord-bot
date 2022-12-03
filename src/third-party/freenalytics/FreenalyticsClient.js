const axios = require('axios');
const logger = require('@greencoast/logger');
const { Message } = require('discord.js');

class FreenalyticsClient {
  constructor(client, options) {
    FreenalyticsClient.validateOptions(options);
    
    this.client = client;
    this.apiUrl = options.apiUrl;
    this.domain = options.domain;

    this.rest = axios.create({
      baseURL: this.apiUrl
    });
  }

  initialize() {
    this.registerEvents();
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
  }
}

module.exports = FreenalyticsClient;
