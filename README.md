# deno create discord event bot

## ローカル実行

`.env.sample` を参考に `.env` に環境変数を設定します。トークンをコミットしないでください。

```sh
deno run --unstable-otel --allow-net --allow-env --allow-read --unstable-cron main.ts
```
