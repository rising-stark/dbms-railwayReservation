var unameType=0, passType=0;
var uname, pass;
var tooltipUname, tooltipPass;
uname=0
pass=0;
$(document).ready(function(){
	$('input').keypress(function(e){
		if(e.which==32)
			return false;
	});

	$('[name="uname"]').keypress(function(e){
		/*if($('[name="uname"]').val().length > 19){
	    	e.preventDefault();
	    	return false;
	    }*/
	    $.ajax({
			type: 'POST',
			url: "{{url_for('bookadd')}}",
			contentType: 'application/json;charset=UTF-8',
			data: {
				action: 'emailVerificationInitiated'
			},
			cache: false,
			success: function(result){
				console.log(typeof(result));
				console.log(result);
				if(result==1){
					console.log("Email sent successfully for emailVerificationInitiated");
				}else{
					var msg="Error in sending email for emailVerificationInitiated";
					alert(msg)
					console.log(msg);
				}
			}
		});
	});

	$('[name="uname"]').on('focus blur mouseleave',function(){
		console.log("here");
		if(unameType==0){
			return false;
		}
		unameType=0;//console.log("c= "+c+"Uname field");
		var username=$('[name="uname"]').val();
		if(username.length>=8){
			uname=1;
			tooltipUname = "Accepted";
			$('#unameimg').attr("src","img/tick.png");
			$('#unameimg').prop("alt", "tick");
			$('#unameimg').attr("hidden",true);
		}
		else if(username.length>0){
			uname=0;
			tooltipUname = "The username should be 8-15 characters long";
			$('#unameimg').attr("src","img/wrong.png");
			$('#unameimg').prop("alt", "wrong");
			$('#unameimg').attr("hidden",true);
		}
		else{
			uname=0;
			tooltipUname = "Please fill out this field";
			$('#unameimg').attr("src","img/wrong.png");
			$('#unameimg').prop("alt", "wrong");
			$('#unameimg').attr("hidden",true);
		}
		$('[name="uname"]').attr('title', tooltipUname);
		$('#unameimg').attr('title', tooltipUname);
	});

	$('[name="password"]').on('keyup focus blur mouseleave',function(){
		if(passType==0){
			  return false;
		  }
		passType=0;
		var rancode=$('[name="password"]').val();
		if(rancode.length >7){
			pass=1;
			tooltipPass = "Accepted";
			$('#codeimg').attr("src","img/tick.png");
			$('#codeimg').prop("alt", "tick");
			$('#codeimg').attr("hidden",false);
		}
		else if(rancode.length>0){
			pass=0;
			tooltipPass = "The random code should be 6 digits long";
			$('#codeimg').attr("src","img/wrong.png");
			$('#codeimg').prop("alt", "wrong");
			$('#codeimg').attr("hidden",false);
		}
		else{
			code=0;
			tooltipPass = "Please fill out this field";
			$('#codeimg').attr("src","img/wrong.png");
			$('#codeimg').prop("alt", "wrong");
			$('#codeimg').attr("hidden",true);
		}
		$('[name="code"]').attr('title', tooltipPass);
		$('#codeimg').attr('title', tooltipPass);
	});

	$('input').on('keyup keydown keypress', function() {
		var name = $(this).attr("name");
		  if(name=="uname"){
			  unameType=1;
			  uname=0;
		  }
		  else if(name=="password"){
			  passType=1;
			  pass=0;
		  }
		  if($(this).val().length==0){
			  var displayTooltip = "Please fill out this field";
			  $(this).attr('title', displayTooltip);				  
			  $('#'+name+'img').attr("src","img/wrong.png");
			  $('#'+name+'img').prop("alt", "wrong");
			  $('#'+name+'img').attr('title', displayTooltip);
		  }
		  $('#'+name+'img').attr("hidden",true);
	  });
		setInterval(Check, 250);
		function Check(){
			if(uname==1 && pass==1){
				$('[name="btnNEXT"]').addClass("grow");
				$('[name="btnNEXT"]')[0].disabled=false;
			}
			else if(uname==0 || pass==0){
				$('[name="btnNEXT"]').removeClass("grow");
				$('[name="btnNEXT"]')[0].disabled=true;
			}
		}
});