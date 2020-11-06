$(document).ready(function(){
	$('.next').click( function () {
		//event.preventDefault();
		// var form_data = new FormData($('#register_form')[0]);
		// console.log('form_data')
		// console.log(form_data)
		$.ajax({
			type: 'POST',
			url: '/register',
			contentType: "application/json",
			/*dataType: "json",*/
			data: JSON.stringify({
				uname: $('[name="uname"]').val(),
				password: $('[name="pass"]').val(),
				fname: $('[name="fname"]').val(),
				lname: $('[name="lname"]').val(),
				email: $('[name="email"]').val(),
				phone: $('[name="phone"]').val(),
				address: $('[name="address"]').val(),
				gender: $('[name="gender"]').val(),
				credit: $('[name="credit"]').val(),
				dob: $('[name="dob"]').val()
			}),
			cache: false,
			processData: false,
			success: function(result){
				console.log("msg 1");
				if(result == "1"){
					msg="Successfully registered.";
					console.log("msg 2");
					alert(msg);
				}else{
					var msg="User Already Exists";
					console.log("msg 3");
					alert(msg);
				}
			},
			error: function(){
				console.log("Not able");
			}
		});
	});
});




