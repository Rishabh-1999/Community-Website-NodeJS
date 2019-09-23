$(document).ready(function() {
  initaliseTable();
})
var table;

// document.getElementById("CommunityRuleFilter").addEventListener("change",function()
// {
//   initaliseTable();
// })

function initaliseTable(){
      table = $('#communitytable').DataTable({
      "processing": true,
      "serverSide": true,
      "dataSrc":"",
      "ajax": {
        "url": "/communityTable/getCommunityLists",
        "type": "POST",
       
        "data": function ( d )
              {
                d.status   = $('#CommunityRuleFilter').val();
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
                  let addadatetoinfo = "addadatetoinfo(\'" + data.description + "\')";
                   data = '<a id="editComm" class="btn btn-sm editbtn actionbtns" onclick=addToEdit("'+row.status+'","'+row.name+'","'+row._id+'") data-toggle="modal" data-target="#updateCommunity" style="margin-top:35px;margin-right:5px;background-color: #2D312C;color: #fff"><span class="fa fa-edit"></span></a><a id="btninfomation" class="btn btn-sm infobtn actionbtns" data-toggle="modal" data-target="#CommunityInfo" onclick=\"' + addadatetoinfo +'\" style="margin-top:35px;background-color: #2D312C;color: #fff"><span class="fa fa-info"></span></a>';
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


        $('#CommunityRuleFilter').on('click', function () {
        table.ajax.reload(null, false);
      });
  }
var gd;

  function addadatetoinfo(desc)
  {
    console.log(desc)
    // document.getElementById("CommunityProfilePic").src=photoloc;
    // document.getElementById("CommunityInfoPop").innerHTML="Community " + name;
    // document.getElementById("communityDesc").innerHTML=desc;

    $(document).on("click", "#btninfomation", function()
    {
        let d = $(this).parent().parent()[0].children;
        document.getElementById("CommunityInfoPop").innerHTML = d[0].innerHTML;
        document.getElementById("communityDesc").innerHTML = desc;
        document.getElementById("CommunityProfilePic").src= d[6].lastChild.currentSrc;
    });
  }

  function addToEdit(status,name,d)
  {
     gd=d;
    // document.getElementById("CommuityName").value=name;
    // document.getElementById("communityStatus").value=status;
    $(document).on("click", "#editComm", function() {
      let d = $(this).parent().parent()[0].children;
      document.getElementById("commNameinedit").innerHTML ="Commuity Name: "+ d[0].innerHTML;
      document.getElementById("CommuityName").value = d[0].innerHTML;
      document.getElementById("communityStatus").value=status;
  });
  }

  document.getElementById("editsubmit").addEventListener("click",function()
  {
    var obj=new Object();
    obj.id=gd;
    obj.name=$("#CommuityName").val();
    obj.status=$("#communityStatus").val();
    console.log(obj);
    var xml=new XMLHttpRequest();
    xml.open("POST","/communityTable/communityupdate");
    xml.onload=function()
                  {
                    if(xml.responseText=='true')
                      alert("Data updated");
                    table.ajax.reload(null, false);
                  }
    xml.setRequestHeader("Content-Type","application/json");
    table.ajax.reload(null, false);
    xml.send(JSON.stringify(obj));
  })