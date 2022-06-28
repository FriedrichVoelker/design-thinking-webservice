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

function returnTranslation(lang, key){

	const allowedLanguages = ["en", "de"]

	if(!allowedLanguages.includes(lang.toLowerCase())){
		lang = "en"
	}

	const langObj = require("./" + lang.toLowerCase() + ".json")
	return recompose(langObj, key) ? recompose(langObj, key) : key;
}

module.exports = {returnTranslation}