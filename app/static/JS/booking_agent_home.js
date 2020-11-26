var trainnoType = 0,
	dojType = 0;
var trainno, doj;
var tooltipTrainno, tooltipDoj;
var reenter_trainno, global_settimeout;

var total_fields = 3;
name_arr = new Array(total_fields).fill(0);
type_arr = new Array(total_fields).fill(0);
reenter_arr = new Array(total_fields).fill(0);
global_settimeout_arr = new Array(total_fields).fill(0);

var total_fields1 = 0;
name_arr1 = [];
type_arr1 = [];
reenter_arr1 = [];
global_settimeout_arr1 = [];

var size_of_train_number = 4;
var popupsLimit = 3; /*This tells how many consecutive popups allowed on restricted keys*/

var dict = {
	trainno2: 0,
	start_doj2: 1,
	coach: 2
};

/*
If both min and max values are set 0 then it means
no integer or character length constraint possible
*/
var mindict = {
	trainno2: 4,
	start_doj2: 1 /*1 day gap before booking train*/,
	coach: 0
}

var mindict = {
	trainno2: 4,
	start_doj2: 120 /*Cannot book a train before 120 days*/,
	coach: 0
}
var dict1 = {};

var msgdict = {
	"Accepted": "correct",
	"Please fill out this field": "wrong"
};

$(document).ready(function() {
	// initializations for validation
	trainno = 0;
	doj = 0;
	reenter_trainno = 0;
	global_settimeout = 0;

	$('.seven').fadeOut(0);

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

	$(document).click(function(event) {
		if (!event.target.matches('.onep1 img') && !event.target.matches('#onep1p1') && !event.target.matches('#uname')) {
			$('.dropdown').slideUp(500).removeClass('active');
		} else {
			if ($('.dropdown').hasClass("active")){
				$('.dropdown').slideUp(500).removeClass('active');
			}
			else{
				$('.dropdown').slideDown(500).addClass('active');
			}
		}
	});

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

		if (name == "trainno2") {
			if (!regExpNum.test(value)) {
				var tooltip = "Only Numbers are allowed i.e. 0-9";
				handleTooltips(name, tooltip, "wrong1", 1);
				e.preventDefault();
				return false;
			}
		}
		name_arr[dict[name]] = 0;
		type_arr[dict[name]] = 1;
	});

	$("#fivep2p1").on('keypress', '[name^="fname"], [name^="lname"]', function(e) {
		var value = e.key;
		var name = $(this).attr("name");
		var index = parseInt($(this).parent().prev().html());
		index--;
		handleTooltips(name, "", "", 0, 0);
		//console.log(value);

		// Here is an exception that "enter" is allowed
		if (value == 13) {
			e.preventDefault();
			return false;
		}

		if (!regExpAlpha.test(value)) {
			var tooltip = "Only alphabets are allowed i.e. a-z or A-Z";
			handleTooltips(name, tooltip, "wrong1", 1);
			e.preventDefault();
			return false;
		}

		name_arr1[dict1[name]] = 0;
		type_arr1[dict1[name]] = 1;
	});

	$("#fivep2p1").on('keypress', '[name^="age"]', function(e) {
		var value = e.key;
		var name = $(this).attr("name");
		var index = parseInt($(this).parent().prev().html());
		index--;
		handleTooltips(name, "", "", 0, 0);
		//console.log(value);

		// Here is an exception that "enter" is allowed
		if (value == 13) {
			e.preventDefault();
			return false;
		}

		if (!regExpNum.test(value)) {
			var tooltip = "Only Numbers are allowed i.e. 0-9";
			handleTooltips(name, tooltip, "wrong1", 1);
			e.preventDefault();
			return false;
		}

		name_arr1[dict1[name]] = 0;
		type_arr1[dict1[name]] = 1;
	});

	$('input').on('keydown', function(e) {
		var name = $(this).attr("name");
		if (e.which == 32) {
			var tooltip = "Cannot input space in this field";
			if (name == "trainno") {
				$('#threep1p1_input_train_tooltip').html(tooltip);
				$('#threep1p1_input_train_tooltip').show(250).delay(500).hide(250);
			} else {
				handleTooltips(name, tooltip, "wrong1", 1);
			}
			e.preventDefault();
			return false;
		}
	});

	$("#fivep2p1").on('keydown', '[name^="fname"], [name^="lname"], [name^="age"]', function(e) {
		if (e.which == 32) {
			var tooltip = "Cannot input space in this field";
			handleTooltips(name, tooltip, "wrong1", 1);
			e.preventDefault();
			return false;
		}
	});

	$('input').on('keyup', function(e) {
		var name = $(this).attr("name");
		if (e.which == 8 || e.which == 46) {
			handleTooltips(name, "Currently accepting input", "", 0, 0);
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

	$("#fivep2p1").on('keyup', '[name^="fname"], [name^="lname"], [name^="age"]', function(e) {
		var name = $(this).attr("name");
		if (e.which == 8 || e.which == 46) {
			handleTooltips(name, "Currently accepting input", "", 0, 0);
			if ($(this).val().length == 0) {
				var tooltip = "Please fill out this field";
				handleTooltips(name, tooltip, "wrong", 0);
			}
			name_arr[dict[name]] = 0;
			type_arr[dict[name]] = 1;
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
				handleTooltips(name, tooltip, "wrong1", 1, 1);
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
		handleTooltips(name, tooltip, handleMsg(tooltip), 0, 1);
	});

	$('[name="start_doj2"]').on('blur', function() {
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

	$('[name="coach"]').click(function() {
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

	$("#fivep2p1").on('focus blur mouseleave', '[name^="fname"], [name^="lname"]', function() {
		var name = $(this).attr("name");
		if (type_arr1[dict1[name]] == 0) {
			return false;
		}
		type_arr1[dict1[name]] = 0;
		len = $(this).val().length;
		var tooltip;
		if (len > 0) {
			name_arr1[dict1[name]] = 1;
			tooltip = "Accepted";
		} else {
			name_arr1[dict1[name]] = 0;
			tooltip = "Please fill out this field";
		}
		handleTooltips(name, tooltip, handleMsg(tooltip), 0, 1);
	});

	$("#fivep2p1").on('focus blur mouseleave', '[name^="age"]', function() {
		var name = $(this).attr("name");
		if (type_arr1[dict1[name]] == 0) {
			return false;
		}
		type_arr1[dict1[name]] = 0;
		len = $(this).val().length;
		ageval = parseInt($(this).val());
		var tooltip;
		if (len > 0) {
			if (ageval <= 0 || ageval > max_age) {
				name_arr1[dict1[name]] = 0;
				tooltip = "Age must be non-zero and less than " + max_age;
			} else {
				name_arr1[dict1[name]] = 1;
				tooltip = "Accepted";
			}
		} else {
			name_arr1[dict1[name]] = 0;
			tooltip = "Please fill out this field";
		}
		handleTooltips(name, tooltip, handleMsg(tooltip), 0, 1);
	});

	$("#fivep2p1").on('click', '[name^="gender"]', function() {
		var name = $(this).attr("name");
		var a = $('select[name="' + name + '"] option:selected').val();
		var tooltip;
		if (a == "0") {
			name_arr1[dict1[name]] = 0;
			tooltip = "Please fill out this field";
		} else {
			name_arr1[dict1[name]] = 1;
			tooltip = "Accepted";
		}
		handleTooltips(name, tooltip, handleMsg(tooltip), 0, 1);
	});

	$("#addRow").click(function() {
		acSeats = parseInt($("#acSeats").html());
		slSeats = parseInt($("#slSeats").html());
		coach = $('[name="coach"]').val();
		console.log(acSeats);
		console.log(slSeats);
		console.log(coach);
		if (coach == "A") {
			if (total_fields1 == acSeats) {
				msg = "You have added enough passengers. Cannot add more rows";
				alert(msg);
				return;
			}
		} else if (coach == "S") {
			if (total_fields1 == slSeats) {
				msg = "You have added enough passengers. Cannot add more rows";
				alert(msg);
				return;
			}
		}
		for (var i = 0; i < 4; i++) {
			name_arr1.push(0);
			type_arr1.push(0);
			reenter_arr1.push(0);
			global_settimeout_arr1.push(0);
		}
		dict1["fname" + total_fields1] = (total_fields1 * 4);
		dict1["lname" + total_fields1] = (total_fields1 * 4) + 1;
		dict1["age" + total_fields1] = (total_fields1 * 4) + 2;
		dict1["gender" + total_fields1] = (total_fields1 * 4) + 3;

		$("#addRowtr").before('<tr>' +
			'<td width="6%">' + (total_fields1 + 1) + '</td>' +
			'<td width="22%"><input type="text" name="fname' + total_fields1 + '"></td>' +
			'<td width="1%"><img id="fnameimg' + total_fields1 + '" src="../static/IMAGES/wrong.gif" alt="wrong" hidden="true"/></td>' +
			'<td width="1%"><span></span><span></span></td>' +
			'<td width="22%"><input type="text" name="lname' + total_fields1 + '"></td>' +
			'<td width="1%"><img id="lnameimg' + total_fields1 + '" src="../static/IMAGES/wrong.gif" alt="wrong" hidden="true"/></td>' +
			'<td width="1%"><span></span><span></span></td>' +
			'<td width="17%"><input type="text" name="age' + total_fields1 + '"></td>' +
			'<td width="1%"><img id="ageimg' + total_fields1 + '" src="../static/IMAGES/wrong.gif" alt="wrong" hidden="true"/></td>' +
			'<td width="1%"><span></span><span></span></td>' +
			'<td width="17%">' +
			'<select name="gender' + total_fields1 + '" required>' +
			'<option value="0">-- Choose Gender --</option>' +
			'<option value="M">Male</option>' +
			'<option value="F">Female</option>' +
			'<option value="O">Other</option>' +
			'</select>' +
			'</td>' +
			'<td width="1%"><img id="genderimg' + total_fields1 + '" src="../static/IMAGES/wrong.gif" alt="wrong" hidden="true"/></td>' +
			'<td width="1%"><span></span><span></span></td>' +
			'<td width="8%" class="cancel"><span>X</span></td>' +
			'</tr>');
		total_fields1++;
		$("#totalPassengersAdded").html(total_fields1);
	});

	$(".cancel").click(function() {
		name_arr1.push(0);
		type_arr1.push(0);
		reenter_arr1.push(0);
		global_settimeout_arr1.push(0);
		dict1["fname" + total_fields1] = (total_fields1 * 4) + 0;
		dict1["lname" + total_fields1] = (total_fields1 * 4) + 1;
		dict1["age" + total_fields1] = (total_fields1 * 4) + 2;
		dict1["gender" + total_fields1] = (total_fields1 * 4) + 3;

		total_fields1--;
		$("#totalPassengersAdded").html(total_fields1);
	});

	$("img[id$=img]").click(function() {
		var item = $(this).parent().next().children("span")[0];
		$(item).slideToggle(250);
	});

	$("#fivep2p1").on('click', "img[id*=img]", function() {
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

	$('#btnSUBMITdiv').mouseenter(function() {
		if ($('#btnSUBMIT').is(':disabled')) {
			$('#btnSUBMITdiv_tooltip').show(250);
		}
	});

	$('#btnSUBMITdiv').on('mouseleave', function() {
		if ($('#btnSUBMIT').is(':disabled')) {
			$('#btnSUBMITdiv_tooltip').hide(250);
		}
	});

	$('#twop1p1').click(function() {
		$('.twop1p1').removeClass("active");
		$('#twop1p1').addClass("active");
		$('.four').fadeOut(250);
		$('.five').fadeOut(250);
		$('.three').fadeIn(0);
		$('.three').addClass("animate-to-left");
		$('.four').css("left", "100%");
		$('.five').css("left", "100%");
	});

	$('#twop1p2').click(function() {
		$('.twop1p1').removeClass("active");
		$('#twop1p2').addClass("active");
		$('.three').fadeOut(250);
		$('.five').fadeOut(250);
		$('.four').fadeIn(0);
		$('.four').addClass("animate-to-left");
		$('.three').css("left", "100%");
		$('.five').css("left", "100%");
		$('#fourp1p1 tbody').empty();
		$.ajax({
			type: 'POST',
			url: '/my_bookings',
			contentType: "application/json",
			/*dataType: "json",*/
			data: JSON.stringify({
				uname: $("#uname").html()
			}),
			cache: false,
			processData: false,
			success: function(result){
				$(".seven").slideUp(500);
				console.log(result);
				len = result.length;
				if(len > 0){
					var train = ''; 
					var i;
					for(i = 0; i < len; i++){
						var num = result[i].length+1;
						var j=0;
						train += '<tr class="passrow">';
						train += '<td rowspan=\"'+num+'\">' + (i+1) + '.</td>';
						train += '<td rowspan=\"'+num+'\">' + result[i][j].trainno + '</td>';
						train += '<td rowspan=\"'+num+'\">' + result[i][j].pnr + '</td>';
						train += '<td rowspan=\"'+num+'\">' + result[i][j].source + '</td>';
						train += '<td rowspan=\"'+num+'\">' + result[i][j].doj + '</td>';
						train += '<td rowspan=\"'+num+'\">' + result[i][j].start_time + '</td>';
						train += '<td rowspan=\"'+num+'\">' + result[i][j].dest + '</td>';
						train += '<td rowspan=\"'+num+'\" class="lasttd">' + result[i][j].end_time + '</td>';
						/*train += '<td rowspan=\"'+num+'\">' + result[i][j].amount + '</td>';*/
						train += '</tr>';
						for(j = 0; j<num-1;j++){
							train += '<tr>';
							train += '<td>' + result[i][j].fname + ' ' + result[i][j].lname + '</td>';
							train += '<td>' + result[i][j].age + '</td>';
							train += '<td>' + result[i][j].gender + '</td>';
							train += '<td>' + result[i][j].coach + '</td>';
							train += '<td>' + result[i][j].seatno + '</td>';
							train += '<td>' + result[i][j].berth + '</td>';
							train += '</tr>';
						}
					}
					$('#fourp1p1').append(train);
					$("#fourp1 h3").hide();
					$("#fourp1p1").slideDown(500);
				}
				else{
					$("#fourp1 h3").show();
					$("#fourp1p1").hide();
				}
			},
			error: function(){
				console.log("Not able to get response from flask function namely my_bookings");
			}
		});
	});

	$('#twop1p3').click(function() {
		$('.twop1p1').removeClass("active");
		$('#twop1p3').addClass("active");
		$('.three').fadeOut(250);
		$('.four').fadeOut(250);
		$('.five').fadeIn(0);
		$('.five').addClass("animate-to-left");
		$('.three').css("left", "100%");
		$('.four').css("left", "100%");
	});

	$('[name="btnSearch"]').click(function() {
		var trainnoval = $('[name="trainno"]').val();
		var dojval = $('[name="doj"]').val();
		$(".seven").slideUp(0);
		$(".threep2").slideUp(0);
		$('#threep2p1').find("tr:gt(0)").remove();
		$(".seven").slideDown(500);
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
				$(".seven").delay(100).slideUp(500);
				console.log(result);
				len = result.length;
				if (len > 0) {
					$(".seven").delay(100).slideUp(500);
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
		$(".seven").slideUp(0);
		$(".seven").slideDown(500);
		$.ajax({
			type: 'POST',
			url: '/book_ticket1',
			contentType: "application/json",
			/*dataType: "json",*/
			data: JSON.stringify({
				trainno: $('[name="trainno2"]').val(),
				start_doj: $('[name="start_doj2"]').val(),
				coach: $('[name="coach"]').val()
			}),
			cache: false,
			processData: false,
			success: function(result) {
				$(".seven").slideUp(250);
				console.log(result);
				len = result.length;
				if (len > 0) {
					msg = "Please Fill the passenger details below";
					console.log(msg);
					$("#acSeats").html(result[0].ac_seats);
					$("#slSeats").html(result[0].sl_seats);
					$("#fivep1").slideUp(250);
					$("#fivep2").slideDown(500);
				} else {
					msg = "No train found on this particular date. Please choose another train or date of journey";
					alert(msg);
				}
			},
			error: function() {
				console.log("Not able to get response from flask function namely book_ticket1");
			}
		});
	});

	$('[name="btnBACK"]').click(function() {
		$("#fivep2").slideUp(250);
		$("#fivep1").slideDown(500);
	});

	$('[name="btnSUBMIT"]').click(function() {
		$(".seven").slideUp(0);
		$(".seven").slideDown(500);
		$.ajax({
			type: 'POST',
			url: '/book_ticket2',
			contentType: "application/json",
			/*dataType: "json",*/
			data: JSON.stringify({
				trainno: $('[name="trainno2"]').val(),
				start_doj: $('[name="start_doj2"]').val(),
				coach: $('[name="coach"]').val(),
				no_of_passengers: total_fields1
			}),
			cache: false,
			processData: false,
			success: function(result) {
				console.log(result);
				$(".seven").slideUp(250);
				$("#fivep1").slideUp(250);
				$("#fivep2").slideUp(250);
				$("#fivep3").slideDown(250);
				$("#finalFare").html(result);
			},
			error: function() {
				console.log("Not able to get response from flask function namely book_ticket2");
			}
		});
	});

	$('[name="btnCONFIRM"]').click(function() {
		$(".seven").slideUp(0);
		$(".seven").slideDown(500);
		fname = [];
		lname = [];
		age = [];
		gender = [];
		dict2 = {};
		for (const [key, value] of Object.entries(dict1)) {
			dict2[key] = ($('[name="' + key + '"]').val());
		}
		console.log(dict2);

		$.ajax({
			type: 'POST',
			url: '/book_ticket3',
			contentType: "application/json",
			/*dataType: "json",*/
			data: JSON.stringify({
				trainno: $('[name="trainno2"]').val(),
				start_doj: $('[name="start_doj2"]').val(),
				coach: $('[name="coach"]').val(),
				no_of_passengers: total_fields1,
				fare: $("#finalFare").html(),
				uname: $("#uname").html(),
				dict1: dict2
			}),
			cache: false,
			processData: false,
			success: function(result) {
				$(".seven").slideUp(250);
				if (result == "1") {
					msg = "Seats Booked. Redirecting you to Search Train page";
					alert(msg);
					window.location.href='http://127.0.0.1:5000/booking_agent_home';
				} else if (result == "0") {
					msg = "Not enough seats left. Book seats for another train no. or date of journey";
					alert(msg);
					$("#finalFare").html("0");
					$("#fivep1").slideDown(250);
					$("#fivep2").slideUp(250);
					$("#fivep3").slideUp(250);
				}else {
					console.log("Some error happened from flask function namely book_ticket3");
					console.log("Result is neither 0 nor 1. Return value is different from flask");
					console.log("Return value is " + result);
					console.log("Return value type is " + typeof result);
				}
			},
			error: function() {
				console.log("Not able to get response from flask function namely book_ticket3");
			}
		});
	});

	$('[name="btnCANCEL"]').click(function() {
		msg = "Transaction Cancelled";
		alert(msg);
		$("#finalFare").html("0");
		$("#fivep2").slideDown(250);
		$("#fivep3").slideUp(250);
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
			$('[name="btnNEXT"]').addClass("valid");
			$('[name="btnNEXT"]')[0].disabled = false;
		} else {
			$('[name="btnNEXT"]').removeClass();
			$('[name="btnNEXT"]').addClass("invalid");
			$('[name="btnNEXT"]')[0].disabled = true;
		}
	}

	setInterval(Valid2, 500);
	function Valid2() {
		var test = 1;
		for (i = 0; i < 4 * total_fields1; i++) {
			if (name_arr1[i] == 0) {
				test = 0;
				break;
			}
		}
		// This is added if someone changes the html through dev tools inspect CTRL + SHIFT + I
		for (i = 0; i < total_fields; i++) {
			if (name_arr[i] == 0) {
				test = 0;
				break;
			}
		}

		if (test == 1 && total_fields1 > 0) {
			$('[name="btnSUBMIT"]').removeClass();
			$('[name="btnSUBMIT"]').addClass("valid");
			$('[name="btnSUBMIT"]')[0].disabled = false;
		} else {
			$('[name="btnSUBMIT"]').removeClass();
			$('[name="btnSUBMIT"]').addClass("invalid");
			$('[name="btnSUBMIT"]')[0].disabled = true;
		}
	}
});