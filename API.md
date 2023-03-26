# warikan API

# 概要

warikanで使用するAPIとその戻り値を記述します。<br>
## 各オブジェクトの方針
- 一度作られたグループは削除を行わない
- 一度全員に承認されたチケットは変更不可　(変更したい場合、チケットを削除して新たに作り直す）
- チケット作成するとチケットの`approved_user_ids`が`[作成者のuser_id]`になり、Flex Messageが関係者に送信される
- チケット作成後に修正が行われると、チケットの`approved_user_ids`が`[修正者のuser_id]`になり、Flex Messageが関係者に送信される
- グループ決済開始時、`approved_user_ids`が`[決済開始者のuser_id]`になり、Flex Messageが関係者に送信される
- グループ決済開始すると、チケットの追加ができなくなる
- グループ決済開始後、新たにチケットを作成する修正を行いたい場合、決済を停止する必要がある(決済中かどうかを示すstatusをグループオブジェクトに追加)

# エンドポイント一覧
## 1.グループ (Transaction Group)
- a.[GET] 一覧取得
- b.[GET] グループ取得
- c.[POST] グループ登録
- d.[POST] グループ参加
- e.[POST] グループ決済開始 (NEW)
- f.[POST] グループ決済停止 (NEW)
- g.[POST] グループ承認 (NEW)
## 2.チケット (Transaction)
- a.[GET] チケット取得 (NEW)
- b.[POST] チケット登録
- c.[PUT] チケット更新
- d.[DELETE] チケット削除 (NEW)
## 3.セッション
- a.[POST] / セッション開始

# エンドポイント詳細

## 1. グループ (Transaction Group)

> グループの取得、登録に関するAPI

### ~~[GET]~~[POST] / ユーザーの参加グループ一覧取得

#### URL 
~~`localhost:8000/transaction_groups/{user_id}`~~
~~`localhost:8000/transaction_group/findByUserId'`~~
`localhost:8000/transaction_group/find_by_user_id'`

#### Request Body

bodyでuser_idを送信

```
{ "user_id": "9093jffn9j3rv"}
```

#### Response (200)
```
[
   {
     "group_id":"9w8euv9uq4qfqo",
     "name":"箱根旅行"
     "description":"友人と行く箱根旅行",
     "transaction_ids" : ["oaweifh0"],
     "users": [
                 { 
                     "user_id": "q489j9javij",
                     "name": "タロウ",
                     "picture_url" : https://line/...."
                 },
                 {
                     "user_id": "aweofizoij",
                     "name": "ジロウ",
                     "picture_url" : https://line/...."
                 },
                 {
                     "user_id": "9fdjvnnweew",
                     "name": "サブロウ",
                     "picture_url" : https://line/...."
                 },
              ], 
   },
   {
     "group_id":"w09fj0jfqo",
     "name":"沖縄旅行"
     "description":"友人と行く沖縄旅行",
     "transaction_ids" : ["oewinfoi32", "aoeb9a09rej", "qo34igoiqoig"],
     "users": [
                 { 
                     "user_id": "iwejfij9vnij",
                     "name": "シロウ",
                     "picture_url" : https://line/...."
                 },
                 {
                     "user_id": "9vahaw4nfinwf",
                     "name": "ゴロウ",
                     "picture_url" : https://line/...."
                 },
                 {
                     "user_id": "5ghrhuasnfjawx",
                     "name": "ロクロウ",
                     "picture_url" : https://line/...."
                 },
              ], 
   },
]
```

### [GET] / グループ取得

#### URL
`localhost:8000/transaction_group/{group_id}`

#### Response (200)
```
{
   "group_id":"9w8euv9uq4qfqo",
   "name":"箱根旅行"
   "description":"友人と行く箱根旅行",
   "transaction_ids" : ["oaweifh0", "igjvoaiwjr"],
   "users": [
               { 
                     "user_id": "q489j9javij",
                     "name": "タロウ",
                     "picture_url" : https://line/...."
               },
               {
                     "user_id": "aweofizoij",
                     "name": "ジロウ",
                     "picture_url" : https://line/...."
               },
               {
                     "user_id": "9fdjvnnweew",
                     "name": "サブロウ",
                     "picture_url" : https://line/...."
               },
            ], 
  }
```

### [POST] / グループ登録
#### URL 
`localhost:8000/transaction_group`

#### Request Body

user_id無しでグループ作成も可

```
{ 
    "user_id": "982hufnqnnwnvn",
    "name": "箱根旅行",
    "description": "友達と行く箱根旅行",
}
```

#### Response (200)

~~{ success: true }~~

id返却

```
{ "group_id": "9093jffn9j3rv" }
```

### [POST] / グループ参加
#### URL 
~~`localhost:8000/transaction_group/join`~~
`localhost:8000/transaction_group/<string:group_id>/join`

#### Request Body

~~{ "group_id":"ahueiufi74awe", user_id": "9093jffn9j3rv"}~~

group_id　→　リクエストパラメータ
```
{ "user_id": "9093jffn9j3rv"}
```

#### Response (200)
```
{
     "group_id":"9w8euv9uq4qfqo",
     "name":"箱根旅行"
     "description":"友人と行く箱根旅行",
     "users": [
                 { 
                     "user_id": "q489j9javij",
                     "name": "タロウ",
                     "picture_url" : https://line/...."
                 },
                 {
                     "user_id": "aweofizoij",
                     "name": "ジロウ",
                     "picture_url" : https://line/...."
                 },
                 {
                     "user_id": "9fdjvnnweew",
                     "name": "サブロウ",
                     "picture_url" : https://line/...."
                 },
              ], 
}
```

### [POST] / グループ決済開始 (NEW)

>APIが叩かれると、関係者同士の送金関係を計算するアルゴリズムを走らせる <br>
>それと同時に関係者にFlex Message(作成中)が送信される


#### URL
`localhost:8000/transaction_group/{group_id}/settlement`

#### Request Body
```
{"user_id": "ringrae2r4g"}
```

#### Response (200)
```
{ success: true }
```

### [POST] / グループ決済停止 (NEW)
> `approved_user_ids`が空にする <br>
>関係者に決済停止の旨を知らせるFlex Message(作成中)が送信される


#### URL
`localhost:8000/transaction_group/{group_id}/stop`

#### Request Body
```
{"user_id": "ringrae2r4g"}
```

#### Response (200)
```
{ success: true }
```

### [POST] / グループ決済承認 (NEW)

>グループのapproved_user_idsを更新する
>全員が承認した時には、Flex Message(作成中)が関係者に送信される


#### URL
`localhost:8000/transaction_group/{group_id}/approve`

#### Request Body
```
{"user_id": "ringrae2r4g"}
```

#### Response (200)
```
{ success: true }
```
`

### [GET] / 最終的な決済を計算する

>　プロジェクト終了時にグループ内の`transaction`の履歴から誰が誰に支払うかをフロントに送信する必要がある.<br>
>　その際、できるだけ全体の送金の回数が少なくなるように実装する必要がある.<br>
>　今回は貪欲用を用いたアルゴリズムでユーザーの数Nに対してO(N^2)で実現.<br>

#### URL
`localhost:8000/transaction_group/payment/<string:group_id>`

#### Response (200)
```
[
  {
    "debtor": "982hufnqnnwnvn",
    "lender": "8vye4u3bnjng",
    "amount": 5160
  },
  {
    "debtor": "a8wveyfhaweifh",
    "lender": "8vye4u3bnjng",
    "amount": 3510
  }
]
```

## 2. チケット (Transaction)

> チケットの作成、修正に関するAPI
> Bot連携も付随して行われる場合があります

### [GET] / チケット取得(NEW)
#### URL 
`localhost:8000/transaction/{transaction_id}`

#### Response Body
```
{
  "transaction_id": "ringrae2r4g",
  "name": "ランチ代金",
  "group_name" : "箱根旅行"
  "description": "箱根旅行2日目の昼のレストラン用",
  "lenders": [
    {
      "user_id": "982hufnqnnwnvn",
      "amount": 3950,
      "name": "タロウ",
      "picture_url" : https://line/...."
    },
    {
      "user_id": "a8wveyfhaweifh",
      "amount": 4000,
      "name": "ジロウ",
      "picture_url" : https://line/...."
    }
  ],
  "debtors": [
    {
      "user_id": "982hufnqnnwnvn",
      "amount": 2230,
      "name": "タロウ",
      "picture_url" : https://line/...."
    },
    {
      "user_id": "a8wveyfhaweifh",
      "amount": 2830,
      "name": "ジロウ",
      "picture_url" : https://line/...."
    },
    {
      "user_id": "8vye4u3bnjng",
      "amount": 2890,
      "name": "サブロウ",
      "picture_url" : https://line/...."
    }
  ],
  "payment": "equal"
}
```

### [POST] / チケット登録
* バックエンド側から、関係するユーザーにBotを通して、FlexMessage送信
* https://www.figma.com/file/yzbr8MmNNGoQZDWhhW5I8Q/warican-raw?node-id=7%3A151
* 対応するグループのオブジェクトのtransation_idsにこのチケットのidを追加

#### (注意) lenders, debtors修正しましたのでご注意ください

#### URL 
`localhost:8000/transaction/<string:group_id>`
`

#### Request Body
```
{
  "transaction_id": "ringrae2r4g",
  "name": "ランチ代金",
  "description": "箱根旅行2日目の昼のレストラン用",
  "lenders": [
    {
      "user_id": "982hufnqnnwnvn",
      "amount": 3950
    },
    {
      "user_id": "a8wveyfhaweifh",
      "amount": 4000
    }
  ],
  "debtors": [
    {
      "user_id": "982hufnqnnwnvn",
      "amount": 2230
    },
    {
      "user_id": "a8wveyfhaweifh",
      "amount": 2830
    },
    {
      "user_id": "8vye4u3bnjng",
      "amount": 2890
    }
  ],
  "payment": "equal"
}
```

#### Response (200)
```
{ success: true }
```

### [PUT] / チケット更新
バックエンド側から、関係するユーザーにBotを通して、FlexMessage送信
(注意) lenders, debtors修正しましたのでご注意ください

#### URL 
`localhost:8000/transaction/{transaction_id}`

#### Request Body
```
{ 
    "user_id": "982hufnqnnwnvn",
    "name": "ランチ代金",
    "description": "箱根旅行2日目の昼のレストラン用",
    "lenders" : [ 
                      { 
                         user_id: "A", 
                         amount: 3950
                      },
                      {
                         user_id: "B",
                         amount: 4000,
                      }.
                   ],
    "debtors": [
                      {
                         user_id: "A",
                         amount: 2230,
                      },
                      {
                         user_id: "B",
                         amount: 2830,
                      },
                      {
                         user_id: "C",
                         amount: 2890,
                      },
                      {
                         user_id: "D",
                         amount: 2890,
                      },
                      
                   ],
}
```

#### Response (200)
```
{ success: true }
```

### [DELETE] / チケット削除 (NEW)
* 対応するグループのオブジェクトのtransation_idsからこのチケットのidを削除

#### URL 
`localhost:8000/transaction/{transaction_id}`

#### Response (200)
```
{ success: true }
```

## 3. セッション

> 認証関係
セキュリティの観点でIDトークンをアクセストークンに切り替えます。違いは有効期限があるかないかだけです。

### [POST] / セッション開始
> セッションを新たに開始する時に叩かれるAPI. 主にliffアプリを始めて立ち上げたときやsession_idの期限が切れた時に使用される。
> アクセストークンと言うline liffから発行されるトークンを用い、line platformと通信してline_idを同定. warikanDBにline_idが一致するエントリが存在した場合、session_idを作成し保存。user_idとsession_idをフロント側に返却する. 

#### URL 
`localhost:8000/session`

#### Request Body
```
{ "access_token": "v8j92hufnqn9sdvkoknwnvn"}
```

#### Response (200)
```
{ user_id: "33m9jdkkvmkmsk", session_id: "oaiwejfoiawg0gvj0a9rjcds"}
```


# オブジェクト一覧
1. グループ (Transaction Group)
2. チケット (Transaction)
3. ユーザー(User)

## 1.グループ (Transaction Group)
```
{
   "group_id":"9w8euv9uq4qfqo",
   "name":"箱根旅行"
   "description":"友人と行く箱根旅行",
   "transaction_ids" : ["oaweifh0", "awuefh89", "aefh88vdn"],
   "user_ids": ["q489j9javij", "aweofizoij","9fdjvnnweew"], 
   "approved_user_ids": ["q489j9javij", "aweofizoij","9fdjvnnweew"],
   "all_approved": false,
   "status" : ""
}
```


## 2. チケット (Transaction)
**(注意) lenders, debtors修正しましたのでご注意ください**
```
{ 
    "transaction_id": "PQMDhlZAzFZv3ofMbAmZ",
    "name": "ランチ代金",
    "description": "箱根旅行2日目の昼のレストラン用",
    "lenders" : [ 
                      { 
                         user_id: "982hufnqnnwnvn", 
                         amount: 3950,
                      },
                      {
                         user_id: "a8wveyfhaweifh",
                         amount: 4000,
                      }.
                   ],
    "debtors": [
                      {
                         user_id: "982hufnqnnwnvn",
                         amount: 2230,
                      },
                      {
                         user_id: "a8wveyfhaweifh",
                         amount: 2830,
                      },
                      {
                         user_id: "8vye4u3bnjng",
                         amount: 2890,
                      },
                   ],
    "payment" : "equal"
    "group_id":"9w8euv9uq4qfqo",
    "approved_user_ids": ["q489j9javij", "aweofizoij","9fdjvnnweew"],
    "all_approved": false
}
```
`payment : {"equal", "individual"}`

## 3. ユーザー(User)
```
{
     "user_id": "q489j9javij",
     "line_id": "U33012874",
     "session_id": "0aw?9eufp¥3rmp4-vi32rq"
     "name": "タロウ",
     "picture_url" : https://line/...."
     "group_ids" : ["aw9eivnoawijr", "8f9aewf883ijrij", "98u8uf4f8du"], 
}
```
