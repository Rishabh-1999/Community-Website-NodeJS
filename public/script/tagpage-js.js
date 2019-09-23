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
var go;
function addTag()
{
            var v=document.getElementById('tagname').value;
            if(v=="")
            {
                alert('First Enter some Input');
            }
            else
            {
              if(go==false)
                return;
                var dat= new Date();
                var datestr="";
                datestr=dat.getDate();
                datestr=datestr+"-"+dat.getMonth();
                datestr=datestr+"-"+dat.getFullYear();
                datestr=datestr+" ("+formatAMPM(dat)+")";
                console.log(datestr);
                var xml=new XMLHttpRequest();
                xml.open("POST","/tagTable/addTag");
                xml.setRequestHeader("Content-Type","application/json");
                xml.send(JSON.stringify({value :v,datestr:datestr}));
            }
        }
        
function taglists()
{
  window.location="/taglists";
}

function checkDuplicate() {
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
        alert('Tag Already Exists');
        go="false";
      }
      else
      {
        go="true";
        addTag();
      }
    })
}