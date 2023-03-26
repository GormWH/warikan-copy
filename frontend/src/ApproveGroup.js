import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Title from "./component/Title";
import Subtitle from "./component/Subtitle";
import Button from "./component/Button";
import Spinner from "./component/Spinner";
import InputLabel from './component/InputLabel'
import TicketAccordion from './component/TicketAccordion';
import TicketBox from './component/TicketBox';
import PaymentList from './component/PaymentList';

import * as warikanAPI from "./service/warikanAPI";
import "./ApproveGroup.css";
import * as storage from './service/storage';
import * as dummy from './service/dummy';

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

function CompleteApproveGroup(props) {
  useEffect(() => {
    const postSettlement = async () => {
      try {
        await warikanAPI.postApprove(props.group_id, props.user_id);
        setIsLoading(false);
      } catch {
        setIsError(true);
      }
    };
    postSettlement();
  }, []);

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return <div>送信に失敗しました</div>;
  }

  return (
    <main>
      <Title text="決済承認" />
      <div className="subtitle-wrapper-check">
        {" "}
        <Subtitle text="決済を承認しました" type="check" />{" "}
      </div>
      <div className="content-wrapper">
        <TicketBox name={props.name} description={props.description}/>
        <div className='form-wrapper'>
            <InputLabel text='決済情報'/>
            <PaymentList payment={props.payment}/>
        </div>
      </div>
      <div className="subtitle-wrapper-arrow">
        {" "}
        <Subtitle
          text="決済が全承認されるまでお待ちください"
          type="arrow"
        />{" "}
      </div>
    </main>
  );
}

function StopApproveGroup(props) {
  useEffect(() => {
    const postSettlement = async () => {
      try {
        await warikanAPI.postStop(props.group_id, props.user_id);
        setIsLoading(false);
      } catch {
        setIsError(true);
      }
    };
    postSettlement();
  }, []);

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return <div>送信に失敗しました</div>;
  }

  return (
    <main>
        <Title text="決済停止" />
        <div className="subtitle-wrapper-check">
          {" "}
          <Subtitle text="決済を停止しました" type="check" />{" "}
        </div>
        <div className="content-wrapper">
          <TicketBox name={props.name} description={props.description}/>
          <div className='form-wrapper'>
            <InputLabel text='決済情報'/>
            <PaymentList payment={props.payment}/>
          </div>
        </div>
      </main>
  );
}

function ApproveGroup() {
  let query = useQuery();
  let groupId = query.get("group_id");

  console.log(groupId);
  // let groupId = dummy.dummyGroups[0]["group_id"];

  const [group, setGroup] = useState();
  const [tickets, setTickets] = useState([]);
  const [payment, setPayment] = useState();
  const [pageIndex, setPageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const getGroupData = async () => {
      //try {
        let group_tmp = await warikanAPI.getGroup(groupId);
        // let group_tmp = dummy.dummyGroups[0];
        // setGroup(group_tmp);

        //
        //setGroup(groups.find(group => group["group_id"] === groupId));
        //

        setGroup(group_tmp);

        let tickets_tmp = await warikanAPI.postTicketFindByGroupId(groupId);
        // let tickets_tmp = dummy.dummyTickets.filter(ticket => {
        //   return ticket["group_name"] === group["name"];
        // });
        setTickets(tickets_tmp);

        let res = await warikanAPI.getGroupPayment(groupId);
        setPayment(res);

        setIsLoading(false);
      //} catch {
      //  console.log("error");
        // setIsError(true);
      //}
    };
    getGroupData();
  }, []);

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return <div>送信に失敗しました</div>;
  }

  async function doSettlement() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setPageIndex(1);
  }

  async function stopSettlement() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setPageIndex(2);
  }

  if (pageIndex === 0) {
    return (
      <main>
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1.0,maximum-scale=1.0"
        />
        <Title text="決済承認・停止" />
        <div className="content-wrapper">
          <div className="page-description">
            グループ内容を確認し、問題ない場合は「承認」<br/>修正が必要な場合は「停止」を押してください
          </div>
          <TicketBox name={group.name} description={group.description}/>
          <div className='form-wrapper'>
            <InputLabel text='チケット一覧'/>
            <TicketAccordion tickets={tickets}/>
          </div>
          <div className='form-wrapper'>
            <InputLabel text='決済情報'/>
            <PaymentList payment={payment}/>
          </div>
        </div>
        <div className="buttons-wrapper">
          <div className="button-wrapper">
            <Button text="決済停止" gray={true} short={true} onClick={stopSettlement} />
          </div>
          <div className="button-wrapper">
            <Button text="決済承認" short={true} onClick={doSettlement} />
          </div>
        </div>
      </main>
    );
  } else if (pageIndex === 1) {
    return (
      <CompleteApproveGroup
        group_id={groupId}
        user_id={storage.userId}
        name={group.name}
        description={group.description}
        payment={payment}
      />
    );
  } else if (pageIndex === 2) {
    return (
      <StopApproveGroup
        group_id={groupId}
        user_id={storage.userId}
        name={group.name}
        description={group.description}
        payment={payment}
      />
    );
  }
}

export default ApproveGroup;
