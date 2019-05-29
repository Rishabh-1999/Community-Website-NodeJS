var table=document.getElementById('table');
function getFullDataTable()
{
	var xml=new XMLHttpRequest();
	xml.open("GET","/getFullDataTable");
	xml.addEventListener('load', function()
	{
		var da=[];
		da=JSON.stringify(xml.responseText);
		console.log(da);
		/*table.innerHTML="";
		for(var i=0;i<da.length;i++)
		{
			addToTableDOM(da[i]);
		}
	})*/
	xml.send();
}
function addToTableDOM(obj)
{
	var tr=document.createElement('tr');
	var td1=document.createElement('td');
	td1.innerHTML=obj.name;
	tr.appendChild(td1);
	var td2=document.createElement('td');
	td2.innerHTML=obj.phone;
	tr.appendChild(td2);
	var td3=document.createElement('td');
	td3.innerHTML=obj.city;
	tr.appendChild(td3);
	var td4=document.createElement('td');
	t4.innerHTML="NULL";
	tr.appendChild(td4);
	var td5=document.createElement('td');
	td5.innerHTML=obj.role;
	tr.appendChild(td5);
	var td6=document.createElement('td');
	td6.innerHTML="Nk";
	tr.appendChild(td6);
	table.appendChild(tr);
}
var logout=document.getElementById("logout");
      logout.setAttribute("data-toggle","modal");
    logout.setAttribute("data-target","#delModal1");
    var yas=document.getElementById("log");
    yas.onclick=function()
    {
        location.href="/login.html";
    }