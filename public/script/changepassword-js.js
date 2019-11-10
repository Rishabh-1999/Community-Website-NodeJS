document.getElementById("submit").addEventListener("click", function (event) {
  var oldpassword = document.getElementById("old");
  var newpassword = document.getElementById("new");
  if (oldpassword.value == "" || newpassword.value == "")
    alert("Please Enter Value");
  else {
    var ob = new Object();
    ob.oldpass = oldpassword.value;
    ob.newpass = newpassword.value;
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/userTable/changePassword");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(ob));
    xhr.addEventListener("load", function (event) {
      console.log(xhr.responseText);
      if (xhr.responseText == "false")
        alert("Incorrect old password");
      else
        alert("Password Changed Successfully");
    });
  }
});