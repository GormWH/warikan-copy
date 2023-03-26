import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'
import Title from './component/Title'
import Subtitle from './component/Subtitle';
import Button from './component/Button'
import Spinner from './component/Spinner';
import InputLabel from './component/InputLabel'
import PaymentList from './component/PaymentList';
import TicketBox from './component/TicketBox';
import TicketAccordion from './component/TicketAccordion';

import * as warikanAPI from './service/warikanAPI';
import * as dummy from './service/dummy'
import * as storage from './service/storage';

import './SettleGroup.css';

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


function SettleGroup() {

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
          setNameValue(groups[0]["name"]);
          setDescriptionValue(groups[0]["description"]);
        }else{
          let group = groups.find(e => e["group_id"] === query.get("group_id"))
          setGroup(group);
          setGroupId(groupId);
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
      <Title text='グループ決済' />
      <div className='content-wrapper'>
        <div className='form-wrapper' ref={groupRef}>
          <InputLabel text='決済するグループ'/>
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
          <InputLabel text='チケット一覧'/>
          <TicketAccordion tickets={tickets}/>
        </div>
        <div className='form-wrapper'>
          <InputLabel text='決済情報'/>
          <PaymentList payment={payment}/>
        </div>
      </div>
      {group["all_approved"] === false ? <div className='button-wrapper'><Button text='決済開始' onClick={createPayment} /></div> : null}
    </main>
    );
  } else if (pageIndex === 1) {
    return <CompletePayment groupId={groupId} name={nameValue} description={descriptionValue} payment={payment}/>;
  }
}

export default SettleGroup;