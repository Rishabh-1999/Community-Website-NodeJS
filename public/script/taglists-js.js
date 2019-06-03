$(document).ready(function() {
  initaliseTable();
});
var table;
function initaliseTable()
{
    table=$('#tagstable').DataTable({
      "processing": true,
      "serverSide": true,
      "ajax": {
        "url": "/tagTable/getTagTable",
        "type": "POST", 
      },
      "columns": [
      {
        "data" : "tagname"
      },
      {
        "data" : "createdby"
      },
      {
        "data" : "createddate"
      },
      {
        "data" : null
      },
      ],
      "columnDefs": [{
                "targets": -1,

                "render": function (data, type, row, meta) {
                    var r = row.role;
                   console.log(r);
                   data = '<button class=btn btn-sm" style="margin-top:0; background-color:#2D312C; color:#fff;" id="delete" onclick="deletetag()"><span class="fa fa-trash"></span></button>';
                   return data;
                }
            }],

    });
      $('#refresh').on('click',function(){
      table.ajax.reload(null,false)
    });
  }

function deletetag()
{
    $(document).on("click", "#delete", function() {
    d = $(this).parent().parent()[0].children;
    console.log(d[0]);
    var u=d[0];
    var obj=new Object();
    obj.tagname=d[0].innerHTML;
    obj.createdby=d[1].innerHTML;
    obj.createddate=d[2].innerHTML;
    $.confirm({
            title: 'Delete Tag!',
            content: "Are you sure you want to delete "+obj.tagname,
            buttons: {
                'Yes': {
                    btnClass: 'btn-success',
                    action: function () 
                    {
                        console.log(obj);
                        var request = new XMLHttpRequest();
                        request.open('POST','/tagTable/deletetag');
                        request.setRequestHeader("Content-Type","application/json");
                        request.send(JSON.stringify(obj));
                        table.ajax.reload(null,false)
                    }
                    },
                'No': {btnClass: 'btn-danger',}
                },
            })
    })
}
/*
loadFromServer();
function loadFromServer()
{
    var t=document.getElementById('tbody');
    tbody.innerHTML="";
    var filename = '/getTagTable';
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
            for(i in myuserArr)
            {
                addToDom(myuserArr[i]);
            }
            update_table();
        }
    }
}
function addToDom(ob)
{
    console.log(ob.tagname);
    console.log(ob.createdby);
    console.log(ob.date);
    if(1)
        {
    var row = document.createElement("tr");
    var col1 = document.createElement("td");
    var col2 = document.createElement("td");
    var col3 = document.createElement("td");
    var col4 = document.createElement("td");
    col1.setAttribute("class","text-center");
    col1.innerHTML = ob.tagname;
    col2.innerHTML = ob.createdby;
    col3.innerHTML = ob.createddate;

    col4.setAttribute("class","text-center");
    var delbtn = document.createElement("button");
    delbtn.setAttribute("class","btn btn-sm");
    delbtn.setAttribute("style","margin-top:0;background-color:#2D312C;color:#fff")
    var span = document.createElement("span");
    span.setAttribute("class","fa fa-trash");
    delbtn.appendChild(span);
    col4.appendChild(delbtn);
    row.appendChild(col1);
    row.appendChild(col2);
    row.appendChild(col3);
    row.appendChild(col4);

    tbody.appendChild(row);
            delbtn.onclick=function()
            {
            var obj1=ob;
            $.confirm({
            title: 'Delete Tag!',
            content: "Are you sure you want to delete ",
            buttons: {
                'Yes': {
                    btnClass: 'btn-success',
                    action: function () 
                    {
                        console.log(obj1);
                        var request = new XMLHttpRequest();
                        request.open('POST','/deletetag');
                        request.setRequestHeader("Content-Type","application/json");
                        request.send(JSON.stringify({_id:obj1._id}));
                    }
                    }
                },
                'No': {btnClass: 'btn-danger',}
            })
        }

            /*
                console.log("hello");
                var yes=document.getElementById("Yes");
                yes.onclick=function()
                {
                    var ob1=new Object();
                    ob1.id=ob._id;
                    ob1.del="0";
                    console.log(ob1);
                    var xhr=new XMLHttpRequest();
        xhr.open("POST","/tagdelete");
        xhr.setRequestHeader("Content-Type","application/json");
        xhr.send(JSON.stringify(ob1));
        xhr.addEventListener("load",function(event)
                            {
            if(xhr.responseText=="1")
                alert("Tag deleted Successfully");
            window.location="/taglist";
        });
                    
                }
            }
        }*/