const {
	MessageEmbed,
	Message
} = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
const {
	check_if_dj
} = require("../../handlers/functions")
const FiltersSettings = require("../../botconfig/filters.json");
module.exports = {
	name: "customspeed", //the command name for the Slash Command

	category: "Filter",
	usage: "speed <speedamount (0 - 20)>",
	aliases: ["customspeed", "changespeed", "cspeed"],

	description: "Cambia la Velocidad de una Canción!", //the command description for Slash Command Overview
	cooldown: 5,
	requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
	alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
	run: async (client, message, args) => {
		try {
			const {
				member,
				guildId,
				guild
			} = message;
			const {
				channel
			} = member.voice;
			if (!channel) return message.reply({
				embeds: [
					new MessageEmbed().setColor(ee.wrongcolor).setTitle(`${client.allEmojis.x} **Por Favor entra al ${guild.me.voice.channel ? "__my__" : "a"} VoiceChannel First!**`)
				],

			})
			if (channel.guild.me.voice.channel && channel.guild.me.voice.channel.id != channel.id) {
				return message.reply({
					embeds: [new MessageEmbed()
						.setColor(ee.wrongcolor)
						.setFooter(ee.footertext, ee.footericon)
						.setTitle(`${client.allEmojis.x} Entra a mi canal de voz :D!`)
						.setDescription(`<#${guild.me.voice.channel.id}>`)
					],
				});
			}
			try {
				let newQueue = client.distube.getQueue(guildId);
				if (!newQueue || !newQueue.songs || newQueue.songs.length == 0) return message.reply({
					embeds: [
						new MessageEmbed().setColor(ee.wrongcolor).setTitle(`${client.allEmojis.x} **No estoy reproduciendo nada ahora mismo.**`)
					],

				})
				if (check_if_dj(client, member, newQueue.songs[0])) {
					return message.reply({
						embeds: [new MessageEmbed()
							.setColor(ee.wrongcolor)
							.setFooter(ee.footertext, ee.footericon)
							.setTitle(`${client.allEmojis.x}**No eres un DJ ni me dices que hacer**`)
							.setDescription(`**DJ-ROLES:**\n> ${check_if_dj(client, member, newQueue.songs[0])}`)
						],
					});
				}
				if (!args[0]) {
					return message.reply({
						embeds: [
							new MessageEmbed()
							.setColor(ee.wrongcolor)
							.setFooter(ee.footertext, ee.footericon)
							.setTitle(`${client.allEmojis.x} **Por Favor ingrese una velocidad entre 0+ and 2!**`)
						],
					})
				}
				let speed_amount = parseInt(args[0])
				if (speed_amount <= 0 || speed_amount > 2) {
					return message.reply({
						embeds: [
							new MessageEmbed()
							.setColor(ee.wrongcolor)
							.setFooter(ee.footertext, ee.footericon)
							.setTitle(`${client.allEmojis.x} **Por Favor ingrese una velocidad entre 0+ and 2!**`)
						],
					})
				}
				FiltersSettings.customspeed = `atempo=${speed_amount}`;
				client.distube.filters = FiltersSettings;
				//add old filters so that they get removed 	
				//if it was enabled before then add it
				if (newQueue.filters.includes("customspeed")) {
					await newQueue.setFilter(["customspeed"]);
				}
				await newQueue.setFilter(["customspeed"]);
				message.reply({
					embeds: [new MessageEmbed()
					  .setColor(ee.color)
					  .setTimestamp()
					  .setTitle(`♨️ **Velocidad definida en x${speed_amount}!**`)
					  .setFooter(`💢 Cortesía de: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true}))]
				})
			} catch (e) {
				console.log(e.stack ? e.stack : e)
				message.reply({
					content: `${client.allEmojis.x} | Error: `,
					embeds: [
						new MessageEmbed().setColor(ee.wrongcolor)
						.setDescription(`\`\`\`${e}\`\`\``)
					],

				})
			}
		} catch (e) {
			console.log(String(e.stack).bgRed)
		}
	}
}
/**
 * @INFO
 * Bot Coded by Tomato#6966 | https://github.com/Tomato6966/Discord-Js-Handler-Template
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention Him / Milrato Development, when using this Code!
 * @INFO
 */
