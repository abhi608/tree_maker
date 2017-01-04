var fs= require("fs");
var path=require("path");
//read all the data from corresponding files
var data1=fs.readFileSync(path.join(__dirname +'/second_level.json')); 
var data2=fs.readFileSync(path.join(__dirname +'/third_level.json'));
var data3=fs.readFileSync(path.join(__dirname +'/fourth_level.json'));
var data4=fs.readFileSync(path.join(__dirname +'/fifth_level.json'));
data1=JSON.parse(data1);
data2=JSON.parse(data2);
data3=JSON.parse(data3);
data4=JSON.parse(data4);
 var json={};  //objects that is used by d3 library to make the tree
      json.name='Sign Up-V2';
      json.children=[];
      for(var i=0; i<data1.length;i++){ //for second level nodes(first level node is "Sign Up-V2")
        json.children[i]={};
        json.children[i].name=data1[i].second+': '+data1[i].value+' or '+data1[i].percent+'%';
        json.children[i].size=data1[i].value;
        json.children[i].children=[];
        for(var j=0; j<data2.length; j++){ //for third level nodes
          if(data2[j].second==data1[i].second){  //checks if the data read is a children of the first node
            json.children[i].children.push({});  //new children node is created
            var index2=json.children[i].children.length-1;
            json.children[i].children[index2].name=data2[j].third+': '+data2[j].value+' or '+data2[j].percent+'%';  //name of the new node
            json.children[i].children[index2].size=data2[j].value;  //size of the new node
            json.children[i].children[index2].children=[]; //children of the current node(currently no children)
            for(var k=0; k<data3.length; k++){  //for fourth level nodes
              if(data3[k].second==data2[j].second && data3[k].third==data2[j].third){
                json.children[i].children[index2].children.push({});
                var index3=json.children[i].children[index2].children.length-1;
                json.children[i].children[index2].children[index3].name=data3[k].fourth+': '+data3[k].value+' or '+data3[k].percent+'%';
                json.children[i].children[index2].children[index3].size=data3[k].value;   
                json.children[i].children[index2].children[index3].children=[];
                for(var l=0; l<data4.length;l++){  //for fifth level nodes
                  if(data4[l].second==data3[k].second && data4[l].third==data3[k].third && data4[l].fourth==data3[k].fourth){
                    json.children[i].children[index2].children[index3].children.push({});
                    var index4=json.children[i].children[index2].children[index3].children.length-1;
                    json.children[i].children[index2].children[index3].children[index4].name=data4[l].fifth+': '+data4[l].value+' or '+data4[l].percent+'%';
                    json.children[i].children[index2].children[index3].children[index4].size=data4[l].value;
                  }
                }
json.children[i].children[index2].children[index3].children=json.children[i].children[index2].children[index3].children.sort(function(obj1, obj2) {
  // Descending order sort
  return obj2.size - obj1.size;
});             
              }
            }
            json.children[i].children[index2].children=json.children[i].children[index2].children.sort(function(obj1, obj2) {
  // Descending order sort
  return obj2.size - obj1.size;
});
          }
        }
        json.children[i].children=json.children[i].children.sort(function(obj1, obj2) {
  // Descending order sort
  return obj2.size - obj1.size;
});
      }
      json.children=json.children.sort(function(obj1, obj2) {
  // Descending order sort
  return obj2.size - obj1.size;
});
      
    stored_data=JSON.stringify(json);	//stored_data is the data to be stored in a file
    console.log(stored_data);
    fs.writeFile(path.join(__dirname +'/dance.json'), stored_data, function(err) { //dance.json contains the final structure of the graph
      if (err) {
                return console.error(err);
            }
        console.log("Data written successfully!");
    });
