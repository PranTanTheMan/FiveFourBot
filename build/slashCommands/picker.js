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
const pickerCommand = {
    command: new discord_js_1.SlashCommandBuilder()
        .setName("picker")
        .setDescription("Start a picker drawing"),
    execute: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        // Show modal for title, description, and time limit
        const modal = new discord_js_1.ModalBuilder()
            .setCustomId("pickerModal")
            .setTitle("Create a Picker Drawing");
        // Add inputs for title, description, and time
        const titleInput = new discord_js_1.TextInputBuilder()
            .setCustomId("titleInput")
            .setLabel("Title")
            .setStyle(discord_js_1.TextInputStyle.Short);
        const descriptionInput = new discord_js_1.TextInputBuilder()
            .setCustomId("descriptionInput")
            .setLabel("Description")
            .setStyle(discord_js_1.TextInputStyle.Paragraph);
        const timeInput = new discord_js_1.TextInputBuilder()
            .setCustomId("timeInput")
            .setLabel("Time (60-600 seconds)")
            .setStyle(discord_js_1.TextInputStyle.Short);
        // Action rows for modal
        const firstActionRow = new discord_js_1.ActionRowBuilder().addComponents(titleInput);
        const secondActionRow = new discord_js_1.ActionRowBuilder().addComponents(descriptionInput);
        const thirdActionRow = new discord_js_1.ActionRowBuilder().addComponents(timeInput);
        modal.addComponents(firstActionRow, secondActionRow, thirdActionRow);
        yield interaction.showModal(modal);
    }),
    modal: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        // Handle modal submission
        yield interaction.deferReply();
        const title = interaction.fields.getTextInputValue("titleInput");
        const description = interaction.fields.getTextInputValue("descriptionInput");
        let time = parseInt(interaction.fields.getTextInputValue("timeInput"));
        // Validate time input
        if (isNaN(time) || time < 60 || time > 600) {
            return interaction.editReply("Please choose a valid time ranging from 60 to 600 seconds.");
        }
        // Create and send embed
        const embed = new discord_js_1.EmbedBuilder()
            .setTitle(title)
            .setDescription(description)
            .setFields({ name: "Entries", value: "0", inline: true }, { name: "Users", value: "None", inline: true }, { name: "Countdown", value: `${time} seconds`, inline: true })
            .setColor("Gold");
        const sentMessage = yield ((_a = interaction.channel) === null || _a === void 0 ? void 0 : _a.send({ embeds: [embed] }));
        if (!sentMessage)
            return;
        // Add reaction for entry
        yield sentMessage.react("🙋");
        // Starting the countdown
        let countdown = time;
        const updateInterval = setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
            if (countdown <= 0) {
                clearInterval(updateInterval);
                // Final update to the embed before choosing the winner
                yield updateEmbed(sentMessage, participants, countdown);
                // Choose winner or handle cases with insufficient participants
                if (participants.size === 0) {
                    sentMessage.edit("No one entered!");
                }
                else if (participants.size === 1) {
                    sentMessage.edit("Only one participant. More participants are needed!");
                }
                else {
                    const winner = chooseRandomParticipant([...participants.keys()]);
                    sentMessage.edit(`The winner is... <@${winner}>!`);
                }
                return;
            }
            // Regular update to the embed
            yield updateEmbed(sentMessage, participants, countdown);
            countdown -= 1;
        }), 1000);
        // Reaction collector setup
        const participants = new Set();
        const filter = (reaction, user) => reaction.emoji.name === "🙋" && !user.bot;
        const collector = sentMessage.createReactionCollector({
            filter,
            time: time * 1000,
        });
        collector.on("collect", (reaction, user) => {
            participants.add(user.id);
        });
        collector.on("remove", (reaction, user) => {
            participants.delete(user.id);
        });
    }),
};
// Helper function to update the embed
function updateEmbed(message, participants, countdown) {
    return __awaiter(this, void 0, void 0, function* () {
        const embed = new discord_js_1.EmbedBuilder(message.embeds[0]).setFields({ name: "Entries", value: `${participants.size}`, inline: true }, {
            name: "Users",
            value: participants.size > 0 ? [...participants].join(", ") : "None",
            inline: true,
        }, { name: "Countdown", value: `${countdown} seconds`, inline: true });
        yield message.edit({ embeds: [embed] });
    });
}
// Helper function to choose a random participant
function chooseRandomParticipant(participants) {
    return participants[Math.floor(Math.random() * participants.length)];
}
exports.default = pickerCommand;
