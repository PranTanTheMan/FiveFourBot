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
        .setName("hobby")
        .setDescription("What is your hobby?"),
    execute: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        const modal = new discord_js_1.ModalBuilder()
            .setCustomId("hobby")
            .setTitle("What is your hobby?");
        const hobbiesInput = new discord_js_1.TextInputBuilder()
            .setCustomId("hobbiesInput")
            .setLabel("What's some of your favorite hobbies?")
            .setStyle(discord_js_1.TextInputStyle.Paragraph);
        const secondActionRow = new discord_js_1.ActionRowBuilder().addComponents(hobbiesInput);
        modal.addComponents(secondActionRow);
        yield interaction.showModal(modal);
    }),
    modal: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        yield interaction.deferReply({ ephemeral: true });
        const hobbies = interaction.fields.getTextInputValue("hobbiesInput");
        yield interaction.editReply({ content: `So, your hobby is ${hobbies}!` });
    }),
    cooldown: 5,
};
exports.default = command;
