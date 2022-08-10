import { CommandInteraction } from "discord.js";
import ValoBot from "src/ressources/Client";
import { modal } from "../modals/code_login"

const ID_INPUT_USERNAME = "username";
const ID_INPUT_PASS = "password";

export async function run (client:ValoBot, interaction:CommandInteraction, args:string[], tool:any):Promise<any> {
      // interaction.showModal(modal);
      // await interaction.deferReply({ephemeral: true});

      //@ts-ignore
      var username:string = interaction.options.get(ID_INPUT_USERNAME).value?.toString();
      //@ts-ignore
      var password:string = interaction.options.get(ID_INPUT_PASS).value?.toString();
    
      var auth = await client.riotAuth.authenticate({username: username, password: password});
      if(!auth) return interaction.reply("Une erreur a eu lieu");
      if (auth.security_type == "response") {
            client.db.createUser({id: interaction.user.id});
            client.db.createRiotUser({ user_id: interaction.user.id, ...auth.riot_data })
            return interaction.reply("Le login a marché mais flm de coder le reste");
      }
      else if (auth.security_type == "multifactor") {
            //@ts-ignore
            client.db.createUser({id: interaction.user.id, cookies: auth.cookies});
            //@ts-ignore
            return interaction.showModal(modal(auth.email));
      }
      else return interaction.reply("Une erreur a eu lieu")
}
  
export const slash = {
      "name": "login",
      "description": "Login with your riot account",
      "options": [
            {
                  "type": 3,
                  "name": "username",
                  "description": "Riot Username",
                  "required": true
            },
            {
                  "type": 3,
                  "name": "password",
                  "description": "Riot Password",
                  "required": true
            }
      ],
}