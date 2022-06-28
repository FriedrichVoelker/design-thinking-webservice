function recompose(obj, string) {
	var parts = string.split('.');
	var newObj = obj ? obj[parts[0]] : null;
	if (parts[1]) {
	  parts.splice(0, 1);
	  var newString = parts.join('.');
	  return recompose(newObj, newString);
	}
	return newObj;
  }
async function translate(){
	const lang =  getCookie("cookiesAccepted") ? getCurrentLanguage() : (sessionStorage.getItem("language") ? sessionStorage.getItem("language") : "en")
	const translateables = document.querySelectorAll("[translate]");

	let resp = await fetch("/lang/" + lang + ".json")
	if(resp.ok){
		const languageobj = await resp.json()
		translateables.forEach(el => {
			let msg = el.attributes.translate ? el.attributes.translate.value : null
			el.innerText = getTranslation(languageobj, msg)
			// el.removeAttribute("translate");
		})
		resizeScreen()
	}else{
		console.error("Couldnt fetch language file")
	}
	if(document.getElementById("checkout-amount")){
		document.getElementById("checkout-amount").value = (sessionStorage.getItem("order-amount") *1 )
	}
}

async function translateSingle(word){
	let lang = (getCookie("cookiesAccepted") ? (getCookie("language") ? getCookie("language") : "en") : (sessionStorage.getItem("language") ? sessionStorage.getItem("language") : "en"))
	let resp = await fetch("/lang/" + lang + ".json")
	if(resp.ok){
		const languageobj = await resp.json()
			return getTranslation(languageobj, word)
	}else{
		console.error("Couldnt fetch language file")
	}
}

function getTranslation(translations, key){
	return recompose(translations,key) ? recompose(translations,key) : key 
}

function getCurrentLanguage(){
	const allowedLanguages = ["de", "en"]
	if(!getCookie("language")){
		// localStorage.setItem("language", "en")
		document.cookie = "language=en"
	}
	let currlang = getCookie("language")
	allowedLanguages.includes(currlang.toLowerCase()) ? "" : currlang = "en" && (document.cookie = "language=en")
	return getCookie("language")
}

async function loadHeader(){
	let resp = await fetch("/statics/templates/cp/header.html")
	if(resp.ok){
		document.body.innerHTML = await resp.text() + document.body.innerHTML
	}else{
		console.error("Template header not found")
	}
	return Promise.resolve()
}

async function loadFooter(){
	let resp = await fetch("/statics/templates/cp/footer.html")
	if(resp.ok){
		document.body.innerHTML = document.body.innerHTML +  await resp.text() 
		resizeScreen()
	}else{
		console.error("Template footer not found")
	}
	return Promise.resolve()
}


async function setup(){
	await loadHeader()
	await loadFooter()
	translate()
	document.getElementById('lang').value = getCookie("cookiesAccepted") ? (getCookie("language") ? getCookie("language") : "en") : (sessionStorage.getItem("language") ? sessionStorage.getItem("language") : "en")
}

function getCookie(cName) {
	const name = cName + "=";
	const cDecoded = decodeURIComponent(document.cookie); //to be careful
	const cArr = cDecoded.split('; ');
	let res;
	cArr.forEach(val => {
	  if (val.indexOf(name) === 0) res = val.substring(name.length);
	})
	return res
  }



  
setup()

window.addEventListener('resize', function(event) {
	if(!(document.documentElement.scrollHeight > document.body.clientHeight)){
		try{
		  document.getElementById("footer").classList.add("sticky")
		  document.getElementById("footer").classList.remove("stayBottom")
		}catch(e){}
	  }else{
		try{
		document.getElementById("footer").classList.add("stayBottom")
		document.getElementById("footer").classList.remove("sticky")
		}catch(e){}
	  }
}, true);

function resizeScreen(){
	if(!(document.documentElement.scrollHeight > document.body.clientHeight)){
		try{
		  document.getElementById("footer").classList.add("sticky")
		  document.getElementById("footer").classList.remove("stayBottom")
		}catch(e){}
	  }else{
		try{
		document.getElementById("footer").classList.add("stayBottom")
		document.getElementById("footer").classList.remove("sticky")
		}catch(e){}
	  }
}
