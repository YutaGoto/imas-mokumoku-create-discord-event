import "jsr:@std/dotenv/load";

const getThirdThursdayDay = (date = new Date()): number => {
  return 7 * 2 + 4 - new Date(date.getFullYear(), date.getMonth(), 1).getDay() + 1;
};

const createEvent = async () => {
  // 現在の月の第三木曜の日付を取得
  const thirdThursday = getThirdThursdayDay();

  const scheduled_start_time = new Date();
  scheduled_start_time.setDate(thirdThursday);
  scheduled_start_time.setHours(20);
  scheduled_start_time.setMinutes(0);
  scheduled_start_time.setSeconds(0);
  scheduled_start_time.setMilliseconds(0);

  const scheduled_end_time = new Date(scheduled_start_time);
  scheduled_end_time.setHours(22);

  const body = {
    name: "アイマスもくもく会テストイベント",
    privacy_level: 2,
    scheduled_start_time: scheduled_start_time.toISOString(),
    scheduled_end_time: scheduled_end_time.toISOString(),
    entity_metadata: {
      location: "",
    },
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
};

// 毎月2日の11時にイベントを作成する (JST 11時) (UTC 2時)
Deno.cron("DiscordEventBot", "0 2 2 * *", async () => {
  console.log("イベント作成");

  await createEvent();
});

Deno.serve({ port: 4242 }, async (_req) => {
  return new Response("Hello World");
});
