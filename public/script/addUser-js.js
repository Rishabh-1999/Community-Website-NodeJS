var submit=document.getElementById('btnaddUser');
submit.addEventListener('click',function()
{
	var obj=new Object();
	obj.name=document.getElementById('adduser-name').value;
	obj.email=document.getElementById('adduser-email').value;
	obj.password=document.getElementById('adduser-password').value;
	obj.phoneno=document.getElementById('adduser-phoneno').value;
	obj.city=document.getElementById('adduser-city').value;

	var i = x.selectedIndex;
	obj.role = document.getElementById("mySelect").options[i].text;
	console.log(obj)
	var xml=new XMLHttpRequest();
		xml.open("POST","/addUserToDataBase");
		xml.addEventListener('load', function()
		{
		})
		xml.send(JSON.stringify({email: obj.email,password: obj.password,name: obj.name,
			phoneno: obj.phoneno,city: obj.city,role:obj.role}));
})
var