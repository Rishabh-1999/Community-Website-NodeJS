$("#up").on('change', function () {
  document.getElementById("profilepicform1").submit();
})

document.getElementById('update').addEventListener("click", function (event) {
  if (document.getElementById('name').value == "" ||
    document.getElementById('phoneno').value == "" ||
    document.getElementById('city').value == ""
  ) {
    $("#errorMsg").text("Name, Phone No. and city are required to be filled");
    $('#errorModal').modal('show');
    return;
  }
  if (document.getElementById('gender').value == "") {
    $("#errorMsg").text("Gender Required");
    $('#errorModal').modal('show');
    return;
  }
  if (document.getElementById('DOB').value == "") {
    $("#errorMsg").text("DOB Required");
    $('#errorModal').modal('show');
    return;
  }
  var obj = new Object();
  obj.name = document.getElementById('name').value;
  obj.DOB = document.getElementById('DOB').value;
  obj.gender = document.getElementById('gender').value;
  obj.phoneno = document.getElementById('phoneno').value;
  obj.city = document.getElementById('city').value;
  obj.interests = document.getElementById('interests').value;
  obj.aboutyou = document.getElementById('aboutyou').value;
  obj.expectations = document.getElementById('expectations').value;
  var xml = new XMLHttpRequest();
  xml.open("POST", "/userTable/updateprofile");
  if (document.getElementById("up").files.length != 0)
    document.getElementById("profilepicform1").submit();
  xml.addEventListener("load", function () {
    window.location = '/home';
  })
  xml.setRequestHeader("Content-Type", "application/json");
  xml.send(JSON.stringify(obj));
});