$.trumbowyg.svgPath = '/css/trumbowyg.svg';
$('#body').trumbowyg();

var mailbtn = document.getElementById('mailbutton');

mailbtn.addEventListener("click", function () {
  var obj = new Object();
  obj.to = document.getElementById('emailPop').value;
  obj.text = strip_html_tags(document.getElementById('body').value);
  obj.subject = document.getElementById('subject').value;

  var xml = new XMLHttpRequest();
  xml.open("POST", "/sendMail");
  xml.setRequestHeader("Content-Type", "application/json");
  xml.addEventListener("load", function () {
    var res = xml.responseText;
    if (res == "true")
      alert("Mail Sent");
    else
      alert("Mail Failed");
  })
  xml.send(JSON.stringify(obj));
});

$(document).ready(function () {
  initaliseTable();
})

var table;

function initaliseTable() {
  table = $('#usertable').DataTable({
    "processing": true,
    "serverSide": true,
    "dataSrc": "",
    "ajax": {
      "url": "userTable/usersTable",
      "type": "POST",
      "data": function (d) {
        d.role = $('#rolebtn').val();
        d.status = $('#statusbtn').val();
        d.customsearch = $('div.dataTables_filter input').val();
      },
    },
    "columns": [{
        "data": "email",
        orderable: true
      },
      {
        "data": "phoneno",
        orderable: false
      },
      {
        "data": "city"
      },
      {
        "data": "status"
      },
      {
        "data": "role"
      },
      {
        "data": null,
        "orderable": false
      },
    ],
    "columnDefs": [{
      "targets": -1,
      "render": function (data, type, row, meta) {
        var r = row.role;
        if (data.role == "SuperAdmin")
          data = '<button class="btn btn-primary btn-lg action-btn" style="background-color:rgb(0, 0, 0)" id="mailbtnsend" data-toggle="modal" data-target="#mailModal" onclick="mailmodal()"><span class="fa fa-envelope" style="color:#fff"></span>';
        else if (data.restrict == "false")
          data = '<button class="btn btn-primary btn-lg action-btn" style="background-color:rgb(0, 0, 0)" id="mailbtnsend" data-toggle="modal" data-target="#mailModal" onclick="mailmodal()"><span class="fa fa-envelope" style="color:#fff"></span></button><button class="btn btn-primary btn-lg action-btn" id="editbutton" data-toggle="modal" data-target="#editModal" onclick="editmodal()"><span class="fa fa-edit" style="color:#fff"></span></button><button class="btn btn-success btn-lg action-btn"  id="activatebtn" onclick=activateUser("' + row._id + '")><span class="fa fa-check-circle" style="color:#fff"></span></button>';
        else
          data = '<button class="btn btn-primary btn-lg action-btn" style="background-color:rgb(0, 0, 0)" id="mailbtnsend" data-toggle="modal" data-target="#mailModal" onclick="mailmodal()"><span class="fa fa-envelope" style="color:#fff"></span></button><button class="btn btn-primary btn-lg action-btn" id="editbutton" data-toggle="modal" data-target="#editModal" onclick="editmodal()"><span class="fa fa-edit" style="color:#fff"></span></button><button class="btn btn-warning btn-lg action-btn"  id="deactivatebtn" onclick=deactivateUser("' + row._id + '")><span class="fa fa-times-circle" style="color:#fff"></span></button>';
        return data;
      }
    }],
  });

  $('#refreshbtn').on('click', function () {
    table.ajax.reload(null, false);
  });
  $('#statusbtn').on('click', function () {
    table.ajax.reload(null, false);
  });
  $('#rolebtn').on('click', function () {
    table.ajax.reload(null, false);
  });
  $('#userlist-icon').on('click', function () {
    table.ajax.reload(null, false);
  });
}

function editmodal() {
  $(document).on("click", "#editbutton", function () {
    d = $(this).parent().parent()[0].children;
    $('#eusername').val(d[0].innerHTML);
    $('#ephone').val(d[1].innerHTML);
    $('#ecity').val(d[2].innerHTML);
    $('#erole').val(d[4].innerHTML);
    document.getElementById('estatus').value = d[3].innerHTML;
  })
}

document.getElementById('eupdate').addEventListener("click", function () {
  var obj = new Object();
  obj.email = document.getElementById('eusername').value;
  obj.phoneno = document.getElementById('ephone').value;
  obj.city = document.getElementById('ecity').value;
  obj.status = document.getElementById('estatus').value;
  obj.role = document.getElementById('erole').value;

  var xml = new XMLHttpRequest();
  xml.open("POST", "/userTable/updatetodatabase");
  xml.setRequestHeader("Content-Type", "application/json");
  xml.send(JSON.stringify(obj));
  xml.onload = function () {
    var d = xml.responseText;
    if (d == "true")
      alert("Data Updated");
    else
      alert("Failed to Update")
  }
  table.ajax.reload(null, false)
})

function mailmodal() {
  $(document).on("click", "#mailbtnsend", function () {
    d = $(this).parent().parent()[0].children;
    $('#emailPop').val(d[0].innerHTML);
  })
}

function activateUser(v) {
  $(document).on("click", "#activatebtn", function () {
    d = $(this).parent().parent()[0].children;
    $.confirm({
      title: 'Activate User!',
      content: 'Are you Sure you want to Deactivate ',
      theme: 'supervan',
      buttons: {
        'Yes': {
          btnClass: 'btn-success',
          action: function () {
            var ob = new Object();
            ob._id = v;
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "/userTable/activateUser");
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(JSON.stringify(ob));
            xhr.onload = function () {
              table.ajax.reload(null, false)
              if (xhr.responseText == 'true')
                alert("Activated Successfully");
              else
                alert("Failed");
            }
          }
        },
        'No': {
          btnClass: 'btn-danger',
        }
      }
    })
  });
}

function deactivateUser(v) {
  $(document).on("click", "#deactivatebtn", function () {
    d = $(this).parent().parent()[0].children;
    $.confirm({
      title: 'Activate User!',
      content: 'Are you Sure you want to Deactivate ',
      theme: 'supervan',
      buttons: {
        'Yes': {
          btnClass: 'btn-success',
          action: function () {
            var ob = new Object();
            ob._id = v;
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "/userTable/deactivateUser");
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(JSON.stringify(ob));
            xhr.onload = function () {
              table.ajax.reload(null, false);
              if (xhr.responseText == 'true')
                alert("Deactivated Successfully");
              else
                alert("Failed");
            }
          }
        },
        'No': {
          btnClass: 'btn-danger',
        }
      }
    })
  });
}

function strip_html_tags(str) {
  if ((str === null) || (str === ''))
    return false;
  else
    str = str.toString();
  return str.replace(/<[^>]*>/g, '');
}

function updateUser() {
  $(document).on("click", "#mailbtnsend", function () {
    d = $(this).parent().parent()[0].children;
    $('#emailPop').val(d[0].innerHTML);
  })
}