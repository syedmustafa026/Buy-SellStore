import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Modal,
  FlatList,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { Color } from '../../constants/colors';
import TextField from '../../components/TextField';
import Buttons from '../../components/Buttons';
import { Checkbox } from 'react-native-paper';
import { useIsFocused } from '@react-navigation/native';
import Back from 'react-native-vector-icons/AntDesign';
import { useTranslation } from 'react-i18next';
import { Base_Url } from '../../api/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// @ICons
import AntDesign from 'react-native-vector-icons/AntDesign';
import Toast from '../../components/Toast';
import * as firebase from '../../components/firebase'


const SignUp = ({ navigation }) => {
  const [checked, setChecked] = useState(false);
  const [firstname, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [conPassword, setConPassword] = useState('');
  const [Cities, setCities] = useState('Cities');
  const [country, setCountry] = useState('Country');
  const [togglePassword, setTogglePassword] = useState(true)
  const [toggleConfirmPassword, setToggleConfirmPassword] = useState(true)
  const [Loading, setLoading] = useState(false);

  const [countryModal, setCountryModal] = useState(false);

  const [citeiesList, setCititesList] = useState([]);
  const [filterCitiesList, setFilterCiteisList] = useState();

  // @Modal Cities
  const [modalVisible, setModalVisible] = useState(false);
  const { t } = useTranslation()

  const focused = useIsFocused();
  useEffect(() => {
    getCityName();
  }, [focused == true]);
  const handleSearchCites = searctTxt => {

    const filterData = citeiesList?.filter(val =>
      val?.toLowerCase().startsWith(searctTxt.toLowerCase()),
    );
    setFilterCiteisList(filterData);
    if (searctTxt == '') {
      setFilterCiteisList(citeiesList);
    }
  }

  const validateEmail = email => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      );
  };
  const signInUser = async () => {
    try {
      let fcmToken = await AsyncStorage.getItem("FCMToken")
      if (!validateEmail(email)) Toast('Enter a valid Email')
      if (Cities === "Cities") Toast('Enter your city')
      if (!firstname) Toast('Enter your first name')
      if (!lastName) Toast('Enter your last name')
      if (!checked) Toast('Please agree the terms and conditions')
      if (password != conPassword) Toast('Password not matched')
      if (validateEmail(email) && Cities != "Cities" && firstname && lastName
        && password == conPassword && checked === true) {
        setLoading(true)
        fetch(`${Base_Url}/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: `${firstname} ${lastName}`,
            email: email,
            password: password,
            confirmed_password: conPassword,
            city: Cities,
          }),
        })
          .then(response => response.json())
          .then(data => {
            const respo = data;

            if (respo?.message == 'Registered successfully') {
              Toast(respo?.message);
              const uid = respo?.data?.id;
              AsyncStorage.setItem('uid', JSON.stringify(uid));
              AsyncStorage.setItem('status', 'loggedIn');
              AsyncStorage.setItem('userName', `${firstname} ${lastName}`)
              AsyncStorage.setItem('userData', JSON.stringify(respo?.data))
              firebase.getMessage(uid, fcmToken)
              navigation.replace('BottomNavigation')
            } else {
              Toast(respo?.message);
              setLoading(false)
            }
          })
          .catch(error => {
            Toast(error)
          });
      }
    } catch (error) {
      Toast(error)
    }

  }

  const getCityName = () => {
    fetch('https://countriesnow.space/api/v0.1/countries/cities', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        country: 'Spain',
      }),
    })
      .then(res => res.json())
      .then(json => {
        if (json.error == false) {
          setCititesList(json.data);
          setFilterCiteisList(json.data);
        } else {
          Toast(json.error);
        }
      })
      .catch(error => {
        Toast(error)
      });
  };


  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Back name="left" size={20} color="black" />
      </TouchableOpacity>
      <View style={{ marginTop: '15%' }}>
        <Text style={{ fontWeight: 'bold', color: Color.black, fontSize: 28 }}>
          {t('common:Signup')}
        </Text>
        <Text style={{ color: 'black' }}>{t('common:letsgetstarted')}</Text>
      </View>
      <View style={styles.txtInputs}>
        <TextField
          setTxt={txt => setFirstName(txt)}
          placeHolder={t('common:firstname')}
        />
        <TextField
          setTxt={txt => setLastName(txt)}
          placeHolder={t('common:lastname')}
        />
        <TextField
          setTxt={txt => setEmail(txt)}
          placeHolder={t('common:email')}
        />
        <TouchableOpacity
          onPress={() => {
            setCountryModal(!countryModal), setModalVisible(true);
          }}
          style={[styles.dropDownContainer, { paddingLeft: 2 }]}>
          <Text style={{ color: 'black', paddingLeft: 25 }}>{Cities}</Text>
          <View setTxt={txt => setCountry(txt)}
            style={{ paddingLeft: 2 }}>

          </View>
          <View
            style={{ right: 10 }}
            onPress={() => setCountryModal(!countryModal)}>
            <AntDesign onPress={() => setModalVisible(true)} name={'down'} size={20} color="black" />
          </View>
        </TouchableOpacity>
        {countryModal ? (
          <>
            <Modal
              statusBarTranslucent={true}
              animationType="slide"
              transparent={true}
              visible={modalVisible}
            >
              <View style={{ flex: 1, backgroundColor: 'white' }}>
                <View
                  style={{
                    backgroundColor: 'white',
                    padding: 20,
                    paddingVertical: 30,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                // onPress={() => setModalVisible(false)}
                >
                  <Text style={{ color: 'black', fontSize: 20 }}>
                    Select Location
                  </Text>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <AntDesign color="black" name="close" size={30} />
                  </TouchableOpacity>
                </View>

                <TextInput
                  placeholder="search cities ...."
                  placeholderTextColor={'black'}
                  style={{
                    borderWidth: 1,
                    borderColor: 'black',
                    borderRadius: 20,
                    marginHorizontal: 10,
                    color: 'black',
                    // backgroundColor: 'blue',
                    padding: 10,
                  }}
                  onChangeText={txt => handleSearchCites(txt)}
                />
                <FlatList
                  style={styles.txtContainer1}
                  data={filterCitiesList}
                  renderItem={item => {
                    return (
                      <TouchableOpacity
                        style={{
                          borderBottomWidth: 1,
                          borderColor: 'black',
                          paddingVertical: 10,
                          marginBottom: 22,
                        }}
                        onPress={() => {
                          setCountryModal(false), setCities(item.item);
                        }}>
                        <Text style={{ color: 'black', fontWeight: 'bold' }}>
                          {item.item}
                        </Text>
                      </TouchableOpacity>
                    );
                  }}
                />
              </View>
            </Modal>


          </>
        ) : null}
        <View style={{ position: 'relative' }}>
          <TextField
            val={password}
            setTxt={txt => setPassword(txt)}
            placeHolder={t('common:password')}
            secureTextEntry={togglePassword}
          />
          <Icon
            style={{ position: 'absolute', top: 25, right: 20 }}
            name={togglePassword ? "eye-off-outline" : "eye-outline"}
            size={23}
            color="black"
            onPress={() => setTogglePassword(!togglePassword)}
          />
        </View>
        <View style={{ position: 'relative' }}>
          <TextField
            val={conPassword}
            setTxt={txt => setConPassword(txt)}
            placeHolder={t('common:Confirm-password')}
            secureTextEntry={toggleConfirmPassword}
          />
          <Icon
            style={{ position: 'absolute', top: 25, right: 20 }}
            name={toggleConfirmPassword ? "eye-off-outline" : "eye-outline"}
            size={23}
            color="black"
            onPress={() => setToggleConfirmPassword(!toggleConfirmPassword)}
          />
        </View>
      </View>
      <View style={styles.checkBox}>
        <Checkbox
          color={checked ? Color.darkOrange : 'black'}
          status={checked ? 'checked' : 'unchecked'}
          onPress={() => {
            setChecked(!checked);
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            // justifyContent: 'center',
            top: 8,
            alignItems: 'center',
            flexWrap: 'wrap',
          }}>
          <Text style={{ color: 'black' }}>{t('common:iagreetoGoldbee')}</Text>

          <Text
            style={{
              textDecorationLine: 'underline',
              left: 10,
              fontWeight: 'bold',
              color: 'black',
            }}>
            {t('common:termsandCondition')}
          </Text>
        </View>
      </View>
      <View>
        <Buttons onpress={() => signInUser()} name={Loading ?
          <>
            <TouchableOpacity disabled>
              <ActivityIndicator size={20} color={Color.yellow} />
            </TouchableOpacity>
          </> :
          t('common:Signup')} />
      </View>
      <View style={styles.bottomTxt}>
        <Text style={{ color: 'black' }}>
          {t('common:Alreadyhaveandaccount')}
        </Text>
        <TouchableOpacity onPress={() => { navigation.navigate('Login') }}>
          <Text style={styles.loginTxt}>{t('common:Login')} </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.splashWhite,
    padding: 20,
  },
  txtInputs: {
    marginTop: 20,
  },
  checkBox: {
    flexDirection: 'row',
    marginTop: 20,

    // marginHorizontal: 10,
  },
  bottomTxt: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 80,
    top: 20,
  },
  loginTxt: {
    fontWeight: 'bold',
    fontSize: 15,
    left: 10,
    color: Color.darkOrange,
  },
  dropDownContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: '12%',
    // padding: 5,

    borderWidth: 1,
    marginVertical: 10,
    borderRadius: 30,

    borderColor: 'gray',
    top: 5,
  },
  txtContainer1: {
    borderWidth: 1,
    borderRadius: 1,
    borderColor: 'gray',
    height: 120,

    paddingTop: 30,
    borderTopWidth: 0,
    bottom: 10,

    padding: 10,
    textAlignVertical: 'top',
  },
});
