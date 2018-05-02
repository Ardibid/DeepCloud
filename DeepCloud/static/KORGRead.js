
// functions to act on the listener events
function changeColorBG(){
	var r = $('#slider0').text();
	var g = $('#slider1').text();
	var b = $('#slider2').text();
	var c = "rgb("+[r,g,b].join(",")+")";

	console.log(c);
	$('body').css("background-color",c);
	//document.body.style.backgroundColor = c;
}

function changeColor1(){
	var r = $('#slider3').text();
	var g = $('#slider4').text();
	var b = $('#slider5').text();
	var c = "rgb("+[r,g,b].join(",")+")";

	console.log("CC",c);
	$("#rec01").css("fill",c);
}

function changeColor2(){
	var r = $('#slider6').text();
	var g = $('#slider7').text();
	var b = $('#knob8').text();
	var c = "rgb("+[r,g,b].join(",")+")";

	console.log("DD",c);
	$("#rec02").css("fill",c);
}

function resetColors(){
	console.log("RESET");
	var r = $('#knob0').text();
	var c = "rgb("+[r,r,r].join(",")+")";

	$('body').css("background-color",c);
	$("#rec01").css("fill",c);
	$("#rec02").css("fill",c);
}

function initSliders(){
	for (var i = 0; i <8; i++){
		var name = '#slider'+i.toString()
		var r = $(name).text();
	  	console.log(name)
	  	name = "#UIslider"+i.toString()
	  	console.log(name)

	  	$(name).val(r-64);
  }
}

var refreshTime = 40
var lastTrigger = 0;


$('#GIF0').on("click",function() {
    // do nothing if last move was less than 40 ms ago
    var r = $('#UIslider0').val();
    $('#guideText').text(r);
    if(Date.now() - lastTrigger > refreshTime) {
        // Do stuff
        
        $("#guideText").text(r)
        lastTrigger = Date.now();
    } 
});


// adding listener for every knob and slider
$('#play').bind("DOMSubtreeModified",function(){
	$('#guideText').text("play");
});

// $('#slider0').bind("DOMSubtreeModified",function(){
// 	var r = $('#slider0').text();
//   	console.log(r)
//   	$("#UIslider0").val(r-64);
// });

// $('#slider1').bind("DOMSubtreeModified",function(){
// 	var r = $('#slider1').text();
//   	console.log(r)
//   	$("#UIslider1").val(r-64);
// });

// $('#slider2').bind("DOMSubtreeModified",function(){
// 	var r = $('#slider2').text();
//   	console.log(r)
//   	$("#UIslider2").val(r-64);
// });

// $('#slider3').bind("DOMSubtreeModified",function(){
// 	var r = $('#slider3').text();
//   	console.log(r)
//   	$("#UIslider3").val(r-64);
// });

// $('#slider4').bind("DOMSubtreeModified",function(){
// 	var r = $('#slider4').text();
//   	console.log(r)
//   	$("#UIslider4").val(r-64);
// });

// $('#slider5').bind("DOMSubtreeModified",function(){
// 	var r = $('#slider5').text();
//   	console.log(r)
//   	$("#UIslider5").val(r-64);
//  });

// $('#slider6').bind("DOMSubtreeModified",function(){
// 	var r = $('#slider6').text();
//   	console.log(r)
//   	$("#UIslider6").val(r-64);
//  });

// $('#slider7').bind("DOMSubtreeModified",function(){
// 	var r = $('#slider7').text();
//   	console.log(r)
//   	$("#UIslider7").val(r-64);
// });

// $('#knob8').bind("DOMSubtreeModified",function(){
//   var r = $('#knob8').text();
//   console.log(r)
//   $("#UIslider1").val(r-64);
// });