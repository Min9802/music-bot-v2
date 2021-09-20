const { MessageEmbed } = require("discord.js");
const { TrackUtils } = require("erela.js");

module.exports = {
    name: "pause",
    description: "Dừng nhạc",
    usage: "",
    permissions: {
        channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
        member: [],
    },
    aliases: [],
    /**
     *
     * @param {import("../structures/DiscordMusicBot")} client
     * @param {import("discord.js").Message} message
     * @param {string[]} args
     * @param {*} param3
     */
    run: async (client, message, args, { GuildDB }) => {
        let player = await client.Manager.get(message.guild.id);
        if (!player) return client.sendTime(message.channel, "❌ | **Không có bài nào...**");
        if (!message.member.voice.channel) return client.sendTime(message.channel, "❌ | **Vào room voice rồi gọi!**");
        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return client.sendTime(message.channel, ":x: | **Vào cùng room voice mới được dùng lệnh!**");
        if (player.paused) return client.sendTime(message.channel, "❌ | **Nhạc đã tạm dừng!**");
        player.pause(true);
        let embed = new MessageEmbed().setAuthor(`Paused!`, client.botconfig.IconURL).setColor("RANDOM").setDescription(`Type \`${GuildDB.prefix}resume\` Để tiếp tục!`);
        await message.channel.send(embed);
        await message.react("✅");
    },

    SlashCommand: {
        /**
     *
     * @param {import("../structures/DiscordMusicBot")} client
     * @param {import("discord.js").Message} message
     * @param {string[]} args
     * @param {*} param3
     */
        run: async (client, interaction, args, { GuildDB }) => {
            const guild = client.guilds.cache.get(interaction.guild_id);
            const member = guild.members.cache.get(interaction.member.user.id);

            if (!member.voice.channel) return client.sendTime(interaction, "❌ | **Vào room voice rồi gọi tao.**");
            if (guild.me.voice.channel && !guild.me.voice.channel.equals(member.voice.channel)) return client.sendTime(interaction, ":x: | **Vào cùng room voice mới được dùng lệnh!**");

            let player = await client.Manager.get(interaction.guild_id);
            if (!player) return client.sendTime(interaction, "❌ | **Không có bài nào...**");
            if (player.paused) return client.sendTime(interaction, "Nhạc đã tạm dừng!");
            player.pause(true);
            client.sendTime(interaction, "**⏸ Paused!**");
        },
    },
};
