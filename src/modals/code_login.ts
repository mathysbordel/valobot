import { ActionRowBuilder, ModalBuilder, ModalSubmitInteraction, TextInputBuilder, TextInputStyle } from "discord.js";
import ValoBot from "src/ressources/Client";

const ID_INPUT_CODE = "code";
      
export async function run (client: ValoBot, interaction: ModalSubmitInteraction, tools: any) {
    await interaction.deferReply({ephemeral: true});
    var user = await client.db.getUser({id: interaction.user.id});
    if(!user) return interaction.reply("Une erreur a eu lieu");

    var code = interaction.fields.getTextInputValue(ID_INPUT_CODE);
    var auth = await client.riotAuth.authenticate2FA(code, user.cookies);
    if(!auth) return interaction.reply("Une erreur a eu lieu");

    await client.db.createRiotUser({user_id: user.id, ...auth.riot_data})
    interaction.reply(`Félicitation, wow, bravo ${auth.riot_data.username}${auth.riot_data.tag} tout le monde est fier de toi`);
        
}   

export function modal (email: string) {
    const modalBuilder = new ModalBuilder().setCustomId("code_login").setTitle("Enter 2FA code");

    const codeInput = new TextInputBuilder().setCustomId(ID_INPUT_CODE)
        .setLabel("Enter valorant 2FA code")
        .setStyle(TextInputStyle.Short)
        .setPlaceholder(`A code as been sended to your email ${email}`)
            
    const firstActionRow = new ActionRowBuilder().addComponents(codeInput);

    //@ts-ignore
    modalBuilder.addComponents(firstActionRow);

    return modalBuilder;
}