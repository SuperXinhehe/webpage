$(document).ready(function() {
  
 $(".likes").click(function() {
  var v = $(this).find(".numbers").text();
  $(this).find(".numbers").html(v*1+1);
 });

 $(".image").click(function() {
  $img = $(this).attr('src');
  $p = $(this).parent().parent().parent().parent();
  $id = $p.attr('id');
  $("#display-image"+$id+"").html("<div class='modal fade'><div class='modal-dialog'><div class='modal-content'><div class='modal-header'><button type='button' data-dismiss = 'modal' class='close' aria-label='Close'><span aria-hidden='true'>&times;</span></button><h4 class='modal-title'>Image Overview</h4></div><div class='modal-body'><img src="+$img+" height=400px /></div></div></div></div>");
  $('.modal').modal('show');
 });

 $("#soh").click(function(){
  $("#commentbutt").collapse();
  if($("#soh").text()=="Show Comments")
  {
    $("#soh").text("Hide Comments")
  }
  else
  {
    $("#soh").text("Show Comments")
  }
 });

 $(".clickable-row").click(function(){
  window.document.location = $(this).data("href");
 })
});

function addComments()
{
	var com = document.getElementById("comments").value;
  	var curtime = new Date($.now());
  	if(com!="Your Comments")
  	{
  		curtime = curtime.toString();
	    $("#commentlist ul").prepend("<li><div class='commenterImage'><img src='/images/userpic.jpg'/></div><div class='commentText'><p>"+com+"</p><p><span class='date sub-text'>"+curtime+"</span></p></div></li>");
		  $("#addcomments").replaceWith("<button class='btn btn-default' id='addcomments' onclick='addComments()' type='button'>Add<span class='glyphicon glyphicon-ok' style='color:green'></span></button>");
	    document.getElementById("comments").value = "Your Comments";
  	}
  	else
  	{
		  $("#addcomments").replaceWith("<button class='btn btn-default' id='addcomments' onclick='addComments()' type='button'>Add<span class='glyphicon glyphicon-remove' style='color:red'></span></button>");
  	}
};

function close(elementId)
{
  document.getElementByClassName(elementId).innerHTML = "";
};


