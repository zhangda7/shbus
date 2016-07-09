/**
 * shbus react list page
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  ListView,
  Image,
  TouchableHighlight,
  View,
  ScrollView,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';

import {styles} from "./js/style/style";
import {getFormatDate, urlForQueryLineInfo, urlForQueryLineStation, urlForQueryArrivalTime} from "./js/page/util";

var xml2js = require('xml2js');
//保存常用公交列表
var favBus = [
    '1106路',
    '581路',
    '龙惠专线'
];

var busStatus = {};

var busInfo = {};
busInfo['581路'] = {};

var busImages = [
        require('./images/bus_big.png')
    ];

    var initialData = new Array();
    var emptyRow = {};
    emptyRow.name = "请添加常用公交路线";
    emptyRow.data = null;
    //initialData[0] = emptyRow;
    //data[0] = "请添加常用公交路线";
    var dataSource = {};
    //data[1] = "22222";  
    // 批量创建
    //var createCardRow = (item, i) => <BusCard key={i} item={item} num={i} img={busImages[0]}/>;

    class shbus extends Component {
        constructor() {
            super();
            //super(props);
            //this.props = data;
            var dataSource = new ListView.DataSource({
                rowHasChanged: (r1, r2) => r1.guid !== r2.guid
            });
            this.state = {
                listData : initialData,
                dataSource : dataSource.cloneWithRows(initialData),
                curIndex:0,
                lineStatus : {}
            };
        }
        parseLine(busName, lineId, result) {
            //解析lineInfo的数据，传过来的应该是result.lineInfoDetails.lineResults0[0]
            var oneRowData = {};
            oneRowData.name = busName;
            oneRowData.lineId = lineId;
            oneRowData.lineInfo = new Array();
            var oneDirection = {};
            var stops = result.lineResults0[0].stop;
            var listVal = [];
            for(var i = 0; i < stops.length; i++) {
                var item = {};
                item.name = stops[i].zdmc;
                item.stopId = stops[i].id;
                item.lineId = lineId;
                listVal.push(item);
            }
            oneDirection.direction = result.direction;
            oneDirection.stops = listVal;
            oneRowData.lineInfo.push(oneDirection);
            return oneRowData;
        }
        fetchLineInfo(busName, lineId, url) {
            console.log(busName + "fetchLineInfo, url= " + url);
            fetch(url)
            .then((response) => response.text())
            .then((responseText) => {
                var self = this;
                xml2js.parseString(responseText, function(err, result) {
                    console.log(busName + "fetch result " + JSON.stringify(result));
                    self.state.listData.push(self.parseLine(busName, lineId, result.lineInfoDetails));
                    
                    var previousStatus = self.state.lineStatus;
                    var status = {};
                    status.name = busName;
                    status.curDirection = true;
                    status.curStops = {};
                    previousStatus[lineId] = status;
                    //self.state.busStatus.push(status);
                    //set bus status
                    self.setState({
                        lineStatus : previousStatus
                    });
                    console.log(busName + "Final result: " + JSON.stringify(self.state.listData));
                    self.setState ({
                        dataSource : self.state.dataSource.cloneWithRows(self.state.listData)
                    });
                    console.log("Status : " + JSON.stringify(self.state.lineStatus));
                    if(self.state.curIndex < favBus.length - 1) {
                        self.state.curIndex += 1;
                        var idUrl = urlForQueryLineInfo(favBus[self.state.curIndex]);
                        self.fetchLineId(favBus[self.state.curIndex], idUrl);
                    }
                    
                });
            })
            .catch((error) => {
              console.warn(error);
          }).done();
        }
        fetchLineId(busName, url) {
            fetch(url)
            .then((response) => response.text())
            .then((responseText) => {
                var self = this;
                xml2js.parseString(responseText, function(err, result) {
                    console.log(result);
                    var lineId = result.linedetails.linedetail[0].line_id;
                    console.log(lineId);
                    console.log(JSON.stringify(result));
                    var url = urlForQueryLineStation(lineId);
                    self.fetchLineInfo(busName, lineId, url);
                });
            })
            .catch((error) => {
              console.warn(error);
          }).done();
        }
        componentDidMount() {
            var idUrl = urlForQueryLineInfo(favBus[this.state.curIndex]);
            this.fetchLineId(favBus[this.state.curIndex], idUrl);
        }
        rowPressed(propertyGuid) {
            console.log("row is pressed" + propertyGuid);
        }
        cardClicked(item) {
            console.log("item : " + JSON.stringify(item));
            ToastAndroid.show(item.name[0], ToastAndroid.SHORT);
            var url = urlForQueryArrivalTime(item.lineId, item.stopId, 0);
            console.log("Monitor url : " + url);
            this.fetchMonitor(item.lineId, url);
        }
        fetchMonitor(lineId, url) {
            fetch(url)
            .then((response) => response.text())
            .then((responseText) => {
                var self = this;
                console.log(responseText);
                xml2js.parseString(responseText, function(err, result) {
                    console.log(result);
                    var cars = result.result.cars[0];
                    console.log(cars);
                    if(("car" in cars)) {
                        console.log("found");
                        console.log(cars.car[0]);
                        var busInfo = {};
                        busInfo.name = cars.car[0].terminal;
                        busInfo.stopDistance = cars.car[0].stopdis;
                        busInfo.distance = cars.car[0].distance;
                        busInfo.time = cars.car[0].time;
                        var previousStatus = self.state.lineStatus;
                        previousStatus[lineId].curStops = busInfo.stopDistance;
                        self.setState({
                                lineStatus : previousStatus
                        });
                    } else {
                        console.log("no car in here, should call diaptcher info");
                    }
                });
            })
            .catch((error) => {
              console.warn(error);
          }).done();
        }
        renderOneCard(item, i) {
            var lineStatus = this.state.lineStatus[item.lineId];
            //console.log("render card line status detail : " + JSON.stringify(lineStatus));
            var busImg = <Image />;
            if(i == 1) {
                busImg = <Image
                  style={styles.image}
                  resizeMode={'contain'}
                  source={busImages[0]} /> ;
            }
            return (
                <TouchableOpacity key={i}
                  onPress={() => this.cardClicked(item)}
                >
                <View style={styles.buscard}>
                <Text 
                    style={styles.busstopText}>{item.name}</Text>
                    {busImg}
                <View style={styles.blank}/>
                </View>
                </TouchableOpacity>
            );
        }
        renderRow(rowData, sectionID, rowID) {
            console.log("render one row" + JSON.stringify(rowData));
            console.log("line status : " + JSON.stringify(this.state.lineStatus));
            console.log("line id : " + rowData.lineId);
            var lineStatus = this.state.lineStatus[rowData.lineId];
            console.log("line status detail : " + JSON.stringify(lineStatus));
            if(rowData.data == null) {
                rowData.data = new Array();
            }
            return (
                <View style={styles.rowContainer}>
                    <Text>{rowData.name}</Text>
                    <Text>预计到站时间：3分钟，距离：1561m, 方向：{JSON.stringify(lineStatus.curStops)}</Text>
                    <ScrollView
                        style={styles.scollContainer} horizontal={true}>
                        {rowData.lineInfo[0].stops.map(this.renderOneCard.bind(this))}
                    </ScrollView>
                </View>
                
            );
        }
      render() {
        return (
          <View>
            <Text style={styles.welcome}>
              常用公交列表
            </Text>
            
            <ListView 
                    dataSource = {this.state.dataSource}
                    renderRow = {this.renderRow.bind(this)} />
          </View>
        );
      }
    }


    AppRegistry.registerComponent('shbus', () => shbus);
