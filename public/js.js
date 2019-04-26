var username=document.getElementById("username");
var password=document.getElementById("password");
var submit=document.getElementById("submit");
submit.addEventListener("click",function()
{
	if(!username.value=="" && !password.value=="")
	{
	var xml=new XMLHttpRequest();
	xml.open("POST","/checkLogin");
	xml.addEventListener('load', function()
		{
			var data=xml.responseText;
			console.log(data);
			if(data==="true")
			{
				
				window.location='/main';

			}
			else
				console.log('getout');
		})
	xml.setRequestHeader("Content-Type", "application/json");
	xml.send(JSON.stringify({username: username.value,password: password.value}));
	}
	else
		alert('Enter Value');
})
