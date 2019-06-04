$(document).ready(function() {
  initaliseTable();
})
function initaliseTable(){
     let table = $('#communitytable').DataTable({
      "processing": true,
      "serverSide": true,
      "dataSrc":"",
      "ajax": {
        "url": "/superadmincommunityTable/getCommunityLists",
        "type": "POST",
       
        "data": function ( d )
              {
                d.rule   = $('#CommunityRuleFilter').val();
                d.customsearch=$('div.dataTables_filter input').val();
              }, 
      },
      "columns": [
      {
        "data" : "name"
      },
      {
        "data" : "rule"
      },
      {
        "data" : "communityloc"
      },
      {
        "data" : "owner"
      },
      {
        "data" : "createdate"
      },
      {
        "data" : null,
        "orderable" : "false"
      },
      {
        "data" : null,
        "orderable" : "false"
      },
      ],
      "columnDefs": [{
                "targets": -2,

                "render": function (data, type, row, meta) {
                   data = '<a class="btn btn-sm editbtn actionbtns" onclick=addToEdit("'+row.status+'","'+row.name+'","'+row._id+'") data-toggle="modal" data-target="#updateCommunity" style="margin-top:35px;margin-right:5px;background-color: #2D312C;color: #fff"><span class="fa fa-edit"></span></a><a class="btn btn-sm infobtn actionbtns" data-toggle="modal" data-target="#CommunityInfo" onclick=addadatetoinfo("'+row.photoloc+'","'+row.name+'","'+row.description+'") style="margin-top:35px;background-color: #2D312C;color: #fff"><span class="fa fa-info"></span></a>';
                return data;
                }},
              
{
                "targets": -1,

                "render": function (data, type, row, meta) {
             
                   if(row.status=="Active")
                      data ='<img src='+ row.photoloc +' style="width: 80px;height: 80px;border: 4px solid green;">';
                  else
                     data ='<img src='+row.photoloc+' style="width: 80px;height: 80px;border: 4px solid red;">';
                return data;
                }
            }],

    });

     $('#refresh').on('click', function () {
        table.ajax.reload(null, false);
       });


        $('#statusbtn').on('click', function () {
        table.ajax.reload(null, false);
      });
  }
var gd;

  function addadatetoinfo(photoloc,name,desc)
  {
    console.log(photoloc)
    document.getElementById("CommunityProfilePic").src=photoloc;
    document.getElementById("CommunityInfoPop").innerHTML="Community " + name;
    document.getElementById("communityDesc").innerHTML=desc;
  }

    function addToEdit(status,name,d)
  {
    gd=d;
    document.getElementById("CommuityName").value=name;
    document.getElementById("communityStatus").value=status;
  }



  document.getElementById("editsubmit").addEventListener("click",function()
  {
    var obj=new Object();
    obj.id=gd;
    obj.name=$("#CommuityName").val();
    obj.status=$("#communityStatus").val();
    console.log(obj);
    var xml=new XMLHttpRequest();
    xml.open("POST","/superadmincommunityTable/communityupdate");
    xml.onload=function()
                  {
                    if(xml.responseText=='true')
                      alert("Data updated");
                  }
    xml.setRequestHeader("Content-Type","application/json");
    xml.send(JSON.stringify(obj));
  })