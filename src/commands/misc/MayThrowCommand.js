const { SlashCommand } = require('@greencoast/discord.js-extended');
const { SlashCommandBuilder } = require('@discordjs/builders');

class MayThrowCommand extends SlashCommand {
  constructor(client) {
    super(client, {
      name: 'may_throw',
      description: '80% the command may throw an error.',
      group: 'misc',
      guildOnly: true,
      dataBuilder: new SlashCommandBuilder()
    });
  }

  run(interaction) {
    if (Math.random() < 0.8) {
      throw new Error('Random error happened. Oops!');
    }

    return interaction.reply({
      content: 'No error was thrown. Cool!'
    });
  }
}

module.exports = MayThrowCommand;
