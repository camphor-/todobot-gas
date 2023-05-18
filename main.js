const accessToken = 'あなたのチャネルアクセストークン'
const lineReplyUrl = 'https://api.line.me/v2/bot/message/reply'

function doPost(e) {
    // イベントの中から必要な情報を取得
    let data = JSON.parse(e.postData.contents)
    let json = data.events[0]
    let replyToken = json.replyToken
    let userMessage = json.message.text

    // 返信メッセージを作る
    let replyMessage = userMessage

    // 返信処理を行う
    UrlFetchApp.fetch(lineReplyUrl, {
        'headers': {
            'Content-Type': 'application/json; charset=UTF-8',
            'Authorization': 'Bearer ' + accessToken,
        },
        'method': 'post',
        'payload': JSON.stringify({
            'replyToken': replyToken,
            'messages': [{
                'type': 'text',
                'text': replyMessage,
            }]
        })
    })
}
