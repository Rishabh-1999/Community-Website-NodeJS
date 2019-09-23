var bar = document.querySelector('.bar')
var tabBar = document.querySelector('.tabBar')
var width;

function expand() {
    if(tabBar.style.width == '250px'){
        tabBar.style.width = width
    }else{
    	width = tabBar.style.width
        tabBar.style.width = '250px'
    }
}
document.querySelectorAll('.bar').forEach((value)=>{
	value.onclick = expand
})

function logout() {
   $.confirm({
    title: 'Confirm Logout!',
    content: 'Do you really want to logout?',
    theme: 'supervan',
    buttons: {
       'Yes': {
           		btnClass: 'btn-success',
           		action: function(){
              	var xml = new XMLHttpRequest();
			    xml.open('POST','/logout');
			    xml.onload = function() {
			    	window.location='/'
  				}
    			xml.send();
            }
          },
          'No': {btnClass: 'btn-danger',}
   }
  });
}

function switchState(e) {
  $.confirm({
      title: e,
      content: "Do you really want switch state...",
      theme: 'supervan',
      buttons: {
          'Yes': {
              btnClass: 'btn-success',
              action: function () {
                var xml=new XMLHttpRequest()
                xml.open("POST","/userTable/changetemprole");
                xml.addEventListener("load",function()
                {
                  window.location='/home'
                })
                xml.send();
              }
          },
          'No': {btnClass: 'btn-danger',}
      }
  });
}