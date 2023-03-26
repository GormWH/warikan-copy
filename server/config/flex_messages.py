class FlexMessages:
    # チケット承認時のメッセージ
    TICKET_APPROVAL = {
    "type": "flex",
    "altText": "Flex Message",
    "contents": {
    "type": "bubble",
    "direction": "ltr",
    "header": {
        "type": "box",
        "layout": "vertical",
        "contents": [
        {
            "type": "text",
            "text": "WARIKAN",
            "align": "center",
            "contents": [],
            "color": "#FFFFFF"
        }
        ],
        "backgroundColor": "#50CED6"
    },
    "body": {
        "type": "box",
        "layout": "vertical",
        "contents": [
        {
            "type": "text",
            "text": "ワリカン太郎さんが",
            "align": "center",
            "contents": [],
            "weight": "bold"
        },
        {
            "type": "text",
            "text": "チケットを発行しました",
            "align": "center",
            "weight": "bold",
            "margin": "sm"
        },
        {
            "type": "box",
            "layout": "vertical",
            "contents": [
            {
                "type": "text",
                "text": "イベントの名前",
                "size": "xs"
            },
            {
                "type": "text",
                "text": "Transactionの名前",
                "size": "md",
                "margin": "lg",
                "weight": "bold",
                "align": "center",
                "contents": []
            },
            {
                "type": "text",
                "text": "2日目の昼食代。"
            }
            ],
            "margin": "md"
        }
        ]
    },
    "footer": {
        "type": "box",
        "layout": "horizontal",
        "contents": [
        {
            "type": "text",
            "text": "チケットを承認しました",
            "weight": "bold",
            "align": "center"
        }
        ]
    }
    }
    }