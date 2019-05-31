$.trumbowyg.svgPath = '/css/trumbowyg.svg';
$('#body').trumbowyg();

var mailbtn=document.getElementById('mailbutton');

mailbtn.addEventListener("click", function()
{
  var obj=new Object();
  obj.to=document.getElementById('emailPop').value;
  obj.text=document.getElementById('body').value;
  obj.subject=document.getElementById('subject').value;

  var xml=new XMLHttpRequest();
  xml.open("POST","/sendMail");
  xml.setRequestHeader("Content-Type","application/json");
  xml.addEventListener("onload",function()
  {
  	var res=xml.responseText;
  	if(res=="true")
  		alert("Mail Sent");
  	else
  	{
  		alert("Mail failed");
  	}
  })
  xml.send(JSON.stringify(obj));
});

$(document).ready(function() {
  initaliseTable();
});


function initaliseTable()
{
	console.log('Table initalised');
    let table = $('#table').DataTable({
      "processing": true,
      "serverSide": true,
      "ajax": {
        "url": "/userTable/usersTable",
        "type": "POST", 
          "dataSrc": "data",
        "data": function( d )
        {
        	d.role = $('#role-btn').val();
        	d.status= $('#status-btn').val();
        },
      },
      "columns": [
      {
        "data" : "email"
      },
      {
        "data" : "phoneno"
      },
      {
        "data" : "city"
      },
      {
        "data" : "status"
      },
      {
        "data" : "role"
      },
      {
        "data" : ""
      },
      ],
      "columnDefs": [{
                "targets": -1,

                "render": function (data, type, row, meta) {
                    var r = row.role;
                   //console.log(r);
                   if(data.role=="SuperAdmin")
                   data = '<button class="btn btn-primary btn-sm action-btn" style="background-color:rgb(0, 0, 0)" id="mailbtnsend" data-toggle="modal" data-target="#mailModal" onclick="mailmodal()"><span class="fa fa-envelope" style="color:#fff"></span>';
                 else if(data.restrict=="false")
                  data = '<button class="btn btn-primary btn-sm action-btn" style="background-color:rgb(0, 0, 0)" id="mailbtnsend" data-toggle="modal" data-target="#mailModal" onclick="mailmodal()"><span class="fa fa-envelope" style="color:#fff"></span></button><button class="btn btn-primary btn-sm action-btn" id="editbutton" data-toggle="modal" data-target="#editModal" onclick="editmodal()"><span class="fa fa-edit" style="color:#fff"></span></button><button class="btn btn-success btn-sm action-btn"  id="activatebtn" onclick=activateUser("'+row._id+'")><span class="fa fa-check-circle" style="color:#fff"></span></button>';
                else
                  data = '<button class="btn btn-primary btn-sm action-btn" style="background-color:rgb(0, 0, 0)" id="mailbtnsend" data-toggle="modal" data-target="#mailModal" onclick="mailmodal()"><span class="fa fa-envelope" style="color:#fff"></span></button><button class="btn btn-primary btn-sm action-btn" id="editbutton" data-toggle="modal" data-target="#editModal" onclick="editmodal()"><span class="fa fa-edit" style="color:#fff"></span></button><button class="btn btn-warning btn-sm action-btn"  id="deactivatebtn" onclick=deactivateUser("'+row._id+'")><span class="fa fa-times-circle" style="color:#fff"></span></button>';
                return data;
                }
            }],

    });
    $('#role-btn').on('click',function(){
	table.ajax.reload(null,false)
});

$('#status-btn').on('click',function(){
	table.ajax.reload(null,false)
});
  $('#refresh').on('click',function(){
  table.ajax.reload(null,false)
});
  }
  

function editmodal()
{
  $(document).on("click", "#editbutton", function() {
    d = $(this).parent().parent()[0].children;
    console.log(d[0]);
    $('#eusername').val(d[0].innerHTML);
    $('#ephone').val(d[1].innerHTML);
    $('#ecity').val(d[2].innerHTML);
    document.getElementById('estatus').value=d[3].innerHTML;
    document.getElementById('erole').value=d[4].innerHTML;
  })
}

document.getElementById('eupdate').addEventListener("click",function()
{
  var obj=new Object();
  obj.email=document.getElementById('eusername').value;
  obj.phoneno=document.getElementById('ephone').value;
  obj.city=document.getElementById('ecity').value;
  obj.status=document.getElementById('estatus').value;
  obj.role=document.getElementById('erole').value;

  var xml=new XMLHttpRequest();
  xml.open("POST","/userTable/updatetodatabase");
  xml.setRequestHeader("Content-Type","application/json");
  xml.send(JSON.stringify(obj));
})

function mailmodal()
{
  $(document).on("click", "#mailbtnsend", function() {
    d = $(this).parent().parent()[0].children;
    console.log(d[0]);
    $('#emailPop').val(d[0].innerHTML);
})
}

function activateUser(v)
{
	$(document).on("click", "#activatebtn", function() {
    d = $(this).parent().parent()[0].children;
	$.confirm({
          title: 'Activate User!',
          content: 'Are you Sure you want to Deactivate ',
          theme: 'supervan',
          buttons: {
             'Yes': {
                 btnClass: 'btn-success',
                 action: function(){
                 	var ob=new Object();
                 	ob._id=v;
                  var xhr=new XMLHttpRequest();
                  xhr.open("POST","/userTable/activateUser");
                  xhr.setRequestHeader("Content-Type","application/json");
                  xhr.send(JSON.stringify(ob));
                  xhr.onload=function()
                  {

                    if(xhr.responseText=='1')
                    alert("Updated Successfully");
                  }
                  initaliseTable();
                  }
                  
                },
                'No': {btnClass: 'btn-danger',}
            }
         })
        });
}
function deactivateUser(v)
{
		$(document).on("click", "#deactivatebtn", function() {
    d = $(this).parent().parent()[0].children;
	$.confirm({
          title: 'Activate User!',
          content: 'Are you Sure you want to Deactivate ',
          theme: 'supervan',
          buttons: {
             'Yes': {
                 btnClass: 'btn-success',
                 action: function(){
                  var ob=new Object();
                 	ob._id=v;
                  var xhr=new XMLHttpRequest();
                  xhr.open("POST","/userTable/deactivateUser");
                  xhr.setRequestHeader("Content-Type","application/json");
                  xhr.send(JSON.stringify(ob));
                  xhr.onload=function()
                  {
                    if(xhr.responseText=='1')
                    alert("Updated Successfully");
                  }
                  initaliseTable();
                  }
                },
                'No': {btnClass: 'btn-danger',}
            }
         })
        });

}

function updateUser()
{
	$(document).on("click", "#mailbtnsend", function() {
    d = $(this).parent().parent()[0].children;
    console.log(d[0]);
    $('#emailPop').val(d[0].innerHTML);
	})
}
/*----------------------------------------------------------------------------------------------*/
/*

   var myuserId = 1;
var myuserArr = [];
var myuserpreviousId;
var userrole = document.getElementById("role-btn");
var userstatus = document.getElementById("status-btn");
var tbody = document.getElementById("table-body");
//loadFromServer();
function loadFromServer()
{
  tbody.innerHTML="";
    var filename = '/getTable';
    var request = new XMLHttpRequest();
    request.open('GET',filename);
    request.send();
    request.onload = function()
    {
        console.log(request.responseText);
        myuserArr = JSON.parse(request.responseText);
        if(myuserArr.length == 0)
        myuserId = 1;
        else {
            for(var i in myuserArr)
            {
                addEntryToDom(myuserArr[i]);
                //myuserpreviousId = parseInt(myuserArr[i].id)
            }
            update_table();
        }
    }
}

function update_table()
   {
     $(document).ready(function() {
       $('#users-table').DataTable();
     })
   }

function addEntryToDom(ob)
{
    console.log(ob);
    var row = document.createElement("tr");
    var col1 = document.createElement("td");
    var col2 = document.createElement("td");
    var col3 = document.createElement("td");
    var col4 = document.createElement("td");
    var col5 = document.createElement("td");
    var col6 = document.createElement("td");

    col1.innerHTML = ob.email;
    col2.innerHTML = ob.phoneno;
    col3.innerHTML = ob.city;
    col4.innerHTML = ob.status;
    col5.innerHTML = ob.role;
     col6.setAttribute("style","text-align: center");
      var b1 = document.createElement("button");
      b1.setAttribute("class","btn btn-primary btn-sm action-btn");
      b1.setAttribute("style","background-color:rgb(0, 0, 0)");
      b1.setAttribute("id","mailbutton");
      b1.setAttribute("data-toggle","modal");
      b1.setAttribute("data-target","#mailModal");
      var span1 = document.createElement("span");
      span1.setAttribute("class","fa fa-envelope")
      span1.setAttribute("style","color:#fff");
      b1.appendChild(span1);
      col6.appendChild(b1);

    if(ob.role=="Admin" || ob.role=="User")
    {
      //edit
      var b2 = document.createElement("button");
      b2.setAttribute("class","btn btn-primary btn-sm action-btn");
      b2.setAttribute("id","editbutton");
      b2.setAttribute("data-toggle","modal");
      b2.setAttribute("data-target","#editModal");
      var span2 = document.createElement("span");
      span2.setAttribute("class","fa fa-edit")
      span2.setAttribute("style","color:#fff");
      b2.appendChild(span2);
      col6.appendChild(b2);
      b2.onclick=function(){
        console.log(ob.status);
        console.log(ob.role);
        var eheading = document.getElementById("eheading");
        eheading.innerHTML=ob.email;
        var eusername = document.getElementById("eusername");
        eusername.value = ob.email;
        var ephone = document.getElementById("ephone");
        ephone.value=ob.phoneno;
        var ecity = document.getElementById("ecity");
        ecity.value=ob.city;
        var estatus = document.getElementById("estatus");
        estatus.value=ob.status;
        var erole = document.getElementById("erole");
        erole.value = ob.role;
        var ob1=new Object();
        ob1.old=eusername.value;
        
        console.log(estatus.value);
        console.log(erole.value);
        var eupdate=document.getElementById("eupdate");
        eupdate.onclick=function()
        {
          if(eusername.value==""||ephone.value==""||ecity.value==""||estatus.value==""||erole.value=="")
            alert("Please enter all values");
          else
          {
            ob1.id=ob._id;
            ob1.emailid=eusername.value;
                    ob1.phoneno=ephone.value;
                    ob1.city=ecity.value;
                    ob1.status=estatus.value;
                    ob1.role=erole.value;
                    var xhr=new XMLHttpRequest();
                    xhr.open("POST","/updatetodatabase");
                    xhr.setRequestHeader("Content-Type","application/json");
                    xhr.send(JSON.stringify(ob1));
                    xhr.onload=function()
                    {
                      if(xhr.responseText=='1')
                      alert("Updated Successfully");
                    }
          }         
        }
      }
    
      if(ob.restrict=="false")
      {
        var b3 = document.createElement("button");
        b3.setAttribute("class","btn btn-success btn-sm action-btn");
        var span3 = document.createElement("span");
        span3.setAttribute("class","fa fa-check-circle")
        span3.setAttribute("style","color:#fff");
        b3.appendChild(span3);
        col6.appendChild(b3);
        b3.addEventListener("click", function(){
         
      }
      else
      {
        var b4 = document.createElement("button");
        b4.setAttribute("class","btn btn-warning btn-sm action-btn");
        var span4 = document.createElement("span");
        span4.setAttribute("class","fa fa-times-circle")
        span4.setAttribute("style","color:#fff");
        b4.appendChild(span4);
        col6.appendChild(b4);
        b4.addEventListener("click", function(){
          $.confirm({
          title: 'Deactivate User!',
          content: 'Are you Sure you want to Deactivate "'+ob.name+'"',
          theme: 'supervan',
          buttons: {
             'Yes': {
                 btnClass: 'btn-success',
                 action: function(){
                    var xml=new XMLHttpRequest();
                    xml.open("POST","/deactivateUser");
                    xml.setRequestHeader("Content-Type","application/json");
                    xml.send(JSON.stringify({id: ob._id}));
                      loadFromServer();
                  }
                },
                'No': {btnClass: 'btn-danger',}
         }
        });
        })
      }
    }
    row.appendChild(col1);
    row.appendChild(col2);
    row.appendChild(col3);
    row.appendChild(col4);
    row.appendChild(col5);
    row.appendChild(col6);
    tbody.appendChild(row);
}*/