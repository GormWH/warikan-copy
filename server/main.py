# from typing import ParamSpec
import json
import re
import secrets
import urllib.request
from os.path import dirname, join
from urllib.parse import quote_plus
from google.cloud import vision
import cv2
from imageio import imread
import io

import firebase_admin
import requests
from firebase_admin import credentials, firestore
from flask import Flask, abort, jsonify, make_response, request
from flask_cors import CORS
from linebot import LineBotApi, WebhookHandler
from linebot.exceptions import InvalidSignatureError
from linebot.models import (
    FlexSendMessage, 
    TextSendMessage,
    FollowEvent, 
    MessageEvent,
    PostbackEvent, 
    TextMessage,
    TextSendMessage,
    UnfollowEvent
)
import base64
import numpy as np

from config.flex_messages import FlexMessages
from config.settings import Settings
from models.flex_message import (return_flex_message_all_approval,
                                 return_flex_message_approval,
                                 return_flex_message_check,
                                 return_flex_message_settlement,
                                 return_flex_message_settlement_stop,
                                 return_flex_message_settlement_all_approved)
from models.transaction import Transaction
from models.transaction_group import TransactionGroup
from models.user import User
from utils.get_cash_flow import optimize_cash_flow

# Settings インスタンス
settings = Settings(join(dirname(__file__), '.env'))

# line bot 接続
line_bot_api = LineBotApi(settings.channel_access)
handler = WebhookHandler(settings.channel_secret)

# Flask
app = Flask(__name__)
# JSONのソートを抑止
app.config['JSON_SORT_KEYS'] = False
# CORS設定
CORS(app, supports_credentials=True)
LINE_PROFILE_URL = 'https://api.line.me/v2/profile'

# Firebase 初期化

# 各（ローカル）サーバー上で初期化
if app.config['ENV'] == 'development':
    cred = credentials.Certificate(settings.google_secret)
    firebase_admin.initialize_app(cred)
# GAE上で初期化
else:
    firebase_admin.initialize_app()

warikanDB = firestore.client()
# linebotDoc = warikanDB.document('linebotDoc')
usersCol = warikanDB.collection(u'users')
transactionCol = warikanDB.collection(u'transactions')
transactiongroupCol = warikanDB.collection(u'transaction_groups')

# 動作確認用
@app.route('/')
def index():
    return 'warikanapi'


@app.route('/transaction/<string:group_id>', methods=['POST'])
def regist_transactions(group_id):
    if request.method == 'POST':
        # リクエストからjsonを取得
        transaction = request.data.decode('utf-8')
        transaction = json.loads(transaction)
        sender_id = transaction["user_id"]
        sender = User.from_dict(usersCol.document(sender_id).get().to_dict())
        trans_obj = Transaction.from_dict(transaction)
        # 取得したjsonをDBに登録
        trans_obj.group_id = group_id
        doc_new_ref = transactionCol.document()
        trans_obj.id = doc_new_ref.id
        # 作成したユーザー情報からapprove情報を更新
        trans_obj.approved_user_ids = [sender_id]
        lenders = [lenders["user_id"] for lenders in trans_obj.lenders]
        debtors = [debtors["user_id"] for debtors in trans_obj.debtors]
        if len(list(set(lenders)|set(debtors))) == 1:
            trans_obj.all_approved = True
        doc_new_ref.set(trans_obj.to_dict())
        # Transaction id をgroupobjのtransaction_idsに追加
        group_snap = transactiongroupCol.document(trans_obj.group_id).get()
        group_obj = TransactionGroup.from_dict(group_snap.to_dict())
        group_obj.transaction_ids.append(trans_obj.id)
        transactiongroupCol.document(trans_obj.group_id).update(
            {'transaction_ids': group_obj.transaction_ids, 'all_approved': False, 'approved_user_ids': []})
        # 関連するユーザーにflex messageを送信
        if len(list(set(lenders)|set(debtors))) == 1:
            try:
                # チケット全承認用に変更する必要がある！
                lender_debtor = User.from_dict(
                    usersCol.document(
                        sender_id).get().to_dict())
                approval_message = return_flex_message_all_approval(
                    usersCol=usersCol,
                    Transaction=trans_obj,
                    Lenders=trans_obj.lenders,
                    Debtors=trans_obj.debtors,
                    GroupName=group_obj.name)
                container_obj = FlexSendMessage(
                    alt_text="チケットが発行されました", contents=approval_message)
                line_bot_api.push_message(
                    to=lender_debtor.line_id, messages=container_obj)
                print("regist_transactions: Pushed message to user: %s ." % sender_id)
            except BaseException:
                print("regist_transactions: User %s not found." % user_id)
        else:
            for user_id in list(set(lenders)|set(debtors)):
                try:
                    
                    lender_debtor = User.from_dict(
                        usersCol.document(
                            user_id).get().to_dict())
                    approval_message = return_flex_message_check(
                        sender=sender,
                        lender_debtor=lender_debtor,
                        usersCol=usersCol,
                        Transaction=trans_obj,
                        Lenders=trans_obj.lenders,
                        Debtors=trans_obj.debtors,
                        GroupName=group_obj.name,
                        Data_approve="action=\"approve\"&transactionID=\"" +
                        trans_obj.id +
                        "\"")
                    container_obj = FlexSendMessage(
                        alt_text="チケットが発行されました", contents=approval_message)
                    line_bot_api.push_message(
                        to=lender_debtor.line_id, messages=container_obj)
                    print("regist_transactions: Pushed message to user: %s ." % user_id)
                except Exception as e:
                    print(e)
                except BaseException:
                    print("regist_transactions: User %s not found." % user_id)
        result = {
            'result': True
        }
        return make_response(jsonify(result))


@app.route('/transaction/find_by_group_id', methods=['POST'])
def find_by_group_id():
    request_body = json.loads(request.data.decode('utf-8'))
    group_id = request_body["group_id"]
    groupDoc = transactiongroupCol.document(group_id)
    transaction_list = groupDoc.get().to_dict()["transaction_ids"]

    output_list = []
    for i_transaction in transaction_list:
        i_transactionDocSnap = transactionCol.document(i_transaction).get()
        if i_transactionDocSnap.exists:
            i_transaction_dict = i_transactionDocSnap.to_dict()
            output_list.append(i_transaction_dict)
        else:
            print("find_by_group_id: Transaction %s not found." %i_transaction)
    return make_response(jsonify(output_list))

@app.route('/transaction/<string:transaction_id>', methods=['PUT'])
def update_transaction(transaction_id):
    if request.method == 'PUT':
        transaction_update = request.data.decode('utf-8')
        transaction_update = json.loads(transaction_update)
        transaction_update["all_approved"] = False
        sender_id = transaction_update["user_id"]
        transaction_update["approved_user_ids"] = [sender_id]
        sender = User.from_dict(usersCol.document(sender_id).get().to_dict())
        try:
            doc_ref = transactionCol.document(transaction_id)
            doc_ref.update(transaction_update)
            trans_dic = doc_ref.get().to_dict()
            group_id = trans_dic['group_id']
            transactiongroupCol.document(group_id).update({'all_approved': False, 'approved_user_ids': []})
            trans_obj = Transaction.from_dict(trans_dic)

            # 関連するユーザーにflex messageを送信
            lenders = [lenders["user_id"] for lenders in trans_obj.lenders]
            debtors = [debtors["user_id"] for debtors in trans_obj.debtors]

            for user_id in list(set(lenders)|set(debtors)):
                try:
                    lender_debtor = User.from_dict(
                        usersCol.document(
                            user_id).get().to_dict())
                    group_snap = transactiongroupCol.document(group_id).get()
                    group_name = group_snap.to_dict()['name']
                    approval_message = return_flex_message_check(
                        sender=sender,
                        lender_debtor=lender_debtor,
                        usersCol=usersCol,
                        Transaction=trans_obj,
                        Lenders=trans_obj.lenders,
                        Debtors=trans_obj.debtors,
                        GroupName=group_name,
                        Data_approve="action=\"approve\"&transactionID=\"" +
                        transaction_id+
                        "\"",
                        modify=True)
                    container_obj = FlexSendMessage(
                        alt_text="チケットが修正されました", contents=approval_message)
                    line_bot_api.push_message(
                        to=lender_debtor.line_id, messages=container_obj)
                    print("regist_transactions: Pushed message to user: %s ." % user_id)
                except BaseException:
                    print("regist_transactions: User %s not found." % user_id)


            result = {
                'success': True
            }
            return make_response(jsonify(result))
        except BaseException:
            print(f'Transaction_id was not found.')
            result = {
                'success': False
            }
            return make_response(jsonify(result))


@app.route('/transaction/<string:transaction_id>', methods=['GET'])
def get_transaction(transaction_id):
    if request.method == 'GET':
        transaction_snap = transactionCol.document(transaction_id).get()

        if not transaction_snap.exists:
            print(f'Transaction_id is not exists')
            abort(404)

        transaction_data = transaction_snap.to_dict()
        return make_response(jsonify(transaction_data))


@app.route('/transaction/<string:transaction_id>', methods=['DELETE'])
def delete_transaction(transaction_id):
    if request.method == 'DELETE':
        transaction_snap = transactionCol.document(transaction_id).get()
        if transaction_snap.exists:
            transactionCol.document(transaction_id).delete()
            query = transactiongroupCol.where('transaction_ids', 'array_contains', transaction_id)
            group = query.get()
            group_dict = group[0].to_dict()
            group_id = group_dict['group_id']
            group_dict['transaction_ids'].remove(transaction_id)
            transactiongroupCol.document(group_id).update({'transaction_ids': group_dict['transaction_ids']})
            result = {
                'success': True
            }
            return make_response(jsonify(result))
        else:
            result = {
                'success': False
            }
            return make_response(jsonify(result))


@app.route("/callback", methods=['POST'])
def callback():
    # get X-Line-Signature header value
    signature = request.headers['X-Line-Signature']

    # get request body as text
    body = request.get_data(as_text=True)
    app.logger.info("Request body: " + body)

    # handle webhook body
    try:
        handler.handle(body, signature)
    except InvalidSignatureError:
        print("Invalid signature. Please check your channel access token/channel secret.")
        abort(400)
    return 'OK'

# オウム返しプログラム


@handler.add(MessageEvent, message=TextMessage)
def handle_message(event):
    line_bot_api.reply_message(
        event.reply_token,
        TextSendMessage(text=event.message.text))

# 友達追加時イベント


@handler.add(FollowEvent)
def handle_follow(event):
    

    query = usersCol.where('line_id', '==', event.source.user_id)
    user_snap = query.get()
    if user_snap:
        user_dict = user_snap[0].to_dict()
        if user_dict['joining_group'] != None:
            register_user_to_transaction_group(user_dict['joining_group'], user_id=user_dict['id'])
            user_doc_ref = usersCol.document(user_dict['id'])
            user_doc_ref.update({"joining_group": None})
            line_bot_api.reply_message(
                event.reply_token,
                TextSendMessage(text='友達登録ありがとう！新しいグループに参加しました！'))
    else:
        line_bot_api.reply_message(
        event.reply_token,
        TextSendMessage(text='友達追加ありがとう！'))
            
    # data = {
    #     u'line_id': profile.user_id,
    #     u'name': profile.display_name,
    #     u'picture_url': profile.picture_url
    # }
    # register_user(data)

# 友達削除時イベント


@handler.add(UnfollowEvent)
def handle_follow(event):
    pass
    # usersCol.document(search_id_from_line_id(event.source.user_id)).delete()


@handler.add(PostbackEvent)
def handle_postback(event):
    action = None
    # data は　"action=\"approve\"&groupID=\"samplegroupid\"" のような形で送られるものとしている
    data_split = event.postback.data.split("&")
    data_dict = {}
    for i_data_script in data_split:
        ldict = {}
        exec(i_data_script, globals(), ldict)
        for j_key in ldict.keys():
            data_dict[j_key] = ldict[j_key]

    action = data_dict['action']
    if action == "approve":
        postback_approve_process(event, data_dict)


def postback_approve_process(event, data_dict):
    # Transaction データ更新
    transactionDoc = transactionCol.document(data_dict['transactionID'])
    transaction = Transaction.from_dict(transactionDoc.get().to_dict())
    userDoc = usersCol.document(search_id_from_line_id(event.source.user_id))
    user = User.from_dict(userDoc.get().to_dict())

    if  user.id in transaction.approved_user_ids:
        print("User %s already approved." % user.id)
        approved_messages = TextSendMessage(text="このチケットは承認済みです")
        line_bot_api.push_message(
                         user.line_id, messages=approved_messages)
    else:
        transaction.approved_user_ids.append(user.id)
        
        # 全員が承認しているか確認
        all_approved_flg = True
        for lender in transaction.lenders:
            if lender["user_id"] not in transaction.approved_user_ids:
                all_approved_flg = False
                break
        for debtor in transaction.debtors:
            if debtor["user_id"] not in transaction.approved_user_ids:
                all_approved_flg = False
                break
        
        if all_approved_flg:
            transaction.all_approved = True

        transactionDoc.set(transaction.to_dict())

        groupDoc = transactiongroupCol.document(transaction.group_id)
        group = TransactionGroup.from_dict(groupDoc.get().to_dict())
        # 全員が承認しているかをもとにメッセージを送信
        if not all_approved_flg:
            flex_message_approval = return_flex_message_approval(
                GroupName=group.name,
                TransactionName=transaction.name,
                Description=transaction.description
            )
            container_obj = FlexSendMessage(
                alt_text="チケットを承認しました",
                contents=flex_message_approval)
            line_bot_api.push_message(event.source.user_id, messages=container_obj)
        else:
            flex_message_approval = return_flex_message_all_approval(
                usersCol=usersCol,
                Transaction=transaction,
                Lenders=transaction.lenders,
                Debtors=transaction.debtors,
                GroupName=group.name
            )

            # DB更新
            lenders = [lenders["user_id"] for lenders in transaction.lenders]
            debtors = [debtors["user_id"] for debtors in transaction.debtors]
            for user_id in list(set(lenders)|set(debtors)):
                try:
                    userDoc = usersCol.document(user_id)
                    conc_user = User.from_dict(userDoc.get().to_dict())
                    conc_user.group_ids.append(data_dict['transactionID'])
                    conc_user.group_ids = set(conc_user.group_ids)
                    userDoc.set(conc_user.to_dict())
                    container_obj = FlexSendMessage(
                        alt_text="チケットが承認されました", contents=flex_message_approval)
                    line_bot_api.push_message(
                        conc_user.line_id, messages=container_obj)
                    print("Pushed message to user: %s ." % lender["user_id"])
                except BaseException:
                    print("User %s not found." % user_id)

        # DBに transaction と user を登録
        transactionDoc.set(transaction.to_dict())
        userDoc.set(user.to_dict())


def search_id_from_line_id(line_id):
    user_candidate_list = usersCol.where('line_id', '==', line_id).get()
    if len(user_candidate_list) == 0:
        return None
    user_snap = user_candidate_list[0]
    user_id = user_snap.id
    return user_id


def _get_user_dict(user_id):
    user_snap = usersCol.document(user_id).get()
    return user_snap.to_dict()

# User取得


@app.route('/user/<string:user_id>', methods=['GET'])
def get_user(user_id):
    if request.method == 'GET':
        user_is_exis = usersCol.document(user_id).get().exists

        if not user_is_exis:
            abort(404)
        user_snap = usersCol.document(user_id).get()

        user = User.from_dict(user_snap.to_dict())
        user_dict = user.to_dict()
        user_dict.pop("line_id", None)

        result = user_dict

        return make_response(jsonify(result))


@app.route('/user', methods=['POST'])
def register_user(data=None):
    if not data:
        data = request.json

    user = User.from_dict(data)
    # generate instance and id
    new_user_ref = warikanDB.collection(u'users').document()
    # set id
    user.id = new_user_ref.id
    # insert database
    new_user_ref.set(user.to_dict())

    result = {
        "user_id": user.id
    }

    return make_response(jsonify(result))

# グループ取得


@app.route('/transaction_group/<string:group_id>', methods=['GET'])
def get_transaction_group(group_id):
    if request.method == 'GET':
        docs = transactiongroupCol.stream()
        transaction_group_snap = transactiongroupCol.document(group_id).get()
        data_is_exists = transaction_group_snap.exists

        if data_is_exists:
            match_group = TransactionGroup.from_dict(
                transaction_group_snap.to_dict())
        else:
            abort(404)
            
        group_dict = match_group.to_dict()
        result = {
            'group_id' : group_dict['id'],
            'name' : group_dict['name'],
            'description' : group_dict['description'],
            'transaction_ids' : group_dict['transaction_ids'],
            'users' : [get_user_info(_user_id) for _user_id in group_dict['user_ids']]
        }
        return make_response(jsonify(result))

# グループ登録


@app.route('/transaction_group', methods=['POST'])
def register_transaction_group():
    data = request.json
    if 'user_id' in data.keys():
        _data = {
            'name' : data['name'],
            'description': data['description']
        }
        group = TransactionGroup.from_dict(_data)
    else:
        group = TransactionGroup.from_dict(data)
    # generate instance and id
    new_group_ref = transactiongroupCol.document()
    # set id
    group.id = new_group_ref.id
    # insert database
    new_group_ref.set(group.to_dict())

    if "user_id" in data:
        register_user_to_transaction_group(group.id, data["user_id"])

    result = {
        "group_id": group.id
    }

    return make_response(jsonify(result))

# グループ参加


@app.route('/transaction_group/<string:group_id>/join', methods=['POST'])
def register_user_to_transaction_group(group_id, user_id=None):
    if not user_id:
        data = request.json
        user_id = data["user_id"]

    group_snap = transactiongroupCol.document(group_id).get()
    if not group_snap.exists:
        print(f'group {group_id} is not exists')
        abort(404)

    match_group = TransactionGroup.from_dict(group_snap.to_dict())

    user_snap = usersCol.document(user_id).get()
    if not user_snap.exists:
        print(f'User {user_id} is not in db')
        abort(404)

    match_user = User.from_dict(user_snap.to_dict())

    if not isinstance(match_group.user_ids, list):
        match_group.user_ids = []

    if user_id not in match_group.user_ids:
        match_group.user_ids.append(user_id)
        new_group_ref = transactiongroupCol.document(match_group.id)
        new_group_ref.set(match_group.to_dict())

    if not isinstance(match_user.group_ids, list):
        match_user.group_ids = []

    if match_group.id not in match_user.group_ids:
        match_user.group_ids.append(match_group.id)
        new_user_ref = warikanDB.collection(u'users').document(user_id)
        new_user_ref.set(match_user.to_dict())

    result = match_group.to_dict()

    return make_response(jsonify(result))

# ユーザーIDでグループ取得


@app.route('/transaction_group/find_by_user_id', methods=['POST'])
def get_transaction_groups():
    if request.method == 'POST':
        data = request.json
        user_id = data['user_id']
        query = transactiongroupCol.where('user_ids', 'array_contains', user_id)
        group_snap_list = query.get()
        # if group_snap_list == []:
        #     abort(404)

        group_dict_list = [group_snap.to_dict() for group_snap in group_snap_list]
        response = [{
            'group_id' : group_dict['id'],
            'name': group_dict['name'],
            'description' : group_dict['description'],
            'transaction_ids' : group_dict['transaction_ids'],
            'all_approved' : group_dict['all_approved'],
            'users' : [get_user_info(_user_id) for _user_id in group_dict['user_ids']]
        } for group_dict in group_dict_list]

        return make_response(jsonify(response))

def get_user_info(user_id):
    user_snap = usersCol.document(user_id).get()
    user_info_dict = user_snap.to_dict()
    return {
        'user_id': user_id,
        'name' : user_info_dict['name'],
        'picture_url' : user_info_dict['picture_url']
    }

@app.route('/transaction_group/<string:group_id>/settlement', methods=['POST'])
def start_settlement(group_id):
    if request.method == 'POST':
        group_ref = transactiongroupCol.document(group_id)
        user_id = request.json['user_id']
        sender = User.from_dict(
                    usersCol.document(
                        user_id).get().to_dict())
        group_ref.update({"approved_user_ids": [user_id]})
        group_obj = TransactionGroup.from_dict(group_ref.get().to_dict())

        if len(group_obj.user_ids) == 1:
            group_ref.update({"all_approved": True})
            settlement_message = return_flex_message_settlement_all_approved(group=group_obj)
            container_obj = FlexSendMessage(
                        alt_text="グループ決済が最終承認されました", contents=settlement_message)
            line_bot_api.push_message(
                    to=sender.line_id, messages=container_obj)
        else:
            settlement_message = return_flex_message_settlement(sender=sender, group=group_obj)
            container_obj = FlexSendMessage(
                            alt_text="グループ決済が開始されました", contents=settlement_message)
            for user_id in group_obj.user_ids:
                line_id = usersCol.document(user_id).get().to_dict()["line_id"]
                line_bot_api.push_message(
                        to=line_id, messages=container_obj)
        
        result = {
            "success": True
        }
        return make_response(jsonify(result))


@app.route('/transaction_group/<string:group_id>/stop', methods=['POST'])
def stop_settlement(group_id):
    if request.method == 'POST':
        request_data = request.json
        user_id = request_data['user_id']
        sender = User.from_dict(
                    usersCol.document(
                        user_id).get().to_dict())
        group_ref = transactiongroupCol.document(group_id)
        group_obj = TransactionGroup.from_dict(group_ref.get().to_dict())
        group_obj.approved_user_ids = []
        group_ref.update(group_obj.to_dict())

        # TODO:関係者に停止のflex messageを送る部分を実装(sender.line_id→lender_debtor_line_id)
        settlement_message = return_flex_message_settlement_stop(sender=sender, group=group_obj)
        container_obj = FlexSendMessage(
                        alt_text="グループ決済が停止されました", contents=settlement_message)
        for user_id in group_obj.user_ids:
            line_id = usersCol.document(user_id).get().to_dict()["line_id"]
            line_bot_api.push_message(
                    to=line_id, messages=container_obj)
        result = {
            'success': True
        }
        return make_response(jsonify(result))


@app.route('/transaction_group/<string:group_id>/approve', methods=['POST'])
def approve_settlement(group_id):
    if request.method == 'POST':
        request_data = request.json
        user_id = request_data['user_id']
        sender = User.from_dict(
                    usersCol.document(
                        user_id).get().to_dict())

        group_snap = transactiongroupCol.document(group_id).get()
        group_obj = TransactionGroup.from_dict(group_snap.to_dict())

        old_approved_user_ids = group_obj.approved_user_ids
        if user_id not in old_approved_user_ids:
            old_approved_user_ids.append(user_id)
            group_obj.approved_user_ids = old_approved_user_ids

        num_of_group_users = len(group_obj.user_ids)
        is_all_approved = len(old_approved_user_ids) == num_of_group_users
        group_obj.all_approved = is_all_approved
        if is_all_approved:
            # TODO:Flexmessageを送る部分を実装
            settlement_message = return_flex_message_settlement_all_approved(group=group_obj)
            container_obj = FlexSendMessage(
                            alt_text="グループ決済が最終承認されました", contents=settlement_message)
            for user_id in group_obj.user_ids:
                line_id = usersCol.document(user_id).get().to_dict()["line_id"]
                line_bot_api.push_message(
                        to=line_id, messages=container_obj)

        transactiongroupCol.document(group_id).update(group_obj.to_dict())
        result = {
            'success': True
        }

        return make_response(jsonify(result))


@app.route('/transaction_group/payment/<string:group_id>', methods=['GET'])
def get_cash_flow(group_id):
    if request.method == 'GET':
        doc_ref = transactiongroupCol.document(group_id)
        doc_snap = doc_ref.get()
        group = TransactionGroup.from_dict(doc_snap.to_dict())
        transaction_ids_list = group.transaction_ids
        transactions_list = []

        for transaction_id in transaction_ids_list:
            transaction_ref = transactionCol.document(transaction_id)
            transaction_snap = transaction_ref.get()
            transaction = Transaction.from_dict(transaction_snap.to_dict())
            transactions_list.append(transaction)

        users = group.user_ids
        num_of_user = len(users)
        # 全ユーザーの純額(合計の貸与額(マイナスの時は借金額))を保有
        pure_cash = [0 for _ in range(num_of_user)]

        # 有向グラフを構築
        cash_flow = [
            [0 for _ in range(num_of_user)]
            for _ in range(num_of_user)
        ]

        user_ids = group.user_ids

        userid_to_index = {
            user_id: index for index, user_id in enumerate(user_ids)
        }

        for transaction in transactions_list:
            lenders = transaction.lenders
            debtors = transaction.debtors

            for debt in debtors:
                user_id = debt['user_id']
                amount = debt['amount']
                user_index = userid_to_index[user_id]
                pure_cash[user_index] -= amount

            for lend in lenders:
                user_id = lend['user_id']
                amount = lend['amount']
                user_index = userid_to_index[user_id]
                pure_cash[user_index] += amount

        payment_list = []
        optimize_cash_flow(pure_cash, payment_list)

        results = [
            {
                'debtor': get_user_info(user_ids[payment['from']]),
                'lender': get_user_info(user_ids[payment['to']]),
                'amount': payment['amount']
            }
            for payment in payment_list
        ]
        print(results)

        # dummy
        # results = [
        #     {
        #         "debtor": {"id": "YrSbINaScVU2pJDmPuHo", "name": "おし", "picture_url": "https://profile.line-scdn.net/0m042718ea7251eaf6739bac4c4f900145e915b3f58524"},
        #         "lender": {"id": "9wrjfj88efefj", "name": "ワリカン次郎", "picture_url": "https://prtimes.jp/i/15177/518/ogp/d15177-518-a399a05532c584f11ac9-0.png"},
        #         "amount": 5000
        #     },
        #     {
        #         "debtor": {"id": "YrSbINaScVU2pJDmPuHo", "name": "おし", "picture_url": "https://profile.line-scdn.net/0m042718ea7251eaf6739bac4c4f900145e915b3f58524"},
        #         "lender": {"id": "9wrjfj88efefj", "name": "ワリカン次郎", "picture_url": "https://prtimes.jp/i/15177/518/ogp/d15177-518-a399a05532c584f11ac9-0.png"},
        #         "amount": 3000
        #     },
        #     {
        #         "debtor": {"id": "YrSbINaScVU2pJDmPuHo", "name": "おし", "picture_url": "https://profile.line-scdn.net/0m042718ea7251eaf6739bac4c4f900145e915b3f58524"},
        #         "lender": {"id": "9wrjfj88efefj", "name": "ワリカン次郎", "picture_url": "https://prtimes.jp/i/15177/518/ogp/d15177-518-a399a05532c584f11ac9-0.png"},
        #         "amount": 2000
        #     }
        # ]
        return make_response(jsonify(results))


@app.route('/session', methods=['POST'])
def start_session():
    if request.method == 'POST':
        request_object = request.data.decode('utf-8')
        request_object = json.loads(request_object)
        access_token = request_object['access_token']

        # access token の検証
        response = requests.get("https://api.line.me/oauth2/v2.1/verify?access_token=" + access_token)
        if response.status_code != 200:
            return make_response(jsonify({'error': 'Access Token Error'}), 500)

        
        # プロフィール取得
        headers = {
            'Authorization': f'Bearer {access_token}',
        }
        response = requests.get(LINE_PROFILE_URL, headers=headers)
        data = response.json()

        # 該当ユーザーを検索
        line_id = data['userId']
        query = usersCol.where('line_id', '==', line_id)
        user_snap = query.get()

        # 該当ユーザーがいなかった場合 新規作成
        if not user_snap:
            prof = {
                u'line_id': line_id,
                u'name': data['displayName'],
                u'picture_url': data['pictureUrl'],
                u'joining_group': request_object['group_id']
            }
            register_user(prof)
            query = usersCol.where('line_id', '==', line_id)
            user_snap = query.get()


        user_id = user_snap[0].id
        user_doc_ref = usersCol.document(user_id)
        new_session_id = secrets.token_hex(16)
        user_doc_ref.update({"session_id": new_session_id})
        result = {
            'user_id': user_id,
            'session_id': new_session_id
        }


        return make_response(jsonify(result))

@app.route('/receipt', methods=['POST'])
def read_receipt():
    if request.method == 'POST':
        request_data = request.json

        result = {}

        try:
            # file read
            img = cv2.cvtColor(imread(io.BytesIO(base64.b64decode(request_data['image']))), cv2.COLOR_RGB2BGR)
            client = vision.ImageAnnotatorClient()
            content = base64.b64decode(request_data['image'])

            image = vision.Image(content=content)
            response = client.document_text_detection(image=image)

            result["response"] = response
            document = response.full_text_annotation
            img_symbol = img.copy()
            for page in document.pages:
                for block in page.blocks:
                    for paragraph in block.paragraphs:
                        for word in paragraph.words:
                            for symbol in word.symbols:
                                bounding_box = symbol.bounding_box
                                xmin = bounding_box.vertices[0].x
                                ymin = bounding_box.vertices[0].y
                                xmax = bounding_box.vertices[2].x
                                ymax = bounding_box.vertices[2].y
                                cv2.rectangle(img_symbol, (xmin, ymin), (xmax, ymax), (0, 255, 0), thickness=1, lineType=cv2.LINE_AA)
            result["img"] = img_symbol[:,:,::-1]

            i_data = 0
            response = result["response"]

            return {"total": print_total_sum(response)}
        except:
            return {"error": "解析失敗"}

def detect_total_sum(text_annotations):
    i_return = None
    for i_text_annotation, text_anotation in enumerate(text_annotations):
        if text_anotation.description in ["合計", "総計"]:
            if i_return != None:
                raise Exception("Error: detected multiple total sum")
            i_return = i_text_annotation
    if i_return == None:
        raise Exception("Error: could not detect the specified string")
    return i_return

def return_det_vector(vertice):
    edge_len_list = []
    for i in range(4):
        if not i == 3:
            edge_len_list.append((vertice[i].x - vertice[i+1].x)**2 + (vertice[i].y - vertice[i+1].y)**2)
        else:
            edge_len_list.append((vertice[3].x - vertice[0].x)**2 + (vertice[3].y - vertice[0].y)**2)
    max_edge_index = edge_len_list.index(max(edge_len_list))
    if max_edge_index in [0,2]:
        edge_long_01_23_flg = True
    else:
        edge_long_01_23_flg = False
  
    if edge_long_01_23_flg:
        x_slope = (vertice[0].x-vertice[1].x+vertice[3].x-vertice[2].x)/2
        y_slope = (vertice[0].y-vertice[1].y+vertice[3].y-vertice[2].y)/2
        det_vector = np.array([-y_slope, x_slope])
    else:
        x_slope = (vertice[0].x-vertice[3].x+vertice[1].x-vertice[2].x)/2
        y_slope = (vertice[0].y-vertice[3].y+vertice[1].y-vertice[2].y)/2
        det_vector = np.array([-y_slope, x_slope])
    return det_vector/np.linalg.norm(det_vector, ord=2)

def return_center(vertices):
    x_sum = 0
    y_sum = 0
    for i, vertice in enumerate(vertices):
        x_sum += vertice.x
        y_sum += vertice.y
    return np.array([x_sum/(i+1), y_sum/(i+1)])

def print_total_sum(response):

    text_annotations = response.text_annotations[1:]
    total_sum_index = detect_total_sum(text_annotations)

    total_sum_vertices = text_annotations[total_sum_index].bounding_poly.vertices
    det_vector = return_det_vector(total_sum_vertices)
    total_sum_center = return_center(total_sum_vertices)

    diff_list = {}
    for i_text_annotation_index, i_text_anotation in enumerate(text_annotations):
        if not i_text_annotation_index == total_sum_index:
            i_vertices_center = return_center(i_text_anotation.bounding_poly.vertices)
            i_center_diff = total_sum_center - i_vertices_center
            i_normed_center_diff = i_center_diff/np.linalg.norm(i_center_diff, ord=2)
            diff_list[i_text_annotation_index] = np.dot(det_vector, i_normed_center_diff)


    sorted_index_diff_list = sorted(diff_list.items(), key=lambda x:abs(x[1]))
    total_sum = None
    for sorted_index_diff in sorted_index_diff_list:
        i_index = sorted_index_diff[0]
        i_description = text_annotations[i_index].description
        # print("- i_description = %s"%i_description)
        try:
            total_sum = int(i_description)
            break
        except:
            pass
    if total_sum == None:
        raise Exception("Error: could not read total sum")
    return total_sum
  # print("> total sum = %d"%total_sum)
  
        



# エラーハンドラ：404
@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not found'}), 404)

# エラーハンドラ：500
@app.errorhandler(500)
def internal_server_error(error):
    return make_response(jsonify({'error': 'Internal Server Error'}), 500)


if __name__ == "__main__":
    # from waitress import serve
    # serve(app, host="0.0.0.0", port=80)
    app.run()

