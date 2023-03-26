# pbl-Warikan


| Name        | Slack Name | GitHub ID |
|-------------|------------|-----------|
|      大島隆佑       |     Ryusuke Oshima       |     r-ohsima      |
|     朴秀洪    |     SuHong PARK       |     37-196258     |
|     伊藤暢洋    |     Nobuhiro Ito       |     ni01     |
|     重見和秀    |     Kazuhide Shigemi       |     skazu1210     |
|     吉川祐貴    |     Yuki Yoshikawa     |    monkichizae    |


# How to use

## 立ち上げ方
ローカルでフロントエンド・バックエンド・ボットを構築する手順を示します

## 前提
ngrokのダウンロード(参考：https://qiita.com/mininobu/items/b45dbc70faedf30f484e) \
frontendディレクトリでnpm installを実行

## Line Developers で Liff と Bot を作成
### Liff
### Bot

## ngrok 設定
~/.ngrok2/ngrok.ymlを以下のように変更
```
authtoken: [変えない]
tunnels:
  frontend:
    proto: http
    addr: 3000
  backend:
    proto: http
    addr: 5000
```
`ngrok start --all`を実行するとfrontend, backend用にURLが発行される

## 環境変数設定(Backend)
.env または .env.local に以下5点を記載する
### LineDeveloperコンソール→上記で作成した個人用ボットに移動
`CHANNEL_ACCESS_TOKEN=[Basic SettingsのChannel secret]`\
`CHANNEL_SECRET=[Messaging APIのChannel access token]`\
`GOOGLE_APPLICATION_CREDENTIALS=[GCP認証情報のパス]` (後述するGCP認証情報についてを参照)\
`FLASK_ENV="development"`
### LineDeveloperコンソール→上記で作成したLiff→LIFFタブ→LIFFアプリ詳細に移動
`LIFF_BASE_URL=[LIFFアプリ詳細に記載されたLIFF URL]`

## 環境変数設定(Frontend)
.env または .env.local に以下4点を記載する
### LineDeveloperコンソール→上記で作成したLiff→LIFFタブ→LIFFアプリ詳細に移動
`REACT_APP_LIFF_ID=[LIFFアプリ詳細に記載されたLIFF ID]`\
`REACT_APP_LIFF_URL=[LIFFアプリ詳細に記載されたLIFF URL]`\
`REACT_APP_SERVER_BASE_URL=[ngrokから発行されたバックエンドのURL]`
### LineDeveloperコンソール→上記で作成した個人用ボット→LINE Official Account Manager→ホーム→友達追加ガイドURLを作成に移動
`REACT_APP_LINE_BOT_URL=[上記で作成したURL]`

## フロントエンド立ち上げ
1. **frontendディレクトリでnpm start**\
上記を行うと通常ブラウザが立ち上がる。この時、立ち上がったアプリのポート番号をURLバーなどから確認する(通常localhost:3000だと思われる)\
もし違ったら対応するアドレスをngrok.ymlに記入し直してngrokを再起動
2. **liffのコンソールに移動**\
コンソールのLIFFタブ→LIFFアプリ詳細に移り、「エンドポイントURL」にngrokから発行されたURLを貼り付ける\
さらに「LIFF URL」をLINEチャット上に貼り付ける。\
`https://liff.line.me/******/new_group`などと貼り付けるとすると、対応する画面に遷移\
`https://liff.line.me/******/update_ticket?ticket_id=28j3me29mw3`などとすると、クエリパラメータの指定が可能

## バックエンド立ち上げ

### GCP認証情報について
[https://cloud.google.com/docs/authentication/production?hl=ja](https://cloud.google.com/docs/authentication/production?hl=ja)　に従いGCPプロジェクトを立ち上げる。\
「サービスアカウントを作成する」の手順に従い、jsonを作成し、ローカルフォルダに配置.\
jsonのパスを`GOOGLE_APPLICATION_CREDENTIALS=[GCP認証情報のパス]`として.envに記載

### パッケージインストール
/server で `poetry install`を実行

### DB設定
GCPの左のタブからデータベース→Firestoreを選んで機能を立ち上げる

### API設定
GCPのAPIとサービスからAPIとサービスの有効化にすすみ Cloud Vision APIを検索、有効化する

### 立ち上げ
1. /serverに移動して `poetry run python main.py`
ポート番号を確認する(通常localhost:5000だと思われる)\
もし違ったら対応するアドレスをngrok.ymlに記入し直してngrokを再起動し、フロントエンドの環境変数変更

## 開発に関して
### WEB上でのアプリ立ち上げの手順
手順3までLINE上でのアプリ立ち上げの手順と同様\
上記3の「LIFF URL」をブラウザに貼り付ける

### PCでスマホ画面に対応した開発
参考：https://pc-karuma.net/how-to-view-mobile-version-of-a-website/ 

## (非推奨) liffアプリとして立ち上げる (herokuを使用する場合)
liffアプリとして動いているか確認する必要がある場合(liffのプロフィール取り込み機能などを用いる場合など)、作ったreactアプリをline loginチャネルに登録する必要があリます

### アプリ立ち上げまでにやること
(前提)\
[herokuアカウント](https://www.heroku.com/) + heroku CLIのインストール\
line login チャネル (メールから招待しました)

1. **herokuにreactアプリをデプロイ**\
参考：[Qiita記事](https://qiita.com/DogK0625/items/12178fdc3dd607088ff0), [公式サイト](https://devcenter.heroku.com/ja/articles/git)\
注意：gitレポジトリのうち,frontendフォルダのみをアプリにデプロイする必要があります！ `git push heroku master`のコマンドを以下のように変えて叩いてください\
``git push heroku `git subtree split --prefix frontend/ [自分がherokuにpushしたいブランチ名]`:master``\
とても長いので[alias](https://qiita.com/i13ame/items/c5aff483a60b95f7c0d3)を設定しても良いかもしれません

2. **herokuのアプリURLを取得**\
heroku openでアプリが正常にデプロイされているかを調べる\
うまくいっていた場合、ブラウザのバーからhttpsで始まるURLをコピー

3. **line loginチャネルにherokuURLを登録**\
loginチャネルのLIFFタブをクリックし、LIFFアプリ詳細画面を開く\
エンドポイントURLに　2で取得したURLを登録

4. **herokuアプリに環境変数を登録**\
loginチャネルのLIFFタブをクリックし、画面下方にあるLIFF IDをコピー\
[参考資料](https://devcenter.heroku.com/ja/articles/config-vars#managing-config-vars)に従って、環境変数`REACT_APP_LIFF_ID=[コピーしたLIFF ID]`を導入

5. **デバッグ**\
loginチャネルのLIFFタブをクリックし、画面下方にあるLIFF URLを取得\
これをスマホのLINEの任意のトーク画面上に貼り付ける\
貼り付けたLINEのリンクをタップするとLIFFアプリが立ち上がるので、意図通りの挙動をしているかデバッグを行う

### liffアプリを登録した後にデバッグする
上の1と5を行ってください(2,3,4は初回のみで大丈夫です)

## わからないことがあったら
Slack上で大島までご連絡ください！
