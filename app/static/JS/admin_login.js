var total_fields = 2;
name_arr = new Array(total_fields).fill(0);
type_arr = new Array(total_fields).fill(0);
reenter_arr = new Array(total_fields).fill(0);
global_settimeout_arr = new Array(total_fields).fill(0);
var max_length = 40;
var dict = {
	uname : 0,
	pass : 1
}

var msg ={
	"Accepted" : "correct",
	"Please fill out this field" : "wrong"
}

$(document).ready(function(){
	$('.five').fadeOut(0);

	function handleTooltips(input, text, wrong_correct, type, show = 1){
		var tooptip = $(input).parent().next().children("span")[type];
		if(type == 0){
			// input element
			if(show == 1){
				$(input).attr('title', text);
				$(input).removeClass();
				$(input).addClass(wrong_correct+"input");
			}else{
				$(input).attr('title', text);
				$(input).removeClass();		
			}
		}
		
		// tooltip element
		if(show == 1){
			$(tooptip).html(text);
			$(tooptip).removeClass();
			$(tooptip).addClass(wrong_correct);
			$(tooptip).show(250);
		}else{
			$(tooptip).html(text);
			$(tooptip).removeClass();
			$(tooptip).hide(0);
		}
		if(type == 1){
			$(tooptip).delay(750).hide(250);;
		}
	}

	function handleMsg(text){
		if(typeof msg[text] == 'undefined'){
			return "wrong";
		}
		return msg[text];
	}

	$('input').on('keypress', function(e) {
		var value = e.key;
		var name = $(this).attr("name");
		handleTooltips(this, "Currently accepting input", "", 0, 0);
		//console.log(value);

		// Here is an exception that "enter" is allowed
		if(value == 13){
			e.preventDefault();
			return false;
		}

		name_arr[dict[name]] = 0;
		type_arr[dict[name]] = 1;
	});

	$('input').on('keydown', function(e) {
		var name = $(this).attr("name");
		if(e.which == 32){
			var tooltip = "Cannot input space in this field";
			handleTooltips(this, tooltip, "wrong1", 1);
			e.preventDefault();
			return false;
		}
	});

	$('input').on('keyup', function(e) {
		var name = $(this).attr("name");
		if(e.which==8 || e.which==46){
			if ($(this).val().length == 0) {
				var tooltip = "Please fill out this field";
				handleTooltips(this, tooltip, "wrong", 0);
			}else{
				name_arr[dict[name]] = 0;
				type_arr[dict[name]] = 1;
			}
		}		
	});

	$('[name="uname"], [name="pass"]').keypress(function(e) {
		var name = $(this).attr("name");
		if ($(this).val().length > (max_length - 1)) {
			tooltip = "Cannot input more than " + max_length + " characters";
			if(reenter_arr[dict[name]] < max_length){
				reenter_arr[dict[name]] += 1;
				handleTooltips(this, tooltip, "wrong1", 1, 1);
			}else if(global_settimeout_arr[dict[name]] == 0){
				global_settimeout_arr[dict[name]] = 1;
				setTimeout(function(){
					//console.log("Running timeout2. Setting global_settimeout2 variable2 to 0 again");
					reenter_arr[dict[name]] = 0;
					global_settimeout_arr[dict[name]] = 0;
				}, 2500);
			}
			e.preventDefault();
			return false;
		}
	});

	$('[name="uname"], [name="pass"]').on('focus blur mouseleave', function() {
		var name = $(this).attr("name");
		if (type_arr[dict[name]] == 0) {
			return false;
		}
		type_arr[dict[name]] = 0;
		len=$(this).val().length;
		var tooltip;
		if (len > 0) {
			name_arr[dict[name]] = 1;
			tooltip = "Accepted";
		}else{
			name_arr[dict[name]] = 0;
			tooltip = "Please fill out this field";
			handleTooltips(this, tooltip, handleMsg(tooltip), 0, 1);
		}
	});

	$('.wrong, .wrong1').click(function(){
		$(this).hide(250);
	});

	$('.btnNEXTdiv').mouseenter(function(){
		if($('#btnNEXT').is(':disabled')){
			$('#btnNEXTdiv_tooltip').show(250);
		}
	});
	
	$('#btnNEXTtd, .btnNEXTdiv').on('mouseleave', function(){
		if($('#btnNEXT').is(':disabled')){
			$('#btnNEXTdiv_tooltip').hide(250);
		}
	});

	$('[name="btnNEXT"]').click(function(){
		$(".five").slideUp(0);
		$(".five").slideDown(500);
		$.ajax({
			type: 'POST',
			url: '/admin_login',
			contentType: "application/json",
			/*dataType: "json",*/
			data: JSON.stringify({
				uname: $('[name="uname"]').val(),
				pass: $('[name="pass"]').val()
			}),
			cache: false,
			processData: false,
			success: function(result){
				if(result == "1"){
					msg = "Logged in Successfully.";
					$(".five").slideUp(250);
					alert(msg);
					window.location.href = "booking_agent_home.html";
				}
				else if(result == "0"){
					msg = "Incorrect uname or password";
					$(".five").slideUp(250);
					alert(msg);
					window.location.href = "admin_login.html";
				}else{
					console.log("Result is neither 0 nor 1. Return value is different from flask");	
					console.log("Return value is " + result);
					console.log("Return value type is " + typeof result);
				}
			},
			error: function(){
				console.log("Not able to get response from flask function namely admin_login");
			}
		});
	});


	setInterval(Valid, 500);
	function Valid() {
		var test = 1;
		for(i=0; i<total_fields; i++){
			if(name_arr[i]==0){
				test=0;
				break;
			}
		}
		if (test == 1) {
			$('[name="btnNEXT"]').removeClass();
			$('[name="btnNEXT"]').addClass("valid");
			$('[name="btnNEXT"]')[0].disabled = false;
		} else{
			$('[name="btnNEXT"]').removeClass();
			$('[name="btnNEXT"]').addClass("invalid");
			$('[name="btnNEXT"]')[0].disabled = true;
		}
	}
});