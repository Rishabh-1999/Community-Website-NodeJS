function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}

var go=false;
function addTag()
{
            var v=document.getElementById('tagname').value;
              if(go==false)
                return;
                var dat= new Date();
                var datestr="";
                datestr=dat.getDate();
                datestr=datestr+"-"+dat.getMonth();
                datestr=datestr+"-"+dat.getFullYear();
                datestr=datestr+" ("+formatAMPM(dat)+")";
                var xml=new XMLHttpRequest();
                xml.open("POST","/tagTable/addTag");
                xml.setRequestHeader("Content-Type","application/json");
                xml.addEventListener("load",function()
                {
                  var d=xml.responseText;
                  if(d=="true") {
                    $("#errorMsg").text("Tag Added");
                    $('#errorModal').modal('show');
                    go=false
                    document.getElementById('tagname').value="";
                  }
                  else {
                    $("#errorMsg").text("Tag Not added");
                    $('#errorModal').modal('show');
                  }
                })
                xml.send(JSON.stringify({value :v,datestr:datestr}));
        }
        
function taglists()
{
  window.location="/taglists";
}

function checkDuplicate() {
  var v=document.getElementById('tagname').value;
            if(v=="")
            {
                $("#errorMsg").text("First Enter some Input");
                $('#errorModal').modal('show');
                return ;
            }
    var xml=new XMLHttpRequest();
    xml.open("POST","/tagTable/checkDuplicate");
    xml.setRequestHeader("Content-Type", "application/json");
    var ob=new Object();
    ob.tagname=document.getElementById('tagname').value;
    xml.send(JSON.stringify(ob));
    xml.addEventListener('load', function()
    {
      var d=xml.responseText;
      if(d=="true")
      {
        $("#errorMsg").text("Tag Already Exists");
        $('#errorModal').modal('show');
        go=false;
      }
      else
      {
        go=true;
        addTag();
      }
    })
}