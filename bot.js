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
//var BUFFER = bufferFile('token.txt');

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

lo_bot.on('message', msg => {


});

// This makes the events used a bit more readable
const la_events = {
	MESSAGE_REACTION_ADD: 'messageReactionAdd',
	MESSAGE_REACTION_REMOVE: 'messageReactionRemove',
};

lo_bot.on('messageReactionAdd', (po_messageReaction, po_user) => {
    if (po_messageReaction.message.channel.name != 'reaction-role') return;

});

lo_bot.login(ls_token);
