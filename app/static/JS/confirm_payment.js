$(document).ready(function(){
	$('.seven').fadeOut(0);

	var twoMinutes, sec, min, start;
	console.log(localStorage);
	function startTimer(duration, display) {
		var timer = duration, minutes, seconds;
		var timerInter = setInterval(function () {
			minutes = parseInt(timer / 60, 10)
			seconds = parseInt(timer % 60, 10);
			minutes = minutes < 10 ? "0" + minutes : minutes;
			seconds = seconds < 10 ? "0" + seconds : seconds;
			
			if(minutes=="01"){
				display.textContent = minutes + " minute and " + seconds+" seconds.";
			}else{
				display.textContent = minutes + " minutes and " + seconds+" seconds.";
			}
			
			if (timer<=0 || timer-- == 0){
				$('.seven').slideDown(500);
				localStorage.clear();
				console.log("removing local storage");
				console.log(localStorage);
				display.textContent = "00 minutes and 00 seconds.";
				clearInterval(timerInter);
				setTimeout(function(){
					$('.seven').slideUp(500);
					window.location.href="booking_agent_home.html";
				}, 3000);
			}
			localStorage.setItem("seconds",seconds);
			localStorage.setItem("minutes",minutes);
		}, 1000);
	}

	sec  = localStorage.getItem("seconds");
	min = localStorage.getItem("minutes");
	start = localStorage.getItem("start");

	if(min==null || min=="NaN" || start=="y"){
		localStorage.setItem("start", "n");
		twoMinutes = 60 * 2;
	}else{
		twoMinutes = (parseInt(min)*60+parseInt(sec));
	}

	display = document.querySelector('.sixc1 #timer');
	startTimer(twoMinutes, display);


	$('[name="btnCONFIRM"]').click(function(){
		$(".seven").slideUp(0);
		$(".seven").slideDown(500);
		$.ajax({
			type: 'POST',
			url: '/confirm_payment',
			contentType: "application/json",
			/*dataType: "json",*/
			cache: false,
			processData: false,
			success: function(result){
				$(".seven").slideUp(250);
				if(result == "1"){
					msg = "Seats Booked. Redirecting you to booking tickets page";
					alert(msg);
					window.location.href = "booking_agent_home.html";
				}else{
					console.log("Some error happened from flask function namely confirm_payment");
					console.log("Result is not 1. Return value is different from flask");	
					console.log("Return value is " + result);
					console.log("Return value type is " + typeof result);
				}
			},
			error: function(){
				console.log("Not able to get response from flask function namely confirm_payment");
			}
		});
	});

	$('[name="btnCANCEL"]').click(function(){
		$(".seven").slideUp(0);
		$(".seven").slideDown(500);
		msg = "Transaction Cancelled";
		alert(msg);
		window.location.href = "booking_agent_home.html";
	});
});