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
module.exports = {
	name: "playskip", //the command name for the Slash Command

	category: "Music",
	aliases: ["ps"],
	usage: "playskip <Search/link>",

	description: "reproduce n, luego n+2", //the command description for Slash Command Overview
	cooldown: 2,
	requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
	alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
	run: async (client, message, args) => {
		try {
			//things u can directly access in an interaction!
			const {
				member,
				channelId,
				guildId,
				applicationId,
				commandName,
				deferred,
				replied,
				ephemeral,
				options,
				id,
				createdTimestamp
			} = message;
			const {
				guild
			} = member;
			const {
				channel
			} = member.voice;
			if (!channel) return message.reply({
				embeds: [
					new MessageEmbed().setColor(ee.wrongcolor).setTitle(`${client.allEmojis.x} **Por Favor Entra ${guild.me.voice.channel ? "__my__" : "a"} un canal de voz primero**`)
				],

			})
			if (channel.userLimit != 0 && channel.full)
				return message.reply({
					embeds: [new MessageEmbed()
						.setColor(ee.wrongcolor)
						.setFooter(ee.footertext, ee.footericon)
						.setTitle(`<:declined:780403017160982538> Ta lleno no puedo entrar`)
					],
				});
			if (channel.guild.me.voice.channel && channel.guild.me.voice.channel.id != channel.id) {
				return message.reply({
					embeds: [new MessageEmbed()
						.setColor(ee.wrongcolor)
						.setFooter(ee.footertext, ee.footericon)
						.setTitle(`<:declined:780403017160982538> Estoy en otro canal`)
					],
				});
			}
			if (!args[0]) {
				return message.reply({
					embeds: [new MessageEmbed()
						.setColor(ee.wrongcolor)
						.setFooter(ee.footertext, ee.footericon)
						.setTitle(`${client.allEmojis.x} **Añade una busqueda**`)
						.setDescription(`**Usage:**\n> \`${client.settings.get(message.guild.id, "prefix")}playskip <Search/Link>\``)
					],
				});
			}
			//let IntOption = options.getInteger("OPTIONNAME"); //same as in IntChoices //RETURNS NUMBER
			const Text = args.join(" "); //same as in StringChoices //RETURNS STRING 
			//update it without a response!
			let newmsg = await message.reply({
				content: `🔍 Buscando... \`\`\`${Text}\`\`\``,
			}).catch(e => {
				console.log(e)
			})
			try {
				let queue = client.distube.getQueue(guildId)
				let options = {
					member: member,
					skip: true
				}
				if (!queue) options.textChannel = guild.channels.cache.get(channelId)
				if (queue) {
					if (check_if_dj(client, member, queue.songs[0])) {
						return message.reply({
							embeds: [new MessageEmbed()
								.setColor(ee.wrongcolor)
								.setFooter(ee.footertext, ee.footericon)
								.setTitle(`${client.allEmojis.x} **No eres Dj y no obedezco pdjps**`)
								.setDescription(`**DJ-ROLES:**\n> ${check_if_dj(client, member, queue.songs[0])}`)
							],
						});
					}
				}
				await client.distube.playVoiceChannel(channel, Text, options)
				//Edit the reply
				newmsg.edit({
					content: `${queue?.songs?.length > 0 ? "⏭ Saltando a" : "🎶 Reproduciendo ahora"}: \`\`\`css\n${Text}\n\`\`\``,
				}).catch(e => {
					console.log(e)
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
