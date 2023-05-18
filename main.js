const accessToken = 'あなたのチャネルアクセストークン'
const lineReplyUrl = 'https://api.line.me/v2/bot/message/reply'
const spreadsheetId = 'スプレッドシートのID'

function doPost(e) {
    // イベントの中から必要な情報を取得
    let data = JSON.parse(e.postData.contents)
    let json = data.events[0]
    let replyToken = json.replyToken
    let userMessage = json.message.text
    let spreadSheetApp = SpreadsheetApp.openById(spreadsheetId)
    let sheet = spreadSheetApp.getSheets()[0]

    // メッセージを解析
    let command = userMessage.split("\n")[0]
    let todo = userMessage.split("\n")[1]

    // タスクを追加する
    if (command === "追加") {
      sheet.appendRow([todo])
    }

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
