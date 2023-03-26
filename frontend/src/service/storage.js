import Cookies from "js-cookie";
import liff from '@line/liff'; 
import * as warikanAPI from './warikanAPI';
import axios from "@line/bot-sdk/node_modules/axios";

export let userId;
export let sessionId; 
export let userName;

export const setUserId = async () => {
    userId = Cookies.get('user_id');
    sessionId = Cookies.get('session_id');

    let group_id = null

    if (window.location.pathname === '/join_group'){
        let search = window.location.search;
        const query = new URLSearchParams(search);
        group_id = query.get('group_id');
    }
    
    if (userId === undefined || sessionId === undefined || true){   
        let accessToken = liff.getAccessToken();
        // await axios.get('https://api.line.me/v2/profile', {headers : { Authorization : `Bearer ${accessToken}`}});
        let response = await warikanAPI.session(accessToken, group_id);
        userId = response.data.user_id;
        sessionId = response.data.session_id;
        Cookies.set('user_id', userId);
        Cookies.set('session_id', sessionId, {expires: 30});
    }

    return;
};

export const setUserProfile = async () => {
    let profile = await liff.getProfile()
    userName = profile.displayName
}

