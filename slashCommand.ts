console.log("Slash command loaded");

async function getCommand() {
  const commandPath = `/applications/${Deno.env.get("APPLICATION_ID")}/guilds/${Deno.env.get("GUILD_ID")}/commands`;

  const response = await fetch(`https://discord.com/api/v10${commandPath}`, {
    method: "GET",
    headers: {
      "Authorization": `Bot ${Deno.env.get("BOT_TOKEN")}`,
    },
  });

  console.log(response.status);
  console.log(await response.json());
}

async function postCommand() {
  const commandPath = `/applications/${Deno.env.get("APPLICATION_ID")}/guilds/${Deno.env.get("GUILD_ID")}/commands`;

  const response = await fetch(`https://discord.com/api/v10${commandPath}`, {
    method: "POST",
    headers: {
      "Authorization": `Bot ${Deno.env.get("BOT_TOKEN")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      "name": "ping",
      "description": "Check the bot's responsiveness",
      "options": [],
    }),
  });

  console.log(response.status);
  console.log(await response.json());
}

console.log(Deno.args);

if (Deno.args.includes("getCommand")) {
  await getCommand();
} else if (Deno.args.includes("postCommand")) {
  await postCommand();
}
