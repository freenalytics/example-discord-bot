const { SlashCommand } = require('@greencoast/discord.js-extended');
const { SlashCommandBuilder } = require('@discordjs/builders');

class GreetCommand extends SlashCommand {
  constructor(client) {
    super(client, {
      name: 'greet',
      description: 'Say hi to the user.',
      group: 'misc',
      guildOnly: true,
      dataBuilder: new SlashCommandBuilder()
    });
  }

  run(interaction) {
    const author = interaction.member.displayName;
    return interaction.reply({
      content: `Hi there ${author}.`
    });
  }
}

module.exports = GreetCommand;
