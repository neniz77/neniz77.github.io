const errorMessage = '系統不穩定，請再試一次'
const apiUrl =
  'https://dvwhnbka7d.execute-api.us-east-1.amazonaws.com/default/lottery'

document
  .querySelector('.board__section__button')
  .addEventListener('click', (e) => {
    getPrize(handlePrizeData)
  })
document
  .querySelector('.lottery__result__button')
  .addEventListener('click', (e) => {
    window.location.reload()
  })
function getPrize(callback) {
  // 送出 request 與錯誤處理
  const xhr = new XMLHttpRequest()
  xhr.open('GET', apiUrl, true)
  xhr.onload = () => {
    if (xhr.status >= 200 && xhr.status < 400) {
      let data
      try {
        data = JSON.parse(xhr.responseText)
      } catch (e) {
        callback(errorMessage)
        return
      }
      if (!data.prize) {
        callback(errorMessage)
        return
      }
      callback(null, data.prize)
    } else {
      callback(errorMessage)
    }
  }
  xhr.onerror = () => {
    callback(errorMessage)
  }
  xhr.send()
}

function handlePrizeData(err, prize) {
  if (err) {
    alert(err)
  }
  const result = {
    FIRST: {
      className: 'jumbotron--first-prize',
      message: '恭喜你中頭獎了！日本東京來回雙人遊！'
    },
    SECOND: {
      className: 'jumbotron--second-prize',
      message: '二獎！90 吋電視一台！'
    },
    THIRD: {
      className: 'jumbotron--third-prize',
      message: '恭喜你抽中三獎：知名 YouTuber 簽名握手會入場券一張，bang！'
    },
    NONE: {
      className: 'jumbotron--no-prize',
      message: '銘謝惠顧'
    }
  }
  const { className, message } = result[prize]
  document.querySelector('.jumbotron__board').classList.add('hide')
  document.querySelector('.lottery__result').classList.remove('hide')
  document.querySelector('.lottery__result__message').innerText = message
  document.querySelector('.jumbotron').classList.add(className)
}
