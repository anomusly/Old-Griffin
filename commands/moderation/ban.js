const { Message, Client, MessageEmbed } = require('discord.js')
module.exports = {
    name: 'ban',
    aliases: ['hackban', 'fuckban', 'fuckoff'],
    category: 'mod',
    premium: false,

    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        if (!message.member.permissions.has('BAN_MEMBERS')) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<a:Cross:1346485804368789525> | You must have \`Ban Members\` permissions to use this command.`
                        )
                ]
            })
        }
        if (!message.guild.me.permissions.has('BAN_MEMBERS')) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<a:Cross:1346485804368789525> | I must have \`Ban Members\` permissions to use this command.`
                        )
                ]
            })
        }
        let isown = message.author.id == message.guild.ownerId
        let user = await getUserFromMention(message, args[0])
        if (!user) {
            try {
                user = await client.users.fetch(args[0])
            } catch (error) {
                return message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor(client.color)
                            .setDescription(
                                `<a:Cross:1346485804368789525> | Please Provide Valid user ID or Mention Member.`
                            )
                    ]
                })
            }
        }
        let rea = args.slice(1).join(' ') || 'No Reason Provided'
        rea = `${message.author.tag} (${message.author.id}) | ` + rea
        const kaalo = new MessageEmbed()
            .setDescription(`<a:Cross:1346485804368789525>| User Not Found`)
            .setColor(client.color)
        if (user === undefined)
            return message.channel.send({ embeds: [kaalo] })

        if (user.id === client.user.id)
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<a:Cross:1346485804368789525> | If You Ban Me Then Who Will Protect Your Server Dumb!?`
                        )
                ]
            })
        if (user.id === message.guild.ownerId)
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<a:Cross:1346485804368789525> | I can't ban the owner of this server.`
                        )
                ]
            })
        if (!client.util.hasHigher(message.member)) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<a:Cross:1346485804368789525> | You must have a higher role than me to use this command.`
                        )
                ]
            })
        }
        let check = message.guild.members.cache.has(user.id)
        if (check === true || user.banable) {
            try {
                const banmess = new MessageEmbed()
                    .setAuthor(
                        message.author.tag,
                        message.author.displayAvatarURL({ dynamic: true })
                    )
                    .setDescription(
                        `**You Have Been Banned From** ${message.guild.name} \nExecutor : ${message.author.tag} \nReason : \`${rea}\``
                    )
                    .setColor(client.color)
                    .setThumbnail(
                        message.author.displayAvatarURL({ dynamic: true })
                    )
                let member = await message.guild.members.fetch(user, true)
                await message.guild.members.ban(member.id, {
                    reason: rea
                })
                await member.send({ embeds: [banmess] }).catch((err) => null)
            } catch (err) {
                const embed = new MessageEmbed()
                    .setDescription(
                        `<a:Cross:1346485804368789525> |  My highest role is below **<@${user.id}>** `
                    )
                    .setColor(client.color)
                return message.channel.send({ embeds: [embed] })
            }
            const done = new MessageEmbed()
                .setDescription(
                    `<a:tick:1272061375539318795> | Successfully banned **<@${user.id}>** from the server.`
                )
                .setColor(client.color)
            return message.channel.send({ embeds: [done] })
        }
        if (check === false) {
            try {
                const banmess = new MessageEmbed()
                    .setAuthor(
                        message.author.tag,
                        message.author.displayAvatarURL({ dynamic: true })
                    )
                    .setDescription(
                        `You Have Been Banned From ${message.guild.name} \nExecutor : ${message.author.tag} \nReason : \`${rea}\``
                    )
                    .setColor(client.color)
                    .setThumbnail(
                        message.author.displayAvatarURL({ dynamic: true })
                    )
                let member = await client.users.fetch(user, true)
                await message.guild.bans.create(member.id, {
                    reason: rea
                })
            } catch (err) {
                const embed = new MessageEmbed()
                    .setDescription(
                        `<a:Cross:1346485804368789525> |  My highest role is below or same as **<@${user.id}>** `
                    )
                    .setColor(client.color)
                return message.channel.send({ embeds: [embed] })
            }
            const done = new MessageEmbed()
                .setDescription(
                    `<a:tick:1272061375539318795> | Successfully banned **<@${user.id}>** from the server.`
                )
                .setColor(client.color)
            return message.channel.send({ embeds: [done] })
        }
    }
}

function getUserFromMention(message, mention) {
    if (!mention) return null

    const matches = mention.match(/^<@!?(\d+)>$/)
    if (!matches) return null

    const id = matches[1]
    return message.client.users.fetch(id)
}
