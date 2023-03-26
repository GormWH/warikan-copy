import Subtitle from './Subtitle';
import './FriendWarning.css';

function FriendWarning(){

  return (
    <main> 
      <div className="subtitle-wrapper-check"> <Subtitle text="Line公式Botに登録されていません" type="warning"/> </div>                      
      <div className="error-message">友達登録またはブロック解除をお願いします</div>
      <div className="friend-button">
        <a href={process.env.REACT_APP_LINE_BOT_URL}>
          <img src="https://scdn.line-apps.com/n/line_add_friends/btn/ja.png" alt="友だち追加" height="36" border="0"/>
        </a>
      </div>
    </main>
  );
}

export default FriendWarning