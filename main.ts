import "jsr:@std/dotenv/load";

if (import.meta.main) {
  const body = {
    name: "アイマスもくもく会テストイベント",
    privacy_level: 2,
    entity_metadata: {
      location: "https://imastudy-mokumoku.connpass.com/event/XXXXXX/",
    },
    scheduled_start_time: "2024-12-19T11:00:00Z",
    scheduled_end_time: "2024-12-19T13:00:00Z",
    description: "アイマスもくもく会テストイベント",
    entity_type: 3,
  };

  const resp = await fetch(
    `https://discord.com/api/v10/guilds/${Deno.env.get("GUILD_ID")}/scheduled-events`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bot ${Deno.env.get("BOT_TOKEN")}`,
      },
      body: JSON.stringify(body),
    },
  );

  console.log(resp.status);
  console.log(await resp.json());
}
