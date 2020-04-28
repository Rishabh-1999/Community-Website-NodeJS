function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}

var go = false;

function putDOM(dombool) {
  var dom;
  if (dombool)
    dom = '<div class="btn btn-success pl-5 pr-5"><h3>Added Successfully</h3></div>'
  else {
    dom = '<div class="btn btn-warning pl-5 pr-5"><h3>Duplicate Tag Exists</h3></div>'
  }
  console.log(dom)
  document.getElementById("tag-div").innerHTML = dom;
}

function addTag() {
  var v = document.getElementById('tagname').value;

  var dat = new Date();
  var datestr = "";
  datestr = dat.getDate();
  datestr = datestr + "-" + dat.getMonth();
  datestr = datestr + "-" + dat.getFullYear();
  datestr = datestr + " (" + formatAMPM(dat) + ")";

  var xml = new XMLHttpRequest();
  xml.open("POST", "/tagTable/addTag");
  xml.setRequestHeader("Content-Type", "application/json");
  xml.addEventListener("load", function () {
    var d = xml.responseText;
    if (d == "true") {
      putDOM(true)
      document.getElementById('tagname').value = "";
    } else
      putDOM(false)
    go = false
  })
  xml.send(JSON.stringify({
    value: v,
    datestr: datestr
  }));
}

function checkDuplicate() {
  if (document.getElementById('tagname').value == "") {
    document.getElementById("tag-div").innerHTML = '<div class="btn btn-danger pl-5 pr-5"><h3>Input Empty First</h3></div>'
    return;
  }
  var xml = new XMLHttpRequest();
  xml.open("POST", "/tagTable/checkDuplicate");
  xml.setRequestHeader("Content-Type", "application/json");
  var ob = new Object();
  ob.tagname = document.getElementById('tagname').value;
  xml.send(JSON.stringify(ob));
  xml.addEventListener('load', function () {
    var d = xml.responseText;
    if (d == "true") {
      putDOM(false)
      go = false;
    } else {
      go = true;
      addTag();
    }
  })
}