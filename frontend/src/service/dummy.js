function ticketFormat(user, amount) {
  return {
    "user_id": user["user_id"],
    "amount": amount,
    "name": user["name"],
    "picture_url": user["picture_url"]
  };
};

function addUserToGroup(user, group) {
  user["group_ids"].push(group["group_id"]);
  group["users"].push(user); 
};

function addTicketToGroup(ticket, group) {
  group["transaction_ids"].push(ticket["ticket_id"]);
  ticket["group_name"] = group["name"];
};

function user_id(user) {
  return user["user_id"];
};

let dummyUsers = [
  {
    "user_id": "q489j9javij",
    "line_id": "U33012874",
    "session_id": "0aw?9eufp¥3rmp4-vi32rq",
    "name": "1",
    "picture_url" : "https://news-pctr.c.yimg.jp/dk/iwiz-news-polls/images/2021/04/1619517404_ac23fb19337cc8a92a16b46b4837a723.jpg?pri=l&w=640&h=476.58666666667",
    "group_ids" : []
  },
  {
    "user_id": "jnfj8hgezy7",
    "line_id": "FVZV36OSA",
    "session_id": "0aw?9eufp¥3rmp4-vi32rq",
    "name": "2",
    "picture_url" : "https://prtimes.jp/i/15177/518/ogp/d15177-518-a399a05532c584f11ac9-0.png",
    "group_ids" : []
  },
  {
    "user_id": "5hxxqg7pams",
    "line_id": "YW3XY2NKL",
    "session_id": "0aw?9eufp¥3rmp4-vi32rq",
    "name": "3",
    "picture_url" : "https://jpn.nec.com/solution/space/images/th_science.jpg",
    "group_ids" : []
  },
  {
    "user_id": "5ka7a3spnsj",
    "line_id": "TH92J00OQ",
    "session_id": "0aw?9eufp¥3rmp4-vi32rq",
    "name": "4",
    "picture_url" : "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-default-avatar-profile-icon-vector-social-media-user-image-vector-illustration-227787227.jpg",
    "group_ids" : []
  },
  {
    "user_id": "gkg4rspfyk5",
    "line_id": "W79KRS8JM",
    "session_id": "0aw?9eufp¥3rmp4-vi32rq",
    "name": "5",
    "picture_url" : "https://previews.123rf.com/images/urfandadashov/urfandadashov1809/urfandadashov180902667/109317646-ic%C3%B4ne-de-vecteur-de-profil-pic-isol%C3%A9-sur-fond-transparent-concept-de-logo-profil-pic-pic.jpg",
    "group_ids" : []
  }
];

let DUMMY_USER_ID = dummyUsers[0].user_id;

let dummyGroups = [
  {
    "group_id":"9w8euv9uq4qfqo",
    "name":"箱根旅行",
    "description":"友人と行く箱根旅行",
    "transaction_ids" : [],
    "users": []
  },
  {
    "group_id":"w09fj0jfqo",
    "name":"飲み会",
    "description":"友人と飲み会",
    "transaction_ids" : [],
    "users": []
  },
];

addUserToGroup(dummyUsers[0], dummyGroups[0]);
addUserToGroup(dummyUsers[1], dummyGroups[0]);
addUserToGroup(dummyUsers[2], dummyGroups[0]);
addUserToGroup(dummyUsers[3], dummyGroups[0]);

addUserToGroup(dummyUsers[0], dummyGroups[1]);
addUserToGroup(dummyUsers[2], dummyGroups[1]);
addUserToGroup(dummyUsers[4], dummyGroups[1]);

let dummyTickets = [
  {
    "ticket_id": "ringrae2r4g",
    "name": "t1",
    "group_name" : "",
    "description": "箱根旅行2日目の昼のレストラン用",
    "lenders": [ticketFormat(dummyUsers[0],4000)],
    "debtors": [ticketFormat(dummyUsers[0],1000), ticketFormat(dummyUsers[1],1000),
                ticketFormat(dummyUsers[2],1000), ticketFormat(dummyUsers[3],1000)],
    "payment": "equal",
    "approved_user_ids": [user_id(dummyUsers[0]), user_id(dummyUsers[1]),
                          user_id(dummyUsers[2]), user_id(dummyUsers[3])],
    "all_approved": true
  },
  {
    "ticket_id": "jg2yjj19cid",
    "name": "t2",
    "group_name" : "箱根旅行",
    "description": "箱根旅行2日目の昼のレストラン用",
    "lenders": [ticketFormat(dummyUsers[0],10000), ticketFormat(dummyUsers[1],2000)],
    "debtors": [ticketFormat(dummyUsers[0],3000), ticketFormat(dummyUsers[1],3000),
                ticketFormat(dummyUsers[2],3000), ticketFormat(dummyUsers[3],3000)],
    "payment": "equal",
    "approved_user_ids": [user_id(dummyUsers[0]), user_id(dummyUsers[1]),
                          user_id(dummyUsers[2]), user_id(dummyUsers[3])],
    "all_approved": true
  },
  {
    "ticket_id": "8bulsjfakik",
    "name": "t3",
    "group_name" : "箱根旅行",
    "description": "箱根旅行2日目の昼のレストラン用",
    "lenders": [ticketFormat(dummyUsers[0],5040)],
    "debtors": [ticketFormat(dummyUsers[0],1680), ticketFormat(dummyUsers[2],1680),
                ticketFormat(dummyUsers[4],1680)],
    "payment": "equal",
    "approved_user_ids": [user_id(dummyUsers[0]), user_id(dummyUsers[2]), user_id(dummyUsers[4])],
    "all_approved": true
  },
  {
    "ticket_id": "6s0b1ooz9wt",
    "name": "t4",
    "group_name" : "箱根旅行",
    "description": "箱根旅行2日目の昼のレストラン用",
    "lenders": [ticketFormat(dummyUsers[0],3000)],
    "debtors": [ticketFormat(dummyUsers[0],1000), ticketFormat(dummyUsers[2],1000),
                ticketFormat(dummyUsers[4],1000)],
    "payment": "equal",
    "approved_user_ids": [user_id(dummyUsers[0]), user_id(dummyUsers[2]), user_id(dummyUsers[4])],
    "all_approved": true
  },
];

addTicketToGroup(dummyTickets[0], dummyGroups[0]);
addTicketToGroup(dummyTickets[1], dummyGroups[0]);
addTicketToGroup(dummyTickets[0], dummyGroups[1]);
addTicketToGroup(dummyTickets[1], dummyGroups[1]);

let dummyPayment = [
{
"debtor": "982hufnqnnwnvn",
"lender": "8vye4u3bnjng",
"amount": 5160
},
{
"debtor": "a8wveyfhaweifh",
"lender": "8vye4u3bnjng",
"amount": 3510
}
];

// console.log(dummyGroups[0]["transaction_ids"]);
export {dummyUsers, dummyGroups, dummyTickets, DUMMY_USER_ID};