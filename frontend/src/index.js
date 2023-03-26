import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css';
import Root from './Root';
import NewGroup from './NewGroup';
import JoinGroup from './JoinGroup';
import NewTicket from './NewTicket';
import UpdateTicket from './UpdateTicket';
import SettleGroup from './SettleGroup';
import ApproveGroup from './ApproveGroup';
import ShowGroups from './ShowGroups';
import FriendWarning from './component/FriendWarning';
import liff from '@line/liff'; 
import * as storage from './service/storage';

const showPage = async () => {
  
  await liff.init({liffId: process.env.REACT_APP_LIFF_ID});
  if (!liff.isLoggedIn()) {
    liff.login();
  }
  
  await storage.setUserId();
  await storage.setUserProfile();

  const data = await liff.getFriendship();
  if (!data.friendFlag) {
    ReactDOM.render(<FriendWarning/>, document.getElementById('root'));
    return;
  }
  

  ReactDOM.render(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Root />} />
        <Route path="new_group" element={<NewGroup />} />
        <Route path="join_group" element={<JoinGroup />} />
        <Route path="new_ticket" element={<NewTicket />} />
        <Route path="update_ticket" element={<UpdateTicket />} />
        <Route path="settle_group" element={<SettleGroup />} />
        <Route path="approve_group" element={<ApproveGroup />} />
        <Route path="show_groups" element={<ShowGroups />} />
      </Routes>
    </BrowserRouter>,
    document.getElementById('root')
  );
}

showPage().catch(e => {
  alert(e);
  ReactDOM.render(
    <div>通信に失敗しました</div>,
    document.getElementById('root')
  );
});