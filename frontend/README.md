# How to use

## 立ち上げ方

このディレクトリ上で `npm start`を打つとブラウザ上にアプリが立ち上がります

## 環境変数設定
Liffコンソール→LIFFタブ→LIFFアプリ詳細に移動\
.env または .env.local に以下３点を記載する\
`REACT_APP_LIFF_ID=[LIFFアプリ詳細に記載されたLIFF ID]`\
`REACT_APP_LIFF_URL=[LIFFアプリ詳細に記載されたLIFF URL]`\
`REACT_APP_SERVER_BASE_URL=https://warikan-stage-334115.an.r.appspot.com/`

ローカルでサーバーを立ち上げて連携したい場合、`REACT_APP_SERVER_BASE_URL=http://localhost:[ローカルサーバーのポート番号]`\
ローカルでサーバーを動かす場合は「バックエンドをローカルで動かす」を参照


## liffアプリとして立ち上げる (ngrokを使用する場合)
liffアプリとして動いているか確認する必要がある場合(liffのプロフィール取り込み機能などを用いる場合など)、作ったreactアプリをline loginチャネルに登録する必要があリます

### LINE上でのアプリ立ち上げの手順
(前提) \
ngrokのダウンロード(参考：https://qiita.com/mininobu/items/b45dbc70faedf30f484e) \
frontendディレクトリでnpm installを実行

1. **frontendディレクトリでnpm start**\
上記を行うと通常ブラウザが立ち上がる。この時、立ち上がったアプリのポート番号をURLバーなどから確認する(通常localhost:5000だと思われる)
2. `ngrok http (上記のポート番号)`\
この時、ngrokからhttps://(何らかの文字列).io が発行されるので、これを確認する
3. **liffのコンソールに移動**\
コンソールのLIFFタブ→LIFFアプリ詳細に移り、「エンドポイントURL」にngrokから発行されたURLを貼り付ける\
さらに「LIFF URL」をLINEチャット上に貼り付ける。\
`https://liff.line.me/******/new_group`などと貼り付けるとすると、対応する画面に遷移\
`https://liff.line.me/******/update_ticket?ticket_id=28j3me29mw3`などとすると、クエリパラメータの指定が可能

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

## バックエンドをローカルで動かす
/serverに移動

### 環境変数設定
LineDeveloperコンソール→warikan botに移動\
.env または .env.local に以下３点を記載する\
`CHANNEL_ACCESS_TOKEN=[Basic SettingsのChannel secret]`\
`CHANNEL_SECRET=[Messaging APIのChannel access token]`\
`GOOGLE_APPLICATION_CREDENTIALS=[GCP認証情報のパス]` (後述するGCP認証情報についてを参照)\
`FLASK_ENV="development"`

### GCP認証情報について
[https://cloud.google.com/docs/authentication/production?hl=ja](https://cloud.google.com/docs/authentication/production?hl=ja)　に従いGCPプロジェクトを立ち上げる。\
「サービスアカウントを作成する」の手順に従い、jsonを作成し、ローカルフォルダに配置.\
jsonのパスを`GOOGLE_APPLICATION_CREDENTIALS=[GCP認証情報のパス]`として.envに記載

### パッケージインストール
/server で `poetry install`を実行

### DB設定
確か必要だったと思われる

### 立ち上げ
`poetry run python main.py`

## わからないことがあったら
Slack上で大島までご連絡ください！

# 以下はReactに付属でついてきた説明です


# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
