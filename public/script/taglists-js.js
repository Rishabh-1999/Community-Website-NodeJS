$(document).ready(function() {
  initaliseTable();
});
var table;
function initaliseTable()
{
    table=$('#tagstable').DataTable({
      "processing": true,
      "serverSide": true,
      "dataSrc":"",
      "ajax": {
        "url": "/tagTable/getTagTable",
        "type": "POST", 

        "data": function ( d )
              {
                d.customsearch=$('div.dataTables_filter input').val();
              }, 
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
                   data = '<button class=btn btn-sm" style="margin-top:0; background-color:#2D312C; color:#fff;" id="delete" onclick="deletetag()"><span class="fa fa-trash"></span></button>';
                   return data;
                }
            }],
    });
      $('#refresh').on('click',function(){
      table.ajax.reload(null,false)
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
