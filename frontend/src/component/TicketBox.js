import './TicketBox.css';

function TicketBox(props) {
  let tag = props.groupName === undefined ? null : (<div className='ticketbox-tag'>{props.groupName}</div>);
  return (
    <div className='ticketbox'>
      {tag}
      <div className="ticketbox-wrapper"> 
        <div className={"ticketbox-title-wrapper"}>
        <div className="ticketbox-title"> {props.name} </div>
        </div>
        <div className="ticketbox-description"> {props.description} </div>
        <div className="ticketbox-date">{new Date().toLocaleString()}</div>
      </div>
    </div>
  )
}

export default TicketBox
