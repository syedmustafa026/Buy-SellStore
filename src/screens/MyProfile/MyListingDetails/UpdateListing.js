import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  ScrollView,
  Modal,
  FlatList,
  Dimensions,
  StatusBar,
  PermissionsAndroid,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import TextField from '../../../components/TextField';

// import TextField from '../../components/TextField';
import Buttons from '../../../components/Buttons';
import { Color } from '../../../constants/colors';
import { Checkbox } from 'react-native-paper';

// @Vector Icon
import Ico from 'react-native-vector-icons/AntDesign';
import Gender from 'react-native-vector-icons/MaterialCommunityIcons';

import { useTranslation } from 'react-i18next';
// import {Base_Url} from '../../api/Api';
import { Base_Url } from '../../../api/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ImagePicker, {
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import { useIsFocused } from '@react-navigation/native';
import Toast from '../../../components/Toast'

const UpdateListing = ({ navigation, route }) => {
  const { t } = useTranslation();
  const [checked, setChecked] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [countryModal, setCountryModal] = useState(false);


  //data of Fields
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [country, setCountry] = useState('Cities');
  const [description, setDescription] = useState('');
  const [openModal1, setopenModal1] = useState(false);
  const [category, setCategory] = useState('');
  const [images, setImages] = useState([]);
  const [img, setImg] = useState([]);
  const [id, setId] = useState();
  const [modalVisible1, setModalVisible1] = useState(false);
  const [Loading, setLoading] = useState(false);

  const [citeiesList, setCititesList] = useState([]);
  const [filterCitiesList, setFilterCiteisList] = useState();

  const { allDetails } = route?.params;
  console.log(route);
  useEffect(() => {
    setTitle(allDetails?.title);
    setPrice(allDetails?.price);
    setCountry(allDetails?.cites);
    setDescription(allDetails?.description);
    setCategory(allDetails?.category);
    setId(allDetails?.id);
    setImages(allDetails?.images);
  }, []);

  const focused = useIsFocused();
  useEffect(() => {
    getCityName();
  }, [focused == true]);

  const cities = [
    'Madrid',
    'Barcelona',
    'Valencia',
    'Sevilla',
    'Málaga',
    'Murcia',
    'Bilbao',
    'Zaragoza',
    'Palma de Mallorca',
    'Las Palmas de Gran Canaria',
  ];
  // console.log('Imags Arry===>', images);
  //posing Listing

  const postListing = async () => {
    if (!checked) Toast("Confirm the Terms and conditions")
    else {
      setLoading(true)
      const data = new FormData();
      data.append('listing_id', id);
      data.append('title', title);
      data.append('price', price);
      data.append('location', country);
      data.append('description', description);

      data.append('category', category);

      await fetch(`${Base_Url}/listings-update`, {
        method: 'POST',
        body: data,
      })
        .then(response => response.json())
        .then(data => {
          //   const res = data.json();
          const respo = data;
          console.log(respo?.status, '=====>');
          if (respo?.message == 'Something missing. All fields are required') {
            Toast(respo?.message);
          } else {
            // Toast(respo?.message);
            setModalVisible(!modalVisible),
              setTimeout(() => {
                setModalVisible(false);
                setLoading(true)
                navigation.navigate('MyProfile');
              }, 3000);
          }
        })

        .catch(error => {
          console.error(error);
        });
    }
  }


  const selectedImg = [
    { id: 1, imgUri: require('../../../assets/SamplePictures/1.png') },
    { id: 2, imgUri: require('../../../assets/SamplePictures/2.png') },
  ];

  const LaunchImageLibrary = () => {
    const options = {
      selectionLimit: 10,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    launchImageLibrary(options, response => {
      // console.log('Image LibraResponse = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = response;
        setImages([...images, source.assets[0].uri]);
        setImg(source);
      }
    });
  };

  const RemoveImage = val => {
    // console.log(val, '========>REMOVE ITEM');
    const imags = images.filter(image => image !== val);
    // console.log('=====>FILTER FUNCTION KEY====>', imags);
    setImages(imags);
    console.log(imags, '====>UPDATED Remove aray');
  };

  //CAMERA LAUNCH
  const LaunchCamera = () => {
    const options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    launchCamera(options, response => {
      console.log('Response = ', response);

      // Permissions for launchng camera
      const requestCameraPermission = async () => {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
              title: 'Cool Photo App Camera Permission',
              message:
                'Cool Photo App needs access to your camera ' +
                'so you can take awesome pictures.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('You can use the camera');
          } else {
            console.log('Camera permission denied');
          }
        } catch (err) {
          console.warn(err);
        }
      };

      requestCameraPermission();

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        Toast(response.customButton);
      } else {
        const source = response;
        console.log('===>URL============>', source);
        setImages([...images, source.assets[0].uri]);

        // imgUri(source.assets[0].uri);

        // setBackLicence(source.assets[0].uri);
      }
    });
  };

  const getCityName = () => {
    // setLoading(true);
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
        // setLoading(false)
        //console.log(json)
        if (json.error == false) {
          setCititesList(json.data);
          setFilterCiteisList(json.data);
        } else {
          Toast(json.error);
        }
      })
      .catch(error => {
        // setLoading(false);
        console.log('response error ===>', error);
      });
  };

  const handleSearchCites = searctTxt => {
    const filterData = citeiesList?.filter(val =>
      val?.toLowerCase().startsWith(searctTxt.toLowerCase()),
    );
    // const filterData = citeiesList.filter(val => val == searctTxt);
    setFilterCiteisList(filterData);
    if (searctTxt == '') {
      setFilterCiteisList(citeiesList);
    }
  };
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      <View style={styles.secoundContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="left" size={20} color="black" />
        </TouchableOpacity>
        {/* First Container Started */}
        <View
          style={{
            borderWidth: 1,
            borderColor: 'gray',
            padding: 10,
            marginTop: 35,
            borderStyle: 'dashed',
            borderRadius: 10,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 10,
            }}>
            <View
            // onPress={LaunchImageLibrary}
            // onPress={() => setopenModal1(true)}
            >
              <Text style={{ color: '#000000' }}>
                {t('common:uploadupto10pictures')}
              </Text>
            </View>
            <AntDesign name="right" size={15} color="black" />
          </View>
          {images.length == 0 ? (
            <>
              <View
                style={{
                  height: 70,
                  width: 80,
                  borderRadius: 20,
                  backgroundColor: 'lightgray',
                  justifyContent: 'center',
                  alignItems: 'center',
                  margin: 10,
                }}>
                <TouchableOpacity onPress={() => setopenModal1(true)}>
                  <AntDesign color="gray" size={20} name="pluscircle" />
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <ScrollView horizontal>
              <View
                style={{
                  height: 65,
                  width: 90,
                  borderRadius: 20,
                  backgroundColor: 'lightgray',
                  justifyContent: 'center',
                  alignItems: 'center',
                  margin: 10,
                  marginTop: 18,
                }}>
                  <TouchableOpacity onPress={() => setopenModal1(true)}>
                    <AntDesign color="gray" size={20} name="pluscircle" />
                  </TouchableOpacity>
                </View>
                {images.map((val, index) => {
                  return (
                    <>
                      <View>
                        <TouchableOpacity
                          onPress={() => RemoveImage(val)}
                          style={{
                            flexDirection: 'row-reverse',
                            elevation: 10,
                            zIndex: 1,
                          }}>
                          <AntDesign
                            name="closecircle"
                            style={{ top: 10 }}
                            size={20}
                            color="black"
                          />
                        </TouchableOpacity>
                        <Image
                          style={{
                            height: 60,
                            width: 90,
                            borderRadius: 10,
                            marginHorizontal: 5,
                          }}
                          source={{ uri: val == undefined ? null : val }}
                        // source={{uri: val}}
                        />
                      </View>
                    </>
                  );
                })}
              </ScrollView>
            </>
          )}
        </View>
        {/* First Container END */}
        <TextField
          val={title}
          setTxt={txt => setTitle(txt)}
          placeHolder={t('common:listingtitle')}
        />
        <View
          style={{
            marginVertical: 10,
            borderWidth: 1,
            borderRadius: 30,
            borderColor: 'gray',
            height: 50,
            marginTop: 10,
            color: 'black',
            // padding: 15,
            paddingLeft: 25,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Text style={{ color: 'black', fontSize: 20 }}>€</Text>
          <TextInput
            value={price}
            keyboardType="number-pad"
            placeholderTextColor={'gray'}
            style={{
              color: 'black',
              // padding: 15,
              width: '90%',
              alignItems: 'center',
              justifyContent: 'center'
            }}

            placeholder={'  0.00'}
            onChangeText={txt => setPrice(txt)}
          />
        </View>

        <TouchableOpacity
          onPress={() => {
            setModalVisible1(true), setCountryModal(!countryModal);
          }}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            borderWidth: 1,
            marginVertical: 0,
            height: '8%',
            borderRadius: 75,
            borderColor: 'gray',
            top: 5,

          }}>
          {/* <TextInput
            setTxt={txt => setCountry(txt)}
            placeholderTextColor={Color.darkGray}
            placeholder={country}
          /> */}
          <Text style={{ marginLeft: 25, alignItems: 'center' }}>{country}</Text>
          {/* <TextField
      
            setTxt={txt => setCountry(txt)}
            placeHolder={t('common:country')}
          /> */}
          <TouchableOpacity
            style={{ right: 10 }}
            onPress={() => setModalVisible1(true)}
          >
            <AntDesign onPress={() => setModalVisible1(true)} name={'down'} size={20} color="black" />
          </TouchableOpacity>
        </TouchableOpacity>
        <View>
          {countryModal ? (
            <>
              <Modal
                statusBarTranslucent={true}
                animationType="slide"
                transparent={true}
                visible={modalVisible1}
                onRequestClose={() => setModalVisible1(false)}
              >

                <View style={{ flex: 1, backgroundColor: 'white', height: "100%", }}>
                  <View
                    style={{
                      backgroundColor: 'white',
                      padding: 20,
                      paddingTop: 50,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Text style={{ color: 'black', fontSize: 20 }}>
                      Select Location
                    </Text>
                    <TouchableOpacity onPress={() => setModalVisible1(false)}>
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
                      marginBottom: 10,
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
                            setCountryModal(false), setCountry(item.item);
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
        </View>

        <View style={{ marginTop: '3%' }}>
          <TextInput
            multiline={true}
            value={description}
            onChangeText={txt => setDescription(txt)}
            placeholderTextColor={'gray'}
            style={styles.txtContainer}
            placeholder={t('common:Describeaboutyoulisting')}
          />
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
        {/* @Button */}
        <Buttons
          onpress={() => {
            postListing();
          }}
          name={Loading ? 
            <>
            <TouchableOpacity disabled style={styles.containe11}>
              <ActivityIndicator size={20} color={Color.yellow} />
            </TouchableOpacity>
          </> :
            "Update Listings"}
        />
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <StatusBar hidden />
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={{
              flex: 1,
              height: Dimensions.get('screen').height,
              backgroundColor: 'rgba(0,0,0,0.61)',

              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                backgroundColor: Color.splashWhite,
                width: Dimensions.get('screen').width - 30,
                paddingVertical: '25%',
                borderRadius: 20,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                style={{ height: 90, width: 90 }}
                source={require('../../../assets/Icons/Group13719.png')}
              />
              <View
                style={{
                  marginTop: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{ fontWeight: 'bold', color: 'black', fontSize: 17 }}>
                  {t('common:updatedscucessfully')}
                </Text>
                <Text style={{ color: 'black' }}>
                  {t('common:yourlistingupdatedsuccessfully')}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>

      <Modal
        statusBarTranslucent={true}
        animationType="slide"
        transparent={true}
        visible={openModal1}
        onRequestClose={() => setopenModal1(false)}

      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.61)',
            flexDirection: 'column-reverse',
          }}>
          <View
            style={{
              backgroundColor: 'white',
              padding: 20,
              margin: 30,
              borderRadius: 20,
              justifyContent: 'flex-end',
            }}>
            <TouchableOpacity
              onPress={() => {
                LaunchCamera(), setopenModal1(false);
              }}
              style={{ flexDirection: 'row' }}>
              <Ico name="camerao" size={30} color="black" />
              <Text style={{ fontSize: 15, color: 'black', top: 5, left: 10 }}>
                {t('common:takeaphoto')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              // onPress={LaunchImageLibrary}
              onPress={() => {
                LaunchImageLibrary(), setopenModal1(false);
              }}
              style={{ flexDirection: 'row' }}>
              <Gender name="view-dashboard-outline" size={30} color="black" />
              <Text style={{ fontSize: 15, color: 'black', top: 5, left: 10 }}>
                {t('common:chosefromGallery')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default UpdateListing;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.splashWhite,
    padding: 20,
  },
  secoundContainer: {
    flex: 1,
    backgroundColor: Color.splashWhite,
    marginTop: 20,
    marginBottom: 60,
  },
  checkBox: {
    flexDirection: 'row',
    marginTop: 20,
    // marginHorizontal: 10,
  },
  txtContainer: {
    borderWidth: 1,
    borderRadius: 30,
    borderColor: 'gray',
    height: 120,
    marginTop: 10,
    padding: 15,
    textAlignVertical: 'top',
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
