var total_fields = 2;
name_arr = new Array(total_fields).fill(0);
type_arr = new Array(total_fields).fill(0);
reenter_arr = new Array(total_fields).fill(0);
global_settimeout_arr = new Array(total_fields).fill(0);

var popupsLimit = 3; /*This tells how many consecutive popups allowed on restricted keys*/;

var dict = {
	source: 0,
	dest: 1
}
var mindict = {
	source: 1 /*min character length*/,
	dest: 1 /*min character length*/
}

var maxdict = {
	source: 40 /*max character length*/,
	dest: 40 /*max character length*/
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
				$('[name="' + name + '"]').attr('title', text);
				$('[name="' + name + '"]').removeClass();
				$('[name="' + name + '"]').addClass(wrong_correct + "input");
			} else {
				$('[name="' + name + '"]').attr('title', text);
				$('[name="' + name + '"]').removeClass();
			}
		}

		// tooltip element
		if (show == 1) {
			$(tooltip).html(text);
			$(tooltip).show(250).delay(500).hide(250);
		} else {
			$(tooltip).html(text);
			$(tooltip).hide(0);
		}
		if (type == 1) {
			$(tooltip).delay(750).hide(250);
		}
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
		handleTooltips(name, "", "", 0, 0);
		//console.log(value);

		// Here is an exception that "enter" is allowed
		if (value == 13) {
			var tooltip = "New-line not allowed";
			reenterPopup(name, tooltip, "wrong1", 1, 1);
			e.preventDefault();
			return false;
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

	$('[name="source"], [name="dest"]').keypress(function(e) {
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

	$('[name="source"], [name="dest"]').on('blur mouseleave', function() {
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
		$("#threep2p1").hide(0);
		$(".threep2 h3").hide(0);

		sourceval = $('[name="source"]').val();
		destval = $('[name="dest"]').val();
		if(sourceval == destval){
			msg = "Source and Destination Stations cannot be same";
			alert(msg);
			return;
		}

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
				$(".threep2").slideDown(500);
				console.log(result);
				len = result.length;
				if (len > 1) {
					var train = '';
					var i;
					if(result[0] == "1"){
						for (i = 1; i <len; i++) {
							train += '<tr>';
							train += '<td>' + i + '.</td>';
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
					} else if(result[0] == "2"){
						for (i = 1, k = 1; i < len; i += 2, k++) {
							train += '<tr class="passrow">';
							train += '<td rowspan="3" class="lasttd">' + k + '.</td>';
							train += '</tr>';
							for(var j = 0; j<2; j++){
								train += '<tr>';
								train += '<td>' + result[i+j].trainno + '</td>';
								train += '<td>' + result[i+j].source + '</td>';
								train += '<td>' + result[i+j].doj + '</td>';
								train += '<td>' + result[i+j].start_time + '</td>';
								train += '<td>' + result[i+j].dest + '</td>';
								/*train += '<td>' + result[i+j].end_doj + '</td>';*/
								train += '<td>' + result[i+j].end_time + '</td>';
								train += '<td>' + result[i+j].ac_coaches + '</td>';
								train += '<td>' + result[i+j].ac_fare + '</td>';
								train += '<td>' + result[i+j].sl_coaches + '</td>';
								train += '<td>' + result[i+j].sl_fare + '</td>';
								if (result[i+j].ac_seats > 0) {
									train += '<td class = "available">' + result[i+j].ac_seats + '</td>';
								} else {
									train += '<td class = "notavailable">' + result[i+j].ac_seats + '</td>';
								}
								if (result[i+j].sl_seats > 0) {
									train += '<td class = "available">' + result[i+j].sl_seats + '</td>';
								} else {
									train += '<td class = "notavailable">' + result[i+j].sl_seats + '</td>';
								}
								train += '</tr>';
							}
							if(i < len-2){
								train += '<tr style="height: 35px;"><td colspan="13"></td></tr>';
							}
						}
					}
					$('#threep2p1').append(train);
					$("#threep2p1").show(0);
				} else {
					msg = "No trains found for this particular source and destination";
					console.log(msg);
					$(".threep2 h3").show(0);
				}
			},
			error: function() {
				console.log("Not able to get response from flask function namely source_dest_search");
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