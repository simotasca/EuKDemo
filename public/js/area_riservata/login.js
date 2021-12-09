function login(email,password,callback){
  fetch("http://www.eurokosher.it/api/EUK_API_autent_auditor.asp?utente="+email+"&pswd="+password)
  .then(result => result.json()).then(json => {
    if(json.length == 0){
      callback(null);
    }else{
      callback(json[0]);
    }
  }).catch(err =>{
    callback(null);
  })
}
