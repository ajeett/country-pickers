import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  Dimensions
} from 'react-native';
import csc from 'country-state-city';
import {
  
  Colors,
  
} from 'react-native/Libraries/NewAppScreen';
import Modal from 'react-native-modal';

import cancelIcon from './../assets/cancelIcon.png';
import stateIcon from './../assets/stateIcon.png';

let dataCountries = '';
let countryId = '';

let stateId = '';
let stateList = '';

let cityId = '';
let cityList = '';

class App extends Component {
  constructor(nextProps) {
    super(nextProps);

    this.state = {
      filterCountries: [],
      queryCountry: '',
      queryState: '',
      queryCity: '',
      userCountry: '',
      userState: '',
      userCity: '',
      userCountryName: '',
      userStateName: '',
      userCityName: '',
      stateData: [],
      cityData: [],

      isCountryPickerVisible: false,
      isStatePickerVisible: false,
      isCityPickerVisible: false,
      countryList: [],
    };
  }

  searchCountryText(text) {
    let data1 = [];
    data1 = dataCountries;
    let result = [];
    let searchText = text.toLowerCase();

    data1 = data1.filter(l => {
      return l.name.toLowerCase().match(searchText);
    });
    this.setState({countryList: data1});
    dataCountries = data1;
  }

  searchStateText(text) {
    let data1 = [];
    data1 = stateList;
    let result = [];
    let searchText = text.toLowerCase();

    data1 = data1.filter(l => {
      return l.name.toLowerCase().match(searchText);
    });
    this.setState({
      stateData: data1,
    });
  }

  searchCityText(text) {
    let data1 = [];
    data1 = cityList;
    let result = [];
    let searchText = text.toLowerCase();

    data1 = data1.filter(l => {
      return l.name.toLowerCase().match(searchText);
    });
    this.setState({
      cityData: data1,
    });
  }

  setStateData(item) {
    countryId = item.id;
    stateList = csc.getStatesOfCountry(countryId);
    this.setState({
      stateData: stateList,
    });
    this.setState({userCountry: item.name});

    this.dismissCountryPopup();
  }
  setCityData(item) {
    stateId = item.id;
    cityList = csc.getCitiesOfState(stateId);
    this.setState({
      cityData: cityList,
      userState: item.name,
    });
    this.dismissStatePopup();
  }

  setCityValues(item) {
    this.setState({userCity: item.name});

    this.dismissCityPopup();
  }
  componentDidMount() {
    let dataCountries = csc.getAllCountries();
    this.setState({countryList: dataCountries});
  }

  setCountryPickerVisiblity() {
    this.setState({
      isCountryPickerVisible: true,
    });
  }
  setStatePickerVisiblity() {
    if (this.state.stateData == '') {
      alert('Choose a country first');
    } else {
      this.setState({
        isStatePickerVisible: true,
      });
    }
  }
  setCityPickerVisiblity() {
    if (this.state.stateData == '') {
      alert('Choose a country first');
    } else if (this.state.cityData == '') {
      alert('Choose a state first');
    } else {
      this.setState({
        isCityPickerVisible: true,
      });
    }
  }

  dismissCountryPopup() {
    this.setState({
      isCountryPickerVisible: false,
      countryList: dataCountries,
    });
  }
  dismissStatePopup() {
    stateList = csc.getStatesOfCountry(countryId);

    this.setState({
      isStatePickerVisible: false,
      stateData: stateList,
    });
  }
  dismissCityPopup() {
    cityList = csc.getCitiesOfState(stateId);

    this.setState({
      isCityPickerVisible: false,
      cityData: cityList,
    });
  }

  showCountryPopup(isVisible) {
    const {closeBtnStyle, popupMainStyle} = styles;

    return isVisible === false ? null : (
      <Modal
        isVisible={true}
        animationType={'slide'}
        style={{backgroundColor: '#FFFFFF',marginTop:50}}>
        <TouchableOpacity
          style={closeBtnStyle}
          onPress={this.dismissCountryPopup.bind(this)}>
          <Image
            style={{width: 20, height: 20, alignSelf: 'flex-end'}}
            resizeMode="contain"
            source={cancelIcon}
          />
        </TouchableOpacity>
        <View style={styles.modalContainer}>
          <TextInput
            leftIcon={stateIcon}
            placeholder={'Enter your Country'}
            maxChars={50}
            capitalType={'none'}
            returnType={'done'}
            onChangeText={text => this.searchCountryText(text)}
          />

          <FlatList
            data={this.state.countryList}
            showsVerticalScrollIndicator={false}
            ref={ref => (this.flatlistRef = ref)}
            renderItem={({item}) => (
              <View>
                <TouchableOpacity onPress={() => this.setStateData(item)}>
                  <View style={popupMainStyle}>
                    <Text>{item.name}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={item => item.id.toString()}
          />
        </View>
      </Modal>
    );
  }

  showStatePopup(isVisible) {
    const {closeBtnStyle, popupMainStyle} = styles;
    return isVisible === false ? null : (
      <Modal
        isVisible={true}
        animationType={'slide'}
        style={{backgroundColor: '#ffffff',marginTop:50}}>
        <TouchableOpacity
          style={closeBtnStyle}
          onPress={this.dismissStatePopup.bind(this)}>
          <Image
            style={{width: 20, height: 20, alignSelf: 'flex-end'}}
            resizeMode="contain"
            source={cancelIcon}
          />
        </TouchableOpacity>
        <View style={styles.modalContainer}>
          <TextInput
            style={styles.inputBox}
            leftIcon={stateIcon}
            placeholder={'Enter your State'}
            maxChars={50}
            capitalType={'none'}
            returnType={'done'}
            onChangeText={text => this.searchStateText(text)}
          />

          <FlatList
            data={this.state.stateData}
            showsVerticalScrollIndicator={false}
            ref={ref => (this.flatlistRef = ref)}
            renderItem={({item}) => (
              <View>
                <TouchableOpacity onPress={() => this.setCityData(item)}>
                  <View style={popupMainStyle}>
                    <Text>{item.name}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={item => item.id.toString()}
          />
        </View>
      </Modal>
    );
  }

  showCityPopup(isVisible) {
    const {closeBtnStyle, popupMainStyle} = styles;
    return isVisible === false ? null : (
      <Modal
        isVisible={true}
        animationType={'slide'}
        style={{backgroundColor: '#FFFFFF',marginTop:50}}>
        <TouchableOpacity
          style={closeBtnStyle}
          onPress={this.dismissCityPopup.bind(this)}>
          <Image
            style={{width: 20, height: 20, alignSelf: 'flex-end'}}
            resizeMode="contain"
            source={cancelIcon}
          />
        </TouchableOpacity>
        <View style={styles.modalContainer}>
          <TextInput
            style={styles.inputBox}
            leftIcon={stateIcon}
            placeholder={'Enter your city'}
            maxChars={50}
            capitalType={'none'}
            returnType={'done'}
            onChangeText={text => this.searchCityText(text)}
          />

          <FlatList
            data={this.state.cityData}
            showsVerticalScrollIndicator={false}
            ref={ref => (this.flatlistRef = ref)}
            renderItem={({item}) => (
              <View>
                <TouchableOpacity onPress={() => this.setCityValues(item)}>
                  <View style={popupMainStyle}>
                    <Text>{item.name}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={item => item.id.toString()}
          />
        </View>
      </Modal>
    );
  }

  render() {
    dataCountries = csc.getAllCountries();
    return (
      <View style={{flex:1}}>
        <Text style={{alignSelf: 'center', fontSize: 20, margin: 10}}>
          Select your location
        </Text>
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          
        <TouchableOpacity onPress={() => this.setCountryPickerVisiblity()}>
          <View style={styles.dobStyle1}>
            <Image
              style={{marginRight: 14.5, width: 22.5, height: 22.5}}
              resizeMode="contain"
              source={stateIcon}
            />
            <Text
              style={{flex: 1}}
              placeholderTextColor="#000000"
              placeholder="Select country">
              {this.state.userCountry==''?"Select country":this.state.userCountry}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => this.setStatePickerVisiblity()}>
          <View style={styles.dobStyle2}>
            <Image
              style={{marginRight: 14.5, width: 22.5, height: 22.5}}
              resizeMode="contain"
              source={stateIcon}
            />
            <Text
              style={{flex: 1}}
              placeholderTextColor="#000000"
              placeholder="Select state">
              {this.state.userState==''?"Select state":this.state.userState}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => this.setCityPickerVisiblity()}>
          <View style={styles.dobStyle3}>
            <Image
              style={{marginRight: 14.5, width: 22.5, height: 22.5}}
              resizeMode="contain"
              source={stateIcon}
            />
            <Text
              style={{flex: 1}}>
              {this.state.userCity==''?"Select city":this.state.userCity}
            </Text>
          </View>
        </TouchableOpacity>

        {this.showCountryPopup(this.state.isCountryPickerVisible)}
        {this.showStatePopup(this.state.isStatePickerVisible)}
        {this.showCityPopup(this.state.isCityPickerVisible)}
</View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  popupMainStyle: {
    padding:
      Platform.OS == 'ios'
        ? Dimensions.get('window').height == 812
          ? 40
          : 30
        : 30,
  },
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
  dobStyle: {
    marginTop: 10,
    width: '100%',
    padding: 16,
    borderRadius: 5,
    backgroundColor: '#fff',
    shadowColor: 'rgba(99, 99, 99, 0.23)',
    flexDirection: 'row',
    shadowOffset: {
      width: 0,
      height: 0.5,
    },
    shadowRadius: 3.5,
    shadowOpacity: 1,
    position: 'relative',
    elevation: 3.5,
  },
  inputBox: {
    borderColor: '#000000',
    // borderWidth: 1,
    margin: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    margin: 10,
    // padding: 50,
  },
  innerContainer: {
    alignItems: 'center',
  },
  closeBtnStyle: {
    // position: 'absolute',
    // top: -10,
    // bottom: 0,
    // right: 0,
    // zIndex: 1,
    // backgroundColor: Colors.white,
    // borderRadius: 20 / 2,
    // height: 20,
    // width: 20,
  },
  dobStyle1: {
    marginTop: 20,
    width: '100%',
    padding: 16,
    borderRadius: 5,
    backgroundColor: '#fff',
    shadowColor: 'rgba(99, 99, 99, 0.23)',
    flexDirection: 'row',
    shadowOffset: {
      width: 0,
      height: 0.5,
    },
    shadowRadius: 3.5,
    shadowOpacity: 1,
    position: 'relative',
    elevation: 3.5,
  },
  dobStyle2: {
    marginTop: 20,
    width: '100%',
    padding: 16,
    borderRadius: 5,
    backgroundColor: '#fff',
    shadowColor: 'rgba(99, 99, 99, 0.23)',
    flexDirection: 'row',
    shadowOffset: {
      width: 0,
      height: 0.5,
    },
    shadowRadius: 3.5,
    shadowOpacity: 1,
    position: 'relative',
    elevation: 3.5,
  },
  dobStyle3: {
    marginTop: 20,
    width: '100%',
    padding: 16,
    borderRadius: 5,
    backgroundColor: '#fff',
    shadowColor: 'rgba(99, 99, 99, 0.23)',
    flexDirection: 'row',
    shadowOffset: {
      width: 0,
      height: 0.5,
    },
    shadowRadius: 3.5,
    shadowOpacity: 1,
    position: 'relative',
    elevation: 3.5,
  },
});

export default App;

