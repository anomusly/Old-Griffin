const { MessageEmbed } = require('discord.js')
module.exports = {
    name: 'purge',
    aliases: ['clear'],
    category: 'mod',
    premium: false,

    run: async (client, message, args) => {
        if (!message.member.permissions.has('MANAGE_MESSAGES')) {
            message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<a:Cross:1346485804368789525> | You must have \`Manage Messages\` permissions to use this command.`
                        )
                ]
            })
        } else {
            const amount = args[0]
            if (!amount) {
                message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor(client.color)
                            .setDescription(
                                `<a:Cross:1346485804368789525> | You must provide the number of messages to be deleted.`
                            )
                    ]
                })
            } else {
                if (!parseInt(amount)) {
                    message.channel.send({
                        embeds: [
                            new MessageEmbed()
                                .setColor(client.color)
                                .setDescription(
                                    `<a:Cross:1346485804368789525> | You must provide a valid number of messages to be deleted.`
                                )
                        ]
                    })
                } else if (amount >= 1000) {
                    message.channel.send({
                        embeds: [
                            new MessageEmbed()
                                .setColor(client.color)
                                .setDescription(
                                    `<a:Cross:1346485804368789525> | You can't delete more than **999** messages at a time.`
                                )
                        ]
                    })
                } else {
                    await message.delete().catch((_) => {})
                    Delete(message.channel, amount)
                    message.channel
                        .send({
                            embeds: [
                                new MessageEmbed()
                                    .setColor(client.color)
                                    .setDescription(
                                        `<a:tick:1272061375539318795> | Successfully deleted ${amount} messages.`
                                    )
                            ]
                        })
                        .then((m) => {
                            setTimeout(() => {
                                m.delete().catch(() => {})
                            }, 2000)
                        })
                }
            }
        }
    }
}

function Delete(channel, amount) {
    for (let i = amount; i > 0; i -= 100) {
        if (i > 100) {
            channel.bulkDelete(100).catch((_) => {})
        } else {
            channel.bulkDelete(i).catch((_) => {})
        }
    }
}
