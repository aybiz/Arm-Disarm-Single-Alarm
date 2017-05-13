
var home1 = new HomeAlarm(
			"", 
			"Rosa",
			"Rosa St, Templestowe Lower",
			"+61409569700"
			);

var home2 = new HomeAlarm(
			"", 
			"John",
			"John St, Templestowe Lower",
			"+61416236008"
			);


function dataToTables() {
	home = new HomeAlarm();
	home.saveAlarmData(home1);
	home.saveAlarmData(home2);
}

