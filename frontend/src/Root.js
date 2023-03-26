import logo from './logo.svg';
import './Root.css';
import liff from '@line/liff'; 
import { Link } from 'react-router-dom'

function Root() {

  /* 追加: メッセージ送信 */
  const sendMessage = () => {
    liff.init({liffId: process.env.REACT_APP_LIFF_ID}) // LIFF IDをセットする
      .then(() => {
        if (!liff.isLoggedIn()) {
          liff.login({}) // ログインしていなければ最初にログインする
        } else if (liff.isInClient()) { // LIFFので動いているのであれば
          liff.sendMessages([{ // メッセージを送信する
            'type': 'text',
            'text': "You've successfully sent a message! Hooray!"
          }]).then(function() {
            window.alert('Message sent');
          }).catch(function(error) {
            window.alert('Error sending message: ' + error);
          });
        }
      })
  }

  /* 追加: UserProfileをAlertで表示 */
  const getUserInfo = () => {
    liff.init({liffId: process.env.REACT_APP_LIFF_ID})
      .then(() => {
        if (!liff.isLoggedIn()) {
          liff.login({}) // ログインしていなければ最初にログインする
        } else if (liff.isInClient()) {
          liff.getProfile()  // ユーザ情報を取得する
            .then(profile => {
              const userId = profile.userId
              const displayName = profile.displayName
              alert(`Name: ${displayName}, userId: ${userId}`)
            }).catch(function(error) {
              window.alert('Error sending message: ' + error);
            });
        }
      })

  }

  return (
    <div className="Root">
      <header className="Root-header">
        <img src={logo} className="Root-logo" alt="logo" />
        <button className="button" onClick={sendMessage}>send message</button>
        <button className="button" onClick={getUserInfo}>show user info</button>
        <nav
        style={{
          borderBottom: "solid 1px",
          paddingBottom: "1rem"
        }}
      >
        <Link to="/new_ticket">NewTicket</Link> |{" "}
        <Link to="/new_group">NewGroup</Link> |{" "}
        <Link to="/settle_group">GroupPayment</Link>
      </nav>
      </header>
    </div>
  );
}

export default Root
