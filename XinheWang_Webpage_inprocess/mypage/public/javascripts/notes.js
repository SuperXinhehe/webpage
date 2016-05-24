$(document).ready(function(){
	$(".update-button").click(function() {
		if($('#new-div').contents().length == 0) {
		   $("#new-div").append("<div class='note-textbox' style='padding:10px'><div class='btn-group btn-group-xs' role='group'><button type='button' onclick='boldtext()' class='btn btn-default'>bold</button><button type='button' onclick='addpre()' class='btn btn-default'>&lt;pre&gt;</button><button type='button' onclick='addp()' class='btn btn-default'>&lt;p&gt;</button><button type='button' onclick='code()' class='btn btn-default'>&lt;code&gt;</button><button type='button' onclick='italic()' class='btn btn-default'>&lt;i&gt;</button><button type='button' onclick='br()' class='btn btn-default'>&lt;br&gt;</button><button type='button' onclick='mark()' class='btn btn-default'>&lt;mark&gt;</button><button type='button' onclick='fileload()' class='btn btn-default'><span class='glyphicon glyphicon-paperclip' aria-hidden='true'></span> files</button><button type='button' id='picbt' class='btn btn-default'><span class='glyphicon glyphicon-picture' aria-hidden='true'></span> pictures</button></div><div><form method='get'><textarea class='form-control' rows='10' id='new' placeholder='Notes...'></textarea></form></div><div id='fileloader'><button class='btn btn-sm btn-default submitbt' onclick='update()'>submit</button></div></div>");			
		}
    else {
      $("#new-div").empty();
    }
	});
  $(".edit-button").click(function(){
    var updateid = $(this).attr("id");
    var changediv = $("#"+updateid+"update");
    var content = changediv.html();
    var textarea = $("<textarea rows='10' class='form-control' id='"+updateid+"update' />");
    textarea.val(content);
    changediv.replaceWith(textarea);
    textarea.focus();
    textarea.blur(editableTextBlurred);
  });
});

// buttons functions:
function addpre() {
  var currentval = $("#new").val();
  $("#new").val(currentval + "<pre></pre>");
  //$("#new").append("&lt;pre&gt;&lt;/pre&gt;");
}
function boldtext() {
  var currentval = $("#new").val();
  $("#new").val(currentval + "<b></b>");
}

function br(){
 var currentval = $("#new").val();
 $("#new").val(currentval + "<br>");
}

function mark(){
  var currentval = $("#new").val();
  $("#new").val(currentval + "<mark></mark>");
}

function italic(){
  var currentval = $("#new").val();
  $("#new").val(currentval + "<i></i>");
}

function addp() {
  var currentval = $("#new").val();
  $("#new").val(currentval + "<p></p>");
}

function code() {
  var currentval = $("#new").val();
  $("#new").val(currentval + "<code></code>");
}

////
function editableTextBlurred() {
  var html = $(this).val();
  var id = $(this).attr("id");
  //alert(id);
  var viewdiv = $("<div id='"+id+"'>");
  //html = html.replace(/<Integer>/, "&lt;Integer&gt;").replace(/<String>/, "&lt;String&gt;");
  viewdiv.html(html);
  $(this).replaceWith(viewdiv);
  var quickinfo = $("#"+id).parents("div:first").find("p:first").text();
  var usrname = quickinfo.replace(/on(.*)/g,"").replace(/(.*)by/g,"").trim();
  var time = quickinfo.replace(/(.*)on/g,"").trim();
  var noteid = document.getElementById("noteid").firstChild.nodeValue.replace("Task # ","");
  var update = {}
  update.note_id = noteid;
  update.updateid = id.replace("update","");
  update.usr_name = usrname;
  update.content = html;
  $.ajax ({
    url:"http://localhost:3000/notes/newupdate",
    type:"POST",
    data:update,
    dataType:"json",
    complete: function() {
      window.location.reload(true);
    }
  })
}
// refered by notes.jade
// trigured by the add new buttom id = "addnewbt" direct to page to edit the new note notes.jade
function addnew() {
	var usrname = document.getElementById("username").firstChild.nodeValue;
	window.location.replace("http://localhost:3000/theheapspace/login=ad/as="+usrname+"/notes/newnote");
}

function fileload() {
	if($('#fileloader').find("span").length == 0){
       $('#fileloader').append("<div><form action='/' method='post' enctype='multipart/form-data' id='newfile'><input id='input-1' type='file' name='singleInputFileName'></input></form></div>");
       //$("#input-1").fileinput({'showUpload':true,'previewFileType':'any'});
	}
}

// function to 
function update() {
   $("#newfile").submit();
   var content = $(document.getElementById("new")).val();
   var noteid = document.getElementById("noteid").firstChild.nodeValue.replace("Task # ","");
   var wel = document.getElementById("usrname").firstChild.nodeValue;
   var usrname = wel.replace("Welcome back, ","");
   var newnote = {};
   if($('input[type=file]').length == 1) {
     var filename = $('input[type=file]').val(); 
     filename = filename.replace("C:\\fakepath\\","");
     newnote.originalname = filename;
   }
   else {newnote.originalname = null;}
   newnote.note_id = noteid;
   newnote.usr_name = usrname;
   newnote.content = content;
   // store the file into uploads directory and 
   // by calling the database store the file information into database
   if(newnote.content.length!=0) {
    $.ajax({
     url:"http://localhost:3000/notes/update",
     type:"POST",
     data: newnote,
     dataType:"json",
     success: function(result) {
       if(result.status == 200) {
        //document.getElementById("newfile").submit();
        window.location.reload();
       }
     },
     error:function(result) {
      console.log(result);
     }
    });  
   }
}

function addit() {
  var form = document.getElementById("newform");
  var tags = $('.tagsinput').val().split(",");
  var usr_name = $('#usr_name').text().replace("Welcome, ","");
  var notetitle = $("#notetitle").val();
  var matches = notetitle.match(/\[(.*?)\]/);
  var rawdescrip = $("#rawdescrip").val();
  var description = "<p>".concat(rawdescrip,"</p>");
  if(matches == null) {
    notetitle = notetitle.trim();
    if(notetitle.split(" ").length == 1) {
      var noteid = notetitle.substring(0,3).toUpperCase();
      var noteid = noteid + Math.floor(Math.random()*900) + 100;
    }
    else {
      var matches2 = notetitle.match(/\b(\w)/g); 
      var noteid = matches2.join("").toUpperCase();
      var noteid = noteid + Math.floor(Math.random()*900) + 100;
    }
  }
  else {
    var part1 = matches[1].toUpperCase();
    var p = notetitle.replace(/\[.*?\]/g,'');
    var part2 = p.match(/\b(\w)/g).join("").toUpperCase();
    var noteid = part1+part2+Math.floor(Math.random()*900) + 100;
  }
  $('<input />').attr('type','hidden').attr("name","tags").attr("value",tags)
   .appendTo(form);
  $('<input />').attr('type','hidden').attr("name","note_id").attr("value",noteid)
   .appendTo(form);
  $('<input />').attr('type','hidden').attr("name","usr_name").attr("value",usr_name)
   .appendTo(form);
  $('<input />').attr('type','hidden').attr("name","description").attr("value",description)
   .appendTo(form);
   form.submit();
}
