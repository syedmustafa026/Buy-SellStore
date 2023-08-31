import {
  Dimensions,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { Color } from '../../constants/colors';
import Back from 'react-native-vector-icons/AntDesign';
import Buttons from '../../components/Buttons';
import AsyncStorage from '@react-native-async-storage/async-storage';
// @translator
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';

const images = [
  require('../../assets/SamplePictures/2.png'),
  require('../../assets/SamplePictures/2.png'),
  require('../../assets/SamplePictures/2.png'),
]

const ProductDetails = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { productDetails } = route.params
  const sellerDetail = productDetails['seller-details']
  const [addFav, setAddFav] = useState(false)
  const [imgActive, setimgActive] = useState(null)
  const [senderId, setSenderID] = useState(0)
  useEffect(async () => {
    const userId = await AsyncStorage.getItem('uid');
    setSenderID(userId)

  }, [])
  onchange = nativeEvent => {
    if (nativeEvent) {
      const slide = Math.ceil(
        nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width,
      );
      if (slide != imgActive) {
        setimgActive(slide);
      }
    }
  };
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      {/* Topbar ICONS */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          position: 'absolute',
          padding: 20,
          zIndex: 1,
          width: '100%',
        }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Back name="left" size={20} color="white" />
        </TouchableOpacity>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity onPress={() => setAddFav(!addFav)}>
          </TouchableOpacity>
        </View>
      </View>
      {/*END Topbar ICONS */}
      <View >
        <ScrollView
          showsHorizontalScrollIndicator={false}
          onScroll={({ nativeEvent }) => onchange(nativeEvent)}
          horizontal
          pagingEnabled
          style={{
            backgroundColor: 'white',
            height: Dimensions.get('screen').height / 2.3,
          }}>
          {productDetails?.images == null ? (
            <Image
              style={{ height: '100%', width: Dimensions.get('screen').width }}
              source={require('../../assets/Icons/MaskGroup121.png')}
            />
          ) : (
            productDetails?.images?.map((e, index) => (
              <Image
                // resizeMode="contain"
                key={index}
                style={{ height: '100%', width: Dimensions.get('screen').width }}
                source={{ uri: e }}
              />
            ))
          )}
        </ScrollView>

        <View
          style={{
            bottom: 0,

            flexDirection: 'row',
            alignSelf: 'center',
            // backgroundColor: 'black',
          }}>
          {productDetails?.images?.map((e, index) => (
            <Text
              key={Math.random() * 1000}
              style={imgActive == index ? styles.dotActive : styles.dot}>
              ●
            </Text>
          ))}
        </View>
      </View>
      {/* //PRofile VIew */}
      <View style={{ height: '100%', padding: 8, margin: 8 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={{ fontSize: 20, fontWeight: '600', color: 'black' }}>{productDetails?.title}</Text>
            <Text style={{ fontSize: 20, fontWeight: '600', marginTop: 5 }}>€ {productDetails?.price}</Text>
          </View>
          {sellerDetail.id != senderId ? < TouchableOpacity
            onPress={() =>
              navigation.navigate('ChatScreen', {
                listingId: productDetails?.id,
                withId: sellerDetail.id,
                profilePic: sellerDetail.profile_picture,
                imageUri: productDetails.images[0],
                price: productDetails.price,
                productName: productDetails.title,
              })
            }>
            <Image
              style={{ height: 70, width: 70 }}
              source={require('../../assets/Icons/Group13720.png')}
            />
          </TouchableOpacity> :
            ''
          }
        </View>
        <View
          style={{
            marginTop: '6%',
          }}>
          <Text
            style={{
              fontSize: 16,
              color: 'grey',
              textAlign: 'left',
              flexWrap: 'wrap',
            }}>
            {productDetails?.description}
          </Text>
        </View>
        <View
          style={{
            borderWidth: 0.8,
            borderBottomColor: '#E0E0E0',
            marginTop: '6%'
          }}
        />
        <View style={{ marginTop: '6%' }}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: 'black' }}>Seller details</Text>
        </View>
        {/* for profile pic */}
        <TouchableOpacity
          onPress={() => navigation.navigate('ProfileDetails', {
            productDetails: productDetails,
            sellerDetails: sellerDetail
          })}
          style={{ flexDirection: 'row', alignItems: 'center', marginTop: '6%' }}>
          <Image
            style={{ height: 50, width: 50, borderRadius: 100 }}
            source={
              sellerDetail?.profile_picture == 'http://95.179.209.186/'
                ? require('../../assets/Icons/noPic.png')
                : { uri: sellerDetail?.profile_picture }
            }
          />
          <View style={{ left: 15 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 15, color: 'black' }}>
              {sellerDetail?.name == null ? '' : sellerDetail?.name}
            </Text>
            <Text
              style={{
                color: Color.darkOrange,
              }}>
              {productDetails?.location}
            </Text>
          </View>
        </TouchableOpacity>
        <View style={{ marginTop: '5%' }}>
          <Buttons name={t('common:buynow')} />
        </View>
      </View>
      {/* //END PROFILE VIEW */}
    </ScrollView >
  );
};

export default ProductDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.splashWhite,
  },
  dotActive: {
    margin: 3,
    fontWeight: 'bold',
    fontSize: 20,
    color: Color.darkOrange,
  },
  dot: {
    margin: 3,
    color: Color.gray,
    fontWeight: 'bold',
    fontSize: 20,
  },
});
