var link = document.createElement("link");
link.href = chrome.extension.getURL("insta-down-css.css");
link.type = "text/css";
link.rel = "stylesheet";
document.getElementsByTagName("head")[0].appendChild(link);

function injectButtons() {
  buttons = document.querySelectorAll('button');
  else_profile = false;
  self_profile = false;

  for(var i=0; i<buttons.length; i++) {
    if(buttons[i].innerText === "Follow" || buttons[i].innerText === "Following") {
      else_profile = true;
    }
    if(buttons[i].innerText === "Edit Profile") {
      self_profile = true;
    }
  }

	// Grab header elements in each post or profile
	headers = document.querySelectorAll('header');

	// Grab images appearing on the page
  images = document.querySelectorAll('img');

  // Grab images appearing on the page
  videos = document.querySelectorAll('video');
  let j = 0;

  if(else_profile) {
    let dlbutton = document.createElement('a');
    dlbutton.innerHTML = `
                <a download href=${images[0].src}>
                <button class="instanshu-unite instanshu-sm instanshu-success">Download DP</button>`;
      if(headers[0].querySelectorAll('button').length < 3) {
        headers[0].appendChild(dlbutton);
      }
  }

  else if (self_profile) {
    let dlbutton = document.createElement('a');
    dlbutton.innerHTML = `
                <a download href=${images[0].src}>
                <button class="instanshu-unite instanshu-sm instanshu-success">Download DP</button>`;
      if(headers[0].querySelectorAll('button').length < 4) {
        headers[0].appendChild(dlbutton);
      }
  }

  else {
    // Iterate through the headers and inject a button to download corresponding image
    for(let i = 0; i<headers.length; i++) {
      let dlbutton = document.createElement('a');
      let pfbutton = document.createElement('a');
      dlink = images[(2*i)+1].src;
      dplink = images[2*i].src;
      if (images[(2*i) + 1].naturalHeight === 150 || (videos[j] && videos[j].poster === dlink)) {
        if(videos[j].src) {
          dlink = videos[j].src;
        }
        j++;
      }

      dlbutton.innerHTML = `
                <a download href=${dlink}>
                <button class="instanshu-unite instanshu-sm instanshu-success">Download</button>`;

      pfbutton.innerHTML = `
                <a download href=${dplink}>
                <button class="instaashu-material-circle instaashu-sm
                instaashu-success instaashu-no-outline"
                style ="margin-right:10px; padding: 4px 1px;">DP<i class="fas fa-arrow-circle-down"></i>
                </button>`;

      if(headers[i].querySelectorAll('button').length < 2) {
        headers[i].appendChild(pfbutton);
        headers[i].appendChild(dlbutton);
      }
      btns = headers[i].querySelectorAll('button');
      if(btns[0] && btns[0].parentElement.href === "https://www.instagram.com/") {
        btns[0].parentElement.href = dlink;
      }
    }
  }
  window.onscroll = function() {refresh()};
}

function refresh() {
  // as we only can have 8 articles at a time.
      injectButtons();
}

injectButtons();
