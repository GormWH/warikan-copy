import json
from models.user import User
from config.settings import Settings
from os.path import dirname, join

settings = Settings(join(dirname(__file__), '.env'))

def return_flex_message_check(
    sender, lender_debtor, usersCol, Transaction, Lenders, Debtors, GroupName="", Data_approve="", modify=False
):
    # title = ({
    #         "type": "text",
    #         "text": "チケットを発行しました",
    #         "size": "sm",
    #         "weight": "bold",
    #         "align": "center",
    #         "color": "#444444",
    #         "margin": "md"
    #     } if not modify else
    #     {
    #         "type": "text",
    #         "weight": "bold",
    #         "align": "center",
    #         "size": "sm",
    #         "color": "#444444",
    #         "contents": [
    #         {
    #             "type": "span",
    #             "text": "チケットを"
    #         },
    #         {
    #             "type": "span",
    #             "text": "修正",
    #             "color": "#EF7272"
    #         },
    #         {
    #             "type": "span",
    #             "text": "しました"
    #         }
    #         ]
    #     })
    
    action_description = ({
            "type": "text",
            "text": "%sさんが\nチケットを発行しました" % sender.name,
            "wrap": True,
            "gravity": "center",
            "size": "sm",
            "weight": "bold",
            "color": "#444444"
          } if not modify else
          {
            "type": "text",
            "wrap": True,
            "gravity": "center",
            "size": "sm",
            "weight": "bold",
            "color": "#444444",
            "contents": [
              {
                "type": "span",
                "text": "%sさんが\n" % sender.name
              },
              {
                "type": "span",
                "text": "チケットを"
              },
              {
                "type": "span",
                "text": "修正",
                "color": "#EF7272"
              },
              {
                "type": "span",
                "text": "しました"
              }
            ]
          }
          )

    lenders_content = []

    for lender in Lenders:
        try:
            lenderUser = User.from_dict(usersCol.document(lender["user_id"]).get().to_dict())
            lenders_content.append({
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "box",
                "layout": "horizontal",
                "contents": [
                  {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                      {
                        "type": "image",
                        "url": lenderUser.picture_url,
                        "aspectMode": "cover"
                      }
                    ],
                    "height": "35px",
                    "width": "35px",
                    "cornerRadius": "25px",
                    "borderWidth": "1px",
                    "borderColor": "#EEEEEE",
                    "flex": 1
                  },
                  {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                      {
                        "type": "text",
                        "text": "%s さんが支払い" % lenderUser.name,
                        "weight": "bold",
                        "size": "xs",
                        "align": "start",
                        "color": "#444444",
                        "wrap": True
                      }
                    ]
                  }
                ],
                "alignItems": "center",
                "margin": "15px",
                "paddingStart": "25px",
                "paddingEnd": "25px",
                "spacing": "20px"
              },
              {
                "type": "box",
                "layout": "horizontal",
                "contents": [
                  {
                    "type": "text",
                    "align": "center",
                    "margin": "8px",
                    "weight": "bold",
                    "contents": [
                      {
                        "type": "span",
                        "text": "%s" % lender["amount"],
                        "weight": "bold",
                        "size": "lg"
                      },
                      {
                        "type": "span",
                        "text": " 円",
                        "weight": "bold",
                        "size": "xxs"
                      }
                    ]
                  }
                ],
                "margin": "8px"
              }
            ],
            "height": "100px",
            "borderWidth": "1px",
            "borderColor": "#F0F1F2",
            "cornerRadius": "2px"
          })
        except:
            print("return_flex_message_check: User %s not found." % lender["user_id"])

    debtors_content = []
    if len(Debtors) > 0:
        debtors_content.append({
                "type": "separator",
                "color": "#F0F1F2",
                "margin": "5px"
            })
    
    for debtor in Debtors:
        try:
            debtorUser = User.from_dict(usersCol.document(debtor["user_id"]).get().to_dict())
            debtors_content.append({
                    "type": "box",
                    "layout": "horizontal",
                    "contents": [
                    {
                        "type": "box",
                        "layout": "vertical",
                        "contents": [
                        {
                            "type": "image",
                            "url": debtorUser.picture_url,
                            "aspectMode": "cover"
                        }
                        ],
                        "height": "35px",
                        "width": "35px",
                        "cornerRadius": "25px",
                        "borderWidth": "1px",
                        "borderColor": "#EEEEEE"
                    },
                    {
                        "type": "text",
                        "text": debtorUser.name,
                        "size": "xs",
                        "align": "start",
                        "color": "#444444",
                        "flex": 2,
                        "margin": "17px"
                    },
                    {
                        "type": "text",
                        "align": "end",
                        "contents": [
                        {
                            "type": "span",
                            "text": "%s" % debtor["amount"],
                            "size": "xs"
                        },
                        {
                            "type": "span",
                            "text": " 円",
                            "size": "xs"
                        }
                        ]
                    }
                    ],
                    "alignItems": "center",
                    "margin": "8px"
                })
            debtors_content.append(
                {
                    "type": "separator",
                    "margin": "8px",
                    "color": "#F0F1F2"
                })
        except:
            print("return_flex_message_check: User %s not found." % debtor["user_id"])
    return {
    "type": "bubble",
    "size": "mega",
    "header": {
        "type": "box",
        "layout": "vertical",
        "contents": [
        {
            "type": "text",
            "text": "WARIKAN",
            "weight": "bold",
            "color": "#FFFFFF",
            "align": "center",
            "size": "sm"
        }
        ],
        "alignItems": "center",
        "justifyContent": "center"
    },
    "body": {
        "type": "box",
        "layout": "vertical",
        "contents": [
        {
        "type": "box",
        "layout": "horizontal",
        "contents": [
          {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "box",
                "layout": "horizontal",
                "contents": [
                  {
                    "type": "image",
                    "url": sender.picture_url,
                    "aspectMode": "cover"
                  }
                ],
                "width": "50px",
                "height": "50px",
                "borderWidth": "1px",
                "borderColor": "#EEEEEE",
                "cornerRadius": "25px"
              }
            ],
            "width": "80px",
            "alignItems": "center",
            "justifyContent": "center",
            "margin": "8px"
          },
          action_description
        ]
      },
        {
            "type": "box",
            "layout": "vertical",
            "margin": "5px",
            "contents": [

            {
              "type": "separator",
              "margin": "20px"
            },
            {
              "type": "box",
              "layout": "vertical",
              "margin": "lg",
              "spacing": "sm",
              "contents": [
                {
                  "type": "box",
                  "layout": "baseline",
                  "spacing": "sm",
                  "contents": [
                    {
                      "type": "text",
                      "text": "チケット",
                      "color": "#aaaaaa",
                      "size": "xxs",
                      "flex": 1
                    },
                    {
                      "type": "text",
                      "text": Transaction.name,
                      "wrap": True,
                      "color": "#444444",
                      "size": "sm",
                      "flex": 3,
                      "weight": "bold"
                    }
                  ]
                },
                {
                  "type": "box",
                  "layout": "baseline",
                  "spacing": "sm",
                  "contents": [
                    {
                      "type": "text",
                      "text": "グループ",
                      "color": "#aaaaaa",
                      "size": "xxs",
                      "flex": 1
                    },
                    {
                      "type": "text",
                      "text": GroupName,
                      "wrap": True,
                      "color": "#444444",
                      "size": "sm",
                      "flex": 3
                    }
                  ],
                  "margin": "10px"
                },
                {
                  "type": "box",
                  "layout": "baseline",
                  "spacing": "sm",
                  "contents": [
                    {
                      "type": "text",
                      "text": "説明",
                      "color": "#aaaaaa",
                      "size": "xxs",
                      "flex": 1
                    },
                    {
                      "type": "text",
                      "text": Transaction.description or " ",
                      "wrap": True,
                      "color": "#444444",
                      "size": "sm",
                      "flex": 3
                    }
                  ],
                  "margin": "10px"
                }
              ]
            },

            {
              "type": "separator",
              "margin": "20px"
            },
            {
            "type": "text",
            "text": "支払い者",
            "size": "xxs",
            "color": "#444444",
            "weight": "bold",
            "margin": "20px"
            },
            {
                "type": "box",
                "layout": "vertical",
                "contents": lenders_content,
                "spacing": "10px",
                "margin": "5px"
            },
            {
                "type": "box",
                "layout": "horizontal",
                "contents": [
                {
                    "type": "text",
                    "text": "各自の金額分",
                    "color": "#444444",
                    "size": "xxs",
                    "weight": "bold"
                },
                {
                    "type": "text",
                    "text": "均等に割り勘" if Transaction.payment == 'equal' else "個別金額",
                    "size": "xxs",
                    "color": "#444444",
                    "align": "end"
                }
                ],
                "margin": "35px"
            },

            {
            "type": "box",
            "layout": "vertical",
            "contents": debtors_content
            },
            ],
            "paddingStart": "15px",
            "paddingEnd": "15px"
        },
        ]
    },
    "footer": {
        "type": "box",
        "layout": "horizontal",
        "spacing": "sm",
        "contents": [
        {
            "type": "box",
            "layout": "horizontal",
            "contents": [
            {
                "type": "button",
                "action": {
                "type": "uri",
                "uri": "%s/update_ticket?ticket_id=%s" % (settings.liff_base_url, Transaction.id),
                "label": "修正"
                },
                "color": "#FFFFFF",
                "height": "sm"
            }
            ],
            "backgroundColor": "#BCBDC1",
            "height": "50px",
            "width": "110px",
            "justifyContent": "center",
            "cornerRadius": "25px",
            "alignItems": "center"
        },
        {
            "type": "box",
            "layout": "horizontal",
            "contents": [
            {
                "type": "button",
                "action": {
                    "type": "postback",
                    "label": "承認",
                    "data": Data_approve
                },
                "color": "#FFFFFF",
                "height": "sm"
            }
            ],
            "backgroundColor": "#50CED6",
            "height": "50px",
            "width": "110px",
            "justifyContent": "center",
            "cornerRadius": "25px",
            "alignItems": "center",
            "margin": "20px"
        }
        ],
        "justifyContent": "center",
        "height": "90px",
        "alignItems": "center"
    },
    "styles": {
        "header": {
        "backgroundColor": "#50CED6"
        },
        "footer": {
        "separator": False
        }
    }
    }
    

    

def return_flex_message_approval(
    GroupName="", TransactionName="", Description=""
):
    return {
        "type": "bubble",
        "size": "mega",
        "header": {
            "type": "box",
            "layout": "vertical",
            "contents": [
            {
                "type": "text",
                "text": "WARIKAN",
                "weight": "bold",
                "color": "#FFFFFF",
                "align": "center",
                "size": "sm"
            }
            ],
            "alignItems": "center",
            "justifyContent": "center"
        },
        "body": {
            "type": "box",
            "layout": "vertical",
            "contents": [
            {
                "type": "text",
                "text": "以下のチケットを承認しました",
                "size": "sm",
                "weight": "bold",
                "align": "center",
                "color": "#444444",
                "margin": "md"
            },
            {
                "type": "box",
                "layout": "vertical",
                "margin": "30px",
                "contents": [
                {
                    "type": "box",
                    "layout": "baseline",
                    "contents": [
                    {
                        "type": "text",
                        "text": GroupName,
                        "size": "xxs",
                        "color": "#444444",
                        "weight": "bold",
                        "flex": 1
                    },
                    {
                        "type": "text",
                        "text": TransactionName,
                        "weight": "bold",
                        "size": "md",
                        "flex": 2
                    }
                    ]
                },
                {
                    "type": "text",
                    "text": Description or " ",
                    "size": "xs",
                    "margin": "5px",
                    "wrap": True
                }
                ],
                "paddingStart": "15px",
                "paddingEnd": "15px"
            },
            {
                "type": "box",
                "layout": "vertical",
                "contents": []
            }
            ]
        },
        "footer": {
            "type": "box",
            "layout": "horizontal",
            "spacing": "sm",
            "contents": [
            {
                "type": "box",
                "layout": "vertical",
                "contents": [
                {
                    "type": "image",
                    "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/01_1_cafe.png"
                }
                ],
                "width": "26px",
                "height": "26px",
                "cornerRadius": "13px",
                "backgroundColor": "#50CED6",
                "margin": "30px"
            },
            {
                "type": "text",
                "text": "チケットを承認しました",
                "weight": "bold",
                "size": "sm",
                "margin": "10px"
            }
            ],
            "justifyContent": "center",
            "height": "90px",
            "alignItems": "center"
        },
        "styles": {
            "header": {
            "backgroundColor": "#50CED6"
            },
            "footer": {
            "separator": False
            }
        }
    }


def return_flex_message_all_approval(
    usersCol, Transaction, Lenders, Debtors, GroupName=""
):
    lenders_content = []
    for lender in Lenders:
        try:
            lenderUser = User.from_dict(usersCol.document(lender["user_id"]).get().to_dict())
            lenders_content.append({
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "box",
                "layout": "horizontal",
                "contents": [
                  {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                      {
                        "type": "image",
                        "url": lenderUser.picture_url,
                        "aspectMode": "cover"
                      }
                    ],
                    "height": "35px",
                    "width": "35px",
                    "cornerRadius": "25px",
                    "borderWidth": "1px",
                    "borderColor": "#EEEEEE",
                    "flex": 1
                  },
                  {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                      {
                        "type": "text",
                        "text": "%s さんが支払い" % lenderUser.name,
                        "weight": "bold",
                        "size": "xs",
                        "align": "start",
                        "color": "#444444",
                        "wrap": True
                      }
                    ]
                  }
                ],
                "alignItems": "center",
                "margin": "15px",
                "paddingStart": "25px",
                "paddingEnd": "25px",
                "spacing": "20px"
              },
              {
                "type": "box",
                "layout": "horizontal",
                "contents": [
                  {
                    "type": "text",
                    "align": "center",
                    "margin": "8px",
                    "weight": "bold",
                    "contents": [
                      {
                        "type": "span",
                        "text": "%s" % lender["amount"],
                        "weight": "bold",
                        "size": "lg"
                      },
                      {
                        "type": "span",
                        "text": " 円",
                        "weight": "bold",
                        "size": "xxs"
                      }
                    ]
                  }
                ],
                "margin": "8px"
              }
            ],
            "height": "100px",
            "borderWidth": "1px",
            "borderColor": "#F0F1F2",
            "cornerRadius": "2px"
          })
        except:
            print("return_flex_message_all_approval: User %s not found." % lender["user_id"])

    debtors_content = []
    if len(Debtors) > 0:
        debtors_content.append({
                "type": "separator",
                "color": "#F0F1F2",
                "margin": "5px"
            })
    
    for debtor in Debtors:
        try:
            debtorUser = User.from_dict(usersCol.document(debtor["user_id"]).get().to_dict())
            debtors_content.append({
                    "type": "box",
                    "layout": "horizontal",
                    "contents": [
                    {
                        "type": "box",
                        "layout": "vertical",
                        "contents": [
                        {
                            "type": "image",
                            "url": debtorUser.picture_url,
                            "aspectMode": "cover"
                        }
                        ],
                        "height": "35px",
                        "width": "35px",
                        "cornerRadius": "25px",
                        "borderWidth": "1px",
                        "borderColor": "#EEEEEE"
                    },
                    {
                        "type": "text",
                        "text": debtorUser.name,
                        "size": "xs",
                        "align": "start",
                        "color": "#444444",
                        "flex": 2,
                        "margin": "17px"
                    },
                    {
                        "type": "text",
                        "align": "end",
                        "contents": [
                        {
                            "type": "span",
                            "text": "%s" % debtor["amount"],
                            "size": "xs"
                        },
                        {
                            "type": "span",
                            "text": " 円",
                            "size": "xs"
                        }
                        ]
                    }
                    ],
                    "alignItems": "center",
                    "margin": "8px"
                })
            debtors_content.append(
                {
                    "type": "separator",
                    "margin": "8px",
                    "color": "#F0F1F2"
                })
        except:
            print("return_flex_message_all_approval: User %s not found." % lender["user_id"])

    return {
        "type": "bubble",
        "size": "mega",
        "header": {
            "type": "box",
            "layout": "vertical",
            "contents": [
            {
                "type": "text",
                "text": "WARIKAN",
                "weight": "bold",
                "color": "#FFFFFF",
                "align": "center",
                "size": "sm"
            }
            ],
            "alignItems": "center",
            "justifyContent": "center"
        },
        "body": {
            "type": "box",
            "layout": "vertical",
            "contents": [
            {
                "type": "text",
                "text": "以下の内容で",
                "size": "sm",
                "weight": "bold",
                "align": "center",
                "color": "#444444",
                "margin": "md"
            },
            {
                "type": "text",
                "text": "チケットが最終承認されました",
                "weight": "bold",
                "align": "center",
                "size": "sm",
                "color": "#444444"
            },
            {
                "type": "box",
                "layout": "vertical",
                "margin": "5px",
                "contents": [
            {
              "type": "separator",
              "margin": "20px"
            },
            {
              "type": "box",
              "layout": "vertical",
              "margin": "lg",
              "spacing": "sm",
              "contents": [
                {
                  "type": "box",
                  "layout": "baseline",
                  "spacing": "sm",
                  "contents": [
                    {
                      "type": "text",
                      "text": "チケット",
                      "color": "#aaaaaa",
                      "size": "xxs",
                      "flex": 1
                    },
                    {
                      "type": "text",
                      "text": Transaction.name,
                      "wrap": True,
                      "color": "#444444",
                      "size": "sm",
                      "flex": 3,
                      "weight": "bold"
                    }
                  ]
                },
                {
                  "type": "box",
                  "layout": "baseline",
                  "spacing": "sm",
                  "contents": [
                    {
                      "type": "text",
                      "text": "グループ",
                      "color": "#aaaaaa",
                      "size": "xxs",
                      "flex": 1
                    },
                    {
                      "type": "text",
                      "text": GroupName,
                      "wrap": True,
                      "color": "#444444",
                      "size": "sm",
                      "flex": 3
                    }
                  ],
                  "margin": "10px"
                },
                {
                  "type": "box",
                  "layout": "baseline",
                  "spacing": "sm",
                  "contents": [
                    {
                      "type": "text",
                      "text": "説明",
                      "color": "#aaaaaa",
                      "size": "xxs",
                      "flex": 1
                    },
                    {
                      "type": "text",
                      "text": Transaction.description or " ",
                      "wrap": True,
                      "color": "#444444",
                      "size": "sm",
                      "flex": 3
                    }
                  ],
                  "margin": "10px"
                }
              ]
            },
            {
              "type": "separator",
              "margin": "20px"
            },
            {
            "type": "text",
            "text": "支払い者",
            "size": "xxs",
            "color": "#444444",
            "weight": "bold",
            "margin": "20px"
            },
                {
                "type": "box",
                "layout": "vertical",
                "contents": lenders_content,
                "spacing": "10px",
                "margin": "5px"
                },
                {
                    "type": "box",
                    "layout": "horizontal",
                    "contents": [
                    {
                        "type": "text",
                        "text": "各自の金額分",
                        "color": "#444444",
                        "size": "xxs",
                        "weight": "bold"
                    },
                    {
                        "type": "text",
                        "text": "均等に割り勘" if Transaction.payment == 'equal' else "個別金額",
                        "size": "xxs",
                        "color": "#444444",
                        "align": "end"
                    }
                    ],
                    "margin": "35px"
                },

                {
                "type": "box",
                "layout": "vertical",
                "contents": debtors_content
                },
                ],
                "paddingStart": "15px",
                "paddingEnd": "15px"
            },
            ]
        },
        "styles": {
            "header": {
            "backgroundColor": "#50CED6"
            }
        }
    }

def return_flex_message_settlement(sender, group):
    return {
  "type": "bubble",
  "size": "mega",
  "header": {
    "type": "box",
    "layout": "vertical",
    "contents": [
      {
        "type": "text",
        "text": "WARIKAN",
        "weight": "bold",
        "color": "#FFFFFF",
        "align": "center",
        "size": "sm"
      }
    ],
    "alignItems": "center",
    "justifyContent": "center"
  },
  "body": {
    "type": "box",
    "layout": "vertical",
    "contents": [
      {
        "type": "box",
        "layout": "horizontal",
        "contents": [
          {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "box",
                "layout": "horizontal",
                "contents": [
                  {
                    "type": "image",
                    "url": sender.picture_url,
                    "aspectMode": "cover"
                  }
                ],
                "width": "50px",
                "height": "50px",
                "borderWidth": "1px",
                "borderColor": "#EEEEEE",
                "cornerRadius": "25px"
              }
            ],
            "width": "90px",
            "alignItems": "center",
            "justifyContent": "center",
            "margin": "8px"
          },
          {
            "type": "text",
            "text": "%sさんが\n決済を開始しました" % sender.name,
            "wrap": True,
            "gravity": "center",
            "size": "sm",
            "weight": "bold",
            "color": "#444444"
          }
        ]
      },
      {
        "type": "box",
        "layout": "horizontal",
        "contents": [
          {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "text",
                "text": "→",
                "align": "center",
                "color": "#50CED6",
                "gravity": "center",
                "weight": "bold",
                "size": "18px"
              }
            ],
            "width": "26px",
            "height": "26px",
            "borderWidth": "2px",
            "cornerRadius": "18px",
            "borderColor": "#50CED6",
            "margin": "15px"
          },
          {
            "type": "text",
            "text": "決済を確認して承認を行なってください",
            "size": "xxs",
            "weight": "bold",
            "gravity": "center",
            "margin": "12px"
          }
        ],
        "margin": "20px"
      },
      {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "separator",
                "margin": "20px"
              },
              {
                "type": "box",
                "layout": "vertical",
                "margin": "lg",
                "spacing": "sm",
                "contents": [
                  {
                    "type": "box",
                    "layout": "baseline",
                    "spacing": "sm",
                    "contents": [
                      {
                        "type": "text",
                        "text": "グループ",
                        "color": "#aaaaaa",
                        "size": "xxs",
                        "flex": 1
                      },
                      {
                        "type": "text",
                        "text": group.name,
                        "wrap": True,
                        "color": "#444444",
                        "size": "sm",
                        "flex": 3,
                        "weight": "bold"
                      }
                    ]
                  },
                  {
                    "type": "box",
                    "layout": "baseline",
                    "spacing": "sm",
                    "contents": [
                      {
                        "type": "text",
                        "text": "説明",
                        "color": "#aaaaaa",
                        "size": "xxs",
                        "flex": 1
                      },
                      {
                        "type": "text",
                        "text": group.description or " ",
                        "wrap": True,
                        "color": "#666666",
                        "size": "sm",
                        "flex": 3
                      }
                    ],
                    "margin": "10px"
                  }
                ]
              },
              {
                "type": "separator",
                "margin": "20px"
              }
            ],
            "paddingStart": "15px",
            "paddingEnd": "15px"
      }
    ]
  },
  "footer": {
    "type": "box",
    "layout": "horizontal",
    "spacing": "sm",
    "contents": [
      {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "button",
            "action": {
              "type": "uri",
              "label": "決済内容を確認",
              "uri": "%s/approve_group?group_id=%s" % (settings.liff_base_url, group.id)
            },
            "color": "#FFFFFF"
          }
        ],
        "margin": "sm",
        "backgroundColor": "#50CED6",
        "cornerRadius": "25px",
        "width": "200px",
        "height": "50px"
      }
    ],
    "flex": 0,
    "justifyContent": "center",
    "height": "80px"
  },
  "styles": {
    "header": {
      "backgroundColor": "#50CED6"
    }
  }
}


def return_flex_message_settlement_all_approved(group):
    return {
  "type": "bubble",
  "size": "mega",
  "header": {
    "type": "box",
    "layout": "vertical",
    "contents": [
      {
        "type": "text",
        "text": "WARIKAN",
        "weight": "bold",
        "color": "#FFFFFF",
        "align": "center",
        "size": "sm"
      }
    ],
    "alignItems": "center",
    "justifyContent": "center"
  },
  "body": {
    "type": "box",
    "layout": "vertical",
    "contents": [
      {
        "type": "box",
        "layout": "horizontal",
        "contents": [
          {
            "type": "text",
            "text": "以下の内容で\n決済が最終承認されました",
            "wrap": True,
            "gravity": "center",
            "size": "sm",
            "weight": "bold",
            "color": "#444444",
            "align": "center"
          }
        ]
      },
      {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "separator",
                "margin": "20px"
              },
              {
                "type": "box",
                "layout": "vertical",
                "margin": "lg",
                "spacing": "sm",
                "contents": [
                  {
                    "type": "box",
                    "layout": "baseline",
                    "spacing": "sm",
                    "contents": [
                      {
                        "type": "text",
                        "text": "グループ",
                        "color": "#aaaaaa",
                        "size": "xxs",
                        "flex": 1
                      },
                      {
                        "type": "text",
                        "text": group.name,
                        "wrap": True,
                        "color": "#444444",
                        "size": "sm",
                        "flex": 3,
                        "weight": "bold"
                      }
                    ]
                  },
                  {
                    "type": "box",
                    "layout": "baseline",
                    "spacing": "sm",
                    "contents": [
                      {
                        "type": "text",
                        "text": "説明",
                        "color": "#aaaaaa",
                        "size": "xxs",
                        "flex": 1
                      },
                      {
                        "type": "text",
                        "text": group.description or " ",
                        "wrap": True,
                        "color": "#666666",
                        "size": "sm",
                        "flex": 3
                      }
                    ],
                    "margin": "10px"
                  }
                ]
              },
              {
                "type": "separator",
                "margin": "20px"
              }
            ],
            "paddingStart": "15px",
            "paddingEnd": "15px"
      }
    ]
  },
  "footer": {
    "type": "box",
    "layout": "horizontal",
    "spacing": "sm",
    "contents": [
      {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "button",
            "action": {
              "type": "uri",
              "label": "決済内容を確認",
              "uri": "%s/settle_group?group_id=%s" % (settings.liff_base_url, group.id)
            },
            "color": "#FFFFFF"
          }
        ],
        "margin": "sm",
        "backgroundColor": "#50CED6",
        "cornerRadius": "25px",
        "width": "200px",
        "height": "50px"
      }
    ],
    "flex": 0,
    "justifyContent": "center",
    "height": "80px"
  },
  "styles": {
    "header": {
      "backgroundColor": "#50CED6"
    }
  }
}


def return_flex_message_settlement_stop(sender, group):
    return {
  "type": "bubble",
  "size": "mega",
  "header": {
    "type": "box",
    "layout": "vertical",
    "contents": [
      {
        "type": "text",
        "text": "WARIKAN",
        "weight": "bold",
        "color": "#FFFFFF",
        "align": "center",
        "size": "sm"
      }
    ],
    "alignItems": "center",
    "justifyContent": "center"
  },
  "body": {
    "type": "box",
    "layout": "vertical",
    "contents": [
      {
        "type": "box",
        "layout": "horizontal",
        "contents": [
          {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "box",
                "layout": "horizontal",
                "contents": [
                  {
                    "type": "image",
                    "url": sender.picture_url,
                    "aspectMode": "cover"
                  }
                ],
                "width": "50px",
                "height": "50px",
                "borderWidth": "1px",
                "borderColor": "#EEEEEE",
                "cornerRadius": "25px"
              }
            ],
            "width": "90px",
            "alignItems": "center",
            "justifyContent": "center",
            "margin": "8px"
          },
          {
            "type": "text",
            "wrap": True,
            "gravity": "center",
            "size": "sm",
            "weight": "bold",
            "color": "#444444",
            "contents": [
              {
                "type": "span",
                "text": "%sさんが\n" % sender.name
              },
              {
                "type": "span",
                "text": "決済を"
              },
              {
                "type": "span",
                "text": "停止",
                "color": "#EF7272"
              },
              {
                "type": "span",
                "text": "しました"
              }
            ]
          }
        ]
      },
      {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "separator",
                "margin": "20px"
              },
              {
                "type": "box",
                "layout": "vertical",
                "margin": "lg",
                "spacing": "sm",
                "contents": [
                  {
                    "type": "box",
                    "layout": "baseline",
                    "spacing": "sm",
                    "contents": [
                      {
                        "type": "text",
                        "text": "グループ",
                        "color": "#aaaaaa",
                        "size": "xxs",
                        "flex": 1
                      },
                      {
                        "type": "text",
                        "text": group.name,
                        "wrap": True,
                        "color": "#444444",
                        "size": "sm",
                        "flex": 3,
                        "weight": "bold"
                      }
                    ]
                  },
                  {
                    "type": "box",
                    "layout": "baseline",
                    "spacing": "sm",
                    "contents": [
                      {
                        "type": "text",
                        "text": "説明",
                        "color": "#aaaaaa",
                        "size": "xxs",
                        "flex": 1
                      },
                      {
                        "type": "text",
                        "text": group.description or " ",
                        "wrap": True,
                        "color": "#666666",
                        "size": "sm",
                        "flex": 3
                      }
                    ],
                    "margin": "10px"
                  }
                ]
              },
              {
                "type": "separator",
                "margin": "20px"
              }
            ],
            "paddingStart": "15px",
            "paddingEnd": "15px"
      }
    ]
  },
  "footer": {
    "type": "box",
    "layout": "horizontal",
    "spacing": "sm",
    "contents": [
      {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "button",
            "action": {
              "type": "uri",
              "label": "グループを確認",
              "uri": "%s/settle_group?group_id=%s" % (settings.liff_base_url, group.id)
            },
            "color": "#FFFFFF"
          }
        ],
        "margin": "sm",
        "backgroundColor": "#50CED6",
        "cornerRadius": "25px",
        "width": "200px",
        "height": "50px"
      }
    ],
    "flex": 0,
    "justifyContent": "center",
    "height": "80px"
  },
  "styles": {
    "header": {
      "backgroundColor": "#50CED6"
    }
  }
}