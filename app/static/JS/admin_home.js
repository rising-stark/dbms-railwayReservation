var trainnoType = 0,
	dojType = 0;
var trainno, doj;
var tooltipTrainno, tooltipDoj;
var reenter_trainno, global_settimeout;

var total_fields = 11;
name_arr = new Array(total_fields).fill(0);
type_arr = new Array(total_fields).fill(0);
reenter_arr = new Array(total_fields).fill(0);
global_settimeout_arr = new Array(total_fields).fill(0);

var popupsLimit = 3; /*This tells how many consecutive popups allowed on restricted keys*/
var size_of_train_number = 4;
name_arr[6] = 1; /*This is donr because not end-date is not send to backend*/

var dict = {
	trainno2: 0,
	source: 1,
	dest: 2,
	start_time: 3,
	end_time: 4,
	start_doj: 5,
	end_doj: 6,
	ac_coaches: 7,
	sl_coaches: 8,
	ac_fare: 9,
	sl_fare: 10
}

/*
If both min and max values are set 0 then it means
no integer or character length constraint possible
*/
var mindict = {
	trainno2: 4 /*min character length*/,
	source: 1 /*min character length*/,
	dest: 1 /*min character length*/,
	start_time: 0,
	end_time: 0,
	start_doj: 60  /*60 days as lower bound after current date*/,
	end_doj: 0 /*train can end on same day*/,
	ac_coaches: 0  /*min ac coaches allowed*/,
	sl_coaches: 0  /*min sl coaches allowed*/,
	ac_fare: 1 /*min ac fare allowed*/,
	sl_fare: 1 /*min sl fare allowed*/
}

var maxdict = {
	trainno2: 4,
	source: 40,
	dest: 40,
	start_time: 0,
	end_time: 0,
	start_doj: 120,
	end_doj: 3 /*Train must end within 3 days of its journey*/,
	ac_coaches: 50,
	sl_coaches: 50,
	ac_fare: 5000,
	sl_fare: 3000
}

var msgdict = {
	"Accepted": "correct",
	"Matching": "correct",
	"Please fill out this field": "wrong"
}

$(document).ready(function() {
	// initializations for validation
	trainno = 0;
	doj = 0;
	reenter_trainno = 0;
	global_settimeout = 0;

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
		var img = $(".four img[id$=img]");
		var input = $('input[type=text], input[type=password], input[type=email], input[type=time], input[type=date], input[type=number], textarea');
		var tooltip = $(".four .wrong, .four .correct,.four .wrong1");
		$("select").attr('title', text);
		$("select").removeClass();
		$(input).val("");
		$(input).attr('title', text);
		$(input).removeClass();
		$(img).attr("src", "../static/IMAGES/wrong.gif");
		$(img).prop("alt", "wrong");
		$(img).attr("hidden", true);
		$(tooltip).html("");
		$(tooltip).removeClass();
		$(tooltip).hide(250);
		/*$('[name="cnfpass"]').attr("disabled", "disabled"); //jQuery 1.5 and below
		$('[name="cnfpass"]').prop('disabled', true);  //jQuery 1.6+*/
		$('select[name="gender"] option:selected').attr("selected", null);
		for (i = 0; i < total_fields; i++) {
			name_arr[i] = 0;
			type_arr[i] = 0;
			reenter_arr[i] = 0;
			global_settimeout_arr[i] = 0;
		}
	}

	var regExpNonPrintable = /[^ -~]/;
	var regExpNum = /[0-9]/;
	var regExpAlpha = /[a-zA-Z]/;
	$('input, textarea').on('keypress', function(e) {
		var value = e.key;
		var name = $(this).attr("name");
		handleTooltips(name, "", "", 0, 0);
		//console.log(value);

		// Here is an exception that "enter" is allowed
		if (value == 13) {
			var tooltip = "New-line not allowed";
			reenterPopup(name, tooltip, "wrong1", 1, 1);
			e.preventDefault();
			return false;
		}

		if (name == "trainno") {
			if (!regExpNum.test(value)) {
				var tooltip = "Only Numbers are allowed i.e. 0-9";
				$('#threep1p1_input_train_tooltip').html(tooltip);
				$('#threep1p1_input_train_tooltip').show(250).delay(500).hide(250);
				e.preventDefault();
			} else {
				trainnoType = 1;
				trainno = 0;
			}
			return;
		}

		if (name == "trainno2" || name == "ac_fare" || name == "sl_fare" || name == "ac_coaches" || name == "sl_coaches") {
			if (!regExpNum.test(value)) {
				var tooltip = "Only Numbers are allowed i.e. 0-9";
				reenterPopup(name, tooltip, "wrong1", 1, 1);
				e.preventDefault();
				return false;
			}
		}

		if (name == "source" || name == "dest") {
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
			if (name == "trainno") {
				$('#threep1p1_input_train_tooltip').html(tooltip);
				$('#threep1p1_input_train_tooltip').show(250).delay(500).hide(250);
			} else {
				reenterPopup(name, tooltip, "wrong1", 1, 1);
			}
			e.preventDefault();
			return false;
		}
	});

	$('input, textarea').on('keyup', function(e) {
		var name = $(this).attr("name");
		if (e.which == 8 || e.which == 46) {
			handleTooltips(name, "", "", 0, 0);
			if ($(this).val().length == 0) {
				var tooltip = "Please fill out this field";
				if (name == "trainno") {
					$('#threep1p1_input_train_tooltip').html(tooltip);
					$('#threep1p1_input_train_tooltip').show(250).delay(500).hide(250);
				}else if (name == "doj") {
					
				} else {
					handleTooltips(name, tooltip, "wrong", 0);
				}
			}
			if (name == "trainno") {
				trainnoType = 1;
				trainno = 0;
			} else {
				name_arr[dict[name]] = 0;
				type_arr[dict[name]] = 1;
			}
		}
	});

	$('[name="trainno"]').keypress(function(e) {
		if ($('[name="trainno"]').val().length > (size_of_train_number - 1)) {
			tooltip = "Cannot input more than " + size_of_train_number + " digits";
			$('#threep1p1_input_train_tooltip').html(tooltip);
			if (reenter_trainno < popupsLimit) {
				reenter_trainno += 1;
				$('#threep1p1_input_train_tooltip').show(250).delay(500).hide(250);
			} else if (global_settimeout == 0) {
				global_settimeout = 1;
				setTimeout(function() {
					//console.log("Running timeout. Setting global_settimeout variable to 0 again");
					reenter_trainno = 0;
					global_settimeout = 0;
				}, 2500);
			}
			e.preventDefault();
			return false;
		}
	});

	$('[name="trainno2"], [name="source"], [name="dest"]').keypress(function(e) {
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

	$('[name="trainno2"], [name="source"], [name="dest"]').on('blur mouseleave', function() {
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

	$('[name="trainno"]').on('focus blur mouseleave', function() {
		if (trainnoType == 0) {
			return false;
		}
		trainnoType = 0;
		trainnolen = $('[name="trainno"]').val().length;
		if (trainnolen > 0) {
			if (trainnolen != size_of_train_number) {
				trainno = 0;
				tooltipTrainno = "The train number must be of " + size_of_train_number + " digits";
				$('[name="trainno"]').removeClass("correctinput");
				$('[name="trainno"]').addClass("wronginput");
				$('#threep1p1_input_train_tooltip').html(tooltipTrainno);
				$('#threep1p1_input_train_tooltip').show(250).delay(1500).hide(250);
			} else {
				trainno = 1;
				tooltipTrainno = "Accepted";
				$('[name="trainno"]').removeClass("wronginput");
				$('[name="trainno"]').addClass("correctinput");
				$('#threep1p1_input_train_tooltip').html(tooltipTrainno);
				$('#threep1p1_input_train_tooltip').hide(250);
			}
		} else {
			trainno = 0;
			tooltipTrainno = "Please fill out this field";
			$('[name="trainno"]').removeClass("wronginput");
			$('[name="trainno"]').removeClass("wronginput");
			$('#threep1p1_input_train_tooltip').html(tooltipTrainno);
			$('#threep1p1_input_train_tooltip').show(250).delay(1500).hide(250);
		}
		$('[name="trainno"]').attr('title', tooltipTrainno);
	});

	$('[name="doj"]').on('focus blur mouseleave', function() {
		dojlen = $('[name="doj"]').val().length;
		if (dojlen > 0) {
			doj = 1;
			tooltipDoj = "Accepted";
		} else {
			doj = 0;
			tooltipDoj = "Please fill out this field";
		}
		$('[name="doj"]').attr('title', tooltipDoj);
	});

	$('[name="trainno2"]').on('focus blur mouseleave', function() {
		var name = $(this).attr("name");
		if (type_arr[dict[name]] == 0) {
			return false;
		}
		type_arr[dict[name]] = 0;
		len = $(this).val().length;
		var tooltip;
		if (len > 0) {
			if (len != mindict[name]) {
				name_arr[dict[name]] = 0;
				tooltip = "The train number must be of " + size_of_train_number + " digits";
			} else {
				name_arr[dict[name]] = 1;
				tooltip = "Accepted";
			}
		} else {
			name_arr[dict[name]] = 0;
			tooltip = "Please fill out this field";
		}
		handleTooltips(name, tooltip, handleMsg(tooltip), 0, 1);
	});

	$('[name="start_time"], [name="end_time"], [name="start_doj"], [name="end_doj"]').on('blur', function() {
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

	$('[name="ac_coaches"], [name="sl_coaches"], [name="ac_fare"], [name="sl_fare"]').on('focus blur mouseleave', function() {
		var name = $(this).attr("name");
		if (type_arr[dict[name]] == 0) {
			return false;
		}
		type_arr[dict[name]] = 0;
		len = $(this).val().length;
		var tooltip;
		thisval = parseInt($(this).val());
		if (len > 0) {
			if (thisval < mindict[name] || thisval > maxdict[name]) {
				name_arr[dict[name]] = 0;
				tooltip = "This value must be non-negative and between " + mindict[name] + " and " + maxdict[name] + ". Both inclusive";
			} else {
				name_arr[dict[name]] = 1;
				tooltip = "Accepted";
			}
		} else {
			name_arr[dict[name]] = 0;
			tooltip = "Please fill out this field";
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

	$('#twop1p2').click(function() {
		$('#twop1p2').addClass("active");
		$('#twop1p1').removeClass("active");
		$('.three').fadeOut(250);
		$('.four').fadeIn(0);
		$('.four').addClass("animate-to-left");
		$('.three').css("left", "-100%");
	});

	$('#twop1p1').click(function() {
		$('#twop1p1').addClass("active");
		$('#twop1p2').removeClass("active");
		$('.four').fadeOut(250);
		$('.three').fadeIn(0);
		$('.three').addClass("animate-to-right");
		$('.four').css("left", "100%");
	});

	$('[name="btnSearch"]').click(function() {
		var trainnoval = $('[name="trainno"]').val();
		var dojval = $('[name="doj"]').val();
		$(".five").slideUp(0);
		$(".threep2").slideUp(0);
		$('#threep2p1').find("tr:gt(0)").remove();
		$(".five").slideDown(500);
		$.ajax({
			type: 'POST',
			url: '/admin_show_train',
			contentType: "application/json",
			/*dataType: "json",*/
			data: JSON.stringify({
				trainno: trainnoval,
				doj: dojval
			}),
			cache: false,
			processData: false,
			success: function(result) {
				$(".five").slideUp(500);
				console.log(result);
				len = result.length;
				if (len > 0) {
					var train = '';
					var i;
					for (i = 0; i < len; i++) {
						train += '<tr>';
						train += '<td>' + (i + 1) + '.</td>';
						train += '<td>' + result[i].trainno + '</td>';
						train += '<td>' + result[i].source + '</td>';
						train += '<td>' + result[i].doj + '</td>';
						train += '<td>' + result[i].start_time + '</td>';
						train += '<td>' + result[i].dest + '</td>';
						/*train += '<td>' + result[i].end_doj + '</td>';*/
						train += '<td>' + result[i].end_time + '</td>';
						train += '<td>' + result[i].ac_coaches + '</td>';
						train += '<td>' + result[i].ac_fare + '</td>';
						train += '<td>' + result[i].sl_coaches + '</td>';
						train += '<td>' + result[i].sl_fare + '</td>';
						if (result[i].ac_seats > 0) {
							train += '<td class = "available">' + result[i].ac_seats + '</td>';
						} else {
							train += '<td class = "notavailable">' + result[i].ac_seats + '</td>';
						}
						if (result[i].sl_seats > 0) {
							train += '<td class = "available">' + result[i].sl_seats + '</td>';
						} else {
							train += '<td class = "notavailable">' + result[i].sl_seats + '</td>';
						}
						train += '</tr>';
					}
					$('#threep2p1').append(train);
					$(".threep2").slideDown(500);
					$(".threep2").addClass("result");
				} else {
					msg = "No records found for this particular trainno and Date of journey";
					alert(msg);
				}
			},
			error: function() {
				console.log("Not able to get response from flask function namely showtrain");
			}
		});
	});

	$('[name="btnNEXT"]').click(function() {
		a = parseInt($('[name="ac_coaches"]').val());
		b = parseInt($('[name="sl_coaches"]').val());
		if ((a + b) == 0) {
			tooltip = "Both the number of coaches cannot be 0. Atleast one coach has to be non-zero for a valid train.";
			handleTooltips("ac_coaches", tooltip, "wrong", 0, 1);
			handleTooltips("sl_coaches", tooltip, "wrong", 0, 1);
			name_arr[dict["ac_coaches"]] = 0;
			name_arr[dict["sl_coaches"]] = 0;
			return;
		}

		// check time and date validation
		a = $('[name="start_time"]').val();
		b = $('[name="end_time"]').val();
		c = $('[name="start_doj"]').val();
		const date1 = new Date();
		const date2 = new Date(c);
		const time1 = new Date("01/01/2007 " + a);
		const time2 = new Date("01/01/2007 " + b);
		const diffDays = Math.ceil((date2 - date1) / (1000 * 60 * 60 * 24));
		const diffTime = time2 - time1;
		console.log(diffDays);
		console.log(diffTime);
		if (diffDays < 0){
			msg = "You cannot add a train in the past";
			alert(msg);
			name_arr[dict["start_doj"]] = 0;
			handleTooltips("start_doj", msg, "wrong", 0, 1);
			return;
		}
		if (diffDays < mindict["start_doj"]){
			msg = "You cannot add a train that has a start date before " + mindict["start_doj"] + " days from today";
			alert(msg);
			name_arr[dict["start_doj"]] = 0;
			handleTooltips("start_doj", msg, "wrong", 0, 1);
			return;
		}
		if (diffDays > maxdict["start_doj"]){
			msg = "You cannot add a train that has a start date after " + maxdict["start_doj"] + " days from today";
			alert(msg);
			name_arr[dict["start_doj"]] = 0;
			handleTooltips("start_doj", msg, "wrong", 0, 1);
			return;
		}
		if (diffTime <= 0){
			msg = "End time cannot be less than or equal to start_time since it is assumed that all trains start and end on same day.";
			alert(msg);
			name_arr[dict["start_time"]] = 0;
			handleTooltips("start_time", msg, "wrong", 0, 1);
			name_arr[dict["end_time"]] = 0;
			handleTooltips("end_time", msg, "wrong", 0, 1);
			return;
		}		

		$(".five").slideUp(0);
		$(".five").slideDown(500);
		$.ajax({
			type: 'POST',
			url: '/admin_add_train',
			contentType: "application/json",
			/*dataType: "json",*/
			data: JSON.stringify({
				trainno: $('[name="trainno2"]').val(),
				source: $('[name="source"]').val(),
				dest: $('[name="dest"]').val(),
				start_time: $('[name="start_time"]').val(),
				end_time: $('[name="end_time"]').val(),
				ac_coaches: $('[name="ac_coaches"]').val(),
				sl_coaches: $('[name="sl_coaches"]').val(),
				ac_fare: $('[name="ac_fare"]').val(),
				sl_fare: $('[name="sl_fare"]').val(),
				start_doj: $('[name="start_doj"]').val()
				/*end_doj: $('[name="end_doj"]').val()*/
			}),
			cache: false,
			processData: false,
			success: function(result) {
				$(".five").slideUp(250);
				if (result == "1") {
					msg = "Record Successfully Inserted.\nPress OK to empty the fields. Press cancel to retain the field values.";
					var ans = confirm(msg);
					if (ans == true) {
						resetALL();
					}
				} else if (result == "0") {
					msg = "Primary Key violation. Already a pair with same train number and date of journey exists.\nPress OK to empty the fields. Press cancel to retain the field values.";
					var ans = confirm(msg);
					if (ans == true) {
						resetALL();
					}
				} else {
					console.log("Result is neither 0 nor 1. Return value is different from flask");
					console.log("Return value is " + result);
					console.log("Return value type is " + typeof result);
				}
			},
			error: function() {
				console.log("Not able to get response from flask function namely admin_add_train");
			}
		});
	});

	setInterval(Valid, 500);
	function Valid() {
		if (trainno == 1 || doj == 1) {
			$('[name="btnSearch"]').removeClass();
			$('[name="btnSearch"]').addClass("valid");
			$('[name="btnSearch"]')[0].disabled = false;
		} else if (trainno == 0 && doj == 0) {
			$('[name="btnSearch"]').removeClass();
			$('[name="btnSearch"]').addClass("invalid");
			$('[name="btnSearch"]')[0].disabled = true;
		}
	}

	setInterval(Valid1, 500);
	function Valid1() {
		var test = 1;
		for (i = 0; i < total_fields; i++) {
			if (name_arr[i] == 0) {
				test = 0;
				break;
			}
		}
		if (test == 1) {
			$('[name="btnNEXT"]').removeClass();
			$('[name="btnNEXT"]').addClass("valid1");
			$('[name="btnNEXT"]')[0].disabled = false;
		} else {
			$('[name="btnNEXT"]').removeClass();
			$('[name="btnNEXT"]').addClass("invalid1");
			$('[name="btnNEXT"]')[0].disabled = true;
		}
	}
});