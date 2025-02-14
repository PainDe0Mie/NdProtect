const Discord = require("discord.js")

exports.help = {
    name: "ban",
    category: 'mods',
  };
  
exports.run = async (bot, message, args) => { 
    if (!message.member.permissions.has(Discord.PermissionsBitField.Flags.BanMembers)) {
        const embed = new Discord.EmbedBuilder()
        .setColor("Red")
        .setDescription(`**❌ Vous avez besoin des permissions suivantes pour utiliser cette commande : Bannir des membres.**`)

        return message.reply({ embeds: [embed] })
    } else {
        const user = message.mentions.users.first() || message.guild.members.cache.get(args[0]) || await bot.users.fetch(args[0]).catch(() => {})
        if(!user) {
            const embed = new Discord.EmbedBuilder()
            .setColor("Red")
            .setDescription(`**❌ Cet utilisateur n'existe pas.**`)

            return message.reply({ embeds: [embed] })
        } 
        
        let reason = args.slice(1).join(' ') || `Aucune raison fournie`;

        const embed = new Discord.EmbedBuilder()
        .setColor("Red")
        
        if(message.author.id == user.id) return message.reply({ embeds: [embed.setDescription("**❌ Vous ne pouvez pas vous bannir vous-même**")]})
        if(message.guild.ownerId == user.id) return message.reply({ embeds: [embed.setDescription(`**❌ Je n'ai pas les permissions de bannir ${user} ?.**`)]})
        if (!user.bannable || bot.user.id == user.id)  return message.reply({ embeds: [embed.setDescription(`**❌ Je n'ai pas les permissions de bannir ${user} ?.**`)]})
        if (user.roles.highest.position >= message.member.roles.highest.position) return message.reply({ embeds: [embed.setDescription(`**❌ Vous n'avez pas les permissions de bannir ${user} ? car cet utilisateur est situé au dessus de vous dans la hiérarchie des rôles.**`)]})

        message.guild.members.ban(user, { reason: reason })
        message.reply({ embeds: [embed.setColor("Green").setDescription(`**✅ ${user} a été banni du serveur.**`).setImage("https://media.discordapp.net/attachments/1170288145871413318/1237412141724860447/cheh.gif?ex=663b8d5c&is=663a3bdc&hm=4d31889ffbcc83386f08844110c58dfb09747d3da93482f55499f8cf56c3cf38&=&width=1480&height=832")]})
    }
}