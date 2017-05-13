// JavaScript Document


//set a key value array for data transfer between Div pages

var alarm_action = "";
var alarm_pin = "";
var toastMsg = "";
var expectAlarmConfirmFlg = "no";
var expectAlarmConfirmObj = {};
var waitForSMSTimeOut
var smsSentFlg = "no";
AlarmPhoneNumber = "+61479055354"; // "+61416236008"


$(window).width()

var db = new Dexie("HomeAlarms");


$(window).load(function() {
  	if(! window.device) {
   		onDeviceReady();
	} else {
		document.addEventListener('deviceready', onDeviceReady, false);
	}
});




	
function onDeviceReady() {



// if (!SMS) { 
// 	alert( 'SMS plugin not ready' ); 
// } else {
// 	alert( 'We have SMS' );
// }

	//Using InexedDB

	db.version(1).stores({
		homes: "++id, home",
		settings: "++id, param_name"
	});

	//setting parameter/s for the first time (if needed)
	var settingParam = new SettingParam();
	settingParam.initiateParams();

	//*********************************************
	//prevent default function of Back button
	document.addEventListener("backbutton", onBackKeyDown, false);

	function onBackKeyDown(e) {
	  e.preventDefault();
	}

	// function hasCameraPermission() {
	//     cordova.plugins.barcodeScanner.hasCameraPermission(
	//       	function(result) {
	//         	if(result === false){
	//         		cordova.plugins.barcodeScanner.requestCameraPermission();
	//         	}
	//  		}
	// 	)
	// }




	//*********************************************
	//Exit the App
	$(document).off("tap", "#exitApp").on("tap", "#exitApp", function (e) {
		if (navigator.app) {
			navigator.app.exitApp();
		}
		else if (navigator.device) {
		  	navigator.device.exitApp();
		}
		else {
		    window.close();
		}
	});
	//*********************************************

//***********************************************************************************************
//***********  Alarms  **************************************************************


	//Check if SMS was sent to Alarm and wiat (or not) for a confirmation SMS
	$(document).off("pagebeforeshow", "#mainPage").on("pagebeforeshow", "#mainPage", function() {
		if(smsSentFlg === "yes") {
			if(expectAlarmConfirmFlg == "yes") {
			    SMS.startWatch(function(){}, function(){});
			    window.plugins.spinnerDialog.show("Waiting...","Wait for Alarm Status confirmation", true);
			    waitForSMSTimeOut = setTimeout(function(){
			    	SMS.stopWatch(function(){}, function(){});
			    	window.plugins.spinnerDialog.hide();
			    	$.alert({
					    title: 'Message Status!',
					    content: "There was no response from the Alarm System. " + 
					    	"Your command should have been received but Alarm is not programmed to reply to your mobile number.",
					});
			    }, 20000);
			    //SMS.enableIntercept(true, function(){}, function(){});
			} else {
				$.alert({
				    title: 'Message Status',
				    content: alarm_action + " command was sent to the Alarm System.",
				});
			}
		}
		smsSentFlg = "no";
	});

	//*********************************************
	//Wait to receive SMS from Alarm
    document.addEventListener('onSMSArrive', function(e){
    	var data = e.data;
    	//alert(data.address);
    	if (data.address == AlarmPhoneNumber) {
    		var msgBody = data.body
	    	window.plugins.spinnerDialog.hide(); //Stop Spinner
	    	clearTimeout(waitForSMSTimeOut); // Stop Time out task
	    	SMS.stopWatch(function(){}, function(){});
	    	$.alert({
			    title: 'Response from Alarm!',
			    content: "SUCCESS from " + data.address + "!!!\n" + 
			    	"Alarm System has been " + msgBody.substring(5, msgBody.length-1) + "d",
			});
    	}
    });


	//*********************************************


	//tap to Arm the alarm. Checks for saveCode flag and goes to enter alarm PIN or retrieve PIN
	$(document).off("tap", "#arm_btn").on("tap", "#arm_btn", function (e) {
		alarm_action = $(this).attr("name");
		$(':mobile-pagecontainer').pagecontainer("change", "#enterPin");
	});

	//tap to Disarm the alarm. Checks for saveCode flag and goes to enter alarm PIN or retrieve PIN
	$(document).off("tap", "#disarm_btn").on("tap", "#disarm_btn", function (e) {
		alarm_action = $(this).attr("name");
		$(':mobile-pagecontainer').pagecontainer("change", "#enterPin");
	});


	function sendSMS() {
	    var sendTo = AlarmPhoneNumber;
	    var textMsg = alarm_pin.trim() + alarm_action.trim();
	    if(SMS)SMS.sendSMS(sendTo, textMsg, function(){}, function(str){alert(str);});
	    //alert(sendTo +  " - "  + textMsg);
		clearSMSData()
		smsSentFlg = "yes";
		$(':mobile-pagecontainer').pagecontainer("change", "#mainPage");
	}

	function clearSMSData() {
	    alarm_pin = "";
	    alarm_action = "";
	}

//***************** check all above new code
//*************************************************************************
//*************************************************************************



	$(document).off("pagebeforeshow", "#alarm_settings").on("pagebeforeshow", "#alarm_settings", function() {	
		if(expectAlarmConfirmFlg === "yes") {
			$("#expect_alarm_confirm_yes").attr("checked",true).checkboxradio("refresh");
			$("#expect_alarm_confirm_no").attr("checked",false).checkboxradio("refresh");
		} else {
			$("#expect_alarm_confirm_yes").attr("checked",false).checkboxradio("refresh");
			$("#expect_alarm_confirm_no").attr("checked",true).checkboxradio("refresh");
		}
		toast(toastMsg);
		toastMsg = "";
	});

	
	//Change of expectAlarmConfirmFlg status
	$("input[name='expect_alarm_confirm_radio']").bind('change', function() {
		var expectAlarmConfirmSliderParam = new SettingParam(expectAlarmConfirmObj.id, "expect_alarm_confirm", $(this).val(), expectAlarmConfirmObj.text);
	    expectAlarmConfirmSliderParam.saveSettingData("update", expectAlarmConfirmSliderParam);
	    expectAlarmConfirmFlg = $(this).val();
	});



	//*****************************
	//Numeric Pad

    $(document).off("pagebeforeshow", "#enterPin").on("pagebeforeshow", "#enterPin", function() {
      	$('#keypad #n_keypad').show();
      	$('#myInput').val("");
      	toast(toastMsg, 1500);
		toastMsg = "";
    });

      $('#keypad .done').off("tap").on("tap", function(evt) {
          	$('#n_keypad').hide('fast');
          	alarm_pin = $('#myInput').val();

          	//Construct SMS string and send SMS
			sendSMS(); 
      });

      $("#keypad .numero").off("tap").on("tap", function(evt) {
        if (!isNaN($('#myInput').val())) {
           if (parseInt($('#myInput').val()) == 0) {
             $('#myInput').val($(this).text());
           } else {
             $('#myInput').val($('#myInput').val() + $(this).text());
           }
        }
      });

      $('#keypad .neg').off("tap").on("tap", function(evt) {
          if (!isNaN($('#myInput').val()) && $('#myInput').val().length > 0) {
            if (parseInt($('#myInput').val()) > 0) {
              $('#myInput').val(parseInt($('#myInput').val()) - 1);
            }
          }
      });

      $('#keypad .pos').off("tap").on("tap", function(evt) {
          if (!isNaN($('#myInput').val()) && $('#myInput').val().length > 0) {
            $('#myInput').val(parseInt($('#myInput').val()) + 1);
          }
      });

      $('#keypad .del').off("tap").on("tap", function(evt) {
          $('#myInput').val($('#myInput').val().substring(0,$('#myInput').val().length - 1));
      });

      $('#keypad .clear').off("tap").on("tap", function(evt) {
          $('#myInput').val('');
      });

      $('#keypad .zero').off("tap").on("tap", function(evt) {
        if (!isNaN($('#myInput').val())) {
          if (parseInt($('#myInput').val()) != 0) {
            $('#myInput').val($('#myInput').val() + $(this).text());
          }
        }
      });
     //End of Numeric Pad
    //*****************************

//******************************************************************************
//***********  End of Home Alarms  **************************************
//******************************************************************************

};



//***********************************************
//create a toast notification that fades out
function toast(message, delay) {
	this.delay = delay || 800;

	if(message != "") {
	    var $toast = $('<div class="ui-loader ui-overlay-shadow ui-body-e ui-corner-all"><p5>' + message + '</p5></div>');

	    $toast.css({
	        display: 'block',
	        background: '#E5E1DC',
	        opacity: 0.90, 
	        position: 'fixed',
	        padding: '7px',
	        'text-align': 'center',
	        width: '300px',
	        left: ($(window).width() - 284) / 2,
	        top: $(window).height() / 2 - 20
	    });

	    var removeToast = function(){
	        $(this).remove();
	    };

	    $toast.click(removeToast);

	    $toast.appendTo($.mobile.pageContainer).delay(this.delay);
	    $toast.fadeOut(this.delay, removeToast);
	}
}

function isInt(value) {
  return !isNaN(value) && 
         parseInt(Number(value)) == value && 
         !isNaN(parseInt(value, 10));
}


SameNameAlert =  function() {
	$("#home_alarm_form #home").focus();
	$.alert({
	    title: 'Duplication Alert!',
	    content: "'" + $("#home_alarm_form #home").val() + "'" + " alarm already exists. Use another name or " + 
	    	" Edit the existing " + "'" + $("#home_alarm_form #home").val() + "'" + " alarm.",
	});
	$("#home_alarm_form #home").val("");
}

//Prepare the object data to have only data (no methods or etc.)
function objToKeyValue (obj) {
	var object = {};
	for (key in obj) {
		if (typeof obj[key] != "function") {
			if (key == "id") {  // no need for id data when adding new record "add"
				object[key] = Number(obj[key]);
			} else if (key != "id") {
				object[key] = obj[key];
			}
		}
	}
	return object;
}

