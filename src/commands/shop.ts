import { CommandInteraction, EmbedBuilder } from "discord.js";
import ValoBot from "src/ressources/Client";

export async function run (client:ValoBot, interaction:CommandInteraction, args:string[], tool:any):Promise<any> {
    interaction.deferReply();
    var user = await client.db.getUser(interaction.user);
    if(!user) return interaction.editReply("Pas de compte riot lié à ton compte Discord (utilise /login)");
    if(!user.riot_users.length) return interaction.editReply("Pas de compte riot lié à ton compte Discord (utilise /login)");
    var user_riot = user.riot_users[0];
    var refresh = await user_riot.refreshCookies();
    if(!refresh) return interaction.editReply("Cookies expired");
    var shop = await user_riot.getShop();
    if(!shop) return interaction.editReply("Impossible de récuperer le shop");
    var skins = shop.skins;
    // var bundles = shop.bundles;
    var embeds:EmbedBuilder[] = [];

    

    for(let skin of skins) {
        let embed = new EmbedBuilder()
            .setThumbnail(skin.displayIcon!)
            .setDescription(`${skin.displayName}\n${skin.currency?.displayName} **${skin.price}**`)
            .setColor("#202225")
        embeds.push(embed)
    }
    
    interaction.editReply({embeds: embeds});
}
  
export const slash = {
    "name": "shop",
    "description": "Affiche ton putain de shop"
}