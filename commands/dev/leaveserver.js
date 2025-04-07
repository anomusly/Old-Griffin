const { MessageEmbed } = require('discord.js')
this.config = require(`${process.cwd()}/config.json`)
module.exports = {
    name: `leaveserver`,
    category: `Owner,admin`,
    aliases: [`gl`, `gleave`],
    description: `Leaves A Guild`,
    run: async (client, message, args) => {
        if (!this.config.admin.includes(message.author.id)) return
        let id = args[0]
        if (!id) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<a:Cross:1346485804368789525> | You didn't provided the server Id.`
                        )
                ]
            })
        }
        let guild = await client.guilds.fetch(id)
        let name = guild?.name || 'No Name Found'
        if (!guild) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<a:Cross:1346485804368789525> | You didn't provided a valid server Id.`
                        )
                ]
            })
        }
        await guild.leave()
        return message.channel.send({
            embeds: [
                new MessageEmbed()
                    .setColor(client.color)
                    .setDescription(
                        `<a:tick:1272061375539318795> | Successfully left **${name} (${id})**.`
                    )
            ]
        })
    }
}
