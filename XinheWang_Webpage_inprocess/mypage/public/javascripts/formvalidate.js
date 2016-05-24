$(document).ready(function() {
    $('.input-group input[required], .input-group textarea[required], .input-group select[required]').on('keyup change', function() {
		var $form = $(this).closest('form'),
            $group = $(this).closest('.input-group'),
			$addon = $group.find('.input-group-addon'),
			$icon = $addon.find('span'),
			state = false;
            
    	if (!$group.data('validate')) {
			state = $(this).val() ? true : false;
		}else if ($group.data('validate') == "email") {
			state = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test($(this).val())
		}else if($group.data('validate') == 'phone') {
			state = /^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/.test($(this).val())
		}else if ($group.data('validate') == "length") {
			state = $(this).val().length >= $group.data('length') ? true : false;
		}else if ($group.data('validate') == "number") {
			state = !isNaN(parseFloat($(this).val())) && isFinite($(this).val());
		}

		if (state) {
				$addon.removeClass('danger');
				$addon.addClass('success');
				$icon.attr('class', 'glyphicon glyphicon-ok');
		}else{
				$addon.removeClass('success');
				$addon.addClass('danger');
				$icon.attr('class', 'glyphicon glyphicon-remove');
		}
        
        if ($form.find('.input-group-addon.danger').length == 0) {
            $form.find('[type="submit"]').prop('disabled', false);
        }else{
            $form.find('[type="submit"]').prop('disabled', true);
        }
	});
    
    $('.input-group input[required], .input-group textarea[required], .input-group select[required]').trigger('change');
    var tagnames = new Bloodhound ({
	 datumTokenizer: Bloodhound.tokenizers.obj.whitespace("text"),
	 queryTokenizer: Bloodhound.tokenizers.whitespace,
	 remote: {
		url:"/asserts/tags",
		filter: function(list) {
			return $.map(list,function(tag) {
				return {
					value:tag.tag_id,
					name:tag.tag_name,
					tagClass:tag.tag_span
				};
			});
		}
	}
    });

    tagnames.initialize();
    $(".tagsinput").tagsinput({
     tagClass:function(item) {
		switch(item.tagClass) {
			case "label label-success" :return "label label-success";
			case "label label-info"    :return "label label-info";
			case "label label-warning" :return "label label-warning";
		}
	 },
	 itemValue:"name",
	 typeaheadjs: {
	 	displayKey:"name",
	 	name:"tagnames",
	 	minLength: 50,
	 	limit:200,
		source: tagnames.ttAdapter()
	 },
	 freeInput:false
	});
});
    