var go;
document.getElementById('btnaddUser').addEventListener('click', function () {
	if (document.getElementById('adduser-name').value == "" ||
		document.getElementById('adduser-email').value == "" ||
		document.getElementById('adduser-password').value == "" ||
		document.getElementById('adduser-phoneno').value == "" ||
		document.getElementById('adduser-city').value == "") {
		document.getElementById("avilability").value = "Enter field first"
	} else {
		var obj = new Object();
		obj.name = document.getElementById('adduser-name').value;
		obj.email = document.getElementById('adduser-email').value;
		obj.password = document.getElementById('adduser-password').value;
		obj.phoneno = document.getElementById('adduser-phoneno').value;

		if (obj.phoneno.length < 10) {
			alert('Phoneno less than 10');
			return;
		}

		obj.city = document.getElementById('adduser-city').value;

		var i = document.getElementById("addUser-select").selectedIndex;
		obj.role = document.getElementById("addUser-select").options[i].text;

		var xml = new XMLHttpRequest();
		xml.open("POST", "/userTable/addUserToDataBase");
		xml.setRequestHeader("Content-Type", "application/json");
		xml.addEventListener('load', function () {
			var res = xml.responseText;;
			console.log(res)
			if (res == "true") {
				alert("Account Created in Name of \"" + document.getElementById('adduser-name').value + "\"");
				go = false;
				window.location.reload();
			} else {
				alert("Failed to create Account");
			}
		})
		xml.send(JSON.stringify(obj));
	}
})

function checkDuplicate() {
	if (document.getElementById('adduser-email').value == "") {
		document.getElementById('email_available').innerHTML = '<i class="fa fa-times-circle"></i> Enter Email Id first';
		document.getElementById('email_available').style = "color: red;"
		return;
	}
	var xml = new XMLHttpRequest();
	xml.open("POST", "/userTable/checkDuplicate");
	xml.setRequestHeader("Content-Type", "application/json");
	xml.send(JSON.stringify({
		email: document.getElementById('adduser-email').value
	}));
	xml.addEventListener('load', function () {
		var d = xml.responseText;
		if (d == "true") {
			document.getElementById('email_available').innerHTML = '<i class="fa fa-times-circle"></i> User already exists';
			document.getElementById('email_available').style = "color: orange;"
			go = "false";
		} else {
			document.getElementById('email_available').innerHTML = '<i class="fa fa-check"></i> Available';
			document.getElementById('email_available').style = "color: green;"
			go = "true";
		}
	})
}

function validateEmail(email) {
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}

function checkEmail() {
	if (validateEmail(document.getElementById('adduser-email').value))
		return false;
	else
		return true;
}