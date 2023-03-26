import './InputLabel.css';

function InputLabel(props) {
  let tag;
  if (props.type === "optional"){
    tag = (<div className="label-tag optional"> 
            任意
            </div>)
  }else if(props.type === "required"){
    tag = (<div className="label-tag required"> 
            必須
            </div>)
  }
  return (
    <div className="input-label">
      <div className="input-label-text">{props.text}</div>
      {tag}
    </div>
  )
}

export default InputLabel
