const http = require('http');
const url = require('url');

const availableTimes = {
    Monday: ["1:00", "1:30", "2:00", "2:30", "3:00", "3:30", "4:00", "4:30"],
    Tuesday: ["1:00", "1:30", "2:00", "2:30", "3:00", "3:30", "4:00", "4:30"],
    Wednesday: ["1:00", "1:30", "2:00", "2:30", "3:00", "4:00", "4:30"],
    Thursday: ["1:00", "1:30", "2:00", "2:30", "3:00", "3:30", "4:00", "4:30"],
    Friday: ["1:30", "2:00", "2:30", "3:00", "3:30", "4:00", "4:30"],
};
const appointments = [
    {name: "James", day: "Wednesday", time: "3:30" },
    {name: "Lillie", day: "Friday", time: "1:00" }];

let serverObj =  http.createServer(function(req,res){
	console.log(req.url);
	let urlObj = url.parse(req.url,true);
	switch (urlObj.pathname) {
		case "/schedule":
			schedule(urlObj.query,res);
			break;
		case "/cancel":
			cancel(urlObj.query,res);
			break;
		case "/check":
			check(urlObj.query,res);			
		default:
			error(res,404,"pathname unknown");

	}
});

function schedule(qObj,res) {
	if (availableTimes[qObj.day].some(time => time == qObj.time)) {
	
	 (availableTimes[qObj.day].filter(time => time != qObj.time)); //if there is a day and time being scheduled, 
	//remove it from available times and return array
	let appdetails = {name: qObj.name, day: qObj.day, time: qObj.time}; //store it in object  appdetails

	appointments.push(appdetails); //push it to appointments
		res.writeHead(200,{'content-type':'text/plain'});
		res.write("scheduled");
		res.end();
	} 

	
	else{ 
		error(res,400,"Can't schedule");

 
}
}
function cancel(qObj,res) {
	
let appdetails = {name: qObj.name, day: qObj.day, time: qObj.time}; //pop stored object out of appointments
	appointments.pop(appdetails);
	res.writeHead(200,{'content-type':'text/plain'});
	res.write("appointment has been canceled");
	res.end();

	if (availableTimes[qObj.day].filter(time => time != qObj.time)){

	 res.writeHead(200,{'content-type':'text/plain'});
         res.write("appointment is not found");
         res.end();
}
}

function check(qObj,res){
	
if (qObj.day && qObj.time in availableTimes){ //if day and time are in array availabletimes, write "available"
	res.writeHead(200,{'content-type':'text/plain'});
          res.write("available");
          res.end();
}

else{
	res.writeHead(200,{'content-type':'text/plain'});
           res.write("not available");
           res.end();
}
}


function error(response,status,message) {

	response.writeHead(status,{'content-type':'text/plain'});
	response.write(message);
	response.end();
}

serverObj.listen(80,function(){console.log("listening on port 80")});
