jQuery.validator.addMethod("ContainAtLeastOneNumber",function(value,element){
	return this.optional(element) || /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/.test(value);
},"Password must contains at least one number");

$(document).ready(function(){ 
 $("#loginForm").validate ({
 	rules:{
 		"user[username]":{
 			required:true,
 			minlength:3
 		},
 		"user[password]":{
 			required:true,
 			minlength:6,
 			ContainAtLeastOneNumber: true
 		}
 	},
 	messages:{
 		"user[username]":{
 			required: "The Username is required",
 			minlength: "length no shorter than 3"
 		},
 		"user[password]":{
 			required: "The password is required",
 			minlength: "Password is no shorter than 6",
 			ContainAtLeastOneNumber: "Password must contains at least one number"
 		}
 	},
 	submitHandler:function(form) 
 	{return true;}
 });
 $("#loginForm").submit(function(e){
 	var v = $("#loginForm").valid();
 	if(v != true)
 	{
 		e.preventDefault();
 	}
 });
});