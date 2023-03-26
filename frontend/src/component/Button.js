import './Button.css';

function Button(props) {
  let className = "button";
  if (props.gray){
    className += " button-gray"
  }
  if (props.short){
    className += " button-short"
  }
  return(
    <button className={className} onClick={props.onClick}>
      {props.text}
    </button>)
}

export default Button
