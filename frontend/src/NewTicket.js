import React, { useState, useEffect } from 'react';
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
import './NewTicket.css';
import { FaCamera } from "react-icons/fa"
import { Audio }  from 'react-loader-spinner';


function CompleteTicket(props){

  useEffect(() => {
    const postTicket = async () => {
      try {
        await warikanAPI.postTicket(props.groupId, props.name, props.description, props.lenders, props.debtors, props.payment);
        setIsLoading(false);
      }catch{
        setIsError(true);
      }
    }
    postTicket();
    
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
    <Title text="チケット作成"/>
    <div className="subtitle-wrapper-check"> <Subtitle text="新しいチケットが作成されました" type="check"/> </div>
    <div className="content-wrapper">
      <TicketBox groupName={props.groupName} name={props.name} description={props.description}/>
      <div className="form-wrapper">
        <InputLabel text="支払い者"/>
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




function NewTicket(){

  const {data:groups, isLoading, isError} = warikanAPI.usePostGroupsFindByUserId(storage.userId);
  // const groups = warikanAPI.dummyGroups;
  // const isLoading = false
  // const isError = false

  const [pageIndex, setPageIndex] = useState(0);
  const [groupId, setGroupId] = useState("");
  const [group, setGroup] = useState({"users" : []});
  const [lenders, setLenders] = useState([]);
  const [debtors, setDebtors] = useState([]);
  const [payment, setPayment] = useState("equal");
  const [nameValue, setNameValue] = useState("");
  const [descriptionValue, setDescriptionValue] = useState("");
  const [validationMessages, setValidationMessages] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const nameRef = React.createRef();
  const lendersRef = React.createRef();
  const debtorsRef = React.createRef();

  const [selectedFile, setSelectedFile] = useState();

  var totalLendersAmount = 0;

  const changeHandler = async (event) => {
		// setSelectedFile(event.target.files[0]);
    setIsAnalyzing(true);
    const res = await warikanAPI.getTotalAmount(event.target.files[0]);
    setIsAnalyzing(false);
    if (res.error){
      alert("解析失敗！ 再度お試しください");
    }else{
      alert("解析完了！ 総計" + res.total + "円です");
    }
    
    totalLendersAmount = res.total;
	};

  lenders.forEach(e => {
    totalLendersAmount += e.amount;
  });

  var totalDebtorsAmount = 0;
  debtors.forEach(e => {
    totalDebtorsAmount += e.amount;
  });

  useEffect(() => {
    if (!isLoading){
      if (groups.length > 0){
        setGroupId(groups[0]['group_id']);
        setGroup(groups[0]);
        setLenders([]);
        setDebtors([]);
      }   
    }
  }, [groups])


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
      setValidationMessages({"name": 'チケット名を入力してください'});
    }else{
      setValidationMessages({});
    }
  }

  function changePayment(e){
    if (e.target.value === "equal" && debtors.length > 0){
      var newDebtors = [...debtors];
      newDebtors.forEach((element, index) => {
        newDebtors[index]['amount'] = (totalLendersAmount / debtors.length | 0) + (index < (totalLendersAmount % debtors.length) ? 1 : 0)
      })
      setDebtors(newDebtors);
    }
    setPayment(e.target.value);
  }

  function changeGroup(e){
    let group = groups.find(element => element["group_id"] === e.target.value);

    setGroupId(e.target.value);
    setGroup(group);
    setLenders([]);
    setDebtors([]);
  }

  function changeName(e){
    setNameValue(e.target.value);
  }

  function changeDescription(e){
    setDescriptionValue(e.target.value);
  }

  const changeLenders = (checked) => {
    let newLenders = []
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
      setValidationMessages({'name': 'チケット名を入力してください'});
      nameRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
      return;
    }

    if (lenders === undefined || lenders.length === 0) {
      setValidationMessages({'lenders': '支払いを行った人を追加してください'});
      lendersRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
      return;
    }

    if (debtors === undefined || debtors.length === 0) {
      setValidationMessages({'debtors': '支払いに関与した人を追加して下さい'});
      debtorsRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
      return;
    }

    if(totalDebtorsAmount !== totalLendersAmount){
      setValidationMessages({'debtors': '支払い金額と精算金額が一致してないです'});
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

 
  if (isLoading){
    return <Spinner/>;
  }

  if (isError){
    // return (<div>送信に失敗しました</div>);
  }

  if (pageIndex === 0){
    let cashNotice;
    if (totalLendersAmount - totalDebtorsAmount > 0){
      cashNotice = (<div className="cash-notice"> 割り当てられていない金額 {totalLendersAmount - totalDebtorsAmount} <span className="unit">円</span></div>)
    }else if (totalLendersAmount - totalDebtorsAmount < 0){
      cashNotice = (<div className="cash-notice"> 余分に割り当てられている金額 { totalDebtorsAmount - totalLendersAmount} <span className="unit">円</span>　 </div>)
    }

    let mainSelect;
    var options = [];
    if (groups){
      groups.forEach( e => {
        options.push(
          <option value={e.group_id} key={e.group_id}>{e.name}</option>
        );
      });
    }
    mainSelect =  (<select className="main-select" onChange={changeGroup}>
                    {options}
                  </select>);

    let nameValidationMessage;
    if (validationMessages['name']){
      nameValidationMessage = (<div className="validation-message"> {validationMessages['name']} </div>)
    }
    let lendersValidationMessage;
    if (validationMessages['lenders']){
      lendersValidationMessage = (<div className="validation-message"> {validationMessages['lenders']} </div>)
    }
    let debtorsValidationMessage;
    if (validationMessages['debtors']){
      debtorsValidationMessage = (<div className="validation-message"> {validationMessages['debtors']} </div>)
    }

    return (
        <main>
          <Title text="チケット作成"/>
          <div className="content-wrapper">
            <div className="form-wrapper">
                <InputLabel text="チケットを発行するグループ"/>
                {mainSelect}
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

            <div className="form-upload-wrapper">
              <label for="file-upload" class="custom-file-upload">
              { isAnalyzing ? <Audio
                    height="30"
                    width="30"
                    color='grey'
                    ariaLabel='loading'
                  /> : <FaCamera size={32}/> }
                <br/>
                {isAnalyzing ? "解析中" : "レシートをアップロードして解析"}
              </label>
              <input id="file-upload" type="file" accept="image/*" onChange={changeHandler} disabled={isAnalyzing}/>
            </div>
    
            <div className="form-wrapper" ref={lendersRef}>
              <InputLabel text="支払いをしたメンバー"/>
              {lendersValidationMessage}
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
              {debtorsValidationMessage}
              { cashNotice }
              <UserTable users={debtors} useCash={true} cashEditable={payment === "equal" ? false : true} onBlur={handleDebtorsBlur}/>
              <div className="picker-wrapper"><UserPicker users={group.users} onSelect={changeDebtors} checkedUsers={debtors}/></div>
            </div>
          </div>
          <div className="button-wrapper"><Button text="作成" onClick={createTicket}/></div>
        </main>
    );

  }else if (pageIndex === 1){
    return <CompleteTicket groupId={groupId} groupName={group.name} name={nameValue} description={descriptionValue} lenders={lenders} debtors={debtors} payment={payment}/>;
  }

}

export default NewTicket
