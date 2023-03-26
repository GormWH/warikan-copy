import React from 'react'
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import TicketBox from './TicketBox';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { FaCheckCircle,FaCheck, FaExclamationTriangle } from "react-icons/fa"

import InputLabel from './InputLabel';
import UserTable from './UserTable';
import './TicketAccordion.css';
import Button from './Button';
import * as storage from '../service/storage';
import * as dummy from '../service/dummy';

function Payment(props) {
  const ticket = props.ticket;

  const lendInfo = ticket.lenders.find(lender => lender.user_id === storage.userId);
  // const lendInfo = ticket.lenders.find(lender => lender.user_id === dummy.DUMMY_USER_ID);
  const borrowInfo = ticket.debtors.find(debtor => debtor.user_id === storage.userId);
  // const borrowInfo = ticket.debtors.find(debtor => debtor.user_id === dummy.DUMMY_USER_ID);

  const lended = lendInfo !== undefined ? lendInfo.amount : 0;
  const borrowed = borrowInfo !== undefined ? borrowInfo.amount : 0;
  let myPayment = lended - borrowed;
  let paymentText;
  if (myPayment < 0) {
    myPayment = -myPayment;
    paymentText = (<div className="accordion-title-label-amount">
      <span className="pay">{myPayment}</span>
      <span className="pay pr-unit">円</span>
      <span className="pay pr-unit pr-desc">支払う</span>
      </div>);
  } else if (myPayment > 0) {
    paymentText = (<div className="accordion-title-label-amount">
      <span className="recieve">{myPayment}</span>
      <span className="recieve pr-unit">円</span>
      <span className="recieve pr-unit pr-desc">もらう</span>
      </div>);
  }else { // myPayment === 0
    paymentText = (<div className="accordion-title-label-amount">
      </div>);
  }
  return paymentText;
}

function TicketAccordion(props) {

  if (props.tickets.length === 0) {
    return (<div className="ticket-list-wrapper">
      <div className="ticket-list-empty-wrapper"> チケットは発行されていません </div>
      </div>);
  }
  let items = [];

  props.tickets.forEach( e => {
    let approvedLabel;
    let titleLabel;
    let approveButton = (null);
    if (e.all_approved ){
      titleLabel = (<div className="accordion-title-wrapper">
                      <div className="facheckcircle-wrapper">
                      <FaCheckCircle color="#50CED6" backgroundColor="white" size="20px"/> 
                      </div>
                      <div className="accordion-title-label"> <div className="accordion-title-label-title">{e.name}</div> <Payment ticket = {e}/> </div>
                      
                    </div>);
      approvedLabel = (<div className="approved-wrapper">
                <div className="facheckcircle-wrapper"> 
                  <FaCheckCircle color="#50CED6" backgroundColor="white" size="20px"/>
                </div>
                <div className="approved-label"> 承認済み</div>
              </div>);
    } else {  
      titleLabel = (<div className="accordion-title-wrapper">
        <div className="check-hollow"> 
        </div>
        <div className="accordion-title-label"> <div className="accordion-title-label-title">{e.name}</div> <Payment ticket = {e}/> </div>
        
      </div>);
      approvedLabel= (<div className="approved-wrapper">
                <div className="icon-wrapper-warning"> 
                  <FaExclamationTriangle color="#e4bb34" size="18px"/>
                </div>
                <div className="approved-label"> 未承認 </div>
              </div>);
    }
    
    function approveTicket() {

    }
    
    if (!e.all_approved && !e.approved_user_ids.includes("q489j9javij"/* storage.userId */)) {
      approveButton = (<div className='button-wrapper'><Button text='チケット承認' onClick={approveTicket} /></div>);
    }

    items.push(
      <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id={e.ticket_id}
      >
        {titleLabel}
      </AccordionSummary>
      <AccordionDetails>
        <div className='ticket-accordion-content-wrapper'>
          <div className="description">
              { e.description }
          </div>
          {approvedLabel}
          <div className="form-wrapper">
            <InputLabel text="支払いをしたメンバー"/>
            <UserTable users={e.lenders} useCash={true} cashEditable={false}/>
          </div>
          <div className="form-wrapper">
            <InputLabel text="各自の金額分"/>
            <UserTable users={e.debtors} useCash={true} cashEditable={false} />
          </div>
        </div>
        {approveButton}
      </AccordionDetails>
    </Accordion>
    );
  });

  return (
      <React.Fragment>
      { items }
      </React.Fragment>);
}

export default TicketAccordion
