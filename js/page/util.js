
var dateFormat = require('dateformat');

//return date like 2016-06-2621:04
export function getFormatDate() {
    var now = new Date();
    return dateFormat(now, "yyyy-mm-ddhh:MM");
}

export function urlForQueryLineInfo(lineName) {
    return "http://180.166.5.82:8000/palmbus_serv/PalmBusJgj/getLineInfoByName.do?" + 
    "linename=" + lineName +
    "&my=7F6ED5C3FC8C5ABD278F5A32DD3AC78F" +
    "&t=2016-06-2621:04";
}

export function urlForQueryLineStation(lineID) {
    return "http://180.166.5.82:8000/palmbus_serv/PalmBusJgj/getLine.do?" +
    "lineid=" + lineID + 
    "&my=7F6ED5C3FC8C5ABD278F5A32DD3AC78F" + 
    "&t=" + getFormatDate();
}

//lineId, stopId, direction={0,1}
export function urlForQueryArrivalTime(lineId, stopId, direction) {
    return "http://180.166.5.82:8000/palmbus_serv/PalmBusJgj/carMonitor.do?" + 
    "lineid=" + lineId + 
    "&stopid=" + stopId + 
    "&direction=" + direction + 
    "&my=7F6ED5C3FC8C5ABD278F5A32DD3AC78F" + 
    "&t=" + getFormatDate();
}