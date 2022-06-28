function changeLanguage(){
	let lang = document.getElementById("lang").value
	// localStorage.setItem("language", lang)
	
	if(getCookie("cookiesAccepted")){
		document.cookie = "language=" + lang + ";expires=Fri, 31 Dec 9999 23:59:59 GMT";
	}else{
		sessionStorage.setItem("language", lang)
	}
	translate()
}
window.addEventListener('resize', function(event) {
	if(!(document.documentElement.scrollHeight > document.documentElement.clientHeight)){
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


function checkAllowedCookies(){

	if(!getCookie("cookiesAccepted") && !sessionStorage.getItem("tempcookie")){
		document.write(`
			<div id="cookiepopup" class="cookiepopup">
				<h3 translate="cookies.header"></h3>
				<span translate="cookies.warning"></span> <br> 
				<span translate="cookies.seeusage"></span>&nbsp;<a href="/privacy" translate="footer.privacy"></a><br><br>
				<a onclick="declineCookies()" class="cookiebutton" translate="cookies.decline"></a>&nbsp;&nbsp;
				<a onclick="acceptCookies()" class="cookiebutton" translate="cookies.understand"></a>
			</div>
					`)

	}

}

async function declineCookiesLater(){
	document.cookie = "cookiesAccepted=false;max-age=0"
	alert(await translateSingle("cookies.declined"))
}

function acceptCookies(){
	document.cookie = "cookiesAccepted=true;expires=Fri, 31 Dec 9999 23:59:59 GMT"
	// alert("Cookies Accepted")
	document.getElementById("cookiepopup").remove()
}

function declineCookies(){
	sessionStorage.setItem("tempcookie", "declined");
	document.getElementById("cookiepopup").remove()
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

  checkAllowedCookies()


function clickOrder(){
	let amount = document.getElementById("order-amount-input").value
	if(amount == null || amount < 1){
		return;
	}
	sessionStorage.setItem("order-amount", amount)
	window.location = "/checkout"
}

function changeOrderAmountInput(){
	let amount = document.getElementById("order-amount-input").value
	let btn = document.getElementById("order-button")
	if(amount == null || amount < 1){
		try{
			btn.classList.add("disabled")
		}catch(e){}
		return;
	}
	try{
		btn.classList.remove("disabled")
	}catch(e){}

}

async function submitCheckout(){
	const name = document.getElementById("checkout-name").value;
	const email = document.getElementById("checkout-email").value;
	const amount = document.getElementById("checkout-amount").value;
	if(!name || !email || !amount){
		alert(await translateSingle("errors.checkout"))
		return
	}

	if(!email.match("^[^@]+@[^@]+\.[^@]+$")){
		alert(await translateSingle("errors.noValidEmail"))
		return;
	}

	let xhr = new XMLHttpRequest();
	xhr.open("POST", "/api/preorder");

	xhr.setRequestHeader("Accept", "application/json");
	xhr.setRequestHeader("Content-Type", "application/json");

	xhr.onload = () => {
		console.log(JSON.parse(xhr.responseText))
		if(JSON.parse(xhr.responseText).message == "success"){
			window.location = "/"
			alert(translateSingle(""))
		}
	};


	let data = {
		name: name,
		email: email,
		amount: amount*1,
		lang: (getCookie("cookiesAccepted") ? (getCookie("language") ? getCookie("language") : "en") : (sessionStorage.getItem("language") ? sessionStorage.getItem("language") : "en"))
	}

	xhr.send(JSON.stringify(data));


}


async function clickLogin(){
	const password = document.getElementById("login-password").value;
	const email = document.getElementById("login-email").value;
	if(!email || !password){
		alert(await translateSingle("errors.login.missing"))
		return
	}

	let xhr = new XMLHttpRequest();
	xhr.open("POST", "/api/login");

	xhr.setRequestHeader("Accept", "application/json");
	xhr.setRequestHeader("Content-Type", "application/json");

	xhr.onload = async () => {
		if(JSON.parse(xhr.responseText).message == "loggedin"){
			if(getCookie("cookiesAccepted")){
				document.cookie = "token=" + JSON.parse(xhr.responseText).data.token  + ";expires=Fri, 31 Dec 9999 23:59:59 GMT";
			}else{
				sessionStorage.setItem("token", JSON.parse(xhr.responseText).data.token)
			}
			window.location = "/controlpanel"
			return;
		}
		alert(await translateSingle("errors.login.wrong"))
		
	};
	xhr.send(JSON.stringify({email:email, password:password}))

}