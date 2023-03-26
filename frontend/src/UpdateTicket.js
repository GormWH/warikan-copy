import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'
import Title from './component/Title'
import Subtitle from './component/Subtitle';
import Button from './component/Button'
import Spinner from './component/Spinner';
import InputLabel from './component/InputLabel'
import LendersList from './component/LendersList';
import UserTable from './component/UserTable';
import UserPicker from './component/UserPicker';
import TicketBox from './component/TicketBox';
import * as warikanAPI from './service/warikanAPI';
import * as storage from './service/storage';
import './UpdateTicket.css';

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}


function CompleteTicket(props){

  useEffect(() => {
    const putTicket = async () => {
      try {
        await warikanAPI.putTicket(props.ticketId, props.name, props.description, props.lenders, props.debtors, props.payment);
        setIsLoading(false);
      }catch{
        setIsError(true);
      }
    }
    putTicket();
    
  }, [])


  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  if (isLoading){
    return <Spinner/>;
  }

  if (isError){
    return (<div>送信に失敗しました</div>);
  }

  return (
  <main>
    <Title text="チケット修正"/>
    <div className="subtitle-wrapper-check"> <Subtitle text="チケットを修正しました" type="check"/> </div>
    <div className="content-wrapper">
      <TicketBox groupName={props.groupName} name={props.name} description={props.description}/>
      <div className="form-wrapper">
        <InputLabel text=" 支払い者"/>
        <LendersList lenders={props.lenders}/>
      </div>

      <div className="form-wrapper">
        <InputLabel text="各自の金額分"/>
        <UserTable users={props.debtors} useCash={true} cashEditable={false} />
      </div>
    </div>
    <div className="subtitle-wrapper-arrow"> <Subtitle text="チケット承認までお待ちください" type="arrow"/> </div>  
  </main>
  );
}



function UpdateTicket(){

  let query = useQuery();
  let ticketId = query.get("ticket_id");

  const {data:ticket, isLoading, isError} = warikanAPI.useGetTicket(ticketId);
  
  // let group = warikanAPI.dummyGroups[0];
  //console.log(ticket);
  // let ticket = warikanAPI.dummyTicket
  // let isLoading = false
  // let isError = false
  const [group, setGroup] = useState();
  const [pageIndex, setPageIndex] = useState(0);
  const [lenders, setLenders] = useState([]);
  const [debtors, setDebtors] = useState([]);
  const [payment, setPayment] = useState("equal");
  const [nameValue, setNameValue] = useState("");
  const [descriptionValue, setDescriptionValue] = useState("");
  const [validationMessages, setValidaionMessages] = useState([]);

  const nameRef = React.createRef();
  const debtorsRef = React.createRef();

  var totalLendersAmount = 0;
  lenders.forEach(e => {
    totalLendersAmount += e.amount;
  });

  var totalDebtorsAmount = 0;
  debtors.forEach(e => {
    totalDebtorsAmount += e.amount;
  });


  useEffect(() => {
    let getGroupData = async () => {
      console.log("あえdかジェdジャケjf");
      let res = await warikanAPI.getGroup(ticket.group_id);
      console.log(res);
      setGroup(res);
    }
    if (!isLoading){
      setPayment(ticket.payment);
      setNameValue(ticket.name);
      setDescriptionValue(ticket.description);
      setLenders(ticket.lenders);
      setDebtors(ticket.debtors);
      getGroupData();
    }
  }, [ticket])


  function handleLendersBlur(e, user_id){
    const ind = lenders.findIndex(element => element['user_id'] === user_id);
    var newLenders = [...lenders]
    if (e.target.value === "" || isNaN(parseInt(e.target.value))){
      newLenders[ind]['amount'] = 0;
    }else{
      newLenders[ind]['amount'] = parseInt(e.target.value);
    }
    setLenders(newLenders);

    if (payment === "equal" && debtors.length > 0){
      var newDebtors = [...debtors];
      var totalLendersAmount = 0;
      newLenders.forEach(e => {
        totalLendersAmount += parseInt(e.amount);
      });
      newDebtors.forEach((element, index) => {
        newDebtors[index]['amount'] = (totalLendersAmount / debtors.length | 0) + (index < (totalLendersAmount % debtors.length) ? 1 : 0)
      })
      setDebtors(newDebtors);
    }
  }

  function handleDebtorsBlur(e, user_id){
    const ind = debtors.findIndex(element => element['user_id'] === user_id);
    var newDebtors = [...debtors]
    if (e.target.value === "" || isNaN(parseInt(e.target.value))){
      newDebtors[ind]['amount'] = 0;
    }else{
      newDebtors[ind]['amount'] = parseInt(e.target.value);
    }
    setDebtors(newDebtors);
  }

  function handleNameBlur(e){
    if (e.target.value === ""){
      setValidaionMessages({"name": 'チケット名を入力してください'});
    }else{
      setValidaionMessages({});
    }
  }

  function changePayment(e){
    if (e.target.value === "equal" && debtors.length > 0){
      var newDebtors = [...debtors];
      newDebtors.forEach((element, index) => {
        newDebtors[index]['amount'] = (totalLendersAmount / debtors.length | 0) + (index < (totalLendersAmount % debtors.length) ? 1 : 0);
      })
      setDebtors(newDebtors);
    }
    setPayment(e.target.value);
  }

  function changeName(e){
    setNameValue(e.target.value);
  }

  function changeDescription(e){
    setDescriptionValue(e.target.value);
  }

  const changeLenders = (checked) => {
    let newLenders = []
    console.log(checked);
    checked.map((user_id) => {
      let lender = lenders.find(user => user["user_id"] === user_id);
      if (lender === undefined){
        let user = group.users.find(user => user["user_id"] === user_id)
        newLenders.push({"user_id": user_id, "name": user.name, "picture_url": user.picture_url, "amount": 0})
      }else{
        newLenders.push(Object.assign({}, lender));
      }
    })
    
    totalLendersAmount = 0;
    newLenders.forEach(e => {
      totalLendersAmount += parseInt(e.amount);
    });
    if (payment === "equal") {
      let newDebtors = [...debtors];
      debtors.forEach((element, index) => {
        newDebtors[index]['amount'] = (totalLendersAmount / debtors.length | 0) + (index < (totalLendersAmount % debtors.length) ? 1 : 0)
      })
      setDebtors(newDebtors);
    }
    setLenders(newLenders);
  }

  const changeDebtors = (checked) => {
    let newDebtors = []
    checked.forEach((user_id, index) => {
      let user = group.users.find(user => user["user_id"] === user_id)
      let amount = payment === "equal" ? (totalLendersAmount / checked.length | 0) + (index < (totalLendersAmount % checked.length) ? 1 : 0) : 0;
      newDebtors.push({"user_id": user_id, "name": user.name, "picture_url": user.picture_url, "amount": amount})
    })

    setDebtors(newDebtors);
  }

  async function createTicket(){

    if (!nameValue){
      setValidaionMessages({'name': 'チケット名を入力してください'});
      nameRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
      return;
    }

    if(totalDebtorsAmount !== totalLendersAmount){
      debtorsRef.current.scrollIntoView({
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

 
  if (isLoading || group === undefined){
    return <Spinner/>;
  }

  if (isError){
    return (<div>送信に失敗しました</div>);
  }

  if (pageIndex === 0){
    let cashNotice;
    if (totalLendersAmount - totalDebtorsAmount > 0){
      cashNotice = (<div className="cash-notice"> 割り当てられていない金額 {totalLendersAmount - totalDebtorsAmount} <span className="unit">円</span></div>)
    }else if (totalLendersAmount - totalDebtorsAmount < 0){
      cashNotice = (<div className="cash-notice"> 余分に割り当てられている金額 { totalDebtorsAmount - totalLendersAmount} <span className="unit">円</span>　 </div>)
    }

    let nameValidationMessage;
    if (validationMessages['name']){
      nameValidationMessage = (<div className="validation-message"> {validationMessages['name']} </div>)
    }

    return (
        <main>
          <meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0"/>
          <Title text="チケット修正"/>
          <div className="content-wrapper">
            <div className="form-wrapper">
                <InputLabel text="チケットを発行するグループ"/>
                <div className='ticket-update-group-name'> {group.name} </div>
            </div>
    
            <div className="form-wrapper" ref={nameRef}>
                <InputLabel type="required" text="チケット名"/>
                {nameValidationMessage}
                <input className="normal-input" type="text" value={nameValue} onChange={changeName} onBlur={handleNameBlur}/>
            </div>
    
            <div className="form-wrapper">
                <InputLabel type="optional" text="説明"/>
                <textarea className="normal-textarea" value={descriptionValue} onChange={changeDescription}/>
            </div>
    
            <div className="form-wrapper">
              <InputLabel text="支払いをしたメンバー"/>
              <UserTable users={lenders} useCash={true} cashEditable={true} onBlur={handleLendersBlur}/>
              <div className="picker-wrapper"><UserPicker users={group.users} onSelect={changeLenders} checkedUsers={lenders}/></div>
            </div>
    
            <div className="form-wrapper" ref={debtorsRef}>
              <div className="label-with-select"> 
                <div className="label-text">各自の金額分</div>
                <select className="sub-select" onChange={changePayment}>
                  <option value="equal">均等に割り勘</option>
                  <option value="individual">個別金額</option>
                </select>
              </div>
              { cashNotice }
              <UserTable users={debtors} useCash={true} cashEditable={payment === "equal" ? false : true} onBlur={handleDebtorsBlur}/>
              <div className="picker-wrapper"><UserPicker users={group.users} onSelect={changeDebtors} checkedUsers={debtors}/></div>
            </div>
          </div>
          <div className="button-wrapper"><Button text="修正" onClick={createTicket}/></div>
        </main>
    );

  }else if (pageIndex === 1){
    return <CompleteTicket groupName={group.name} ticketId={ticketId} userId={storage.userId} name={nameValue} description={descriptionValue} lenders={lenders} debtors={debtors} payment={payment}/>;
  }

}

export default UpdateTicket
