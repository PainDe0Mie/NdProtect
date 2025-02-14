const Discord = require('discord.js')

module.exports = {
  name: "webhookUpdate",
  async execute(channel, bot) {
    bot.db.query(`SELECT * FROM bot WHERE guildId = "${channel.guild.id}"`, async (err, req) => {
      const whitelist = JSON.parse(req[0].whitelist)
      bot.db.query(`SELECT * FROM antiraid WHERE guildId = "${channel.guild.id}"`, async (err, req) => {
        if (err || req.length < 1 || req[0].antiwebhook == "off") return;

        const action = await channel.guild.fetchAuditLogs({ limit: 1, type: Discord.AuditLogEvent.WebhookCreate }).then(audit => audit.entries.first());
        if (!action || action.executor.id === bot.user.id || whitelist.includes(action.executor.id) ||action.executor.id === channel.guild.ownerId) return;

        channel.guild.fetchWebhooks().then((webhooks) => {
          webhooks.forEach((wh) => wh.delete({ reason: "AntiWebhook by NdProtect /uhq" }));
        });
        action.executor.send(`⚠️ Vous n'êtes pas autorisé à créer des webhooks sur le serveur \`${channel.guild.name}\`.`)
      })
    })
  }
}