# Weather Notify

## Overview
VercelとNode.jsを用いて、毎日自動で明日の天気予報と洗濯できるかどうかをLINEに通知するシステムです。このシステムはOpenWeather APIを使用し、指定された場所の天気予報を取得し、その情報をもとにLINEに通知をします。

## Function
- 天気予報の取得: OpenWeather APIを使用して、指定された地域の天気予報を取得します。
- 洗濯日和の判定: 取得した天気予報データをもとに、翌日が洗濯に適しているかを判定します。
- LINE通知: 判定結果と天気予報をLINE Notify APIを用いてLINEに通知します。
![スクリーンショット 2023-10-04 152451](https://github.com/horiyuko0512/weather-notify/assets/159997803/6675b082-0319-479e-be5b-95d12515f56c)

## Prerequisites
- Node.js
- npm
- vercel
- [OpenWeather API](https://openweathermap.org/)
- [LINE Notify API](https://notify-bot.line.me/ja/)
## Environmental Variables
- LOCATION=''
- TIME_DIFFERENCE=9 (日本の場合)
- WEATHER_API_KEY=''
- LINE_API_KEY=''
- CRON_SECRET=''

## Setup
1. このリポジトリをクローンします。
   ```sh
    git clone https://github.com/username/weather-notify.git
    cd weather-notify
   ```
2. 必要なパッケージをインストールします。
    ```sh
    npm install
    ```
3. .envファイルの設定
4. vercelへデプロイ
　詳しくは[ドキュメント](https://vercel.com/docs)

## Notes
- このシステムは、天気予報の精度がOpenWeather APIに依存します。
- api/cronエンドポイントは、セキュリティのためにシークレットキーによって保護されています。シークレットキーが一致しないリクエストは拒否されます。
- 毎日指定された時間にLINEに通知が届きます。
- vercelではUTCなので`vercel.json`を設定する際にはJSTとの時間の違いに注意してください。
