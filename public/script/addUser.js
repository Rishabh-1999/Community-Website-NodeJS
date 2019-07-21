var go;
document.getElementById('btnaddUser').addEventListener('click',function() {

	if(document.getElementById('adduser-name').value=="" ||
		document.getElementById('adduser-email').value=="" ||
		document.getElementById('adduser-password').value=="" ||
		document.getElementById('adduser-phoneno').value=="" ||
		document.getElementById('adduser-city').value=="")
			alert('Fill the Required Field');
	else if(go!="true")
		alert('Email Already Exsists');
	else if( document.getElementById('adduser-name').value!="" &&
		document.getElementById('adduser-email').value!="" &&
		document.getElementById('adduser-password').value!="" &&
		document.getElementById('adduser-phoneno').value!="" &&
		document.getElementById('adduser-city').value!="")
	{
	var obj=new Object();
	obj.name=document.getElementById('adduser-name').value;
	obj.email=document.getElementById('adduser-email').value;
	obj.password=document.getElementById('adduser-password').value;
	obj.phoneno=document.getElementById('adduser-phoneno').value;
	obj.city=document.getElementById('adduser-city').value;

	var i = document.getElementById("addUser-select").selectedIndex;
	obj.role = document.getElementById("addUser-select").options[i].text;
	var xml=new XMLHttpRequest();
		xml.open("POST","/userTable/addUserToDataBase");
		xml.setRequestHeader("Content-Type", "application/json");
		xml.send(JSON.stringify(obj));
		
		var ob=new Object();
  		ob.to=document.getElementById('adduser-email').value;
  		ob.text="Welcome to cq Community "+ document.getElementById('adduser-name').value+" Your password is "+document.getElementById('adduser-password').value+".Thank You";
  		ob.subject="Welcome to cq";

		var x=new XMLHttpRequest();
		
		x.open("POST","/sendMail");
		x.setRequestHeader("Content-Type","application/json");
	  	x.addEventListener('onload', function()
	  	{
			window.location='/addUser';
	  	})
	  	
	  	x.send(JSON.stringify(ob));
	  	console.log(ob);
	  	
	}
})
function checkDuplicate() {
		var email=document.getElementById('adduser-email');
		var xml=new XMLHttpRequest();
		xml.open("POST","/userTable/checkDuplicate");
		xml.setRequestHeader("Content-Type", "application/json");
		var ob=new Object();
		ob.email=document.getElementById('adduser-email').value;
		xml.send(JSON.stringify(ob));
		xml.addEventListener('load', function()
		{
			var d=xml.responseText;
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
}