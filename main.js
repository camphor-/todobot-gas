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
    let todoList = []

    // 命令を実行する
    if (command === "追加") {
      sheet.appendRow([todo])
    } else if (command === "一覧") {
        let rows = sheet.getDataRange().getValues();
        for (row of rows) {
          todoList.push(row[0])
        }
    } else if (command === "削除") {
        let rows = sheet.getDataRange().getValues();
        for (row of rows) {
          if (row[0] === todo) {
            todoList.push([""])
          } else {
            todoList.push([row[0]])
          }
        }
        sheet.getDataRange().setValues(todoList)
    }

    // 返信メッセージを作る
    let replyMessage = ""
    if (command === "追加") {
        replyMessage = "追加しました: " + todo
    } else if (command === "一覧") {
        for (t of todoList) {
          if (t !== "") {
              replyMessage += t + "\n"
          }
        }
    } else if (command === "削除") {
      replyMessage = "削除しました: " + todo
    }

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
