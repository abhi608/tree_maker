var request = require('request');
var fs = require("fs");
var async= require('async');
var path=require("path");
string='';  //will store the query string
var args=process.argv.slice(2);  //first argument is starting date and second is last date(in yyyy-mm-dd format)
//events array contains the name of all the events
var events=["App Shared", "Compose Start", "Home Opened-V2", "Compose Type Selected", "Explore Opened-V2", "Favourites", "Feed Fetched-V2", "Follow User", "Gallery Opened", "Media Uplaod Fail", "Media Uplaod Finish", "Media Upload Start", "Notification Clicked-V2", "Post Like", "Post Shared-V2", "Profile Opened-V2", "Tag Opened-V2", "UGC post created", "UGC Upload start"];
var data1='function main() {var x=0;var y=0;return Events({ ';  //first part of query string
string=data1.toString();
string+='from_date: "'+args[0]+'", to_date: "'+args[1]+'"';  //date information added to query string
//data2 is the next part of query string
var data2=' }).groupByUser(function(state, events) {state = state || { last_login: false, count: 0 };if (events.length > 0) {if (state.last_login && '
string+=data2.toString();  //data appended to string
arr=[];  //used by async(contains all the requests to be sent to the server of Mixpanel)
second_level_arr=[];
var temp_string1=string;  //used for refreshing the string every time a request is stored in the array
for( var i=0;i<events.length;i++) {
	string+=' events[0].name == "'+events[i]+'" ';
	var data3=' ) {++state.count;}for (var i = 0; i < events.length - 1; ++i) { if (events[i].name == "Sign Up-V2" && ';
	string+=data3.toString();
	string+=' events[i+1].name == "'+events[i]+'" ';
	var data4=') {++state.count;}}if (events[events.length - 1].name == "Sign Up-V2") {state.last_login = true;}a=events[0].name;}return state;}).map(function(event) { return event.value.count }).reduce(mixpanel.reducer.sum());}';
	string+=data4.toString();
	//params contains the parameters to be sent
	var params = {
	    url: 'https://9ec92a54f32d495f769596edfc8c601f@mixpanel.com/api/2.0/jql', //URL to hit
	    qs: {script: string, params: '{"from_date":"2016-01-01", "to_date": "2016-01-07"}'}, //Query string data
	    method: 'POST'
	};
	var obj={first : i, params : params};
	arr.push(obj);  //push the request data in a array. Used by async
	string=temp_string1;
}

/*async, here is used to send 50 requests to the Mixpanel server at a time. 
/If many requsts are sent in parallel, then the server blocks the requests. 
For this, async library is used */
async.mapLimit(arr, 50, test, function(err,results){
	if(err){
		console.log(err);
	}
	else{
		var percent=0;  //stores the total count of all the events
		for(var i=0;i<results.length;i++){  //to calculate the total count of events
			percent=Number(percent)+Number(results[i].value);
		}
		for(var j=0;j<results.length;j++){  //to calculate percentage of each event 
			if(results[j].percent!=0){
				results[j].percent=(Number(results[j].value)*100/Number(percent)).toFixed(2);
			}
			else
				results[j].percent=0.00;
		}
		console.log(results);
		var myjson=JSON.stringify(results);

		fs.writeFile(path.join(__dirname +'/second_level.json'), myjson, function(err) { //store all the data in a file.
			if (err) {
       					return console.error(err);
   					}
   			console.log("Data written successfully!");
		});
	}
})

function test(arr, cb){   //function that calls the api
	params=arr.params;
	request(params, function(error, response, body){  //data is returned in body
	    if(error) {
	        console.log(error);
	        return cb(null,null);
	    } 
	    else {
	        	var result = JSON.parse(body);
	        	console.log('Sign Up-V2->'+events[arr.first]+': '+result[0]);  
	        	var obj={second: events[arr.first], third: null, fourth: null, fifth:null, value: result[0]}; //object that is sent back to async
	    		return cb(null, obj);
	    }
	});

}





