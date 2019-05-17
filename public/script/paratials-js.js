function openHome()
{
	var xml=new XMLHttpRequest();
	xml.open("GET","/home");
	xml.send();
}
function openAddUser()
{
	var xml=new XMLHttpRequest();
	xml.open("GET","/addUser");
	xml.send();
}
function logout()
{
	var xml=new XMLHttpRequest();
	xml.open("GET","/logout");
	xml.addEventListener('load', function()
	{
		window.location='/'
	})
	xml.send();
}
function openTable()
{
	var xml=new XMLHttpRequest();
	xml.open("GET","/table");
	xml.send();
}