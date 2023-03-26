import './PaymentList.css';
import { FaArrowDown } from "react-icons/fa"
import * as storage from '../service/storage';

function PaymentList(props) {
  
  if (props.payment.length === 0){
    return (<ul>
      <li className="payment-wrapper" key="empty_payment">
      <div className="payment-list-empty-wrapper"> 決済は不要です </div>
    </li>
    </ul>)
  }
  let items = [];
  let userId = storage.userId;
  props.payment.forEach( e => {
    items.push(
      <li className="payment-wrapper" key={e.debtor.name + e.lender.name}>
      <div className={"payment-list-user-wrapper" + (e.debtor.user_id === userId ? " payment-list-own-wrapper" : " payment-list-others-wrapper")}>
        <img className="payment-list-image"　src={e.debtor.picture_url} alt="" height="35px" width="35px" border="0"/>
        <div className={e.debtor.user_id === userId ? "payment-list-own-name" : "payment-list-others-name"}> {e.debtor.name} さん</div>
      </div>
      <div className="payment-list-amount-wrapper">
        <div className='payment-list-arrow'>
        <FaArrowDown color="#444444" size="24px"/>
        </div>
        <div className="payment-list-amount">
          {e.amount} <span className="payment-list-unit">円</span>
        </div>
      </div>
      <div className={"payment-list-user-wrapper" + (e.lender.user_id === userId  ? " payment-list-own-wrapper" : " payment-list-others-wrapper")}>
      <img className="payment-list-image"　src={e.lender.picture_url} alt="" height="35px" width="35px" border="0"/>
        <div className={e.lender.user_id === userId  ? "payment-list-own-name" : "payment-list-others-name"}> {e.lender.name} さん</div>
      </div>
    </li>
      );
  });
  return (<ul>{ items }</ul>);
}

export default PaymentList
