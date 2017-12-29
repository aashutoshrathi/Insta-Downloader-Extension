function injectButtons() {

	// Grab header elements in each post
	headers = document.querySelectorAll('header');

	// Grab images appearing on the page
	images = document.querySelectorAll('img');

	// Iterate through the headers and inject a button to download corresponding image
	for(let i = 0; i<headers.length; i++) {
		let dlbutton = document.createElement('a');
		dlbutton.innerHTML = `<a download href=${images[(2*i)+1].src}><button>Download</button>`;
		if(headers[i].querySelectorAll('a').length < 3) {
			headers[i].appendChild(dlbutton);
		}
	}
}

injectButtons();
