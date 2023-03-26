# 10/15, 20, 22

**アプリの概要：お金の友達とのやりとり**  
チケットかなんかで管理して、それをデータベースに割り当てる  
支払いをする人をまとめたグループを選び、代表者が払う  

**アプリ競合**  
  
- ワリカ  
不便な点：電子決済に繋げるのがない、総計が出てこない  
改善点：領収書の写真をアップロードすれば、決済できる  
理想：LinePayを使って支払う形が理想  
  
- LinePayなどの割り勘機能  
不便な点：決済単位でしか割り勘できず、より大きなプロジェクト単位  
旅行以外にも使い道があるか議論  

  
**別のアプリアイデア**  
機械学習で株価予測  
問題点：そんな簡単にできるわけではない  
ありものと差別化できる点：  
- リアルタイム性を売りにする  
- セキュリティの難しさ  
- 株価アプリのモデルの精度をめちゃくちゃあげる  
→モデルの精度を研究  

**結論：お金の友達とのやりとり**  
  
iOSアプリにした方が良い  

# 10/27 Wed 17:00（メンターMTG①）

出席者：伊藤，大島, 重見，Park, 吉川
メンターMTG： 小林先生

ドキュメント

- API仕様検討
https://docs.google.com/spreadsheets/d/1xtHXUWk9DOMY5Aq235CRDiO4EXqT7_e0mEuChwUysC4/edit#gid=2044191477 

- Launch Presentation
https://docs.google.com/presentation/d/1_vcj6LTL4hgv5PrVWfG3MRilrB7znExwq9_ZDHVKwY8/edit#slide=id.p 

環境
- VScodeの共同編集機能

## 議論のトピック

- シナリオの作成
  
  - プロジェクトのメンバーで打ち上げ旅行に行く（熱海）
  - メンバーでLINEのグループ作成
  - warikanアプリのインストール
    - warikan自体のインストール
      - **誰がインストールするか**
    - グループLINE内で以下のメッセージを送る
      - メンションを送ると自動でアプリ立ち上げる
      - @warikan_open_project
  - 旅行に行く．空港でレストラン入った．
  - 吉川さんが，レストランで全額払った．
    - 全員同じ　1000円
    - １人ずつ違う
      - カレー
      - 和風定食
      - 洋風定食
    - 全員　5000円　→　吉川さんが全額支払った
  - 吉川さんがチケット発行する
    - **コマンド決める必要**
    - パターン１：全員同じ金額
      - @all 1000
      - ...
    - パターン２：個別に違う
      - @ito 1000
      - @yoshikawa 1000
      - ...
    - パターン３：自分へのメモ
      - 自分で支払ったけど，メモ用としてメンションしとく
  - チケットの発行があると，他のメンバーに通知が行く
  - 通知を受け取ったメンバーは，承認・修正
    - 修正
      - 1000円じゃなく，800円
    - 承認
      - 通知自体を承認
      - 通知を見逃すケースもある
  - 旅行が終わりました．
  - プロジェクトを終了する
    - 誰かが終了を押す
    - 他に何かありませんか？画面に表示
    - 他のメンバーが承認・修正
  - 全員が承認した
  - warikanアプリは，精算する
    - 誰が誰に何円．一覧を表示
    - LINE Payで勝手に精算

## 来週までの各自の作業

- 全体のフレームワーク検討（大島さん）
  - Webサービスを作ってLINE LIFFに組み込むアプローチ
  - ReactNativeで作るアプローチ
  - それぞれのアプローチの関係．具体的な方法

- MVPのbot作成（吉川さん）

- サーバーのベースを構築（伊藤）
  - Flask

- APIの仕様作成（大島，吉川，伊藤）

- ReactNativeの勉強・チュートリアル（Park，重見）
  - Expo Go

## 来週以降の予定

- フロントのモック作成

- 各自の実装開始

# 11/04 Thu 17:00

出席者：大島，Park，伊藤

ドキュメント

- API仕様検討
https://docs.google.com/spreadsheets/d/1xtHXUWk9DOMY5Aq235CRDiO4EXqT7_e0mEuChwUysC4/edit#gid=2044191477 

- Launch Presentation
https://docs.google.com/presentation/d/1_vcj6LTL4hgv5PrVWfG3MRilrB7znExwq9_ZDHVKwY8/edit#slide=id.p 

環境
- VScodeの共同編集機能

## 今週の作業，本日の議論

- 全体のフレームワーク図(大島)
  - https://docs.google.com/presentation/d/1DGPYAaYtH7jr8Q_iIZkC_ZEYUiGpk4gH-rOBv36clpY/edit#slide=id.p

- モック作成(大島)
  - Figma
  - https://www.figma.com/file/KgY5gJQElfWWnF5ZZR2Ugp/warican?node-id=0%3A1　

- APIのベース作成（伊藤）
  - Flask + MongoDB
  - 参考サイト
    - https://qiita.com/kerobot/items/bd504b0d787de63c364e

- 画面遷移図
  - シナリオに沿って必要な作業を整理
  - https://www.figma.com/file/KgY5gJQElfWWnF5ZZR2Ugp/warican?node-id=0%3A1

- APIの仕様（伊藤）
  - https://docs.google.com/spreadsheets/d/1xtHXUWk9DOMY5Aq235CRDiO4EXqT7_e0mEuChwUysC4/edit#gid=2044191477

- ReactNativeの勉強・チュートリアル（Park）

- 割り振り案
  - （第1案）★採用になりそうだが，今一度，全体を整理★
    - フロント
      - LINE LIFF
      - React
    - バックエンド
      - アカウント・グループ管理
        - LINE連携
      - bot管理
        - LINE連携
      - チケット（貸借）管理

  - （第2案）機能箇所ごとに分ける 
    - グループ作成
      - グループ作成画面の担当
    - グループ参加
      - 参加画面を全て担当
    - チケット作成
      - チケット作成画面の担当
    - チケット承認、修正担当
      - チケットの承認、修正を担当

  - （第3案）担当者が担当箇所を実装 
    - 画面作成
      - figmaに沿う形で画面のUI作成。ボタン等のアクションは実装しない
    - line エンドポイントラッパー作成
      - lineのAPIが変更させても大丈夫なように、独自の関数でラップする
    - Flex Messageの作成
      - https://developers.line.biz/ja/docs/messaging-api/flex-message-elements/#block に沿ってflex messageの雛形を作成する

## 来週以降の予定

- LINE LIFFを利用する場合のフレームワーク，エンドポイントの整理（大島）
- LINEボットのflaskへの組込み（伊藤）
- Git上のサーバーを自分のローカルで動かせるようにしておく（Park，重見）
  - React, Flaskの環境構築を含む

# 11/10 Wed 17:00（メンターMTG②）

出席者：大島，Park，伊藤、吉川，小林先生

ドキュメント

- API仕様検討
https://docs.google.com/spreadsheets/d/1xtHXUWk9DOMY5Aq235CRDiO4EXqT7_e0mEuChwUysC4/edit#gid=2044191477 

- Launch Presentation
https://docs.google.com/presentation/d/1_vcj6LTL4hgv5PrVWfG3MRilrB7znExwq9_ZDHVKwY8/edit#slide=id.p 

環境
- VScodeの共同編集機能

## 今週の作業

- figma更新(大島)
  - https://www.figma.com/file/yzbr8MmNNGoQZDWhhW5I8Q/warican-raw

- 資料作成(大島)
  - https://docs.google.com/spreadsheets/d/1WK7fAFnC8Y-l9jiFGfpSmXHZkiS8c9IWTIlh0TvLly8/edit?usp=sharing

- asana作成(大島)
  - https://app.asana.com/0/home/1201350478621128

- frontをgithubにあげた(大島)
  - https://github.com/UTokyo-PBL/pbl-2021-group_3_2021

- LINEの以下のAPIコードを組込み（伊藤）
  - https://github.com/line/line-bot-sdk-python 

- パソコンにサーバー起動環境の設定、構築 (Park)
  - MongoDB, Flaskなど必要な環境、パッケージーのinstall

## 今日の議論

- APIの仕様はチェック（11/10中にチェック）

- 役割分担
  - フロント（大島，Park，重見？）
  - バックエンド（API作成，サーバー）
    - Transaction（吉川）
    - TransactionGroup（伊藤）
    - その他バックエンド（重見？）

- チケット作成画面に表示する内容
  - どのグループ
  - 払った金額
  - メンバーの割り当て (と その金額)
  - 平等に割り勘するか、金額をバラバラにするか
  - (アイデア：何円単位で割り勘するか)
  - (アイデア：端数の表示)
  - (アイデア：領収書取り込み)

## 来週以降の予定

- 各自の担当部分を進める
- バックエンド
  - ＋ ServerをGCPに配置

# 11/17 Wed 17:00

出席者：大島，Park，重見，吉川，伊藤

## 議題

- 作業会
- 質疑応答

## 来週以降の予定

- フロント
  - Asana参照
- バックエンド
  - ドキュメントの黄色ハイライトを終了
    - https://docs.google.com/spreadsheets/d/1WK7fAFnC8Y-l9jiFGfpSmXHZkiS8c9IWTIlh0TvLly8/edit?usp=sharing

# 11/24 Wed 17:00（メンターMTG③）

出席者：大島，Park，重見，吉川，伊藤，小林先生

# 作業報告

- frontend(グループ編集)
  - Bot友達判定
  - UI画面
  - グループ参加をバックエンドに送信

- Transaction (吉川)
  - 登録
  - 更新(WIP)
  - Flex messageの動作確認

- Transaction Group（伊藤）
  - 登録
  - 取得
  - 参加
  - 所属グループの一覧取得　→　userのAPI
    - #/User/{id}/Groups　→　グループの中身を全部返す
  - userのトークン　→　userのAPI

# 議題

- GitHub
  - issue

- GCP上にServerデプロイ

- API
  - userのAPI
    - line token登録
    - group取得
  - 認証
    - LINEでこのアプリに承諾　→　こっちのAPIでも許諾
    - urlの中にランダムな文字列を入れる方法で足りそう
    - https://qiita.com/kerobot/items/8ef8d7416742eedcea49 

- Flex Message
  - フロント・バックどちらが担当するか
  - UI部分のコード化はフロント、データ部分のコード化はバックエンドで分担が良い？
  - バックエンド側で担当

- Swagger

- Dockerイメージ(フェーズ2以降)

## 来週以降の予定

- フロント

- バックエンド
  - APIの残り


# 12/1 Wed 17:00

出席者：大島，Park，重見，吉川，伊藤，小林先生

## 作業報告

- 所定のAPI作成，変更等のコメント（伊藤）
- グループ作成の画面作成（Park）

## 議題

- マージ順
- デプロイ

## 来週以降の予定

- 統合テスト
  - コメント対応
  - Swagger
- フォロー

# 12/8 Wed 17:00（メンターMTG④）


# 12/15 Wed 17:00


# 12/22 Wed 17:00（メンターMTG⑤）


# 12/23-29　→　アプリ完成・プレゼン着手


# 2022/1/5 Wed 17:00　→　プレゼン完成


# 1/12 Wed 17:00（メンターMTG⑥）　→　予備


# 1/14 Fri 17:00（最終発表）→　優勝賞金100万円


シナリオ

- グループ作成(担当：大島)
  タイトル：箱根旅行
  説明： 1/15日の箱根旅行
  作成者：大島

- グループ承認（担当：伊藤）
  承認画面:

- チケット作成(担当：全員)
  - チケット(伊藤): 箱根美術館の入場料 3500円 (lenders: 伊藤, debtors:自分を含めた全員 payment:equal)
  - チケット(Park): 宿泊料金 45000円 (lenders: Park, debtors:伊藤,大島,Park, payment:equal)
  - チケット(吉川)：
  - チケット(重見)： ランチ料金(2日目の昼食代) 7000円 (lender: 重見, debtor: Park, 伊藤, Park, payment: Park-1500, 伊藤-1500, 吉川-1500, 大島-1500, 重見-1000 )

- チケット修正(担当: Park)
  - ランチ料金の修正 (Park-1500 => 1000, 伊藤-1500 => 2000, 大島-1000)

- 決済開始 (担当：大島)


今後
- チケット承認
- 決済のFlex Messageの送信
- 決済結果の表示
