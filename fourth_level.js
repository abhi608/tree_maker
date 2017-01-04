var request = require('request');
var fs = require("fs");
var path=require("path");
var async= require('async');
string='';
var args=process.argv.slice(2);
var data=fs.readFileSync("third_level.json");
data=JSON.parse(data);
//console.log(data);
var events=["App Shared", "Compose Start", "Home Opened-V2", "Compose Type Selected", "Explore Opened-V2", "Favourites", "Feed Fetched-V2", "Follow User", "Gallery Opened", "Media Uplaod Fail", "Media Uplaod Finish", "Media Upload Start", "Notification Clicked-V2", "Post Like", "Post Shared-V2", "Profile Opened-V2", "Tag Opened-V2", "UGC post created", "UGC Upload start"];
var data1='function main() {var x=0;var y=0;return Events({ ';
string=data1.toString();
string+='from_date: "'+args[0]+'", to_date: "'+args[1]+'"';
var data2=' }).groupByUser(function(state, events) {state = state || { last_login: false, count: 0 };if (events.length > 0) {if (state.last_login && '
string+=data2.toString();
var temp_string1=string;
var count=0;
arr=[];
// for( var i=0;i<events.length;i++) {
// 	for(var j=0;j<events.length;j++){
// 		for(var k=0;k<events.length;k++){
// 	string+=' events[0].name == "'+events[i]+'" && events[1].name == "'+events[j]+'" && events[2].name == "'+events[k]+'" ';
// 	var data3=' ) {++state.count;}for (var i = 0; i < events.length - 3; ++i) { if (events[i].name == "Sign Up-V2" && ';
// 	string+=data3.toString();
// 	string+=' events[i+1].name == "'+events[i]+'" && events[i+2].name == "'+events[j]+'" && events[i+3].name == "'+events[k]+'" ';
// 	var data4=') {++state.count;}}if (events[events.length - 1].name == "Sign Up-V2") {state.last_login = true;}a=events[0].name;}return state;}).map(function(event) { return event.value.count }).reduce(mixpanel.reducer.sum());}';
// 	string+=data4.toString();
// 	var params = {
// 	    url: 'https://9ec92a54f32d495f769596edfc8c601f@mixpanel.com/api/2.0/jql', //URL to hit
// 	    qs: {script: string, params: '{"from_date":"2016-01-01", "to_date": "2016-01-07"}'}, //Query string data
// 	    method: 'POST'
// 	};
// 	var obj={first : i, second : j, third: k, params : params};
// 	arr.push(obj);
// 	string=temp_string1;
// }
// }
// }

for(var i=0;i<data.length;i++){
	if(data[i].percent>1){
		for(var k=0;k<events.length;k++){
			//console.log("entered");
			string+=' events[0].name == "'+data[i].second+'" && events[1].name == "'+data[i].third+'" && events[2].name == "'+events[k]+'" ';
			var data3=' ) {++state.count;}for (var i = 0; i < events.length - 3; ++i) { if (events[i].name == "Sign Up-V2" && ';
			string+=data3.toString();
			string+=' events[i+1].name == "'+data[i].second+'" && events[i+2].name == "'+data[i].third+'" && events[i+3].name == "'+events[k]+'" ';
			var data4=') {++state.count;}}if (events[events.length - 1].name == "Sign Up-V2") {state.last_login = true;}a=events[0].name;}return state;}).map(function(event) { return event.value.count }).reduce(mixpanel.reducer.sum());}';
			string+=data4.toString();
			var params = {
	    		url: 'https://9ec92a54f32d495f769596edfc8c601f@mixpanel.com/api/2.0/jql', //URL to hit
	    		qs: {script: string, params: '{"from_date":"2016-01-01", "to_date": "2016-01-07"}'}, //Query string data
	   			method: 'POST'
			};
			var obj={first : i, second : i, third: k, params : params};
			arr.push(obj);
			string=temp_string1;
		}
	}
}
//console.log(arr);
async.mapLimit(arr, 50, test, function(err,results){
	if(err){
		console.log(err)
	}
	else{
		//console.log(results);
		//second_level_arr.push(results);
		//console.log(second_level_arr);
		var percent=0;
		for(var i=0;i<results.length;i++){
			percent=Number(percent)+Number(results[i].value);
		}
		for(var j=0;j<results.length;j++){
			if(results[j].percent!=0){
				results[j].percent=(Number(results[j].value)*100/Number(percent)).toFixed(2);
			}
			else
				results[j].percent=0.00;
		}
		console.log(results);
		var myjson=JSON.stringify(results);
		fs.writeFile(path.join(__dirname +'/fourth_level.json'), myjson, function(err) {
			if (err) {
       					return console.error(err);
   					}
   			console.log("Data written successfully!");
		});
	}
})

/*function test(i, j, params){
	request(params, function(error, response, body){
	    if(error) {
	        console.log(error);
	        return cb(error,null);
	    } 
	    else {
	    	//console.log(body);
	        var result = JSON.parse(body);
	    	console.log(events[i]+'->'+events[j]+': '+result[0]);
	    }
	});
}*/

function test(arr, cb){
	params=arr.params;
	request(params, function(error, response, body){
	    if(error) {
	        console.log(error);
	        return cb(null,null);
	    } 
	    else {
	    	//console.log(body);
	        var result = JSON.parse(body);
	        //if (result[0]!=0) {
	        	console.log('Sign Up-V2->'+data[arr.first].second+'->'+data[arr.second].third+'->'+events[arr.third]+': '+result[0]);
	        	var obj={second: data[arr.first].second, third: data[arr.second].third, fourth: events[arr.third], fifth:null, value: result[0]};
	        //}
	    	return cb(null, obj);
	    }
	});

}





