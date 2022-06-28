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
  const name = document.getElementById("settings-name").value;
  const email = document.getElementById("settings-email").value;
  const password = document.getElementById("settings-password").value;
  const confirmPassword = document.getElementById("settings-confirm_password").value;


  if((password && !confirmPassword) || (!password && confirmPassword)){
    alert(await translateSingle("errors.passwordOrConfirmMissing"))
    return;
  }

  if((password && confirmPassword) && password != confirmPassword){
    alert(await translateSingle("errors.passwordMismatch"))
    return;
  }

  

}