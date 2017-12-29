(function() {

	headers = document.querySelectorAll('header');

	images = document.querySelectorAll('img');

	for(let i = 0; i<headers.length; i++) {
		let instanshu = document.createElement('a');
		instanshu.innerHTML = `<a download href=${images[(2*i)+1].src}><button>Download</button>`;
		if(headers[i].querySelectorAll('a').length < 3) {
			headers[i].appendChild(instanshu);
		}
	}

})();