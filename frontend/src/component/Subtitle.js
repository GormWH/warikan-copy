import './Subtitle.css';
import { FaCheck, FaArrowRight, FaExclamationTriangle, FaCheckCircle } from "react-icons/fa"

function Subtitle(props) {
  let icon;
  if (props.type === "check"){
    icon = (<div className="icon-wrapper-fill"> 
            <FaCheckCircle color="#50CED6" backgroundColor="white" size="20px"/>
            </div>)
  }else if(props.type === "arrow"){
    icon = (<div className="icon-wrapper-hollow"> 
            <FaArrowRight color="#50CED6" size="14px"/>
            </div>)
  }else if (props.type === "warning"){
    icon = (<div className="icon-wrapper-warning"> 
            <FaExclamationTriangle color="#e4bb34" size="18px"/>
            </div>)
  }
  return (
    <div className="subtitle"> 
      { icon }
      {props.text}
    </div>
  )
}

export default Subtitle
