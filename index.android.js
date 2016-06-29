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
  View
} from 'react-native';

var xml2js = require('xml2js');
var dateFormat = require('dateformat');

var busInfo = {};
busInfo['581路'] = {};
//busInfo['581路'].stop[0] = "";

//return date like 2016-06-2621:04
function getFormatDate() {
    var now = new Date();
    return dateFormat(now, "yyyy-MM-ddhh:MM");
}

function urlForQueryLineInfo(lineName) {
    return "http://180.166.5.82:8000/palmbus_serv/PalmBusJgj/getLineInfoByName.do?" + 
    "linename=" + lineName +
    "&my=7F6ED5C3FC8C5ABD278F5A32DD3AC78F" +
    "&t=2016-06-2621:04";
}

function urlForQueryLineStation(lineID) {
    return "http://180.166.5.82:8000/palmbus_serv/PalmBusJgj/getLine.do?" +
    "lineid=" + lineID + 
    "&my=7F6ED5C3FC8C5ABD278F5A32DD3AC78F" + 
    "&t=" + getFormatDate();
}
var data = new Array();
data[0] = "11111";
var dataSource = {};
//data[1] = "22222";  
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
            var that = this;
            xml2js.parseString(responseText, function(err, result) {
                console.log(result.lineInfoDetails.lineResults0[0].stop);
                var stops = result.lineInfoDetails.lineResults0[0].stop;
                var listVal = "";
                for(var i = 0; i < stops.length; i++) {
                    listVal += stops[i].zdmc + " | ";
                }
                console.log(listVal);
                data.push(listVal);
                console.log(data);
                that.setState ({
                    dataSource : that.state.dataSource.cloneWithRows(data)
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
            <TouchableHighlight onPress={() => this.rowPressed(rowData)}
                underlayColor='#dddddd'>
                <View>
                    <View style={styles.rowContainer}>
                        <View style={styles.textContainer}>
                            <Text>{price}</Text>
                        </View>
                    </View>
                    <View style={styles.separator}></View>
                    
                </View>
            </TouchableHighlight>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  thumb: {
        width:80,
        height: 80,
        marginRight: 10
    },
    textContainer: {
        flex: 1
    },
    separator: {
        height: 1,
        backgroundColor: '#dddddd'
    },
    price: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#48BBEC'
    },
    title: {
        fontSize: 20,
        color: '#656565'
    },
    rowContainer: {
        flexDirection: 'row',
        padding: 10
    }
});

AppRegistry.registerComponent('shbus', () => shbus);
