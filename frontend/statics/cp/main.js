function logout() {

	if(getCookie("cookiesAccepted") == "true"){
		document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
	}else{
		sessionStorage.setItem("token", null);
	}
	window.location = "/login";
}

function getCookie(cName) {
  const name = cName + "=";
  const cDecoded = decodeURIComponent(document.cookie); //to be careful
  const cArr = cDecoded.split("; ");
  let res;
  cArr.forEach((val) => {
    if (val.indexOf(name) === 0) res = val.substring(name.length);
  });
  return res;
}


async function clickSettings(){
	let token = ""
	if (getCookie("cookiesAccepted") == "true") {
		token = getCookie("token");
	  } else {
		token = sessionStorage.getItem("token");
	  }
  const name = document.getElementById("settings-name").value;
  const email = document.getElementById("settings-email").value;
  const password = document.getElementById("settings-password").value;
  const confirmPassword = document.getElementById("settings-confirm_password").value;


  if(!name || !email || !password || !confirmPassword){
    return;
  }


  if((password && !confirmPassword) || (!password && confirmPassword)){
    alert(await translateSingle("errors.passwordOrConfirmMissing"))
    return;
  }

  if((password && confirmPassword) && password != confirmPassword){
    alert(await translateSingle("errors.passwordMismatch"))
    return;
  }

  const data = {
    new_name: name,
    new_email: email,
    new_password: password,
  }

  
  let xhr = new XMLHttpRequest();
	xhr.open("POST", "/api/settings");

	xhr.setRequestHeader("Accept", "application/json");
	xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("Authorization", "Bearer " + token);

	xhr.onload = async () => {
		if(JSON.parse(xhr.responseText).message == "success"){
        alert(await translateSingle("settings.success"))
          if(getCookie("cookiesAccepted")){
            document.cookie = "token=" + JSON.parse(xhr.responseText).token   + ";expires=Fri, 31 Dec 9999 23:59:59 GMT;path = /";
          }else{
            sessionStorage.setItem("token", JSON.parse(xhr.responseText).token)
          }

        return;
    }
    alert(await translateSingle("errors.settings"))
    return;
	};
	xhr.send(JSON.stringify(data))


}