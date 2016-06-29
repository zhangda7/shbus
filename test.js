
var xml2js = require('xml2js');
var dateFormat = require('dateformat');
var parseString = require('xml2js').parseString;
var xml = "<root>Hello xml2js!</root>"
parseString(xml, function (err, result) {
    console.dir(result);
});
var ret = "<linedetails><linedetail><end_earlytime>06:45</end_earlytime><end_latetime>18:55</end_latetime><end_stop>秀康路</end_stop><line_id>90019</line_id><line_name>1106路</line_name><start_earlytime>06:20</start_earlytime><start_latetime>18:30</start_latetime><start_stop>康人路环桥路</start_stop></linedetail></linedetails>";
xml2js.parseString(ret, function(err, result) {
    console.log(result);
    //this can print all json string
    console.log(JSON.stringify(result));
    //console.log(reuslt.linedetails);
});

var now = new Date();
 
// Basic usage 
//2016-06-2621:04
var d = dateFormat(now, "yyyy-MM-ddhh:MM");
console.log(d);

var data = new Array();
data.push("1");
console.log(data);





