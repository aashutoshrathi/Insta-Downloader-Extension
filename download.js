var link = document.createElement('link')
link.href = chrome.extension.getURL('insta-down-css.css')
link.type = 'text/css'
link.rel = 'stylesheet'
document.getElementsByTagName('head')[0].appendChild(link)

function injectButtons () {
  var buttons = document.querySelectorAll('button')
  var elseProfile = false
  var selfProfile = false
  var explore = false
  var headings = document.querySelectorAll('h2')

  for (var i = 0; i < buttons.length; i++) {
    if (
      buttons[i].innerText === 'Follow' ||
      buttons[i].innerText === 'Following'
    ) {
      elseProfile = true
    }
    if (buttons[i].innerText === 'Edit Profile') {
      selfProfile = true
    }
  }

  for (i = 0; i < headings.length; i++) {
    if (headings[i].innerText === 'Explore') {
      explore = true
    }
  }

  // Grab header elements in each post or profile
  var headers = document.querySelectorAll('header')

  // Grab images appearing on the page
  var images = document.querySelectorAll('img')

  // Grab images appearing on the page
  var videos = document.querySelectorAll('video')
  let j = 0

  if (explore) {
    for (let i = 3; i < images.length; i++) {
      let x = images[i].parentElement.parentElement.parentElement.parentElement
      let db = document.createElement('a')
      db.innerHTML = `<a download href=${images[i].src}>
                  <button class="instanshu-unite instanshu-sm instanshu-success" style="left: 100px; top: 10px;">Download</button>`
      if (x.querySelectorAll('button').length < 1) {
        x.appendChild(db)
      }
      var btns = x.querySelectorAll('button')
      if (btns[0] && btns[0].parentElement.href === document.location.href) {
        btns[0].parentElement.href = images[i].src
      }
    }
  } else if (elseProfile) {
    let dlbutton = document.createElement('a')
    dlbutton.innerHTML = `
                <a download href=${images[0].src}>
                <button class="instanshu-unite instanshu-sm instanshu-success">Download DP</button>`
    if (headers[0].querySelectorAll('button').length < 3) {
      headers[0].appendChild(dlbutton)
    }

    for (let i = 1; i < images.length; i++) {
      let x = images[i].parentElement.parentElement.parentElement.parentElement
      let db = document.createElement('a')
      db.innerHTML = `<a download href=${images[i].src}>
                  <button class="instanshu-unite instanshu-sm instanshu-success" style="left: 100px; top: 10px;">Download</button>`
      if (x.querySelectorAll('button').length < 1) {
        x.appendChild(db)
      }
      btns = x.querySelectorAll('button')
      if (btns[0] && btns[0].parentElement.href === document.location.href) {
        btns[0].parentElement.href = images[i].src
      }
    }
  } else if (selfProfile) {
    let dlbutton = document.createElement('a')
    dlbutton.innerHTML = `
                <a download href=${images[0].src}>
                <button class="instanshu-unite instanshu-sm instanshu-success">Download DP</button>`
    if (headers[0].querySelectorAll('button').length < 4) {
      headers[0].appendChild(dlbutton)
    }

    for (let i = 1; i < images.length; i++) {
      let x = images[i].parentElement.parentElement.parentElement.parentElement
      let db = document.createElement('a')
      db.innerHTML = `<a download href=${images[i].src}>
                  <button class="instanshu-unite instanshu-sm instanshu-success" style="left: 100px; top: 10px;">Download</button>`
      if (x.querySelectorAll('button').length < 1) {
        x.appendChild(db)
      }
      btns = x.querySelectorAll('button')
      if (btns[0] && btns[0].parentElement.href === document.location.href) {
        btns[0].parentElement.href = images[i].src
      }
    }
  } else {
    // Iterate through the headers and inject a button to download corresponding image
    for (let i = 0; i < headers.length; i++) {
      let dlbutton = document.createElement('a')
      let pfbutton = document.createElement('a')
      let buttonsParent = document.createElement('div')

      buttonsParent.className = 'download-buttons'
      var dlink = images[2 * i + 1].src
      var dplink = images[2 * i].src
      if (
        images[2 * i + 1].naturalHeight === 150 ||
        (videos[j] && videos[j].poster === dlink)
      ) {
        if (videos[j].src) {
          dlink = videos[j].src
        }
        j++
      }

      dlbutton.innerHTML = `
                <a download href=${dlink}>
                <button class="instanshu-unite instanshu-sm instanshu-success">Download</button>`

      pfbutton.innerHTML = `
                <a download href=${dplink}>
                <button class="instaashu-material-circle instaashu-sm
                instaashu-success instaashu-no-outline"
                style ="margin-right:10px; padding: 4px 1px;">DP<i class="fas fa-arrow-circle-down"></i>
                </button>`

      buttonsParent.appendChild(pfbutton)
      buttonsParent.appendChild(dlbutton)

      if (headers[i].querySelectorAll('button').length < 2) {
        headers[i].appendChild(buttonsParent)
      }
      btns = headers[i].querySelectorAll('button')
      if (btns[1] && btns[1].parentElement.href === document.location.href) {
        btns[1].parentElement.href = dlink
      }
    }
  }
  window.onscroll = function () {
    refresh()
  }
}

function refresh () {
  // as we only can have 8 articles at a time.
  injectButtons()
}

injectButtons()
