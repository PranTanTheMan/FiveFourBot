import {
  SlashCommandBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  ChatInputCommandInteraction,
  ModalSubmitInteraction,
  EmbedBuilder,
  PermissionResolvable,
  AutocompleteInteraction,
  TextChannel,
  GuildMember,
  MessageReaction,
  User,
  Message,
  ReactionCollector,
} from "discord.js";

export interface SlashCommand {
  command: SlashCommandBuilder;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
  modal?: (
    interaction: ModalSubmitInteraction
  ) => Promise<Message<boolean> | void>;
  autocomplete?: (interaction: AutocompleteInteraction) => Promise<void>;
  cooldown?: number;
  permissions?: PermissionResolvable[];
  description?: string;
}

const pickerCommand: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("picker")
    .setDescription("Start a picker drawing"),
  execute: async (interaction) => {
    // Show modal for title, description, and time limit
    const modal = new ModalBuilder()
      .setCustomId("pickerModal")
      .setTitle("Create a Picker Drawing");

    // Add inputs for title, description, and time
    const titleInput = new TextInputBuilder()
      .setCustomId("titleInput")
      .setLabel("Title")
      .setStyle(TextInputStyle.Short);

    const descriptionInput = new TextInputBuilder()
      .setCustomId("descriptionInput")
      .setLabel("Description")
      .setStyle(TextInputStyle.Paragraph);

    const timeInput = new TextInputBuilder()
      .setCustomId("timeInput")
      .setLabel("Time (60-600 seconds)")
      .setStyle(TextInputStyle.Short);

    // Action rows for modal
    const firstActionRow =
      new ActionRowBuilder<TextInputBuilder>().addComponents(titleInput);
    const secondActionRow =
      new ActionRowBuilder<TextInputBuilder>().addComponents(descriptionInput);
    const thirdActionRow =
      new ActionRowBuilder<TextInputBuilder>().addComponents(timeInput);

    modal.addComponents(firstActionRow, secondActionRow, thirdActionRow);

    await interaction.showModal(modal);
  },
  modal: async (interaction) => {
    // Handle modal submission
    await interaction.deferReply();

    const title = interaction.fields.getTextInputValue("titleInput");
    const description =
      interaction.fields.getTextInputValue("descriptionInput");
    let time = parseInt(interaction.fields.getTextInputValue("timeInput"));

    // Validate time input
    if (isNaN(time) || time < 60 || time > 600) {
      return interaction.editReply(
        "Please choose a valid time ranging from 60 to 600 seconds."
      );
    }

    // Create and send embed
    const embed = new EmbedBuilder()
      .setTitle(title)
      .setDescription(description)
      .setFields(
        { name: "Entries", value: "0", inline: false },
        { name: "Users", value: "None", inline: false },
        { name: "Countdown", value: `${time} seconds`, inline: false }
      )
      .setColor("Gold");

    const sentMessage = await interaction.channel?.send({ embeds: [embed] });
    if (!sentMessage) return;

    // Add reaction for entry
    await sentMessage.react("🙋");

    // Starting the countdown
    let countdown = time;
    const updateInterval = setInterval(async () => {
      if (countdown <= 0) {
        clearInterval(updateInterval);

        // Final update to the embed before choosing the winner
        await updateEmbed(sentMessage, participants, countdown);

        // Choose winner or handle cases with insufficient participants
        if (participants.size === 0) {
          sentMessage.edit("No one entered!");
        } else if (participants.size === 1) {
          sentMessage.edit(
            "Only one participant. More participants are needed!"
          );
        } else {
          const winner = chooseRandomParticipant([...participants.keys()]);
          sentMessage.edit(`The winner is... <@${winner}>!`);
        }

        return;
      }

      // Regular update to the embed
      await updateEmbed(sentMessage, participants, countdown);
      countdown -= 1;
    }, 1000);

    // Reaction collector setup
    const participants = new Set<string>();
    const filter = (reaction: MessageReaction, user: User) =>
      reaction.emoji.name === "🙋" && !user.bot;
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
  },
};

// Helper function to update the embed
async function updateEmbed(
  message: Message,
  participants: Set<string>,
  countdown: number
) {
  const embed = new EmbedBuilder(message.embeds[0]).setFields(
    { name: "Entries", value: `${participants.size}`, inline: true },
    {
      name: "Users",
      value: participants.size > 0 ? [...participants].join(", ") : "None",
      inline: true,
    },
    { name: "Countdown", value: `${countdown} seconds`, inline: true }
  );

  await message.edit({ embeds: [embed] });
}

// Helper function to choose a random participant
function chooseRandomParticipant(participants: string[]): string {
  return participants[Math.floor(Math.random() * participants.length)];
}

export default pickerCommand;
