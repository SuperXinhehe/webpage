function loadnotes(category)
{
	$("#note_content").html(category);
	var data = {};
	data.category = category;
	$.ajax ({
		url:"http://localhost:3000/theheapspace/nicenotes/cate="+category+"",
		type:"POST",
		data:data,
		dataType:"json",
		complete: function(data) {
			$("#note_content").html(data.nnote_content);
			//console.log(data.nnote_content);
			//alert(JSON.stringify(data.nnote_content));
		}
	});
}