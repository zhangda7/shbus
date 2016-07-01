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
  ToastAndroid
} from 'react-native';

import {styles} from "./js/style/style";
import {getFormatDate, urlForQueryLineInfo, urlForQueryLineStation} from "./js/page/util";

var xml2js = require('xml2js');

var busInfo = {};
busInfo['581路'] = {};
//busInfo['581路'].stop[0] = "";

var busImages = [
    require('./images/bus_big.png')
];

// 名字
var NAMES = [
  'Girls\' Generation',
  'Jessica Jung',
  'Kim Hyo Yeon',
  'Seo Hyun',
  'Soo Young',
  'Sunny',
  'Taeyeon',
  'Tiffany',
  'Yoona',
  'Yuri'
];

//return date like 2016-06-2621:04

var data = new Array();
//data[0] = "11111";
var dataSource = {};
//data[1] = "22222";  

//one bus stop Card视图
class BusCard extends Component {
  onClicked(name) {
    ToastAndroid.show(name, ToastAndroid.SHORT);
  }

  render() {
    return (
      <TouchableOpacity
        style={styles.button}
        onPress={() => this.onClicked(this.props.i)}
      >
        <View style={styles.blank}/>
        <Text>{this.props.name}</Text>
        <Image
          style={styles.image}
          resizeMode={'cover'}
          source={this.props.img} />
        <View style={styles.blank}/>
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
            dataSource : dataSource.cloneWithRows(data)
        };
    }
    fetchData(url) {
        fetch(url)
        .then((response) => response.text())
        .then((responseText) => {
            var self = this;
            xml2js.parseString(responseText, function(err, result) {
                console.log(result.lineInfoDetails.lineResults0[0].stop);
                var stops = result.lineInfoDetails.lineResults0[0].stop;
                var listVal = [];
                for(var i = 0; i < stops.length; i++) {
                    //listVal += stops[i].zdmc + " | ";
                    listVal.push(stops[i].zdmc);
                }
                console.log(listVal);
                data.push(listVal);
                console.log(data);
                self.setState ({
                    dataSource : self.state.dataSource.cloneWithRows(data)
                });
                //this can print all json string
                console.log(JSON.stringify(result));
                //console.log(reuslt.linedetails);
            });
        })
        .catch((error) => {
          console.warn(error);
      }).done();
    }
    componentDidMount() {
        var url = urlForQueryLineStation("90019");
        this.fetchData(url);
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
        var price = rowData;
        console.log("render one row" + rowData);
        return (
            <ScrollView
                style={styles.container} horizontal={true}>
                {rowData.map(createCardRow)}
        </ScrollView>
            
        );
    }
  render() {
    return (
      <View>
        <Text style={styles.welcome}>
          My Favorite Bus
        </Text>
        
        <ListView 
                dataSource = {this.state.dataSource}
                renderRow = {this.renderRow.bind(this)} />
      </View>
    );
  }
}


AppRegistry.registerComponent('shbus', () => shbus);
