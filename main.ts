import "jsr:@std/dotenv/load";

type SparqlRow = {
  birthDate: {
    value: string;
  };
  name: {
    value: string;
  };
};

const getBirthdayIdol = async (birthDate: string): Promise<string> => {
  const endpointUrl = "https://sparql.crssnky.xyz/spql/imas/query";

  const query = `
  PREFIX imas: <https://sparql.crssnky.xyz/imasrdf/URIs/imas-schema.ttl#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX schema: <http://schema.org/>

      SELECT DISTINCT ?birthDate ?name
      WHERE {
        ?s rdfs:label ?name;
          rdf:type ?type;
          imas:nameKana|imas:alternateNameKana ?kana;
          schema:birthDate ?birthDate .
          FILTER (regex(str(?type), 'Idol$|Staff$')).
          FILTER (str(?birthDate) = '--${birthDate}')
      }
      ORDER BY ?birthDate
  `;

  const response = await fetch(`${endpointUrl}?output=json&query=${encodeURIComponent(query)}`);

  if (!response.ok) {
    return "error";
  }

  const result = await response.json();

  if (result.results.bindings.length === 0) {
    return "";
  }

  return `| 誕生日アイドル: ${result.results.bindings.map((row: SparqlRow) => row.name.value).join(", ")}`;
};

const getThirdThursdayDay = (date = new Date()): number => {
  return 7 * 3 + 4 - new Date(date.getFullYear(), date.getMonth(), 1).getDay() + 1;
};

const createEvent = async () => {
  // 現在の月の第三木曜の日付を取得
  const thirdThursday = getThirdThursdayDay();

  const scheduled_start_time = new Date();
  scheduled_start_time.setDate(thirdThursday);
  scheduled_start_time.setHours(11); // UTC 11時 日本時間 20時
  scheduled_start_time.setMinutes(0);
  scheduled_start_time.setSeconds(0);
  scheduled_start_time.setMilliseconds(0);

  const scheduled_end_time = new Date(scheduled_start_time);
  scheduled_end_time.setHours(13); // UTC 13時 日本時間 22時

  const birthdayIdols = await getBirthdayIdol(
    `${(scheduled_start_time.getMonth() + 1).toString().padStart(2, "0")}-${thirdThursday.toString().padStart(2, "0")}`,
  );

  const body = {
    name: "アイマスもくもく会",
    privacy_level: 2,
    scheduled_start_time: scheduled_start_time.toISOString(),
    scheduled_end_time: scheduled_end_time.toISOString(),
    entity_metadata: {
      location: `https://imastudy-mokumoku.connpass.com/ ${birthdayIdols}`,
    },
    description: "アイマスもくもく会",
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
  console.log("アイドル取得");

  const thirdThursday = getThirdThursdayDay();

  const birthdayIdols = await getBirthdayIdol(
    `${(new Date().getMonth() + 1).toString().padStart(2, "0")}-${thirdThursday.toString().padStart(2, "0")}`,
  );

  return new Response(birthdayIdols);
});
