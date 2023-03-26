import API from './API';
import * as storage from './storage';
import useSWR from 'swr';

// const _sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export let dummyGroups = [
          {
            "group_id":"9w8euv9uq4qfqo",
            "name":"箱根旅行",
            "description":"友人と行く箱根旅行",
            "transaction_ids" : ["oaweifh0"],
            "users": [
                        { 
                            "user_id": "q489j9javij",
                            "name": "タロウ",
                            "picture_url" : "https://news-pctr.c.yimg.jp/dk/iwiz-news-polls/images/2021/04/1619517404_ac23fb19337cc8a92a16b46b4837a723.jpg?pri=l&w=640&h=476.58666666667"
                        },
                        {
                            "user_id": "aweofizoij",
                            "name": "ジロウ",
                            "picture_url" : "https://prtimes.jp/i/15177/518/ogp/d15177-518-a399a05532c584f11ac9-0.png"
                        },
                        {
                            "user_id": "9fdjvnnweew",
                            "name": "サブロウ",
                            "picture_url" : "https://jpn.nec.com/solution/space/images/th_science.jpg"
                        },
                     ], 
          },
          {
            "group_id":"w09fj0jfqo",
            "name":"函館旅行",
            "description":"友人と行く函館旅行",
            "transaction_ids" : ["oewinfoi32", "aoeb9a09rej", "qo34igoiqoig"],
            "users": [
                        { 
                            "user_id": "iwejfij9vnij",
                            "name": "シロウ",
                            "picture_url" : "https://jpn.nec.com/solution/space/images/th_science.jpg"
                        },
                        {
                            "user_id": "9vahaw4nfinwf",
                            "name": "ゴロウ",
                            "picture_url" : "https://jpn.nec.com/solution/space/images/th_science.jpg"
                        },
                        {
                            "user_id": "5ghrhuasnfjawx",
                            "name": "ロクロウ",
                            "picture_url" : "https://jpn.nec.com/solution/space/images/th_science.jpg"
                        },
                     ], 
          },
]

export let dummyTickets = [
  {
    "ticket_id": "ringrae2r4g",
    "name": "ランチ代金",
    "group_name" : "箱根旅行",
    "description": "箱根旅行2日目の昼のレストラン用",
    "lenders": [
      {
        "user_id": "q489j9javij",
        "amount": 5000,
        "name": "タロウ",
        "picture_url" : "https://news-pctr.c.yimg.jp/dk/iwiz-news-polls/images/2021/04/1619517404_ac23fb19337cc8a92a16b46b4837a723.jpg?pri=l&w=640&h=476.58666666667"
      },
      {
        "user_id": "aweofizoij",
        "amount": 4000,
        "name": "ジロウ",
        "picture_url" : "https://prtimes.jp/i/15177/518/ogp/d15177-518-a399a05532c584f11ac9-0.png"
      }
    ],
    "debtors": [
      {
        "user_id": "q489j9javij",
        "amount": 3000,
        "name": "タロウ",
        "picture_url" : "https://news-pctr.c.yimg.jp/dk/iwiz-news-polls/images/2021/04/1619517404_ac23fb19337cc8a92a16b46b4837a723.jpg?pri=l&w=640&h=476.58666666667"
      },
      {
        "user_id": "aweofizoij",
        "amount": 3000,
        "name": "ジロウ",
        "picture_url" : "https://prtimes.jp/i/15177/518/ogp/d15177-518-a399a05532c584f11ac9-0.png"
      },
      {
        "user_id": "9fdjvnnweew",
        "amount": 3000,
        "name": "サブロウ",
        "picture_url" : "https://jpn.nec.com/solution/space/images/th_science.jpg"
      }
    ],
    "payment": "equal",
    "approved_user_ids": ["q489j9javij","aweofizoij","9fdjvnnweew"],
    "all_approved": true
  },
  {
    "ticket_id": "ringdss2r4g",
    "name": "宿泊代金",
    "group_name" : "箱根旅行",
    "description": "1日目の宿泊料金",
    "lenders": [
      {
        "user_id": "q489j9javij",
        "amount": 5000,
        "name": "タロウ",
        "picture_url" : "https://news-pctr.c.yimg.jp/dk/iwiz-news-polls/images/2021/04/1619517404_ac23fb19337cc8a92a16b46b4837a723.jpg?pri=l&w=640&h=476.58666666667"
      },
      {
        "user_id": "aweofizoij",
        "amount": 4000,
        "name": "ジロウ",
        "picture_url" : "https://prtimes.jp/i/15177/518/ogp/d15177-518-a399a05532c584f11ac9-0.png"
      }
    ],
    "debtors": [
      {
        "user_id": "q489j9javij",
        "amount": 3000,
        "name": "タロウ",
        "picture_url" : "https://news-pctr.c.yimg.jp/dk/iwiz-news-polls/images/2021/04/1619517404_ac23fb19337cc8a92a16b46b4837a723.jpg?pri=l&w=640&h=476.58666666667"
      },
      {
        "user_id": "aweofizoij",
        "amount": 3000,
        "name": "ジロウ",
        "picture_url" : "https://prtimes.jp/i/15177/518/ogp/d15177-518-a399a05532c584f11ac9-0.png"
      },
      {
        "user_id": "9fdjvnnweew",
        "amount": 3000,
        "name": "サブロウ",
        "picture_url" : "https://jpn.nec.com/solution/space/images/th_science.jpg"
      }
    ],
    "payment": "equal",
    "approved_user_ids": ["q489j9javij","aweofizoij","9fdjvnnweew"],
    "all_approved": false
  }
]

export let dummyTicket = {
          "ticket_id": "ringrae2r4g",
          "name": "ランチ代金",
          "group_name" : "箱根旅行",
          "description": "箱根旅行2日目の昼のレストラン用",
          "lenders": [
            {
              "user_id": "q489j9javij",
              "amount": 5000,
              "name": "タロウ",
              "picture_url" : "https://news-pctr.c.yimg.jp/dk/iwiz-news-polls/images/2021/04/1619517404_ac23fb19337cc8a92a16b46b4837a723.jpg?pri=l&w=640&h=476.58666666667"
            },
            {
              "user_id": "aweofizoij",
              "amount": 4000,
              "name": "ジロウ",
              "picture_url" : "https://prtimes.jp/i/15177/518/ogp/d15177-518-a399a05532c584f11ac9-0.png"
            }
          ],
          "debtors": [
            {
              "user_id": "q489j9javij",
              "amount": 3000,
              "name": "タロウ",
              "picture_url" : "https://news-pctr.c.yimg.jp/dk/iwiz-news-polls/images/2021/04/1619517404_ac23fb19337cc8a92a16b46b4837a723.jpg?pri=l&w=640&h=476.58666666667"
            },
            {
              "user_id": "aweofizoij",
              "amount": 3000,
              "name": "ジロウ",
              "picture_url" : "https://prtimes.jp/i/15177/518/ogp/d15177-518-a399a05532c584f11ac9-0.png"
            },
            {
              "user_id": "9fdjvnnweew",
              "amount": 3000,
              "name": "サブロウ",
              "picture_url" : "https://jpn.nec.com/solution/space/images/th_science.jpg"
            }
          ],
          "payment": "equal"
        };

  export let dummyPayment = [
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
  ]

// export const getGroup = async (group_id) => {

//     await _sleep(2000);
    
//     return {
//             "group_id":"9w8euv9uq4qfqo",
//             "name":"箱根旅行",
//             "description":"友人と行く箱根旅行。友人と行く箱根旅行。友人と行く箱根旅行。友人と行く箱根旅行。友人と行く箱根旅行。友人と行く箱根旅行。友人と行く箱根旅行。友人と行く箱根旅行。友人と行く箱根旅行。友人と行く箱根旅行。友人と行く箱根旅行。友人と行く箱根旅行。友人と行く箱根旅行。友人と行く箱根旅行。友人と",
//             "transaction_ids" : ["oaweifh0"],
//             "users": [
//                     { 
//                         "user_id": "q489j9javij",
//                         "name": "タロウ",
//                         "picture_url" : "https://news-pctr.c.yimg.jp/dk/iwiz-news-polls/images/2021/04/1619517404_ac23fb19337cc8a92a16b46b4837a723.jpg?pri=l&w=640&h=476.58666666667"
//                     },
//                     {
//                         "user_id": "aweofizoij",
//                         "name": "ジロウ",
//                         "picture_url" : "https://prtimes.jp/i/15177/518/ogp/d15177-518-a399a05532c584f11ac9-0.png"
//                     },
//                     {
//                         "user_id": "9fdjvnnweew",
//                         "name": "サブロウ",
//                         "picture_url" : "https://jpn.nec.com/solution/space/images/th_science.jpg"
//                     },
//             ], 
//     }; 
// };

// export const postGroupsFindByUserId = async (user_id) => {

//     await _sleep(2000);

//     return [
//         {
//           "group_id":"9w8euv9uq4qfqo",
//           "name":"箱根旅行",
//           "description":"友人と行く箱根旅行",
//           "transaction_ids" : ["oaweifh0"],
//           "users": [
//                       { 
//                           "user_id": "q489j9javij",
//                           "name": "タロウ",
//                           "picture_url" : "https://news-pctr.c.yimg.jp/dk/iwiz-news-polls/images/2021/04/1619517404_ac23fb19337cc8a92a16b46b4837a723.jpg?pri=l&w=640&h=476.58666666667"
//                       },
//                       {
//                           "user_id": "aweofizoij",
//                           "name": "ジロウ",
//                           "picture_url" : "https://prtimes.jp/i/15177/518/ogp/d15177-518-a399a05532c584f11ac9-0.png"
//                       },
//                       {
//                           "user_id": "9fdjvnnweew",
//                           "name": "サブロウ",
//                           "picture_url" : "https://jpn.nec.com/solution/space/images/th_science.jpg"
//                       },
//                    ], 
//         },
//         {
//           "group_id":"w09fj0jfqo",
//           "name":"函館旅行",
//           "description":"友人と行く函館旅行",
//           "transaction_ids" : ["oewinfoi32", "aoeb9a09rej", "qo34igoiqoig"],
//           "users": [
//                       { 
//                           "user_id": "iwejfij9vnij",
//                           "name": "シロウ",
//                           "picture_url" : "https://jpn.nec.com/solution/space/images/th_science.jpg"
//                       },
//                       {
//                           "user_id": "9vahaw4nfinwf",
//                           "name": "ゴロウ",
//                           "picture_url" : "https://jpn.nec.com/solution/space/images/th_science.jpg"
//                       },
//                       {
//                           "user_id": "5ghrhuasnfjawx",
//                           "name": "ロクロウ",
//                           "picture_url" : "https://jpn.nec.com/solution/space/images/th_science.jpg"
//                       },
//                    ], 
//         },
//      ];
// }

// export const getTicket = async (ticket_id) => {

//     await _sleep(2000);
//     return {
//         "ticket_id": "ringrae2r4g",
//         "name": "ランチ代金",
//         "description": "箱根旅行2日目の昼のレストラン用",
//         "lenders": [
//           {
//             "user_id": "982hufnqnnwnvn",
//             "amount": 5000,
//             "name": "タロウ",
//             "picture_url" : "https://news-pctr.c.yimg.jp/dk/iwiz-news-polls/images/2021/04/1619517404_ac23fb19337cc8a92a16b46b4837a723.jpg?pri=l&w=640&h=476.58666666667"
//           },
//           {
//             "user_id": "a8wveyfhaweifh",
//             "amount": 4000,
//             "name": "ジロウ",
//             "picture_url" : "https://prtimes.jp/i/15177/518/ogp/d15177-518-a399a05532c584f11ac9-0.png"
//           }
//         ],
//         "debtors": [
//           {
//             "user_id": "982hufnqnnwnvn",
//             "amount": 3000,
//             "name": "タロウ",
//             "picture_url" : "https://news-pctr.c.yimg.jp/dk/iwiz-news-polls/images/2021/04/1619517404_ac23fb19337cc8a92a16b46b4837a723.jpg?pri=l&w=640&h=476.58666666667"
//           },
//           {
//             "user_id": "a8wveyfhaweifh",
//             "amount": 3000,
//             "name": "ジロウ",
//             "picture_url" : "https://prtimes.jp/i/15177/518/ogp/d15177-518-a399a05532c584f11ac9-0.png"
//           },
//           {
//             "user_id": "8vye4u3bnjng",
//             "amount": 3000,
//             "name": "サブロウ",
//             "picture_url" : "https://jpn.nec.com/solution/space/images/th_science.jpg"
//           }
//         ],
//         "payment": "equal"
//       };
// };

export const session = async (accessToken, group_id=null) => {

  let res = await API.post('session', {
    "access_token": accessToken,
    "group_id": group_id,
  })
  return res;
    
};

export const getGroup = async (group_id) => {
  let res = await API.get(`transaction_group/${group_id}`);
  return res.data;
}

export const postGroup = async (name, description) => {

  let res = await API.post('transaction_group', {
    "user_id" : storage.userId, 
    "name" : name,
    "description" : description
  })
  return res;

}

export const joinGroup = async (group_id) => {

  let res = await API.post(`transaction_group/${group_id}/join`, {
    "user_id" : storage.userId
  })
  return res;
};


export const postTicket = async (groupId, name, description, lenders, debtors, payment) => {

  let res = await API.post(`transaction/${groupId}`, {
    "user_id" : storage.userId,
    "name" : name,
    "description" : description,
    "lenders" : lenders,
    "debtors" : debtors,
    "payment" : payment 
  });
  return res;
};

export const putTicket = async (ticketId, name, description, lenders, debtors, payment) => {
  let res = await API.put(`transaction/${ticketId}`, {
    "user_id" : storage.userId,
    "name" : name,
    "description" : description,
    "lenders" : lenders,
    "debtors" : debtors,
    "payment" : payment 
  })
  return res;
};

export const postTicketFindByGroupId = async (groupId) => {
  let res = await API.post(`transaction/find_by_group_id`, {
    "group_id" : groupId
  })
  return res.data;
}

export const postGroupSettlement = async (groupId) => {
  let res = await API.post(`transaction_group/${groupId}/settlement`, {
    "user_id" : storage.userId
  })
}

export const getGroupPayment = async (groupId) => {
  let res = await API.get(`transaction_group/payment/${groupId}`)
  return res.data;
}

export const getTotalAmount = async (file) => {

  var reader = new FileReader();

  let enc = await new Promise((resolve, reject) => {
    reader.onerror = () => {
      reader.abort();
      reject(new DOMException("Problem parsing input file."));
    };

    reader.onload = async () => {
      resolve(reader.result.replace(/^data:\w+\/\w+;base64,/, ''));
    };
    reader.readAsDataURL(file);

  })

  let res = await API.post(`receipt`, { "image" : enc });
  return res.data;
}


const getFetcher = (url) => {
  return API.get(`${url}`);
}

const postFetcher = (url, data) => {
  return API.post(`${url}`, data);
}



// フックで作成
export function usePostGroupsFindByUserId(id) {
    const { data, error } = useSWR(['transaction_group/find_by_user_id', {user_id: storage.userId}], postFetcher)
  
    return {
      data: (data === undefined ? [] : data['data']),
      isLoading: !error && !data,
      isError: error,
    }
}

// export function usePostTicketsFindByGroupId(group_id, canFetch) {
//   const { data, error } = useSWR(canFetch ? ['transaction/find_by_group_id', {group_id: group_id}] : null, postFetcher)

//   return {
//     data: (data === undefined ? [] : data['data']),
//     isLoading: !error && !data,
//     isError: error,
//   }
// }

export function useGetGroup(group_id, canFetch) {
  const { data, error } = useSWR(canFetch ? `transaction_group/${group_id}` : null, getFetcher);

  return {
    data: data === undefined ? [] : data['data'],
    isLoading: !error && !data,
    isError: error
  }
}

export function useGetTicket(ticket_id) {
  const { data, error } = useSWR(`transaction/${ticket_id}`, getFetcher);

  return {
    data: data === undefined ? [] : data['data'],
    isLoading: !error && !data,
    isError: error
  }
}

export const postApprove = async (group_id, userId) => {
  let res = await API.post(`transaction_group/${group_id}/approve`, { user_id: userId });

  return res;
}

export const postStop = async (group_id, userId) => {
  let res = await API.post(`transaction_group/${group_id}/stop`, { user_id: userId });

  return res;
}

function getBase64(file) {
  var reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function () {
    alert(reader.result.replace(/^data:\w+\/\w+;base64,/, ''));
  };
  reader.onerror = function (error) {
    alert("error");
    return error;
  };
}