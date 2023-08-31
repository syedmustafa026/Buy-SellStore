import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  Modal,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { Color } from '../../constants/colors';
import SearchBar from '../../components/SearchBar';
import CategoryContainer from '../../components/CategoryContainer';
import Card from '../../components/Card';
import { useTranslation } from 'react-i18next';
import { Base_Url } from '../../api/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import Toast from '../../components/Toast'

// @ICons
import AntDesign from 'react-native-vector-icons/AntDesign';

const Home = () => {
  const { t } = useTranslation();
  const [data, setData] = useState();
  const [filterData, setFilterData] = useState([]);
  const [selected, setSelected] = useState(t('common:all'));
  const [countryModal, setCountryModal] = useState(false);
  const [Cities, setCities] = useState('');

  // @Modal Cities
  const [modalVisible, setModalVisible] = useState(false);

  //Citeis
  const [citeiesList, setCititesList] = useState([]);
  const [filterCitiesList, setFilterCiteisList] = useState();
  //handle to change View
  const [find, setFind] = useState('notCheck');
  // @check updates or not
  const [check, setCheck] = useState(false);

  const getAllListing = async () => {
    const userData = await AsyncStorage.getItem('userData');
    const parsedData = userData ? JSON.parse(userData) : null;
    if (parsedData) {
      await fetch(`${Base_Url}/get-listings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: parsedData.id }),
      })
        .then(response => response.json())
        .then(data => {
          const respo = data;
          let tempData = [];
          respo?.data?.map(item => {
            tempData = [...tempData, ...item.listings];
          });
          if (Cities != '') {
            let newData = getDataByLocation(tempData, Cities);
            setData(tempData);
            setCheck(false);
            setFilterData(newData);
          }

        })
        .catch(error => {
          console.error(error);
        });
    }
  };

  const hadlefilter = () => {
    const filterData = data?.filter(val => val?.category === selected);
    const cityWise = getDataByLocation(filterData, Cities);
    setFilterData(cityWise);
    selected == 'All' ? getAllListing() : null;
  };

  const hadleCiteiesFilter = async () => {
    let updatedData = [];
    if (selected === 'All') {
      if (!data) getAllListing();
      else updatedData = getDataByLocation(data, Cities);
    } else {
      const filterData = data?.filter(val => val?.category === selected);
      updatedData = getDataByLocation(filterData, Cities);
    }
    setFilterData(updatedData);
  };

  const handleSearchItem = async searctTxt => {
    const newFilterData = data?.filter(val => {
      if (val?.location === Cities) {
        return val?.title.toLowerCase().startsWith(searctTxt.toLowerCase());
      }
    });

    setFilterData(newFilterData);
    filterData?.length == 0 ? setFind('searchBar') : null;

    if (searctTxt == '') {
      await getAllListing();
    }
  };

  const handleSearchCites = searctTxt => {
    const filterData = citeiesList?.filter(val =>
      val?.toLowerCase().startsWith(searctTxt.toLowerCase()),
    );
    setFilterCiteisList(filterData);
    if (searctTxt == '') {
      setFilterCiteisList(citeiesList);
    }
  };

  const getDataByLocation = (arr, city) => {
    let newData = [];
    if (arr && city != '') {
      arr.map(item => {
        if (item.location === city) {
          newData.push(item);
        }
      });
    }
    return newData;
  };

  const focused = useIsFocused();
  useEffect(() => {
    getAllListing();
    getCityName();
  }, [focused == true, check]);

  const setCityFirstTime = async () => {
    const userData = await AsyncStorage.getItem('userData');
    const parsedData = userData ? JSON.parse(userData) : null;
    if (parsedData) setCities(parsedData.city);
  };

  useEffect(() => {
    setCityFirstTime()
  }, []);

  useEffect(() => {
    hadlefilter();
  }, [selected]);
  useEffect(() => {
    hadleCiteiesFilter();
  }, [Cities]);

  const handleSelected = value => {
    setSelected(value);
    setFind(value);
  };

  const getCityName = country => {
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
    <View style={styles.container}>
      <View style={{ padding: 20 }}>
        <SearchBar getSearch={txt => handleSearchItem(txt)} />
        <TouchableOpacity
          onPress={() => {
            setCountryModal(!countryModal), setModalVisible(true);
          }}
          style={[
            styles.dropDownContainer,
          ]}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              style={{ height: 20, width: 20 }}
              source={require('../../assets/Icons/Group4039.png')}
            />
            <Text style={{ left: '100%' }}>{Cities}</Text>
          </View>
          <TouchableOpacity
            style={{ right: 10 }}
          >
            <AntDesign onPress={() => setModalVisible(true)} name={'caretdown'} size={18} color="black" />
          </TouchableOpacity>
        </TouchableOpacity>
        {countryModal ? (
          <>
            <Modal
              statusBarTranslucent={true}
              animationType="slide"
              transparent={true}
              visible={modalVisible}
            >
              <View style={{ flex: 1, backgroundColor: 'white', height: "100%" }}>
                <View
                  style={{
                    backgroundColor: 'white',
                    padding: 20,
                    paddingVertical: 30,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
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
      </View>
      <View>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{ width: '100%' }}>
          <CategoryContainer
            onPress={handleSelected}
            value={selected}
            name={t('common:all')}
            Icon={
              <Image
                style={{ height: 20, width: 20 }}
                source={require('../../assets/Icons/Group13721.png')}
              />
            }
          />
          <CategoryContainer
            onPress={handleSelected}
            value={selected}
            name={t('common:rings')}
            Icon={
              <Image
                style={{ height: 20, width: 20 }}
                source={require('../../assets/Icons/Group13722.png')}
              />
            }
          />
          <CategoryContainer
            onPress={handleSelected}
            value={selected}
            name={t('common:necklaces')}
            Icon={
              <Image
                style={{ height: 20, width: 20 }}
                source={require('../../assets/Icons/Group13723.png')}
              />
            }
          />
          <CategoryContainer
            onPress={handleSelected}
            value={selected}
            name={t('common:earrings')}
            Icon={
              <Image
                style={{ height: 20, width: 20 }}
                source={require('../../assets/Icons/Group13724.png')}
              />
            }
          />
          <CategoryContainer
            onPress={handleSelected}
            value={selected}
            name={t('common:bracelat')}
            Icon={
              <Image
                style={{ height: 20, width: 20 }}
                source={require('../../assets/Icons/Group13725.png')}
              />
            }
          />
          <CategoryContainer
            onPress={handleSelected}
            value={selected}
            name="Bangles"
            Icon={
              <Image
                style={{ height: 20, width: 20 }}
                source={require('../../assets/Icons/Group13731.png')}
              />
            }
          />
          <CategoryContainer
            onPress={handleSelected}
            value={selected}
            name="Diamonds"
            Icon={
              <Image
                style={{ height: 20, width: 20 }}
                source={require('../../assets/Icons/Group13730.png')}
              />
            }
          />
        </ScrollView>
      </View>

      {filterData?.length == 0 ? (
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {find == 'Bangles' ? (
            <Text>No bangles found</Text>
          ) : null || find == 'Diamonds' ? (
            <>
              <Image
                resizeMode="contain"
                style={{ height: 80, width: 80 }}
                source={require('../../assets/Icons/Path13197.png')}
              />
              <Text style={{ color: 'gray' }}>No Diamonds Found</Text>
            </>
          ) : null || find == 'Bracelet' ? (
            <>
              <Image
                resizeMode="contain"
                style={{ height: 80, width: 80 }}
                source={require('../../assets/Icons/Shape-3.png')}
              />
              <Text style={{ color: 'gray' }}>No Bracelet Found</Text>
            </>
          ) : null || find == 'Eearrings' ? (
            <>
              <Image
                resizeMode="contain"
                style={{ height: 80, width: 80 }}
                source={require('../../assets/Icons/Shape-2.png')}
              />
              <Text style={{ color: 'gray' }}>No Eearrings Found</Text>
            </>
          ) : null || find == 'Necklaces' ? (
            <>
              <Image
                resizeMode="contain"
                style={{ height: 80, width: 80 }}
                source={require('../../assets/Icons/Shape-1.png')}
              />
              <Text style={{ color: 'gray' }}>No Necklaces Found</Text>
            </>
          ) : null || find == 'Rings' ? (
            <>
              <Image
                resizeMode="contain"
                style={{ height: 80, width: 80 }}
                source={require('../../assets/Icons/Shape.png')}
              />
              <Text style={{ color: 'gray' }}>No Rings Found</Text>
            </>
          ) : null || find == 'searchBar' ? (
            <>
              <Image
                resizeMode="contain"
                style={{ height: 80, width: 80 }}
                source={require('../../assets/Icons/Icon.png')}
              />
              <Text style={{ color: 'gray' }}>No Product found </Text>
            </>
          ) : null || find == 'serachCities' ? (
            <>
              <Image
                resizeMode="contain"
                style={{ height: 80, width: 80 }}
                source={require('../../assets/Icons/Icon.png')}
              />
              <Text style={{ color: 'gray' }}>
                No Product Found Based on Citeis
              </Text>
            </>
          ) : null || find == 'All' ? (
            <>
              {/* <Image
                resizeMode="contain"
                style={{height: 80, width: 80}}
                source={require('../../assets/Icons/Path13197.png')}
              /> */}
              <Text style={{ color: 'gray' }}>No items found</Text>
            </>
          ) : null}
        </View>
      ) : (
        <FlatList
          key={Math.random() * 100000}
          scrollEnabled
          showsVerticalScrollIndicator={false}
          style={{ margin: 20 }}
          data={filterData}
          numColumns={2}
          renderItem={item => {
            return (
              <>
                <Card
                  getFUN={() => getAllListing()}
                  id={item?.item?.id}
                  name={item?.item?.title}
                  price={`€ ${item?.item?.price}`}
                  bgImage={item?.item?.images}
                  checkChange={text => setCheck(text)}
                  // bgImage={{
                  //   uri: `${
                  //     item?.item?.images
                  //       ? item?.item?.images
                  //       : item?.item?.images == null
                  //       ? [1]
                  //       : item?.item?.images
                  //   }`,
                  // }}
                  isFav={item?.item?.isFollowed}
                  sellerDetails={item?.item['seller-details']?.id}
                  productDetails={item?.item}
                />
                {/* {/* </View> */}
              </>
            );
          }}
        />
      )}
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.splashWhite,
    // padding: 20,
  },
  dropDownContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: 15,
    // padding: 5,

    borderWidth: 1,
    marginVertical: 10,

    // borderTopEndRadius: 20,
    // borderTopLeftRadius: 20,
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
