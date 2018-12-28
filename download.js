/* eslint no-undef: "error" */
/* eslint-env browser */

function escapeHTML (str) {
  return str.replace(/[&"'<>]/g, m => escapeHTML.replacements[m])
}
escapeHTML.replacements = {
  '&': '&amp;',
  '"': '&quot;',
  "'": '&#39;',
  '<': '&lt;',
  '>': '&gt;'
}

const link = document.createElement('link')
link.href = chrome.extension.getURL('insta-down-css.css')
link.type = 'text/css'
link.rel = 'stylesheet'
document.getElementsByTagName('head')[0].appendChild(link)
let i = 0

console.log(
  '%c Hello Developer!\n Star us here: https://github.com/aashutoshrathi/Insta-Downloader-Extension',
  'background: #222; color: #bada55'
)
const getHTML = function gethtml (url, callback) {
  // Feature detection
  if (!window.XMLHttpRequest) return

  // Create new request
  const xhr = new XMLHttpRequest()

  // Setup callback
  xhr.onload = function onload () {
    if (callback && typeof callback === 'function') {
      callback(this.responseXML)
    }
  }

  // Get the HTML
  xhr.open('GET', url)
  xhr.responseType = 'document'
  xhr.send()
}

function injectButtons () {
  const buttons = document.querySelectorAll('button')
  let elseProfile = false
  let selfProfile = false
  let explore = false
  const headings = document.querySelectorAll('h2')

  for (i = 0; i < buttons.length; i += 1) {
    if (
      document.getElementsByClassName(
        'glyphsSpriteMore_horizontal__outline__24__grey_9 u-__7'
      ).length === 1
    ) {
      elseProfile = true
      console.log('%c Some Profile ', 'background: #222; color: #bada55')
      break
    }
    if (buttons[i].innerText === 'Edit Profile') {
      selfProfile = true
      console.log('%c Your Profile', 'background: #222; color: #bada55')
      break
    }
  }

  for (i = 0; i < headings.length; i += 1) {
    if (headings[i].innerText === 'Explore') {
      explore = true
      break
    }
  }

  // Grab header elements in each post or profile
  const headers = document.querySelectorAll('header')

  // Grab section in each post
  const sections = document.getElementsByClassName('ltpMr')

  // Grab images appearing on the page
  const images = document.querySelectorAll('img')

  for (i = 0; i < images.length; i += 1) {
    // making the image link a downloading link
    if (
      !images[i].src.endsWith('&dl=1') &&
      images[i].className !== 'download-icon'
    ) {
      images[i].src = `${images[i].src}&dl=1`
    }
  }
  // // Grab images appearing on the page
  const videos = document.querySelectorAll('video')
  // // making the video link as downloading dlink

  if (videos[0]) {
    for (i = 0; i < videos.length; i += 1) {
      if (!videos[i].src.endsWith('&dl=1')) {
        videos[i].src = `${videos[i].currentSrc}&dl=1`
      }
      if (!videos[i].poster.endsWith('&dl=1')) {
        videos[i].poster = `${videos[i].poster}&dl=1`
      }
    }
  }
  let j = 0

  // Explore Page
  if (explore) {
    for (i = 3; i < images.length; i += 1) {
      const x =
        images[i].parentElement.parentElement.parentElement.parentElement

      // For downloading video
      if (x.getElementsByClassName('Byj2F').length === 1) {
        // getting video link
        const y = images[i].parentElement.parentElement.parentElement

        // get the html content of video link to download video
        getHTML(y, response => {
          const video = response.querySelectorAll(
            "meta[property='og:video:secure_url']"
          )
          const db = document.createElement('a')
          // making the image link a downloading link
          video[0].content = `${video[0].content}&dl=1`

          db.innerHTML = `<a download href=${escapeHTML(video[0].content)}>
                    <button class="instanshu-unite instanshu-sm instanshu-success" style="left: 100px; top: 10px;"> Download Video</button>`
          if (x.querySelectorAll('button').length < 1) {
            x.appendChild(db)
          }
        })
      } else {
        const db = document.createElement('a')
        db.innerHTML = `<a download href=${escapeHTML(images[i].src)}>
                  <button class="instanshu-unite instanshu-sm instanshu-success" style="left: 100px; top: 10px;">Download</button>`
        if (x.querySelectorAll('button').length < 1) {
          x.appendChild(db)
        }
        const btns = x.querySelectorAll('button')
        if (btns[0] && btns[0].parentElement.href === document.location.href) {
          btns[0].parentElement.href = images[i].src
        }
      }
    }
  } else if (elseProfile) {
    // Someone else's profile
    const dlbutton = document.createElement('a')
    dlbutton.innerHTML = `
                <a download href=${escapeHTML(images[0].src)}>
                <button class="instanshu-unite instanshu-sm instanshu-success">Download DP</button>
                 `
    if (headers[0].querySelectorAll('button').length < 1) {
      headers[0].appendChild(dlbutton)
    }

    for (i = 1; i < images.length; i += 1) {
      const x =
        images[i].parentElement.parentElement.parentElement.parentElement

      if (x.getElementsByClassName('Byj2F').length === 1) {
        const y = images[i].parentElement.parentElement.parentElement
        getHTML(y, response => {
          const video = response.querySelectorAll(
            "meta[property='og:video:secure_url']"
          )
          const db = document.createElement('a')
          video[0].content = `${video[0].content}&dl=1`

          db.innerHTML = `<a download href=${escapeHTML(video[0].content)}>
                    <button class="instanshu-unite instanshu-sm instanshu-success" style="left: 100px; top: 10px;"> Download Video</button>`
          if (x.querySelectorAll('button').length < 1) {
            x.appendChild(db)
          }
        })
      } else {
        const db = document.createElement('a')
        if (images[i].className === '_6q-tv' && images[i].height === 50) {
          db.innerHTML = `<a download href=${escapeHTML(images[i].src)}>
                  <button class="instanshu-unite instanshu-sm instanshu-success" style="left: -160px; top: -9px;">Download</button>`
        } else {
          db.innerHTML = `<a download href=${escapeHTML(images[i].src)}>
                  <button class="instanshu-unite instanshu-sm instanshu-success" style="left: 100px; top: 10px;">Download</button>`
        }
        if (x.querySelectorAll('button').length < 1) {
          x.appendChild(db)
        }
        const btns = x.querySelectorAll('button')
        if (btns[0] && btns[0].parentElement.href === document.location.href) {
          btns[0].parentElement.href = images[i].src
        }
      }
    }
  } else if (selfProfile) {
    const dlbutton = document.createElement('a')
    dlbutton.innerHTML = `
                <a download href=${escapeHTML(images[0].src)}>
                <button class="instanshu-unite instanshu-sm instanshu-success">Download DP</button>`
    if (headers[0].querySelectorAll('button').length < 4) {
      headers[0].appendChild(dlbutton)
    }

    for (i = 1; i < images.length; i += 1) {
      const x =
        images[i].parentElement.parentElement.parentElement.parentElement
      if (x.getElementsByClassName('Byj2F').length === 1) {
        const y = images[i].parentElement.parentElement.parentElement
        getHTML(y, response => {
          const video = response.querySelectorAll(
            "meta[property='og:video:secure_url']"
          )
          const db = document.createElement('a')
          video[0].content = `${video[0].content}&dl=1`

          db.innerHTML = `<a download href=${escapeHTML(video[0].content)}>
                    <button class="instanshu-unite instanshu-sm instanshu-success" style="left: 100px; top: 10px;"> Download Video</button>`
          if (x.querySelectorAll('button').length < 1) {
            x.appendChild(db)
          }
        })
      } else {
        const db = document.createElement('a')
        db.innerHTML = `<a download href=${escapeHTML(images[i].src)}>
                  <button class="instanshu-unite instanshu-sm instanshu-success" style="left: 100px; top: 10px;">Download</button>`
        if (x.querySelectorAll('button').length < 1) {
          x.appendChild(db)
        }
        const btns = x.querySelectorAll('button')
        if (btns[0] && btns[0].parentElement.href === document.location.href) {
          btns[0].parentElement.href = images[i].src
        }
      }
    }
  } else {
    // Handle main page here
    // Iterate through the headers and inject a button to download corresponding image
    console.log('%c Main Page', 'background: #222; color: #bada55')
    for (i = 0; i < headers.length; i += 1) {
      // const dlbutton = document.createElement('a')
      const pfbutton = document.createElement('a')
      const buttonsParent = document.createElement('div')
      // const downloadButton = document.createElement('span')

      buttonsParent.className = 'download-buttons'
      let dlink = images[2 * i + 1].src
      let dplink = images[2 * i].src
      // let label = 'Download'
      if (videos[j] && videos[j].poster === dlink) {
        if (videos[j] && videos[j].src) {
          dlink = videos[j].src
          label = 'Download Video'
        }
        j += 1
      }

      // console.log(dlink)

      // dlbutton.innerHTML = `
      //           <a download href=${escapeHTML(dlink)}>
      //           <button class="download-button instanshu-unite instanshu-sm instanshu-success">
      //             <img
      //               class="download-icon"
      //               src="https://img.icons8.com/ios/50/000000/installing-updates.png" width=29>
      //           </button></a>`

      pfbutton.innerHTML = `
                <a download href=${escapeHTML(dplink)}>
                <button class="instaashu-material-circle instaashu-sm
                instaashu-success instaashu-no-outline"
                style ="margin-right:10px; padding: 4px 1px;">DP<i class="fas fa-arrow-circle-down"></i>
                </button></a>`

      buttonsParent.appendChild(pfbutton)
      // downloadButton.appendChild(dlbutton)

      if (headers[i].querySelectorAll('button').length < 1) {
        headers[i].appendChild(buttonsParent)
      }
      const btns = headers[i].querySelectorAll('button')
      if (btns[1] && btns[1].parentElement.href === document.location.href) {
        btns[1].parentElement.href = dlink
      }
    }

    for (i = 0; i < sections.length; i += 1) {
      const dlbutton = document.createElement('a')
      dlbutton.className = 'download-btn'
      const downloadButton = document.createElement('span')

      let dlink = images[2 * i + 1].src
      if (videos[j] && videos[j].poster === dlink) {
        if (videos[j] && videos[j].src) {
          dlink = videos[j].src
        }
        j += 1
      }

      dlbutton.innerHTML = `
                <a download href=${escapeHTML(dlink)}>
                <button class="download-button instanshu-unite instanshu-sm instanshu-success">
                  <img
                    class="download-icon"
                    src="https://img.icons8.com/ios/50/000000/installing-updates.png" width=29>
                </button></a>`

      downloadButton.appendChild(dlbutton)

      const btns = sections[i].querySelectorAll('span')
      if (btns[i].className === 'download-btn') {
        console.log(btns)
      } else {
        if (btns.length === 6) {
          if (sections[i].querySelectorAll('span').length < 7) {
            sections[i].insertBefore(downloadButton, btns[4])
          }
        } else {
          if (sections[i].querySelectorAll('span').length < 9) {
            sections[i].insertBefore(downloadButton, btns[6])
          }
        }
      }
      if (btns[1] && btns[1].parentElement.href === document.location.href) {
        btns[1].parentElement.href = dlink
      }
    }
  }
  window.onscroll = function ref () {
    refresh()
  }
}

function refresh () {
  // as we only can have 8 articles at a time.
  injectButtons()
}

injectButtons()
