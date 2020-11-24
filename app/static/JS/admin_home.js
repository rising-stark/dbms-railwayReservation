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
var size_of_train_number = 4,
	size_of_station = 40,
	ac_fare_max = 5000,
	sl_fare_max = 2000,
	max_coaches = 100;
name_arr[6] = 1;
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
	sl_fare: 10,
}

var msgdict = {
	"Accepted": "correct",
	"Please fill out this field": "wrong"
}

$(document).ready(function() {
	// initializations for validation
	trainno = 0;
	doj = 0;
	reenter_trainno = 0;
	global_settimeout = 0;

	$('.five').fadeOut(0);

	function handleTooltips(input, text, wrong_correct, type, show = 1) {
		var img = $(input).parent().next().children("img")[0];
		var tooltip = $(input).parent().next().next().children("span")[type];
		if (type == 0) {
			// input element
			if (show == 1) {
				$(input).attr('title', text);
				$(input).removeClass();
				$(input).addClass(wrong_correct + "input");
			} else {
				$(input).attr('title', text);
				$(input).removeClass();
			}

			//image element
			if (show == 1) {
				$(img).attr("src", "../static/IMAGES/" + wrong_correct + ".gif");
				$(img).prop("alt", wrong_correct);
				$(img).attr("hidden", false);
			} else {
				$(img).attr("src", "");
				$(img).prop("alt", "None");
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
			$(tooltip).delay(750).hide(250);;
		}
	}

	function handleMsg(text) {
		if (typeof msgdict[text] == 'undefined') {
			return "wrong";
		}
		return msgdict[text];
	}

	var regExpNonPrintable = /[^ -~]/;
	var regExpNum = /[0-9]/;
	var regExpAlpha = /[a-zA-Z]/;
	$('input').on('keypress', function(e) {
		var value = e.key;
		var name = $(this).attr("name");
		handleTooltips(this, "Currently accepting input", "", 0, 0);
		//console.log(value);

		// Here is an exception that "enter" is allowed
		if (value == 13) {
			e.preventDefault();
			return false;
		}

		if (name == "trainno") {
			if (!regExpNum.test(value)) {
				var tooltip = "Only Numbers are allowed i.e. 0-9";
				$('#threep1p1_input_train_tooltip').html(tooltip);
				$('#threep1p1_input_train_tooltip').show(250).delay(500).hide(250);
				e.preventDefault();
				return false;
			} else {
				trainnoType = 1;
				trainno = 0;
			}
		}

		if (name == "trainno2" || name == "ac_fare" || name == "sl_fare" || name == "ac_coaches" || name == "sl_coaches") {
			if (!regExpNum.test(value)) {
				var tooltip = "Only Numbers are allowed i.e. 0-9";
				handleTooltips(this, tooltip, "wrong1", 1);
				e.preventDefault();
				return false;
			}
		}

		if (name == "source" || name == "dest") {
			if (!regExpAlpha.test(value)) {
				var tooltip = "Only alphabets are allowed i.e. a-z or A-Z";
				handleTooltips(this, tooltip, "wrong1", 1);
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
				handleTooltips(this, tooltip, "wrong1", 1);
			}
			e.preventDefault();
			return false;
		}
	});

	$('input').on('keyup', function(e) {
		var name = $(this).attr("name");
		if (e.which == 8 || e.which == 46) {
			handleTooltips(this, "Currently accepting input", "", 0, 0);
			if ($(this).val().length == 0) {
				var tooltip = "Please fill out this field";
				if (name == "trainno") {
					$('#threep1p1_input_train_tooltip').html(tooltip);
					$('#threep1p1_input_train_tooltip').show(250).delay(500).hide(250);
				} else {
					handleTooltips(this, tooltip, "wrong", 0);
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
			if (reenter_trainno < size_of_train_number) {
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

	$('[name="trainno2"]').keypress(function(e) {
		var name = $(this).attr("name");
		if ($(this).val().length > (size_of_train_number - 1)) {
			tooltip = "Cannot input more than " + size_of_train_number + " digits";
			if (reenter_arr[dict[name]] < size_of_train_number) {
				reenter_arr[dict[name]] += 1;
				handleTooltips(this, tooltip, "wrong1", 1, 1);
			} else if (global_settimeout_arr[dict[name]] == 0) {
				global_settimeout_arr[dict[name]] = 1;
				setTimeout(function() {
					//console.log("Running timeout2. Setting global_settimeout2 variable2 to 0 again");
					reenter_arr[dict[name]] = 0;
					global_settimeout_arr[dict[name]] = 0;
				}, 2500);
			}
			e.preventDefault();
			return false;
		}
	});

	$('[name="source"], [name="dest"]').keypress(function(e) {
		var name = $(this).attr("name");
		if ($(this).val().length > (size_of_station - 1)) {
			tooltip = "Cannot input more than " + size_of_station + " characters";
			if (reenter_arr[dict[name]] < size_of_station) {
				reenter_arr[dict[name]] += 1;
				handleTooltips(this, tooltip, "wrong1", 1, 1);
			} else if (global_settimeout_arr[dict[name]] == 0) {
				global_settimeout_arr[dict[name]] = 1;
				setTimeout(function() {
					//console.log("Running timeout2. Setting global_settimeout2 variable2 to 0 again");
					reenter_arr[dict[name]] = 0;
					global_settimeout_arr[dict[name]] = 0;
				}, 2500);
			}
			e.preventDefault();
			return false;
		}
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
			if (len != size_of_train_number) {
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
		handleTooltips(this, tooltip, handleMsg(tooltip), 0, 1);
	});

	$('[name="source"], [name="dest"]').on('focus blur mouseleave', function() {
		var name = $(this).attr("name");
		if (type_arr[dict[name]] == 0) {
			return false;
		}
		type_arr[dict[name]] = 0;
		len = $(this).val().length;
		var tooltip;
		if (len > 0) {
			name_arr[dict[name]] = 1;
			tooltip = "Accepted";
		} else {
			name_arr[dict[name]] = 0;
			tooltip = "Please fill out this field";
		}
		handleTooltips(this, tooltip, handleMsg(tooltip), 0, 1);
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
		handleTooltips(this, tooltip, handleMsg(tooltip), 0, 1);
	});

	$('[name="ac_coaches"]').on('focus blur mouseleave', function() {
		var name = $(this).attr("name");
		if (type_arr[dict[name]] == 0) {
			return false;
		}
		type_arr[dict[name]] = 0;
		len = $(this).val().length;
		var tooltip;
		ac_coachval = parseInt($('[name="ac_coaches"]').val());
		if (len > 0) {
			if (ac_coachval <= 0 || ac_coachval > max_coaches) {
				name_arr[dict[name]] = 0;
				tooltip = "AC coaches must be less than " + max_coaches;
			} else {
				name_arr[dict[name]] = 1;
				tooltip = "Accepted";
			}
		} else {
			name_arr[dict[name]] = 0;
			tooltip = "Please fill out this field";
		}
		handleTooltips(this, tooltip, handleMsg(tooltip), 0, 1);
	});

	$('[name="sl_coaches"]').on('focus blur mouseleave', function() {
		var name = $(this).attr("name");
		if (type_arr[dict[name]] == 0) {
			return false;
		}
		type_arr[dict[name]] = 0;
		len = $(this).val().length;
		var tooltip;
		sl_coachval = parseInt($('[name="sl_coaches"]').val());
		if (len > 0) {
			if (sl_coachval <= 0 || sl_coachval > max_coaches) {
				name_arr[dict[name]] = 0;
				tooltip = "SL coaches must be less than " + max_coaches;
			} else {
				name_arr[dict[name]] = 1;
				tooltip = "Accepted";
			}
		} else {
			name_arr[dict[name]] = 0;
			tooltip = "Please fill out this field";
		}
		handleTooltips(this, tooltip, handleMsg(tooltip), 0, 1);
	});

	$('[name="ac_fare"]').on('focus blur mouseleave', function() {
		var name = $(this).attr("name");
		if (type_arr[dict[name]] == 0) {
			return false;
		}
		type_arr[dict[name]] = 0;
		len = $(this).val().length;
		var tooltip;
		ac_fareval = parseInt($('[name="ac_fare"]').val());
		if (len > 0) {
			if (ac_fareval <= 0 || ac_fareval > ac_fare_max) {
				name_arr[dict[name]] = 0;
				tooltip = "AC fare must be non-zero and less than " + ac_fare_max;
			} else {
				name_arr[dict[name]] = 1;
				tooltip = "Accepted";
			}
		} else {
			name_arr[dict[name]] = 0;
			tooltip = "Please fill out this field";
		}
		handleTooltips(this, tooltip, handleMsg(tooltip), 0, 1);
	});

	$('[name="sl_fare"]').on('focus blur mouseleave', function() {
		var name = $(this).attr("name");
		if (type_arr[dict[name]] == 0) {
			return false;
		}
		type_arr[dict[name]] = 0;
		len = $(this).val().length;
		var tooltip;
		sl_fareval = parseInt($('[name="sl_fare"]').val());
		if (len > 0) {
			if (sl_fareval <= 0 || sl_fareval > sl_fare_max) {
				name_arr[dict[name]] = 0;
				tooltip = "SL fare must be non-zero and less than " + sl_fare_max;
			} else {
				name_arr[dict[name]] = 1;
				tooltip = "Accepted";
			}
		} else {
			name_arr[dict[name]] = 0;
			tooltip = "Please fill out this field";
		}
		handleTooltips(this, tooltip, handleMsg(tooltip), 0, 1);
	});

	$("img[id$=img]").click(function() {
		var item = $(this).parent().next().children("span")[0];
		$(item).slideToggle(250);
	});

	/*
	This snippet is not working
	$("table td span.wrong").click(function(){
		console.log("H");
		$(this).hide(250);
	});
	*/

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
		if ((trainnoval.length == 0 && dojval.length != 0) || ((trainnoval.length != 0 && dojval.length == 0))) {
			$(".five").slideUp(0);
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
		}
	});

	$('[name="btnNEXT"]').click(function() {
		a = parseInt($('[name="ac_coaches"]').val());
		b = parseInt($('[name="sl_coaches"]').val());
		if ((a + b) == 0) {
			tooltip = "Both the number of coaches cannot be 0. Atleast one coach has to be non-zero for a valid train.";
			handleTooltips('[name="ac_coaches"]', tooltip, "wrong", 0, 1);
			handleTooltips('[name="sl_coaches"]', tooltip, "wrong", 0, 1);
			name_arr[dict["ac_coaches"]] = 0;
			name_arr[dict["sl_coaches"]] = 0;
			return;
		}

		/* 
		check time and date validation
		a = $('[name="start_time"]').val();
		b = $('[name="end_time"]').val();
		c = $('[name="start_doj"]').val();
		d = $('[name="end_doj"]').val();
		const date1 = new Date(c);
		const date2 = new Date(d);
		const time1 = new Date(a);
		const time2 = new Date(b);
		const diffDays = Math.ceil(date2 - date1 / (1000 * 60 * 60 * 24));
		const diffTime = time2 - time1;
		console.log(diffTime);
		return;
		*/

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
				start_doj: $('[name="start_doj"]').val(),
				/*end_doj: $('[name="end_doj"]').val()*/
			}),
			cache: false,
			processData: false,
			success: function(result) {
				if (result == "1") {
					msg = "Record Successfully Inserted.<br>Press OK to empty the fields. Press cancel to retain the field values.";
					$(".five").slideUp(250);
					var ans = confirm(msg);
					if (ans == true) {
						$('input').val("");
					}
				} else if (result == "0") {
					msg = "Primary Key violation. Already a pair with same train number and date of journey exists.<br>Press OK to empty the fields. Press cancel to retain the field values.";
					$(".five").slideUp(250);
					var ans = confirm(msg);
					if (ans == true) {
						$('input').val("");
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