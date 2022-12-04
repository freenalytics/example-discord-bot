# Discord Bot Example

An example bot for Discord that integrates with Freenalytics.

## Some Information

This discord bot integrates to a Freenalytics application with the following schema:

```yml
type: object
properties:
  command_name:
    type: string
  command_author:
    type: string
  command_success:
    type: boolean
  command_error_message:
    type: string
  server_count:
    type: integer
  member_count:
    type: integer
```

The bot will send data whenever a command is executed or whenever it errors. Additionally, it will upload `server_count` and `member_count` once every 10 seconds.

This bot was made with [@greencoast/discord.js-extended](https://docs.greencoaststudios.com/discord.js-extended/master/) which includes additional event handlers to attach logic to command execution.

Feel free to check the source code to see how you can integrate your own Discord bot with Freenalytics. The code that integrates Freenalytics can be found in
[FreenalyticsClient.js](https://github.com/freenalytics/example-discord-bot/blob/master/src/third-party/freenalytics/FreenalyticsClient.js).

## Running the Example

If you feel the need to test this example yourself, you can do so by:

1. Clone this repository:

```text
git clone https://github.com/freenalytics/example-discord-bot
```

2. Install the dependencies:

```text
npm install
```

3. Rename `config.json.sample` to `config.json` and replace the file with your Discord token and your Freenalytics API endpoint and application domain.

4. Start the bot:

```text
npm start
```

You can run the following slash commands inside the server that you've defined with the `testing_guild_id` key in the `config.json` file:

1. `/greet`: The bot will respond with `Hello $USER$`.
2. `/may_throw`: The bot has a 80% chance of throwing an error when running this command.

Finally, you can check your application's dashboard on your Freenalytics instance where you'll find all the data uploaded by the bot.

![dashboard-screenshot-1](https://raw.githubusercontent.com/freenalytics/example-discord-bot/master/assets/dashboard_screenshot_1.png)
![dashboard-screenshot-2](https://raw.githubusercontent.com/freenalytics/example-discord-bot/master/assets/dashboard_screenshot_2.png)
