var total_fields = 2;
name_arr = new Array(total_fields).fill(0);
type_arr = new Array(total_fields).fill(0);
reenter_arr = new Array(total_fields).fill(0);
global_settimeout_arr = new Array(total_fields).fill(0);

var size_of_station = 40;

var dict = {
	source: 0,
	dest: 1
}

var msgdict = {
	"Accepted": "correct",
	"Please fill out this field": "wrong"
}

$(document).ready(function() {
	$('.five').fadeOut(0);

	function handleTooltips(input, name, text, wrong_correct, type, show = 1) {
		var tooltip = $('#threep1p1_input_' + name + '_tooltip');
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

	var regExpNonPrintable = /[^ -~]/;
	var regExpNum = /[0-9]/;
	var regExpAlpha = /[a-zA-Z]/;
	$('input').on('keypress', function(e) {
		var value = e.key;
		var name = $(this).attr("name");
		handleTooltips(this, name, "Currently accepting input", "", 0, 0);
		//console.log(value);

		// Here is an exception that "enter" is allowed
		if (value == 13) {
			e.preventDefault();
			return false;
		}

		if (name == "source" || name == "dest") {
			if (!regExpAlpha.test(value)) {
				var tooltip = "Only alphabets are allowed i.e. a-z or A-Z";
				handleTooltips(this, name, tooltip, "wrong1", 1);
				e.preventDefault();
			} else {
				name_arr[dict[name]] = 0;
				type_arr[dict[name]] = 1;
			}
			return;
		}
	});

	$('input').on('keydown', function(e) {
		var name = $(this).attr("name");
		if (e.which == 32) {
			var tooltip = "Cannot input space in this field";
			handleTooltips(this, name, tooltip, "wrong1", 1);
			e.preventDefault();
			return false;
		}
	});

	$('input').on('keyup', function(e) {
		var name = $(this).attr("name");
		if (e.which == 8 || e.which == 46) {
			handleTooltips(this, name, "Currently accepting input", "", 0, 0);
			if ($(this).val().length == 0) {
				var tooltip = "Please fill out this field";
				handleTooltips(this, name, tooltip, "wrong", 0);
			}
			name_arr[dict[name]] = 0;
			type_arr[dict[name]] = 1;
		}
	});

	$('[name="source"], [name="dest"]').keypress(function(e) {
		var name = $(this).attr("name");
		if ($(this).val().length > (size_of_station - 1)) {
			tooltip = "Cannot input more than " + size_of_station + " characters";
			if (reenter_arr[dict[name]] < 5) {
				reenter_arr[dict[name]] += 1;
				handleTooltips(this, name, tooltip, "wrong1", 1, 1);
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
		handleTooltips(this, name, tooltip, handleMsg(tooltip), 0, 1);
	});

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

	$('[name="btnSearch"]').click(function() {
		$(".five").slideUp(0);
		$(".threep2").slideUp(0);
		$('#threep2p1 tbody').empty();
		$(".five").slideDown(500);
		$.ajax({
			type: 'POST',
			url: '/source_dest_search',
			contentType: "application/json",
			/*dataType: "json",*/
			data: JSON.stringify({
				source: $('[name="source"]').val(),
				dest: $('[name="dest"]').val()
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

	setInterval(Valid, 500);
	function Valid() {
		var test = 1;
		for (i = 0; i < total_fields; i++) {
			if (name_arr[i] == 0) {
				test = 0;
				break;
			}
		}
		if (test == 1) {
			$('[name="btnSearch"]').removeClass();
			$('[name="btnSearch"]').addClass("valid");
			$('[name="btnSearch"]')[0].disabled = false;
		} else {
			$('[name="btnSearch"]').removeClass();
			$('[name="btnSearch"]').addClass("invalid");
			$('[name="btnSearch"]')[0].disabled = true;
		}
	}
});