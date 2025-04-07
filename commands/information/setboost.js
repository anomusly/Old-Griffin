const { MessageEmbed } = require('discord.js')
const db = require('../../models/boost.js')

module.exports = {
    name: 'setboost',
    aliases: ['boost'],
    category: 'info',
    run: async (client, message, args) => {
        if (!message.member.permissions.has('ADMINISTRATOR')) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<a:Cross:1346485804368789525> | You must have \`Administration\` perms to run this command.`
                        )
                ]
            })
        }
        let disable = args[0] ? args[0].toLowerCase() == 'off' : null
        let channel,
            hasPerms = null
        if (!disable)
            channel =
                message.mentions.channels.first() ||
                message.guild.channels.cache.get(args[0])
        if (!disable && !channel) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<a:Cross:1346485804368789525> | You didn't provided a valid channel.`
                        )
                ]
            })
        }
        if (!disable)
            hasPerms = message.guild.me
                .permissionsIn(channel)
                .has('SEND_MESSAGES')
        if (!disable && !hasPerms) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<a:Cross:1346485804368789525> | I didn't have permissions to send messages in <#${channel.id}>.`
                        )
                ]
            })
        }
        let data = await db.findOne({ Guild: message.guildId })
        if (!data)
            data = new db({
                Guild: message.guild.id,
                Boost: disable ? null : channel.id
            })
        else data.Boost = disable ? null : channel.id
        await data.save()
        message.channel.send({
            embeds: [
                new MessageEmbed()
                    .setColor(client.color)
                    .setDescription(
                        disable
                            ? `<a:tick:1272061375539318795> | I'll not send messages when when someone boosts the server.`
                            : `<a:tick:1272061375539318795> | I'll now send messages to <#${channel.id}> when someone boosts the server.`
                    )
            ]
        })
    }
}
