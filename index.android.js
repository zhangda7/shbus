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
import {getFormatDate, urlForQueryLineInfo, urlForQueryLineStation} from "./js/page/util";

var xml2js = require('xml2js');
//保存常用公交列表
var favBus = [
    '1106路',
    '581路',
    '龙惠专线'
];

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

//one bus stop Card视图
class BusCard extends Component {
  onClicked(name) {
    ToastAndroid.show(name[0], ToastAndroid.SHORT);
  }

  render() {
    return (
      <TouchableOpacity
        onPress={() => this.onClicked(this.props.name)}
      >
        <View style={styles.buscard}>
        <Text 
            style={styles.busstopText}>{this.props.name}</Text>
        <Image
          style={styles.image}
          resizeMode={'contain'}
          source={this.props.img} />
        <View style={styles.blank}/>
        </View>
      </TouchableOpacity>
    );
  }
}

// 批量创建
var createCardRow = (name, i) => <BusCard key={i} name={name} num={i} img={busImages[0]}/>;

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
            curIndex:0
        };
    }
    fetchLineInfo(busName, url) {
        console.log(busName + "fetchLineInfo, url= " + url);
        fetch(url)
        .then((response) => response.text())
        .then((responseText) => {
            var self = this;
            console.log(busName + "responseText " + JSON.stringify(responseText));
            xml2js.parseString(responseText, function(err, result) {
                console.log(busName + "fetch result " + JSON.stringify(result));
                console.log(busName + result.lineInfoDetails.lineResults0[0].stop);
                var stops = result.lineInfoDetails.lineResults0[0].stop;
                var listVal = [];
                var oneRowData = {};
                for(var i = 0; i < stops.length; i++) {
                    listVal.push(stops[i].zdmc);
                }
                console.log(busName + "listVal: " + JSON.stringify(listVal));
                oneRowData.name = busName;
                oneRowData.data = listVal;
                self.state.listData.push(oneRowData);
                console.log(busName + "Final result: " + JSON.stringify(self.state.listData));
                self.setState ({
                    dataSource : self.state.dataSource.cloneWithRows(self.state.listData)
                });
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
                self.fetchLineInfo(busName, url);
            });
        })
        .catch((error) => {
          console.warn(error);
      }).done();
    }
    componentDidMount() {
        //for(var i = 0; i < favBus.length; i++) {
            var idUrl = urlForQueryLineInfo(favBus[this.state.curIndex]);
            this.fetchLineId(favBus[this.state.curIndex], idUrl);
        //}
    }
    componentWillUnmount() {
        // 如果存在this.timer，则使用clearTimeout清空。
        // 如果你使用多个timer，那么用多个变量，或者用个数组来保存引用，然后逐个clear
        this.timer && clearTimeout(this.timer);
    } 
    _handleResponse(response) {
        console.log("Response : " + response);
        /*this.setState({isLoading:false, message:''});
        if(response.application_response_code.substr(0,1) === '1') {
            console.log('Properties found ' + response.listings.length);
                   
        } else {
            this.setState({message: 'Location not recognized, please try again'});
        }*/
    }
    rowPressed(propertyGuid) {
        /*var property = this.props.listings.filter(prop => prop.guid === propertyGuid)[0];
        this.props.navigator.push({id:'detail', property:property});*/
        console.log("row is pressed" + propertyGuid);
    }
    renderRow(rowData, sectionID, rowID) {
        //var price = rowData;
        console.log("render one row" + rowData);
        console.log("render one row" + JSON.stringify(rowData));
        if(rowData.data == null) {
            rowData.data = new Array();
        }
        return (
            <View style={styles.rowContainer}>
                <Text>{rowData.name}</Text>
                <ScrollView
                    style={styles.scollContainer} horizontal={true}>
                    {rowData.data.map(createCardRow)}
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
