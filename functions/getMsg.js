/**
 * Переключение роли участнику.
 *
 * @param {InteractionReply} int
 */
module.exports = (int) => {
    const channel = guild.channels.cache.get(int.channel_id)
    return {
        channel: channel,
        channelId: int.channel_id,
        guild: guild,
        guildId: guild.id,
        author: guild.members.cache.get(int.member.user.id).user,
        member: guild.members.cache.get(int.member.user.id),
        interaction: int,
        createdTimestamp: new Date(int.id / 4194304 + 1420070400000),
        isSlash: true,
        message: (channel ? channel.cache.get(int.message.id) : 0)
    }
}

