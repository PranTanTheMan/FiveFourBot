"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const command = {
    command: new discord_js_1.SlashCommandBuilder()
        .setName("embed")
        .addStringOption((option) => {
        return option
            .setName("title")
            .setDescription("Title of the embed message")
            .setRequired(true);
    })
        .addStringOption((option) => {
        return option
            .setName("description")
            .setDescription("Description of the embed message.")
            .setRequired(true);
    })
        .addChannelOption((option) => {
        return option
            .setName("channel")
            .setDescription("Text channel where the embed message will be sent.")
            .setRequired(true);
    })
        .addStringOption((option) => {
        return option
            .setName("color")
            .setDescription("Select an option or type an hex color, for example: #000000")
            .setRequired(true)
            .setAutocomplete(true);
    })
        .setDescription("Create a new embed message."),
    autocomplete: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const focusedValue = interaction.options.getFocused();
            const choices = [
                { name: "White", value: "White" },
                { name: "Aqua", value: "Aqua" },
                { name: "Green", value: "Green" },
                { name: "Blue", value: "Blue" },
                { name: "Yellow", value: "Yellow" },
                { name: "Purple", value: "Purple" },
                { name: "LuminousVividPink", value: "LuminousVividPink" },
                { name: "Fuchsia", value: "Fuchsia" },
                { name: "Gold", value: "Gold" },
                { name: "Orange", value: "Orange" },
                { name: "Red", value: "Red" },
                { name: "Grey", value: "Grey" },
                { name: "Navy", value: "Navy" },
                { name: "DarkAqua", value: "DarkAqua" },
                { name: "DarkGreen", value: "DarkGreen" },
                { name: "DarkBlue", value: "DarkBlue" },
                { name: "DarkPurple", value: "DarkPurple" },
                { name: "DarkVividPink", value: "DarkVividPink" },
                { name: "DarkGold", value: "DarkGold" },
                { name: "DarkOrange", value: "DarkOrange" },
                { name: "DarkRed", value: "DarkRed" },
                { name: "DarkGrey", value: "DarkGrey" },
                { name: "DarkerGrey", value: "DarkerGrey" },
                { name: "LightGrey", value: "LightGrey" },
                { name: "DarkNavy", value: "DarkNavy" },
            ];
            let filtered = [];
            for (let i = 0; i < choices.length; i++) {
                const choice = choices[i];
                if (choice.name.includes(focusedValue))
                    filtered.push(choice);
            }
            yield interaction.respond(filtered);
        }
        catch (error) {
            console.log(`Error: ${error.message}`);
        }
    }),
    execute: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e;
        try {
            yield interaction.deferReply({ ephemeral: true });
            const options = {};
            if (!interaction.options)
                return interaction.editReply({ content: "Something went wrong..." });
            for (let i = 0; i < interaction.options.data.length; i++) {
                const element = interaction.options.data[i];
                if (element.name && element.value)
                    options[element.name] = element.value;
            }
            const embed = new discord_js_1.EmbedBuilder()
                .setColor(options.color.toString())
                .setTitle(options.title.toString())
                .setDescription(options.description.toString())
                .setAuthor({
                name: ((_a = interaction.client.user) === null || _a === void 0 ? void 0 : _a.username) || "Default Name",
                iconURL: ((_b = interaction.client.user) === null || _b === void 0 ? void 0 : _b.avatarURL()) || undefined,
            })
                .setThumbnail(((_c = interaction.client.user) === null || _c === void 0 ? void 0 : _c.avatarURL()) || null)
                .setTimestamp()
                .setFooter({
                text: "Test embed message",
                iconURL: ((_d = interaction.client.user) === null || _d === void 0 ? void 0 : _d.avatarURL()) || undefined,
            });
            let selectedTextChannel = (_e = interaction.channel) === null || _e === void 0 ? void 0 : _e.client.channels.cache.get(options.channel.toString());
            selectedTextChannel.send({ embeds: [embed] });
            return interaction.editReply({
                content: "Embed message successfully sent.",
            });
        }
        catch (error) {
            interaction.editReply({ content: "Something went wrong..." });
        }
    }),
    cooldown: 10,
};
exports.default = command;
