"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const picker_1 = __importDefault(require("../slashCommands/picker"));
const event = {
    name: "interactionCreate",
    execute: (interaction) => {
        var _a;
        if (interaction.isChatInputCommand()) {
            let command = interaction.client.slashCommands.get(interaction.commandName);
            let cooldown = interaction.client.cooldowns.get(`${interaction.commandName}-${interaction.user.username}`);
            if (!command)
                return;
            if (command.cooldown && cooldown) {
                if (Date.now() < cooldown) {
                    interaction.reply(`You have to wait ${Math.floor(Math.abs(Date.now() - cooldown) / 1000)} second(s) to use this command again.`);
                    setTimeout(() => interaction.deleteReply(), 5000);
                    return;
                }
                interaction.client.cooldowns.set(`${interaction.commandName}-${interaction.user.username}`, Date.now() + command.cooldown * 1000);
                setTimeout(() => {
                    interaction.client.cooldowns.delete(`${interaction.commandName}-${interaction.user.username}`);
                }, command.cooldown * 1000);
            }
            else if (command.cooldown && !cooldown) {
                interaction.client.cooldowns.set(`${interaction.commandName}-${interaction.user.username}`, Date.now() + command.cooldown * 1000);
            }
            command.execute(interaction);
        }
        else if (interaction.isAutocomplete()) {
            const command = interaction.client.slashCommands.get(interaction.commandName);
            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }
            try {
                if (!command.autocomplete)
                    return;
                command.autocomplete(interaction);
            }
            catch (error) {
                console.error(error);
            }
        }
        else if (interaction.isModalSubmit()) {
            const command = interaction.client.slashCommands.get(interaction.customId);
            if (interaction.customId === "pickerModal") {
                (_a = picker_1.default.modal) === null || _a === void 0 ? void 0 : _a.call(picker_1.default, interaction);
            }
            if (!command) {
                console.error(`No command matching ${interaction.customId} was found.`);
                return;
            }
            try {
                if (!command.modal)
                    return;
                command.modal(interaction);
            }
            catch (error) {
                console.error(error);
            }
        }
    },
};
exports.default = event;
