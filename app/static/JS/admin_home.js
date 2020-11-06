$(document).ready(function(){
	$('#btnSearch').click( function (event) {
		var trainno = $('[name="trainno"]').val();
		var doj = $('[name="doj"]').val();
		/*console.log(trainno);
		console.log("#"+doj+"#"); 
		console.log(doj.length); */
		if(trainno.length ==0 && doj.length ==0){
			msg = "Both Fields cannot be empty";
			alert(msg);
		}
		else if(trainno.length !=4){
			msg = "Train numbers are of length 4 only."+
				"Please enter a valid train number"+
				"Or leave this field empty and "+
				"search using only date of journey.";
			alert(msg);
		}
		else if((trainno.length ==0 && doj.length!=0) || ((trainno.length !=0 && doj.length==0))){
			$(".five").slideUp(0);
			$(".five").slideDown(500);
			$.ajax({
				type: 'POST',
				url: '/showtrain',
				contentType: "application/json",
				/*dataType: "json",*/
				data: JSON.stringify({
					trainno: trainno,
					doj: doj
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
							train += '<td id = "available">' + (i+1) + '</td>';
							train += '<td id = "available">' + (i+1) + '</td>';
							train += '</tr>';
						}
						$('#threep3p1').append(train);
						$(".threep3").slideDown(500);
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
});