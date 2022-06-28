async function verify(){
	let token = ""
	if(getCookie("cookiesAccepted") == "true"){
		token = getCookie("token")
	}else{
		token = sessionStorage.getItem("token")
	}

	if( window.location.pathname != "/login" && (token == "" || token == null)){
		window.location = "/login"
		return;
	}
	let xhr = new XMLHttpRequest();
	xhr.open("POST", "/api/checkAuth");
	xhr.setRequestHeader("Accept", "application/json");
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.setRequestHeader("Authorization", "Bearer " + token);
	xhr.onload = () => {
		if(window.location.pathname != "/login" && JSON.parse(xhr.responseText).message != "Successfully logged in"){
			window.location = "/login"
			return;
		}
		if(window.location.pathname == "/login" && JSON.parse(xhr.responseText).message == "Successfully logged in"){
			window.location = "/controlpanel"
			return;
		}
	}
	xhr.send();
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

  verify()