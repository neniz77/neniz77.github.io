const ERROR_MESSAGE = '系統異常'
const APIURL = 'https://api.twitch.tv/kraken'
const GALLERY_TEMPLATE = `
    <img class="gallery__item__photo" src="$preview"/>
    <div class="gallery__item__info">
      <img class="info__avatar" src="$logo"
      />
      <div class="info__text">
        <div class="info__text__title">
          $status
        </div>
        <div class="info__text__author">$author</div>
      </div>
    </div>`

// 顯示 navbar list 的 top 5 games & 抓到第一名的 streams
getGames((error, games) => {
  if (error) {
    alert(error)
    return
  }
  games.forEach((element) => {
    const listItem = document.createElement('li')
    listItem.classList.add('navbar__list__item')
    listItem.innerText = element.game.name
    document.querySelector('.navbar__list').appendChild(listItem)
  })
  changeGame(games[0].game.name)
})
document.querySelector('.navbar__list').addEventListener('click', (e) => {
  if (e.target.classList.contains('navbar__list__item')) {
    changeGame(e.target.innerText)
  }
})

// 這個 function 負責發出「撈到 top 20 streams」的請求
function getStreams(callback, gameName) {
  const xhr = new XMLHttpRequest()
  xhr.open(
    'GET',
    `${APIURL}/streams?game=${encodeURIComponent(gameName)}&limit=20`,
    true
  )
  xhr.setRequestHeader('Accept', 'application/vnd.twitchtv.v5+json')
  xhr.setRequestHeader('Client-ID', '4wiww36eeo54svja4rq9u514aw6e0o')

  xhr.onload = () => {
    if (xhr.status >= 200 && xhr.status < 400) {
      let json
      try {
        json = JSON.parse(xhr.responseText)
      } catch (e) {
        callback(ERROR_MESSAGE)
        return
      }
      callback(null, json)
      if (!json) {
        callback(ERROR_MESSAGE)
      }
    } else {
      callback(ERROR_MESSAGE)
    }
  }
  xhr.onerror = () => {
    callback(ERROR_MESSAGE)
  }
  xhr.send()
}

// 這個 function 負責處理「顯示 top 20 streams」
function showGallery(error, data) {
  /* 錯誤處理 */
  if (error) {
    alert(error)
    return
  }
  /* 顯示 top 20 streams */
  const gallery = document.querySelector('.gallery')
  gallery.innerHTML = ''
  data.streams.forEach((element) => {
    const galleryItem = document.createElement('a')
    galleryItem.setAttribute('href', element.channel.url)
    galleryItem.setAttribute('target', '_blank')
    galleryItem.classList.add('gallery__item')
    galleryItem.innerHTML = GALLERY_TEMPLATE.replace(
      '$preview',
      element.preview.large
    )
      .replace('$logo', element.channel.logo)
      .replace('$status', element.channel.status)
      .replace('$author', element.channel.display_name)
    gallery.appendChild(galleryItem)
  })
  /* 在後面加上 emptyItem 來排版 */
  const emptyItem = document.createElement('div')
  emptyItem.classList.add('gallery__item')
  emptyItem.classList.add('gallery__item--invisible')
  gallery.appendChild(emptyItem)
}

// 這個 function 負責發出「撈到 top 5 games」的請求
function getGames(callback) {
  const xhr = new XMLHttpRequest()
  xhr.open('GET', `${APIURL}/games/top?limit=5`, true)
  xhr.setRequestHeader('Accept', 'application/vnd.twitchtv.v5+json')
  xhr.setRequestHeader('Client-ID', '4wiww36eeo54svja4rq9u514aw6e0o')
  xhr.onload = () => {
    if (xhr.status >= 200 && xhr.status < 400) {
      let games
      try {
        games = JSON.parse(xhr.responseText).top
      } catch (e) {
        callback(ERROR_MESSAGE)
        return
      }
      if (!games) {
        callback(ERROR_MESSAGE)
      }
      callback(null, games)
    } else {
      callback(ERROR_MESSAGE)
    }
  }
  xhr.onerror = () => {
    callback(ERROR_MESSAGE)
  }
  xhr.send()
}

// 這個 function 負責切換 games
function changeGame(gameName) {
  const title = document.querySelector('.title')
  title.innerText = gameName
  getStreams(showGallery, gameName)
}
