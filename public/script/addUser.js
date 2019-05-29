var submit=document.getElementById('btnaddUser');
var go;
submit.addEventListener('click',function()
{
	if(go=="true")
	{
	var obj=new Object();
	obj.name=document.getElementById('adduser-name').value;
	obj.email=document.getElementById('adduser-email').value;
	obj.password=document.getElementById('adduser-password').value;
	obj.phoneno=document.getElementById('adduser-phoneno').value;
	obj.city=document.getElementById('adduser-city').value;

	var i = document.getElementById("addUser-select").selectedIndex;
	obj.role = document.getElementById("addUser-select").options[i].text;
	console.log(obj)
	var xml=new XMLHttpRequest();
		xml.open("POST","/addUserToDataBase");
		xml.addEventListener('load', function()
		{
			window.location='/addUser';
		})
		xml.setRequestHeader("Content-Type", "application/json");
		xml.send(JSON.stringify(obj));
	}
	else
		alert('Email Already Exsists');
})
function checkDuplicate()
{
		var email=document.getElementById('adduser-email');
		var xml=new XMLHttpRequest();
		xml.open("POST","/checkDuplicate");
		xml.setRequestHeader("Content-Type", "application/json");
		var ob=new Object();
		ob.email=email.value;
		console.log("Hello world")
		console.log(ob.email)
		xml.send(JSON.stringify(ob));
		xml.addEventListener('load', function()
		{

			var d=xml.responseText;
			console.log(d);
			document.getElementById('alert-div-avilability').style.display="block";
			if(d=="true")
			{
				document.getElementById('avilability').innerHTML="User "+email.value+" is already exist";
				go="false";
			}
			else
			{
				document.getElementById('avilability').innerHTML=email.value+" is available";
				go="true";
			}
			
		})
		console.log(email.value);
}