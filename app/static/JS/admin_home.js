var trainnoType = 0,
	dojType = 0;
var trainno, doj;
var tooltipTrainno, tooltipDoj;

$(document).ready(function(){
	trainno = 0;
	doj = 0;
	$('.five').fadeOut(0);

	$('input').keypress(function(e) {
		if (e.which == 32)
			return false;
	});

	$('[name="trainno"]').keypress(function(e) {
		if ($('[name="trainno"]').val().length > 3) {
			e.preventDefault();
			return false;
		}
	});

	var regExpTrainno = /[0-9]/;
	$('[name="trainno"]').on('keydown keyup blur focus', function(e) {
		var value = e.key;
		//var ascii=value.charCodeAt(0);
		//$('textarea').append(ascii);
		//$('textarea').append(value);
		//console.log(e);
		// Only numbers
		if ((!regExpTrainno.test(value) &&
			e.which !=35 // end key
			&&
			e.which !=9 // tab key for keyboard focusing
			&&
			e.which != 8 // backspace
			&&
			e.which != 46 // delete
			&&
			(e.which < 37 // arrow keys
				||
				e.which > 40))) {
			e.preventDefault();
			return false;
		}
	});

	$('#threep2p1btn').mouseenter(function(){
		if($('#btnSearch').is(':disabled')){
			$('#threep2p1_btn_show_tooltip').show(250);
		}
	});
	
	$('#threep2p1btn').mouseleave(function(){
		if($('#btnSearch').is(':disabled')){
			$('#threep2p1_btn_show_tooltip').hide(250);
		}
	});
	$('input').on('keydown keyup keypress', function() {
		var name = $(this).attr("name");
		var flag=0;
		var regExpAlpha = /[a-zA-Z]/;
		var regExpNum = /[0-9]/;
		if (name == "trainno") {
			trainnoType = 1;
			trainno = 0;
		} else if (name == "doj") {
			dojType = 1;
			doj = 0;
		}
		if ($(this).val().length == 0) {
			flag=1;
			var displayTooltip = "Please fill out this field";
			$(this).attr('title', displayTooltip);
		}
		/*if(flag==0){
			var item = $(this).parent().next().next().children("span")[0];
			$(item).hide(250);
			item = $(this).parent().next().next().children("span")[1];
			$(item).hide(250);
		}*/
	});

	$('[name="trainno"]').on('focus blur mouseleave', function() {
		if (trainnoType == 0) {
			return false;
		}
		trainnoType = 0;
		trainnolen=$('[name="trainno"]').val().length;
		if (trainnolen > 0) {
			if(trainnolen !=4){
				trainno = 0;
				tooltipTrainno = "The train number must be of 4 digits";
				$('#threep2p1_input_train_tooltip').html(tooltipTrainno);
				$('#threep2p1_input_train_tooltip').show(250).delay(1500).hide(250);
			}else{
				trainno = 1;
				tooltipTrainno = "Accepted";
				$('#threep2p1_input_train_tooltip').html(tooltipTrainno);
				$('#threep2p1_input_train_tooltip').hide(250);
			}
		}else{
			trainno = 0;
			tooltipTrainno = "Please fill out this field";
			$('#threep2p1_input_train_tooltip').html(tooltipTrainno);
			$('#threep2p1_input_train_tooltip').show(250).delay(1500).hide(250);
		}
		$('[name="trainno"]').attr('title', tooltipTrainno);
	});

	$('[name="doj"]').on('focus blur mouseleave', function() {
		if (dojType == 0) {
			return false;
		}
		dojType = 0;
		dojlen=$('[name="doj"]').val().length;
		if (dojlen > 0) {
			doj = 1;
			tooltipDoj = "Accepted";
		}else{
			doj = 0;
			tooltipDoj = "Please fill out this field";
		}
		$('[name="doj"]').attr('title', tooltipDoj);
	});

	$('#threep1p2').click( function () {
		$('#threep1p2').addClass("active");
		$('#threep1p1').removeClass("active");
		$('.threep2').slideUp(250);
		$('.threep3').slideUp(250);
	});

	$('#threep1p1').click( function () {
		$('#threep1p1').addClass("active");
		$('#threep1p2').removeClass("active");
		$('.threep2').slideDown(250);
		if($('.threep3').hasClass('.result')){
			$('.threep3').slideDown(250);
		}
	});

	$('.valid').click( function () {
		var trainnoval = $('[name="trainno"]').val();
		var dojval = $('[name="doj"]').val();
		if(trainnoval.length ==0 && dojval.length ==0){
			msg = "Both Fields cannot be empty";
			alert(msg);
		}
		else if(trainnoval.length !=4){
			msg = "Train numbers are of length 4 only."+
				"Please enter a valid train number"+
				"Or leave this field empty and "+
				"search using only date of journey.";
			alert(msg);
		}
		else if((trainnoval.length ==0 && dojval.length!=0) || ((trainnoval.length !=0 && dojval.length==0))){
			$(".five").slideUp(0);
			$(".five").slideDown(500);
			$.ajax({
				type: 'POST',
				url: '/showtrain',
				contentType: "application/json",
				/*dataType: "json",*/
				data: JSON.stringify({
					trainno: trainnoval,
					doj: dojval
				}),
				cache: false,
				processData: false,
				success: function(result){
					console.log(result);
					len = result.length;
					if(len > 0){
						$(".five").delay(100).slideUp(500);
						var train = ''; 
						var i;
						for(i = 0; i < len; i++){
							train += '<tr>'; 
							train += '<td>' + (i+1) + '.</td>';
							train += '<td>' + result[i].trainno + '</td>';
							train += '<td>' + result[i].doj + '</td>';
							train += '<td>' + result[i].source + '</td>';
							train += '<td>' + result[i].start_time + '</td>';
							train += '<td>' + result[i].dest + '</td>';
							train += '<td>' + result[i].end_time + '</td>';
							train += '<td>' + result[i].ac_coaches + '</td>';
							train += '<td>' + result[i].ac_fare + '</td>';
							train += '<td>' + result[i].sl_coaches + '</td>';
							train += '<td>' + result[i].sl_fare + '</td>';
							if(result[i].ac_seats > 0){
								train += '<td class = "available">' + result[i].ac_seats + '</td>';
							}else{
								train += '<td class = "notavailable">' + result[i].ac_seats + '</td>';
							}
							if(result[i].sl_seats > 0){
								train += '<td class = "available">' + result[i].sl_seats + '</td>';
							}else{
								train += '<td class = "notavailable">' + result[i].sl_seats + '</td>';
							}
							train += '</tr>';
						}
						$('#threep3p1').append(train);
						$(".threep3").slideDown(500);
						$(".threep3").addClass("result");
					}
					else{
						msg = "No records found for this trainno and Date of journey";
						$(".five").slideUp(500);
						alert(msg);
					}
				},
				error: function(){
					console.log("Not able to get response from flask function namely showtrain");
				}
			});
		}
	});

	setInterval(Check, 250);
	function Check() {
		if (trainno == 1 || doj == 1) {
			$('[name="btnSearch"]').addClass("valid");
			$('[name="btnSearch"]').removeClass("invalid");
			$('[name="btnSearch"]')[0].disabled = false;
		} else if (trainno == 0 && doj == 0) {
			$('[name="btnSearch"]').addClass("invalid");
			$('[name="btnSearch"]').removeClass("valid");
			$('[name="btnSearch"]')[0].disabled = true;
		}
	}
});