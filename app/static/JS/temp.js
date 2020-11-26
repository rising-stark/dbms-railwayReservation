var total_fields = 11;
name_arr = new Array(total_fields).fill(0);
type_arr = new Array(total_fields).fill(0);
reenter_arr = new Array(total_fields).fill(0);
global_settimeout_arr = new Array(total_fields).fill(0);

var popupsLimit = 3; /*This tells how many consecutive popups allowed on restricted keys*/

var dict = {
	fname: 0,
	lname: 1,
	dob: 2,
	gender: 3,
	email: 4,
	phone: 5,
	address: 6,
	uname: 7,
	creditcard: 8,
	pass: 9,
	cnfpass: 10,
}

/*
If both min and max values are set 0 then it means
no integer or character length constraint possible
*/
var mindict = {
	fname: 2 /*min character length*/,
	lname: 2,
	dob: 10 /*min age*/,
	gender: 0,
	email: 0,
	phone: 10,
	address: 0,
	uname: 2,
	creditcard: 16,
	pass: 8,
	cnfpass: 0 /*No constraint because automatic constraint from pass due to compulsory matching*/,
}

var maxdict = {
	fname: 40 /*max character length*/,
	lname: 40,
	dob: 100 /*max age*/,
	gender: 0,
	email: 0,
	phone: 12,
	address: 99,
	uname: 40,
	creditcard: 16,
	pass: 20,
	cnfpass: 0,
}

var msgdict = {
	"Accepted": "correct",
	"Matching": "correct",
	"Please fill out this field": "wrong"
}

$(document).ready(function() {
	$('.five').fadeOut(0);

	function handleTooltips(name, text, wrong_correct, type, show = 1) {
		var img = $('[name="' + name + '"]').parent().next().children("img")[0];
		var tooltip = $('[name="' + name + '"]').parent().next().next().children("span")[type];
		if (type == 0) {
			// input element
			if (show == 1) {
				$('[name="' + name + '"]').attr('title', text);
				$('[name="' + name + '"]').removeClass();
				$('[name="' + name + '"]').addClass(wrong_correct + "input");
			} else {
				$('[name="' + name + '"]').attr('title', text);
				$('[name="' + name + '"]').removeClass();
			}

			//image element
			if (show == 1) {
				$(img).attr("src", "../static/IMAGES/" + wrong_correct + ".gif");
				$(img).prop("alt", wrong_correct);
				$(img).attr("hidden", false);
			} else {
				$(img).attr("src", "../static/IMAGES/wrong.gif");
				$(img).prop("alt", "wrong");
				$(img).attr("hidden", true);
			}
		}

		// tooltip element
		if (show == 1) {
			$(tooltip).html(text);
			$(tooltip).removeClass();
			$(tooltip).addClass(wrong_correct);
			$(tooltip).show(250);
		} else {
			$(tooltip).html(text);
			$(tooltip).removeClass();
			$(tooltip).hide(0);
		}
		if (type == 1) {
			$(tooltip).delay(750).hide(250);
		}
	}

	function handleMsg(text) {
		if (typeof msgdict[text] == 'undefined') {
			return "wrong";
		}
		return msgdict[text];
	}

	function reenterPopup(name, tooltip, wrong_correct, type, show){
		if (reenter_arr[dict[name]] < popupsLimit) {
			reenter_arr[dict[name]] += 1;
			handleTooltips(name, tooltip, wrong_correct, type, show);
		} else if (global_settimeout_arr[dict[name]] == 0) {
			global_settimeout_arr[dict[name]] = 1;
			setTimeout(function() {
				reenter_arr[dict[name]] = 0;
				global_settimeout_arr[dict[name]] = 0;
			}, 2500);
		}
	}

	function resetALL(){
		var text = "Please fill out this field";
		var img = $(".two img[id$=img]");
		var input = $('input[type=text], input[type=password], input[type=email], input[type=time], input[type=date], input[type=number], textarea');
		var tooltip = $(".two .wrong, .two .correct");
		$(input).val("");
		$(input).attr('title', text);
		$(input).removeClass();
		$(img).attr("src", "../static/IMAGES/wrong.gif");
		$(img).prop("alt", "wrong");
		$(img).attr("hidden", true);
		$(tooltip).html("");
		$(tooltip).removeClass();
		$(tooltip).hide(250);
		$('[name="cnfpass"]').attr("disabled", "disabled"); //jQuery 1.5 and below
		$('[name="cnfpass"]').prop('disabled', true);  //jQuery 1.6+
		$('select[name="gender"] option:selected').attr("selected", null);
		for (i = 0; i < total_fields; i++) {
			name_arr[i] = 0;
			type_arr[i] = 0;
			reenter_arr[i] = 0;
			global_settimeout_arr[i] = 0;
		}
	}

	function resetThese(arr){
		var len = arr.length;
		for(var i = 0; i < len; i++){
			var text = "Please fill out this field";
			var img = $('#'+arr[i]+'img');
			var input = $('[name="'+arr[i]+'"]');
			var tooltip = $('[name="'+arr[i]+'"]').parent().next().next().children("span")[0];
			$(input).val("");
			$(input).attr('title', text);
			$(input).removeClass();
			$(img).attr("src", "../static/IMAGES/wrong.gif");
			$(img).prop("alt", "wrong");
			$(img).attr("hidden", true);
			$(tooltip).html("");
			$(tooltip).removeClass();
			$(tooltip).hide(250);
			$(input).attr("disabled", "disabled"); //jQuery 1.5 and below
			$(input).prop('disabled', true);  //jQuery 1.6+
			name_arr[dict[arr[i]]] = 0;
			type_arr[dict[arr[i]]] = 0;
			reenter_arr[dict[arr[i]]] = 0;
			global_settimeout_arr[dict[arr[i]]] = 0;
		}
	}

	var regExpNonPrintable = /[^ -~]/;
	var regExpEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	var regExpNum = /[0-9]/;
	var regExpAlpha = /[a-zA-Z]/;
	$('input').on('keypress', function(e) {
		var value = e.key;
		var name = $(this).attr("name");
		handleTooltips(name, "", "", 0, 0);
		//console.log(value);

		// Here is an exception that "enter" is allowed
		if (value == 13) {
			e.preventDefault();
			return false;
		}

		if (name == "phone" || name == "creditcard") {
			if (!regExpNum.test(value)) {
				var tooltip = "Only Numbers are allowed i.e. 0-9";
				reenterPopup(name, tooltip, "wrong1", 1, 1);
				e.preventDefault();
				return false;
			}
		}

		if (name == "fname" || name == "lname") {
			if (!regExpAlpha.test(value)) {
				var tooltip = "Only alphabets are allowed i.e. a-z or A-Z";
				reenterPopup(name, tooltip, "wrong1", 1, 1);
				e.preventDefault();
				return false;
			}
		}

		name_arr[dict[name]] = 0;
		type_arr[dict[name]] = 1;
	});

	$('input').on('keydown', function(e) {
		var name = $(this).attr("name");
		if (e.which == 32) {
			var tooltip = "Cannot input space in this field";
			reenterPopup(name, tooltip, "wrong1", 1, 1);
			e.preventDefault();
			return false;
		}
	});

	$('input').on('keyup', function(e) {
		var name = $(this).attr("name");
		if (e.which == 8 || e.which == 46) {
			handleTooltips(name, "", "", 0, 0);
			if ($(this).val().length == 0) {
				var tooltip = "Please fill out this field";
				handleTooltips(name, tooltip, "wrong", 0, 1);
			}
			name_arr[dict[name]] = 0;
			type_arr[dict[name]] = 1;
		}
	});

	$('[name="fname"], [name="lname"], [name="phone"], [name="uname"], [name="creditcard"], [name="pass"], [name="address"]').keypress(function(e) {
		var name = $(this).attr("name");
		var flag = false;
		if ($(this).val().length > (maxdict[name] - 1)) {
			flag  = true;
			tooltip = "Cannot input more than " + maxdict[name] + " characters";
		}
		if(flag){
			reenterPopup(name, tooltip, "wrong1", 1, 1);
			e.preventDefault();
			return false;
		}
	});

	$('[name="fname"], [name="lname"], [name="address"], [name="phone"], [name="uname"], [name="creditcard"]').on('blur mouseleave', function() {
		var name = $(this).attr("name");
		if (type_arr[dict[name]] == 0) {
			return false;
		}
		type_arr[dict[name]] = 0;
		len = $(this).val().length;
		var tooltip;
		if (len > 0) {
			if(len < mindict[name]){
				name_arr[dict[name]] = 0;
				tooltip = "Input length must be greater than " + mindict[name] + " characters";
			}else{
				name_arr[dict[name]] = 1;
				tooltip = "Accepted";
			}
		}else{
			name_arr[dict[name]] = 0;
			tooltip = "Please fill out this field";
		}
		handleTooltips(name, tooltip, handleMsg(tooltip), 0, 1);
	});

	$('[name="email"]').on('blur mouseleave', function() {
		var name = $(this).attr("name");
		if (type_arr[dict[name]] == 0) {
			return false;
		}
		type_arr[dict[name]] = 0;
		len = $(this).val().length;
		emailval = $('[name="email"]').val();
		var tooltip;
		if (len > 0) {
			if (!regExpEmail.test(emailval)) {
				name_arr[dict[name]] = 0;
				tooltip = "Email-id " + emailval + " is invalid";
			}else{
				name_arr[dict[name]] = 1;
				tooltip = "Accepted";
			}
		}else{
			name_arr[dict[name]] = 0;
			tooltip = "Please fill out this field";
		}
		handleTooltips(name, tooltip, handleMsg(tooltip), 0, 1);
	});

	$('[name="dob"]').on('blur', function() {
		var name = $(this).attr("name");
		len = $(this).val().length;
		var tooltip;
		if (len > 0) {
			name_arr[dict[name]] = 1;
			tooltip = "Accepted";
		} else {
			name_arr[dict[name]] = 0;
			tooltip = "Please fill out this field";
		}
		handleTooltips(name, tooltip, handleMsg(tooltip), 0, 1);
	});

	$('[name="pass"]').on('blur mouseleave', function() {
		var name = $(this).attr("name");
		if (type_arr[dict[name]] == 0) {
			return false;
		}
		type_arr[dict[name]] = 0;
		len = $(this).val().length;
		var tooltip;
		if (len > 0) {
			if(len < mindict[name]){
				name_arr[dict[name]] = 0;
				tooltip = "Password length must be greater than " + mindict[name] + " characters";
				var arr = ["cnfpass"];
				resetThese(arr);
			}else{
				name_arr[dict[name]] = 1;
				tooltip = "Accepted";
				$('[name="cnfpass"]').removeAttr('disabled'); //jQuery 1.5 and below
				$('[name="cnfpass"]').prop('disabled', false);  //jQuery 1.6+
			}
		}else{
			name_arr[dict[name]] = 0;
			tooltip = "Please fill out this field";
		}
		handleTooltips(name, tooltip, handleMsg(tooltip), 0, 1);
	});

	$('[name="cnfpass"]').on('blur mouseleave', function() {
		var name = $(this).attr("name");
		if (type_arr[dict[name]] == 0) {
			return false;
		}
		type_arr[dict[name]] = 0;
		len = $(this).val().length;
		passval = $('[name="pass"]').val();
		cnfpassval = $('[name="cnfpass"]').val();
		var tooltip;
		if (len > 0) {
			if(passval == cnfpassval){
				name_arr[dict[name]] = 1;
				tooltip = "Matching";
			}else{
				name_arr[dict[name]] = 0;
				tooltip = "Passwords does not match";
			}
		} else {
			name_arr[dict[name]] = 0;
			tooltip = "Please fill out this field";
		}
		handleTooltips(name, tooltip, handleMsg(tooltip), 0, 1);
	});

	$('[name="gender"]').click(function() {
		var name = $(this).attr("name");
		var a = $(this).val();
		var tooltip;
		if (a == "0") {
			name_arr[dict[name]] = 0;
			tooltip = "Please Choose An Option";
		} else if (a != null) {
			name_arr[dict[name]] = 1;
			tooltip = "Accepted";
		}
		handleTooltips(name, tooltip, handleMsg(tooltip), 0, 1);
	});

	$("img[id$=img]").click(function() {
		var item = $(this).parent().next().children("span")[0];
		$(item).slideToggle(250);
	});

	/*
	It is working but not used to allow copying of tooltip text
	
	$("span").on('click', function(){
		if($(this).hasClass('wrong') || $(this).hasClass('correct')){
		$(this).hide(250);	
		}
	});*/

	$('#threep1p1btn').mouseenter(function() {
		if ($('#btnSearch').is(':disabled')) {
			$('#threep1p1_btn_show_tooltip').show(250);
		}
	});

	$('#threep1p1btn').mouseleave(function() {
		if ($('#btnSearch').is(':disabled')) {
			$('#threep1p1_btn_show_tooltip').hide(250);
		}
	});

	$('.btnNEXTdiv').mouseenter(function() {
		if ($('#btnNEXT').is(':disabled')) {
			$('#btnNEXTdiv_tooltip').show(250);
		}
	});

	$('#btnNEXTtd, .btnNEXTdiv').on('mouseleave', function() {
		if ($('#btnNEXT').is(':disabled')) {
			$('#btnNEXTdiv_tooltip').hide(250);
		}
	});

	$('[name="btnNEXT"]').click(function() {
		$(".five").slideUp(0);
		$(".five").slideDown(500);
		$.ajax({
			type: 'POST',
			url: '/register',
			contentType: "application/json",
			/*dataType: "json",*/
			data: JSON.stringify({
				uname: $('[name="trainno2"]').val(),
				password: $('[name="pass"]').val(),
				fname: $('[name="fname"]').val(),
				lname: $('[name="lname"]').val(),
				email: $('[name="email"]').val(),
				phone: $('[name="phone"]').val(),
				address: $('[name="address"]').val(),
				gender: $('[name="gender"]').val(),
				creditcard: $('[name="creditcard"]').val(),
				dob: $('[name="start_doj"]').val()
			}),
			cache: false,
			processData: false,
			success: function(result) {
				$(".five").slideUp(250);
				if (result == "1") {
					msg = "Registration Successful.\nRedirecting to Home page.";
					alert(msg);
					window.location.href='http://127.0.0.1:5000/home';
				} else if (result == "0") {
					msg = "User Already Exists!!! Try a different Username\nPress OK to empty the fields. Press cancel to retain the field values.";
					var ans = confirm(msg);
					if (ans == true) {
						resetALL();
					}
				} else {
					console.log("Result is neither 0 nor 1. Return value is different from flask function namely register");
					console.log("Return value is " + result);
					console.log("Return value type is " + typeof result);
				}
			},
			error: function() {
				console.log("Not able to get response from flask function namely register");
			}
		});
	})

	setInterval(Valid , 500);
	function Valid() {
		var test = 1;
		for (i = 0; i < total_fields; i++) {
			if (name_arr[i] == 0) {
				test = 0;
				break;
			}
		}
		if (test == 1) {
			$('[name="btnNEXT"]').removeClass();
			$('[name="btnNEXT"]').addClass("valid");
			$('[name="btnNEXT"]')[0].disabled = false;
		} else {
			$('[name="btnNEXT"]').removeClass();
			$('[name="btnNEXT"]').addClass("invalid");
			$('[name="btnNEXT"]')[0].disabled = true;
		}
	}
});