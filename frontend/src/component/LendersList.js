import './LendersList.css';

function LendersList(props) {
  let items = [];

  props.lenders.forEach( e => {
    items.push(
    <li className="lender-wrapper" key={e.user_id}>
      <div className="lender-profile-wrapper"> 
        <img className="lender-image"　src={e.picture_url} alt="" height="40px" width="40px" border="0"/>
        <div className="lender-name"> {e.name} さんが支払い </div>  
      </div>
      <div className="cash-wrapper"> {e.amount} <span className="lenders-list-unit">円</span> </div>
    </li>
      );
  });
  return (<ul>{ items }</ul>);
}

export default LendersList
