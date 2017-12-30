function injectButtons() {

  buttons = document.querySelectorAll('button');
  profile = false;
  
  for(var i=0; i<buttons.length; i++) { 
    if(buttons[i].innerText === "Options") { 
      profile = true;
    }
  }

	// Grab header elements in each post or profile
	headers = document.querySelectorAll('header');

	// Grab images appearing on the page
	images = document.querySelectorAll('img');

  css = `<style>
            @charset "UTF-8";

            .instanshu-default {
              color: #fff;
            }
            .instanshu-primary,
            .instanshu,
            .instanshu-lg,
            .instanshu-md,
            .instanshu-sm,
            .instanshu-xs {
              color: #1d89ff;
            }
            .instanshu-warning {
              color: #feab3a;
            }
            .instanshu-danger {
              color: #ff5964;
            }
            .instanshu-success {
              color: #28b78d;
            }
            .instanshu-royal {
              color: #bd2df5;
            }
            .instanshu,
            .instanshu-lg,
            .instanshu-md,
            .instanshu-sm,
            .instanshu-xs {
              margin: 0;
              padding: 0;
              border-width: 0;
              border-color: transparent;
              background: transparent;
              font-weight: 400;
              cursor: pointer;
              position: relative;
            }
            .instanshu-lg {
              padding: 8px 15px;
              font-size: 24px;
              font-family: inherit;
            }
            .instanshu-md {
              font-size: 20px;
              font-family: inherit;
              padding: 5px 12px;
            }
            .instanshu-sm {
              padding: 4px 10px;
              font-size: 16px;
              font-family: inherit;
            }
            .instanshu-xs {
              padding: 3px 8px;
              font-size: 12px;
              font-family: inherit;
            }
            .instanshu-unite {
              margin: 0;
              padding: 0;
              border-width: 0;
              border-color: transparent;
              background: transparent;
              font-weight: 400;
              cursor: pointer;
              position: relative;
              font-size: 20px;
              font-family: inherit;
              padding: 5px 12px;
              z-index: 0;
              overflow: hidden;
              border: 1px solid #1d89ff;
              border-radius: 100px;
              background: #fff;
              color: #1d89ff;
              -webkit-transition: color 0.3s cubic-bezier(0.02, 0.01, 0.47, 1), border-color 0.3s cubic-bezier(0.02, 0.01, 0.47, 1);
              transition: color 0.3s cubic-bezier(0.02, 0.01, 0.47, 1), border-color 0.3s cubic-bezier(0.02, 0.01, 0.47, 1);
            }
            .instanshu-unite:before {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 120%;
              background: #d6e3ff;
              content: '';
              opacity: 0;
              z-index: -1;
              -webkit-transition: opacity 0.15s cubic-bezier(0.02, 0.01, 0.47, 1), -webkit-transform 0.15s cubic-bezier(0.02, 0.01, 0.47, 1);
              transition: opacity 0.15s cubic-bezier(0.02, 0.01, 0.47, 1), -webkit-transform 0.15s cubic-bezier(0.02, 0.01, 0.47, 1);
              transition: transform 0.15s cubic-bezier(0.02, 0.01, 0.47, 1), opacity 0.15s cubic-bezier(0.02, 0.01, 0.47, 1);
              transition: transform 0.15s cubic-bezier(0.02, 0.01, 0.47, 1), opacity 0.15s cubic-bezier(0.02, 0.01, 0.47, 1), -webkit-transform 0.15s cubic-bezier(0.02, 0.01, 0.47, 1);
              -webkit-transform: translate3d(-110%, -10%, 0) skewX(-20deg);
                      transform: translate3d(-110%, -10%, 0) skewX(-20deg);
            }
            .instanshu-unite:after {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 120%;
              background: rgba(214,227,255,0.7);
              content: '';
              opacity: 0;
              z-index: -1;
              -webkit-transition: opacity 0.15s cubic-bezier(0.02, 0.01, 0.47, 1), -webkit-transform 0.15s cubic-bezier(0.02, 0.01, 0.47, 1);
              transition: opacity 0.15s cubic-bezier(0.02, 0.01, 0.47, 1), -webkit-transform 0.15s cubic-bezier(0.02, 0.01, 0.47, 1);
              transition: transform 0.15s cubic-bezier(0.02, 0.01, 0.47, 1), opacity 0.15s cubic-bezier(0.02, 0.01, 0.47, 1);
              transition: transform 0.15s cubic-bezier(0.02, 0.01, 0.47, 1), opacity 0.15s cubic-bezier(0.02, 0.01, 0.47, 1), -webkit-transform 0.15s cubic-bezier(0.02, 0.01, 0.47, 1);
              -webkit-transform: translate3d(110%, -10%, 0) skewX(-20deg);
                      transform: translate3d(110%, -10%, 0) skewX(-20deg);
            }
            .instanshu-unite:hover,
            .instanshu-unite:focus {
              box-shadow: 0 1px 8px rgba(58,51,53,0.3);
              color: #1d89ff;
              -webkit-transition: all 0.5s cubic-bezier(0.02, 0.01, 0.47, 1);
              transition: all 0.5s cubic-bezier(0.02, 0.01, 0.47, 1);
            }
            .instanshu-unite:hover:before,
            .instanshu-unite:focus:before {
              opacity: 1;
              -webkit-transition: opacity 0.25s cubic-bezier(0.02, 0.01, 0.47, 1), -webkit-transform 0.25s cubic-bezier(0.02, 0.01, 0.47, 1);
              transition: opacity 0.25s cubic-bezier(0.02, 0.01, 0.47, 1), -webkit-transform 0.25s cubic-bezier(0.02, 0.01, 0.47, 1);
              transition: transform 0.25s cubic-bezier(0.02, 0.01, 0.47, 1), opacity 0.25s cubic-bezier(0.02, 0.01, 0.47, 1);
              transition: transform 0.25s cubic-bezier(0.02, 0.01, 0.47, 1), opacity 0.25s cubic-bezier(0.02, 0.01, 0.47, 1), -webkit-transform 0.25s cubic-bezier(0.02, 0.01, 0.47, 1);
              -webkit-transform: translate3d(-50%, -10%, 0) skewX(-20deg);
                      transform: translate3d(-50%, -10%, 0) skewX(-20deg);
            }
            .instanshu-unite:hover:after,
            .instanshu-unite:focus:after {
              opacity: 1;
              -webkit-transition: opacity 0.25s cubic-bezier(0.02, 0.01, 0.47, 1), -webkit-transform 0.25s cubic-bezier(0.02, 0.01, 0.47, 1);
              transition: opacity 0.25s cubic-bezier(0.02, 0.01, 0.47, 1), -webkit-transform 0.25s cubic-bezier(0.02, 0.01, 0.47, 1);
              transition: transform 0.25s cubic-bezier(0.02, 0.01, 0.47, 1), opacity 0.25s cubic-bezier(0.02, 0.01, 0.47, 1);
              transition: transform 0.25s cubic-bezier(0.02, 0.01, 0.47, 1), opacity 0.25s cubic-bezier(0.02, 0.01, 0.47, 1), -webkit-transform 0.25s cubic-bezier(0.02, 0.01, 0.47, 1);
              -webkit-transform: translate3d(50%, -10%, 0) skewX(-20deg);
                      transform: translate3d(50%, -10%, 0) skewX(-20deg);
            }
            .instanshu-unite.instanshu-xs {
              padding: 3px 8px;
              font-size: 12px;
              font-family: inherit;
            }
            .instanshu-unite.instanshu-xs:hover,
            .instanshu-unite.instanshu-xs:focus {
              box-shadow: 0 1px 4px rgba(58,51,53,0.3);
            }
            .instanshu-unite.instanshu-sm {
              padding: 4px 10px;
              font-size: 16px;
              font-family: inherit;
            }
            .instanshu-unite.instanshu-sm:hover,
            .instanshu-unite.instanshu-sm:focus {
              box-shadow: 0 1px 6px rgba(58,51,53,0.3);
            }
            .instanshu-unite.instanshu-md {
              font-size: 20px;
              font-family: inherit;
              padding: 5px 12px;
            }
            .instanshu-unite.instanshu-md:hover,
            .instanshu-unite.instanshu-md:focus {
              box-shadow: 0 1px 8px rgba(58,51,53,0.3);
            }
            .instanshu-unite.instanshu-lg {
              padding: 8px 15px;
              font-size: 24px;
              font-family: inherit;
            }
            .instanshu-unite.instanshu-lg:hover,
            .instanshu-unite.instanshu-lg:focus {
              box-shadow: 0 1px 10px rgba(58,51,53,0.3);
            }
            .instanshu-unite.instanshu-default {
              border-color: #1d89ff;
              color: #1d89ff;
            }
            .instanshu-unite.instanshu-default:hover,
            .instanshu-unite.instanshu-default:focus {
              background: #d6e3ff;
              color: #1d89ff;
            }
            .instanshu-unite.instanshu-default:before {
              background: #a7c3ff;
            }
            .instanshu-unite.instanshu-default:after {
              background: #d6e3ff;
            }
            .instanshu-unite.instanshu-primary {
              border-color: #1d89ff;
              color: #1d89ff;
            }
            .instanshu-unite.instanshu-primary:hover,
            .instanshu-unite.instanshu-primary:focus {
              background: #1d89ff;
              color: #fff;
            }
            .instanshu-unite.instanshu-primary:before {
              background: #006de3;
            }
            .instanshu-unite.instanshu-primary:after {
              background: #1d89ff;
            }
            .instanshu-unite.instanshu-warning {
              border-color: #feab3a;
              color: #feab3a;
            }
            .instanshu-unite.instanshu-warning:hover,
            .instanshu-unite.instanshu-warning:focus {
              background: #feab3a;
              color: #fff;
            }
            .instanshu-unite.instanshu-warning:before {
              background: #f89001;
            }
            .instanshu-unite.instanshu-warning:after {
              background: #feab3a;
            }
            .instanshu-unite.instanshu-danger {
              border-color: #ff5964;
              color: #ff5964;
            }
            .instanshu-unite.instanshu-danger:hover,
            .instanshu-unite.instanshu-danger:focus {
              background: #ff5964;
              color: #fff;
            }
            .instanshu-unite.instanshu-danger:before {
              background: #ff1424;
            }
            .instanshu-unite.instanshu-danger:after {
              background: #ff5964;
            }
            .instanshu-unite.instanshu-success {
              border-color: #28b78d;
              color: #28b78d;
            }
            .instanshu-unite.instanshu-success:hover,
            .instanshu-unite.instanshu-success:focus {
              background: #28b78d;
              color: #fff;
            }
            .instanshu-unite.instanshu-success:before {
              background: #209271;
            }
            .instanshu-unite.instanshu-success:after {
              background: #28b78d;
            }
            .instanshu-unite.instanshu-royal {
              border-color: #bd2df5;
              color: #bd2df5;
            }
            .instanshu-unite.instanshu-royal:hover,
            .instanshu-unite.instanshu-royal:focus {
              background: #bd2df5;
              color: #fff;
            }
            .instanshu-unite.instanshu-royal:before {
              background: #a20bdd;
            }
            .instanshu-unite.instanshu-royal:after {
              background: #bd2df5;
            }

          </style>`;

	
  if(profile) {
    let dlbutton = document.createElement('a');
    dlbutton.innerHTML = ` ${css}
                <a download href=${images[0].src}>
                <button class="instanshu-unite instanshu-sm instanshu-success">Download DP</button>`;
      if(headers[0].querySelectorAll('a').length < 6) {
        headers[0].appendChild(dlbutton);
      }
  }

  else {
    // Iterate through the headers and inject a button to download corresponding image
    for(let i = 0; i<headers.length; i++) {
      let dlbutton = document.createElement('a');
      dlbutton.innerHTML = ` ${css}
                <a download href=${images[(2*i)+1].src}>
                <button class="instanshu-unite instanshu-sm instanshu-success">Download</button>`;
      if(headers[i].querySelectorAll('a').length < 3) {
        headers[i].appendChild(dlbutton);
      }
    }
  }
  
}


injectButtons();
