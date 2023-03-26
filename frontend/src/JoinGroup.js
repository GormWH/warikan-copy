import React, {useEffect, useState} from 'react';
import { useLocation } from 'react-router-dom'
import Title from './component/Title'
import Subtitle from './component/Subtitle'
import UserTable from './component/UserTable';
import Spinner from './component/Spinner';
import TicketBox from './component/TicketBox';
import * as warikanAPI from './service/warikanAPI';
import './JoinGroup.css';

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}


function JoinGroup() {
  
  let query = useQuery();
  let groupId = query.get("group_id");

  useEffect(() => {
    const joinGroup = async () => {
      try {
        await warikanAPI.joinGroup(groupId);
        setJoinGroupIsLoading(false);
      }catch{
        setJoinGroupIsError(true);
      }
    }
    joinGroup();
    
  }, [])

  const [joinGroupIsLoading, setJoinGroupIsLoading] = useState(true);
  const [joinGroupIsError, setJoinGroupIsError] = useState(false);

  // const {data: joinGroupData, isLoading: joinGroupIsLoading, isError: joinGroupIsError} = warikanAPI.useJoinGroup(groupId, storage.userId);
  const {data, isLoading: getGroupIsLoading, isError: getGroupIsError} = warikanAPI.useGetGroup(groupId, !joinGroupIsLoading);

  if (joinGroupIsLoading || getGroupIsLoading) {
    return <Spinner/>;
  }

  if (joinGroupIsError || getGroupIsError){
    return <div>通信エラーが発生しました</div>
  }

  return (
    <main>
      <Title text="グループ参加"/>
      <div className="subtitle-wrapper-check"> <Subtitle text="以下のグループに参加しました" type="check"/> </div>
      <div className="content-wrapper">
        <TicketBox name={data.name} description={data.description}/>
        <div className="users-wrapper">
          <div className="users-label">現在のメンバー</div>
        </div>
        <UserTable users={data.users}/>
      </div>
    </main>
  );   

}

export default JoinGroup
