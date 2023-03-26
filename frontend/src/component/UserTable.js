import './UserTable.css';
import React, {useEffect, useState} from 'react';
import { FaPencilAlt } from "react-icons/fa"

function UserTable(props){

  let [amounts, setAmounts] = useState([]);

  useEffect(
    () => {
      var newAmounts = [];
      props.users.forEach(e => {
        newAmounts.push(e["amount"]);
      })
      setAmounts(newAmounts);
    },
    [props.users],
  );

  function handleChange(e, index) {
    let newAmounts = [...amounts];
    newAmounts[index] = e.target.value;
    setAmounts(newAmounts);
  };

  function handleClick(index){
    refs[index].current.focus();
    let length = refs[index].current.value.length;
    refs[index].current.setSelectionRange(length, length);
    if (refs[index].current.value === "0"){
      refs[index].current.value = "";
    }
  }
  
  let items = [];
  let refs = [];

  props.users.forEach( (e, index) => {
    let ref = React.createRef();
    refs.push(ref);

    let amount;
    if(props.useCash && props.cashEditable){

      amount = (<button className="invisible-form-wrapper" onClick={() => handleClick(index)}> <input key={e.user_id} type="text" inputMode="numeric" pattern="\d*" value={amounts[index]} user_id={e.user_id} onChange={(e) => handleChange(e, index)} onBlur={ (event) => props.onBlur(event, e.user_id)} className="invisible-form" ref={ref}/> <span className="unit unit-editable">円</span> <FaPencilAlt color="#666666" size="14px"/> </button>)

    }else if (props.useCash && !props.cashEditable){
  
      amount = (<div className="user-amount user-amount-non-editable"> <span className="amount">{e.amount}</span><span className="unit">円</span> </div>)
 
    }

    items.push(
    <li className="user-entry" key={e.user_id}>
      <img className="user-image"　src={e.picture_url} alt="" height="48px" width="48px" border="0"/>
      <div className="user-name"> {e.name} </div>
      {amount}
    </li>
      );
  });
  items.push(<li key="end-of-list" className="user-entry"> </li>)
  return (<ul　className="users-table">{ items }</ul>);
}

export default UserTable