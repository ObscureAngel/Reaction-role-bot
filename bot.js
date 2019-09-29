// Import de la biblioteque Discord.js
var lo_Discord = require('discord.js');

// Creation d'une instance d'un client Discord
var lo_bot = new lo_Discord.Client({autoReconnect: true});

// Reprise du token du bot
var ls_token = "";
var lo_fs = require('fs'),
    lo_path = require('path'),
    ls_filePath = lo_path.join(__dirname, 'token.txt');

// Buffer mydata
_BUFFER = bufferFile('token.txt');

function bufferFile(relPath) {
    ls_token = lo_fs.readFileSync(ls_filePath,{ encoding: 'utf8' }); // zzzz....
}

// Prefix pour les commandes
const ls_prefix = "rr!"

// version du bot
const ls_version = "0.0";

// Activation du mode DEBUG
var lb_debugMode = true;

// Aide pour le bot
var ls_helpText = "```Liste des commandes\n";
ls_helpText += " - " + ls_prefix + "help  Affiche ce message d'aide\n";
ls_helpText += " - " + ls_prefix + "version  Affiche les informations de version du bot\n";
ls_helpText += " - " + ls_prefix + "debug  Active ou désactive le mode débug.\n";
ls_helpText += "   Syntaxe : " + ls_prefix + "debug true|false";
ls_helpText += "   Debug activé : " + lb_debugMode + "\n";
ls_helpText += "```";

lo_bot.on('ready', () => {
    console.log(new Date() + ' : Logged in as '+ lo_bot.user.tag);
});

// En cas d'erreur quelquonque
lo_bot.on('error', po_error => {
    // On l'affiche
    console.error(new Date() + ' : ' + po_error.message);
});

lo_bot.login(ls_token);

lo_bot.on('message', msg => {


});

lo_bot.on('messageReactionAdd', (po_messageReaction, po_user) => {
    if (po_messageReaction.message.channel.name != 'reaction-role') return;

});

// This makes the events used a bit more readable
const la_events = {
	MESSAGE_REACTION_ADD: 'messageReactionAdd',
	MESSAGE_REACTION_REMOVE: 'messageReactionRemove',
};

lo_bot.on('raw', async event => {
    if (!la_events.hasOwnProperty(event.t)) return;

    const { d: data } = event;
    const user = lo_bot.users.get(data.user_id);
    const channel = lo_bot.channels.get(data.channel_id);

    const message = await channel.fetchMessage(data.message_id);
    const member = message.guild.members.get(user.id);

    const emojiKey = (data.emoji.id) ? `${data.emoji.name}:${data.emoji.id}` : data.emoji.name;
    let reaction = message.reactions.get(emojiKey);

    if (!reaction) {
        // Create an object that can be passed through the event like normal
        const emoji = new Emoji(lo_bot.guilds.get(data.guild_id), data.emoji);
        reaction = new MessageReaction(message, emoji, 1, data.user_id === lo_bot.user.id);
    }

    let embedFooterText;
    if (message.embeds[0]) embedFooterText = message.embeds[0].footer.text;

    if (
        (message.author.id === lo_bot.user.id) && (message.content !== CONFIG.initialMessage ||
        (message.embeds[0] && (embedFooterText !== CONFIG.embedFooter)))
    ) {

        if (!CONFIG.embed && (message.embeds.length < 1)) {
            const re = `\\*\\*"(.+)?(?="\\*\\*)`;
            const role = message.content.match(re)[1];

            if (member.id !== lo_bot.user.id) {
                const guildRole = message.guild.roles.find(r => r.name === role);
                if (event.t === "MESSAGE_REACTION_ADD") member.addRole(guildRole.id);
                else if (event.t === "MESSAGE_REACTION_REMOVE") member.removeRole(guildRole.id);
            }
        } else if (CONFIG.embed && (message.embeds.length >= 1)) {
            const fields = message.embeds[0].fields;

            for (const { name, value } of fields) {
                if (member.id !== lo_bot.user.id) {
                    const guildRole = message.guild.roles.find(r => r.name === value);
                    if ((name === reaction.emoji.name) || (name === reaction.emoji.toString())) {
                        if (event.t === "MESSAGE_REACTION_ADD") member.addRole(guildRole.id);
                        else if (event.t === "MESSAGE_REACTION_REMOVE") member.removeRole(guildRole.id);
                    }
                }
            }
        }
    }
});
