import { PermissionFlagsBits } from "discord.js";
import { Command } from "../types";

const command: Command = {
  name: "insult",
  execute: (message, args) => {
    let toGreet = message.mentions.members?.first();
    message.channel.send(
      `you suck ${
        toGreet ? toGreet.user.username : message.member?.user.username
      }!`
    );
  },
  cooldown: 10,
  aliases: ["sayhello"],
  permissions: ["Administrator", PermissionFlagsBits.ManageEmojisAndStickers], // to test
};

export default command;
