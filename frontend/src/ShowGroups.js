import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'
import liff from '@line/liff'; 
import Title from './component/Title'
import Subtitle from './component/Subtitle';
import Button from './component/Button'
import Spinner from './component/Spinner';
import InputLabel from './component/InputLabel'
import PaymentList from './component/PaymentList';
import TicketBox from './component/TicketBox';
import TicketAccordion from './component/TicketAccordion';
import UserTable from './component/UserTable';
import { FaBars } from "react-icons/fa"
import { BiUserPlus } from 'react-icons/bi'
import { BsCreditCard2Back } from 'react-icons/bs'

import * as warikanAPI from './service/warikanAPI';
import * as dummy from './service/dummy'
import * as storage from './service/storage';

import './ShowGroups.css';

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

function CompletePayment(props) {
  useEffect(() => {
    const postPayment = async () => {
      try {
        // 決済のapi   
        await warikanAPI.postGroupSettlement(props.groupId);
        setIsLoading(false);
      }catch{
        setIsError(true);
      }
    }
    postPayment();
  }, [])

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);


  if (isLoading){
    return (<Spinner/>);
  }

  if (isError){
    return (<div>送信に失敗しました</div>);
  }

  return (
  <main>
    <meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0"/>
    <Title text="グループ決済"/>
    <div className="subtitle-wrapper-check"> <Subtitle text="決済を開始しました" type="check"/> </div>
    <div className="content-wrapper">
      <TicketBox name={props.name} description={props.description}/>
      <div className='form-wrapper'>
          <InputLabel text='決済情報'/>
          <PaymentList payment={props.payment}/>
      </div>
    </div>
    <div className="subtitle-wrapper-arrow"> <Subtitle text="決済が全て承認されるまでお待ちください" type="arrow"/> </div>  
  </main>
  );
}


function ShowGroups() {

  let query = useQuery();

  const {data:groups, isGroupsLoading, isGroupsError} = warikanAPI.usePostGroupsFindByUserId(storage.userId);
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [pageIndex, setPageIndex] = useState(0);
  const [groupId, setGroupId] = useState(query.get("group_id"));
  const [group, setGroup] = useState();
  const [tickets, setTickets] = useState([]);
  // const [lenders, setLenders] = useState();
  // const [debtors, setDebtors] = useState();
  const [payment, setPayment] = useState();
  const [users, setUsers] = useState([]);
  const [nameValue, setNameValue] = useState("");
  const [descriptionValue, setDescriptionValue] = useState("");
  const [validationMessages, setValidationMessages] = useState([]);
  
  const groupRef = React.createRef();
  
  useEffect(() => {
    if (!isGroupsLoading) {
      if (groups.length > 0) {
        if (query.get("group_id") === null){
          setGroup(groups[0]);
          setGroupId(groups[0]["group_id"]);
          setUsers(groups[0]["users"]);
          setNameValue(groups[0]["name"]);
          setDescriptionValue(groups[0]["description"]);
        }else{
          let group = groups.find(e => e["group_id"] === query.get("group_id"))
          setGroup(group);
          setGroupId(groupId);
          setUsers(group["users"]);
          setNameValue(group["name"]);
          setDescriptionValue(group["description"]);
        }    
      }
    }
  }, [groups])

  useEffect(() => {
    let updateTickets = async () => {
      if (!isGroupsLoading){
          let res = await warikanAPI.postTicketFindByGroupId(groupId);
          let payment = await warikanAPI.getGroupPayment(groupId);
          setPayment(payment);
          setTickets(res);
        setIsLoading(false);
        setIsError(false);
      }
    } 
    updateTickets();
  }, [nameValue])


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
                                "text": nameValue,
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
                                "text": descriptionValue === '' ? ' ' : descriptionValue,
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

  function changeGroup(e) {
    let group = groups.find(element => element["group_id"] === e.target.value);
    setGroup(group);
    setGroupId(e.target.value);
    setNameValue(group["name"]);
    setDescriptionValue(group["description"]);
  }

  async function createPayment() {
    if (groups.length <= 0) {
      setValidationMessages({'group': 'グループを選択してください'});
      groupRef.current.scrollIntoView({
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
  }

  if (isLoading) {
    return <Spinner/>
  }
  if (isError) {
    return (<div>送信に失敗しました</div>);
  }

  if (pageIndex === 0) {
    let mainSelect;
    let options = [];
    if (groups) {
      groups.forEach((e,index) => {
        options.push(
          <option value={e.group_id} key={e.group_id}>{e.name}</option>
        )
      });
    }
    mainSelect = (
      <select className='main-select' value={groupId} onChange={changeGroup}>
        {options}
      </select>
    );
    let groupValidationMessage;
    if (validationMessages['group']) {
      groupValidationMessage = (<div className="validation-message"> {validationMessages['group']} </div>);
    }

    if (groups.length === 0) {
      return (
        <main>
          <meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0"/>
          <Title text='グループ決済' />
          <div className='content-wrapper'>
          <div className='form-wrapper center-text'>
          グループが存在しません<br/>まずはグループを作成しましょう！
          </div>
          </div>
        </main>
        );
    }

    return (
    <main>
      <meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0"/>
      <Title text='グループ確認' />
      <div className='content-wrapper'>
        <div className='form-wrapper' ref={groupRef}>
          <InputLabel text='グループ名'/>
          {groupValidationMessage}
          {mainSelect}
        </div>
        <div className='form-wrapper'>
          <InputLabel text='説明'/>
          <div className='description'> 
            {descriptionValue}
          </div>
        </div>
        <div className='form-wrapper'>
          <InputLabel text='グループメンバー'/>
          <UserTable users={users} useCash={false} />
          <button className="plain-button" onClick={shareTargetPicker}>
            <BiUserPlus className='user-icon'/>
            <div className="text">メンバーを新たに招待する</div>
          </button>
        </div>
        <div className='form-wrapper'>
          <InputLabel text='チケット一覧'/>
          <TicketAccordion tickets={tickets}/>
        </div>
        <div className='form-wrapper'>
          <InputLabel text='決済情報'/>
          <PaymentList payment={payment}/>
          {group["all_approved"] === false ? <button className="plain-button last-element" onClick={createPayment}>
            <BsCreditCard2Back className='credit-icon'/>
            <div className="text">決済を行う</div>
          </button> : null}
        </div>
      </div>     
    </main>
    );
  } else if (pageIndex === 1) {
    return <CompletePayment groupId={groupId} name={nameValue} description={descriptionValue} payment={payment}/>;
  }
}

export default ShowGroups;