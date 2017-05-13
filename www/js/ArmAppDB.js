



//******************************************************************************
//******************************************************************************
//******************************************************************************
// AlarmSingleAlarm Settings 
// with related unique methods

function SettingParam(id, param_name, value, text) {
	this.id		  	= id || "";
	this.param_name = param_name || ""; //Name of parameter
	this.value  	= value  || ""; //Parameter value
	this.text  		= text  || ""; //Parameter text string to be used for messages to user


//initiate parameters
	this.initiateParams =  function() {
		var paramKeyValue = {};

		db.open();
		//Alarm Status confirmation flag = Want? or don't want?
		db.settings.where("param_name").equals("expect_alarm_confirm").count(function(count){
			if(count == 0){
				//create "save_flag" parameter
				paramKeyValue["param_name"] =  "expect_alarm_confirm";
				paramKeyValue["value"] =  "no";
				paramKeyValue["text"] =  "Wait for Alarm Status confirmation";
				
				db.settings.put(paramKeyValue); //new db record will be created with own id
			} 
			db.settings.where("param_name").equals("expect_alarm_confirm").each(function (para) {
				expectAlarmConfirmFlg = para.value;
				expectAlarmConfirmObj = para;
			});
		});
	}



	//Save method; 
	//Inputs are:
	//action with "add" or "update"
	//Settings Param -  object with data
	this.saveSettingData =  function(action, param) {
		paramKeyValue = objToKeyValue (param)
		if(action == "add") {
			db.open();
			db.settings.put(paramKeyValue);
		} else if (action == "update") {
			var id = paramKeyValue.id;
			delete paramKeyValue.id;
			db.open();
			db.settings.update(id, paramKeyValue)
			.then(function() {
				toast(paramKeyValue.text + " Updated to '" + paramKeyValue.value + "'");
			});
		};
	};


}
