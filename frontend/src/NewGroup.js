import React, { useState, useEffect } from 'react';
import liff from '@line/liff'; 
import Title from './component/Title';
import Subtitle from './component/Subtitle';
import InputLabel from './component/InputLabel';
import Button from './component/Button';
import Spinner from './component/Spinner';
import TicketBox from './component/TicketBox';
import * as warikanAPI from './service/warikanAPI';
import './NewGroup.css';

import { red } from '@mui/material/colors';
import { ThemeProvider, createTheme } from '@mui/material/styles';




const nameRef = React.createRef();

function CompleteGroup(props) {

  useEffect(() => {
    const postGroup = async () => {
      try {
        let ret = await warikanAPI.postGroup(props.name, props.description);
        setGroupId(ret.data.group_id);
        setIsLoading(false);
      }catch{
        setIsError(true);
      }
    }
    postGroup();
    
  }, [])

  const [groupId, setGroupId] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);


  function shareTargetPicker() {
    liff.getProfile().then(profile => {
      const name = profile.displayName
      const pictureUrl = profile.pictureUrl
      const url = `${process.env.REACT_APP_LIFF_URL}/join_group?group_id=${groupId}`
      liff.shareTargetPicker(
        [
          {
            "type": "flex",
            "altText": "グループ招待",
            "contents": {
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
                                "url": pictureUrl,
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
                        "text": name + " さんから\n" + "グループへの招待",
                        "wrap": true,
                        "gravity": "center",
                        "size": "sm",
                        "weight": "bold",
                        "color": "#444444"
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
                                "text": props.name,
                                "wrap": true,
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
                                "text": props.description === '' ? ' ' : props.description,
                                "wrap": true,
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
                "layout": "vertical",
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
                          "uri": url,
                          "label": "参加"
                        },
                        "color": "#FFFFFF",
                        "height": "sm"
                      }
                    ],
                    "backgroundColor": "#50CED6",
                    "height": "50px",
                    "width": "140px",
                    "justifyContent": "center",
                    "cornerRadius": "25px",
                    "alignItems": "center"
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
                  "separator": false
                }
              }
            }
          },
        ],
        {
          isMultiple: true,
        }
      )
      .then(function (res) {
        if (res) {
          alert("グループ招待状を送信しました");
        }
      }).catch(function (error) {
        alert("グループ招待状の送信に失敗しました");
        console.log(error);
      })

    })
    .catch((err) => {
      console.log('error', err);
    });
  }

  if (isLoading){
    return <Spinner/>;
  }

  if (isError){
    return (<div>送信に失敗しました</div>);
  }

  return (
  <main>
    <Title text="グループ作成"/>
    <div className="subtitle-wrapper-check">
      <Subtitle text="新しいグループが作成されました" type="check"/>
    </div>
    <div className="content-wrapper">
      <TicketBox name={props.name} description={props.description}/>
      <div className="newgroup-subtitle-wrapper-arrow">
        <Subtitle text="お金をやり取りするユーザにシェア" type="arrow"/>
      </div>
    </div>
    <div className="newgroup-button-wrapper"><Button text="シェア" onClick={shareTargetPicker}/></div>
  </main>
  );
}



function NewGroup() {

  const [pageIndex, setPageIndex] = useState(0);
  const [nameValue, setNameValue] = useState("");
  const [descriptionValue, setDescriptionValue] = useState("");
  const [validationMessages, setValidationMessages] = useState([]);

  function handleNameBlur(e) {
    if (e.target.value === "") {
      setValidationMessages({"name":"グループ名を入力してください"});
    } else {
      setValidationMessages({});
    }
  }

  function changeName(e) {
    setNameValue(e.target.value);
  }

  function changeDescription(e) {
    setDescriptionValue(e.target.value);
  }


  async function createGroup() {
    if (!nameValue) {
      setValidationMessages({"name":"グループ名を入力してください"});
      nameRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
      return;
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    setPageIndex(1);
  };

  if (pageIndex === 0) {
    let nameValidationMessage;
    if (validationMessages["name"]) {
      nameValidationMessage = (<div className="validation-message">{validationMessages['name']}</div>);
    }
    const theme = createTheme({
      palette: {
        primary: {
          main: red[500],
        },
      },
    });

    return (
      <ThemeProvider theme={theme}>
      <main>
        <Title text="グループ作成"/>
        <div className="content-wrapper">
          <div className="page-description">お金のやり取りが行われる一連のイベントグループです。<br/> グループ名を入力してグループを作成してください。</div>
          <div className="form-wrapper" ref={nameRef}>
            <InputLabel type="required" text="グループ名"/>
            {nameValidationMessage}
            <input className="normal-input" type="text" value={nameValue} onChange={changeName} onBlur={handleNameBlur}/>
          </div>
          <div className="form-wrapper">
            <InputLabel type="optional" text="説明"/>
            <textarea className="normal-textarea" value={descriptionValue} onChange={changeDescription}/>
          </div>
        </div>
        <div className="button-wrapper"><Button text="作成" onClick={createGroup}/></div>
      </main>
      </ThemeProvider>
    );
  } else if (pageIndex === 1) {
    return <CompleteGroup name={nameValue} description={descriptionValue}/>;
  }
}

export default NewGroup