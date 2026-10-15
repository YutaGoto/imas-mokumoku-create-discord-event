# deno create discord event bot

## ローカル実行

`.env.sample` を参考に `.env` に環境変数を設定します。トークンをコミットしないでください。

```sh
OTEL_DENO=true deno run --unstable-otel --allow-net --allow-env --allow-read --unstable-cron main.ts
```

## Deno Deploy

新しい Deno Deploy の GitHub 連携でデプロイします。Classic 向けの
`denoland/deployctl@v1` ワークフローは使用しません。
GitHub Actions の `deno check` は引き続きコードを検証します。

### 初回設定

1. Deno Deploy のアプリで、この GitHub リポジトリが連携済みであることを確認します。
2. アプリ設定の App directory はリポジトリのルート（`.`）にします。
   実行設定は `deno.json` の `deploy.runtime` で指定済みです。
   Dynamic モードで `main.ts` を実行し、インストール・ビルドコマンドは不要です。
   ソースコードの設定がダッシュボードの設定より優先されます。
3. Timelines で本番用タイムラインが `main` ブランチを追跡していることを確認します。
4. 本番用タイムラインに適用される実行時の環境変数を設定します。

   | 変数 | 値 |
   | --- | --- |
   | `GUILD_ID` | イベントを作成する Discord サーバーの ID |
   | `BOT_TOKEN` | Discord Bot のトークン（秘密情報として登録） |
   | `TZ` | `UTC`（コード内の開催時刻は UTC 前提） |

   `APPLICATION_ID` は現在のコードでは使用していません。
   Bot を対象サーバーに追加し、イベントを作成する権限も付与してください。
   プレビューを使用する場合は、本番と別のテスト用サーバー・Bot を設定してください。

### デプロイと動作確認

1. `main` への push で Deno Deploy が自動的にビルド・デプロイします。
   初回は Builds 画面の「Deploy Default Branch」からも開始できます。
2. Deno Deploy のビルドログで成功を確認し、発行された URL にアクセスします。
   HTTP レスポンスには第3木曜日の誕生日アイドルが返ります。該当者がいない場合は空文字です。
   URL へのアクセスでは Discord イベントは作成されません。
3. Cron の画面で `DiscordEventBot` の登録と実行ログを確認します。
   毎月2日 02:00 UTC（日本時間 11:00）に、その月の第3木曜日
   20:00〜22:00（日本時間）のイベントを作成します。
   新しい Deno Deploy は `Deno.cron` を管理するため、
   ローカル実行用の `--unstable-cron` を実行引数へ追加する必要はありません。
4. Cron 実行後、ログの Discord API 応答が成功（HTTP 201）であることと、
   対象サーバーにイベントが作成されたことを確認します。

参考: [ビルド設定](https://docs.deno.com/deploy/reference/builds/) /
[Cron](https://docs.deno.com/deploy/reference/cron/)
