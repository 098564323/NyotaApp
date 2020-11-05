import React,{Component} from 'react';

import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  SectionList,
  TouchableOpacity,
  VirtualizedList
} from 'react-native';


const DATA = [
  {
    title: 'Main dishes',
    data: ['Pizza', 'Burger', 'Risotto','Pizza', 'Burger'],
    index:0,
  },
  {
    title: 'Sides',
    data: ['French Fries', 'Onion Rings', 'Fried Shrimps','French Fries', 'Onion Rings', 'Fried Shrimps','French Fries', 'Onion Rings', 'Fried Shrimps'],
    index:1,
  },
  {
    title: 'Drinks',
    data: ['Water', 'Coke', 'Beer'],
    index:2,
  },
  {
    title: 'Desserts',
    data: ['Cheese Cake', 'Ice Cream','Cheese Cake', 'Ice Cream','Cheese Cake', 'Ice Cream'],
    index:3,
  },
];


class TestComponent extends Component{


  constructor(props) {
        super(props);
        this.state = {
          isClick: -1,
          GridListItems: [
            { id: '1',image:require('../../images/dashboard/harvest.png'), title: 'Fruits',screenName:'Login' },
            { id: '2',image:require('../../images/dashboard/diet_color.png'), title: 'Vegetables' ,screenName:'Login'},
            { id: '3',image:require('../../images/dashboard/muffin.png'), title: 'Bakery',screenName:'Login' },
            { id: '4',image:require('../../images/dashboard/cream.png'), title: 'Beauty' ,screenName:''},
            { id: '5',image:require('../../images/dashboard/chicken.png'), title: 'Meat',screenName:'' },
            { id: '6',image:require('../../images/dashboard/eggs.png'), title: 'Eggs',screenName:'' },
            { id: '7',image:require('../../images/dashboard/milk.png'), title: 'Dairy',screenName:'' },
            { id: '8',image:require('../../images/dashboard/brush.png'), title: 'Cleaners' ,screenName:''},
            { id: '9',image:require('../../images/dashboard/shampoo.png'), title: 'Personal care',screenName:'' }
          ]
        }
  }

  render(){
    function getItemCount (data) {
        return DATA.length
    }
    function getItem (data, index) {
        return DATA[index]
    }
    return(
      <SafeAreaView style={styles.container}>

          <VirtualizedList
                    extraData={this.state.isClick}
                    data={DATA}
                    getItemCount={getItemCount}
                    getItem={getItem}
                    keyExtractor = { (item, index) => index.toString() }
                    renderItem={({ item, index }) => {
                      return (
                        <View style={{flexDirection: 'column'}}>
                              <TouchableOpacity onPress={()=>{
                                                this.setState({ isClick: index })
                                                }}>
                                  <Text>Hello</Text>
                              </TouchableOpacity>
                              {
                                (this.state.isClick===index)? <this.inflateView indexPosData={item.data}/>:null
                              }
                        </View>
                      )
                    }}
        />
      </SafeAreaView>
    );
  }

  inflateView=({indexPosData})=>{
    var payments = [];

  	for(let i = 0; i < indexPosData.length; i++){
  		payments.push(
      				<View key = {i} style={{width: undefined,height:100,backgroundColor: 'green',marginTop: 5}}>
      					<Text>Hello</Text>
      				</View>
  		)
  	}

    return (
      <View>
          {payments}
      </View>
    );

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 45,
    marginHorizontal: 16,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
  }
});

export default TestComponent;
