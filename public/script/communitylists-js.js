$(document).ready(function() {
    initaliseTable();
    initaliseTable1();
    initaliseTable2();
})
  
    function initaliseTable()
    {
      document.getElementById('can-create-community').innerHTML="";
      var s="true"
      var xml=new XMLHttpRequest();
      xml.open("GET","/communityTable/getArrayOwnCommunity");
      xml.setRequestHeader("Content-Type","application/json");
      xml.addEventListener("load",function()
      {
       var data=JSON.parse(xml.responseText);
        for(var i=0;i<data.length;i++)
            addToDOM(data[i],s)
       })
      xml.send();
    }
  
    function initaliseTable1()
    {
      var s="false"
      var xml=new XMLHttpRequest();
      xml.open("GET","/communityTable/getArrayOtherCommunity");
      xml.setRequestHeader("Content-Type","application/json");
      xml.addEventListener("load",function()
      {
       var data=JSON.parse(xml.responseText);
        for(var i=0;i<data.length;i++)
            addToDOM(data[i],s)
       })
      xml.send();
    }

    function initaliseTable2()
    {
      var s="pending"
      var xml=new XMLHttpRequest();
      xml.open("GET","/communityTable/getArrayOtherCommunityInvited");
      xml.setRequestHeader("Content-Type","application/json");
      xml.addEventListener("load",function()
      {
       var data=JSON.parse(xml.responseText);
        for(var i=0;i<data.length;i++)
         addToDOM(data[i],s)
       })
      xml.send();
    }
  
    function addToDOM(obj,s)
    {
      console.log(obj)
      var div1=document.createElement('div');
      div1.setAttribute("class","col-sm-12 col-xs-12 myCommunity community-div");
      div1.setAttribute("style","display: flex;");
      var div2=document.createElement('div');
      div2.setAttribute("class","col-sm-1 col-xs-3")
      div2.setAttribute("style", "padding:10px;flex:1;")
      var img=document.createElement('img')
      img.setAttribute("src",obj.photoloc)
      img.setAttribute("class","cpic")
      div2.appendChild(img)
      div1.appendChild(div2)
      var div3=document.createElement('div')
      div3.setAttribute("class","col-sm-10 col-xs-7")
      div3.setAttribute("style","padding:20px;")
      var p=document.createElement('p')
      var a2=document.createElement('a');
      a2.setAttribute("class","comnametxt")
      a2.href="/communityTable/communityDicussion/"+obj._id;
      a2.innerHTML=obj.name
      var a3=document.createElement('a')
      a3.setAttribute("class","comnametxt-user")
      if(s=="true")
      {
        a3.setAttribute("href","/communityTable/"+obj._id);
        a3.innerHTML=" Members("+obj.users.length  +")";
      }
      else if(s=="pending")
      {
         a3.setAttribute("href","#");
      }
      else
      {
        a3.setAttribute("href","/communityTable/communitymembers/"+obj._id);
        a3.innerHTML=" Request(" + obj.request.length +")";
      }
      p.appendChild(a2)
      p.appendChild(a3)
      div3.appendChild(p)
      div1.appendChild(div3)
      if(s=="true" || s=="pending")
      {
        var div4=document.createElement('div')
          div4.setAttribute("class","col-sm-1 col-xs-2")
          var a4=document.createElement('a')
          a4.setAttribute("class","community-short-btn")
          if(s=="true")
          a4.href="/communityTable/"+obj._id;
          else
            a4.href="#";
          a4.setAttribute("style","float:right;")
          var l1=document.createElement('label')
          if(s=="true")
          l1.setAttribute("class","btn btn-success")
          else
            l1.setAttribute("class","btn btn-danger")
          l1.setAttribute("style","cursor:pointer !important;")
          var i1=document.createElement('i')
          i1.setAttribute("class","fa fa-cogs")
          l1.appendChild(i1)
          a4.appendChild(l1)
          div4.appendChild(a4)
          div1.appendChild(div4)
      }
      document.getElementById('can-create-community').appendChild(div1)
    }