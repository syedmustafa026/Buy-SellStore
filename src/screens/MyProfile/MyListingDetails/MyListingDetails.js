import {
  Dimensions,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  View,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { Color } from '../../../constants/colors'
import Back from 'react-native-vector-icons/AntDesign'
import Dots from 'react-native-vector-icons/Entypo'
// import Buttons from '../../components/Buttons'
import Buttons from '../../../components/Buttons'

// @translator
import { useTranslation } from 'react-i18next'

const MyListingDetails = ({ navigation, route }) => {
  const { t } = useTranslation()
  const { productDetails } = route.params
  console.log('PRODUCT DETAILS==>', productDetails.name)
  const sellerDetail = productDetails['seller-details']
  const [imgActive, setimgActive] = useState(0)

  onchange = nativeEvent => {
    if (nativeEvent) {
      const slide = Math.ceil(
        nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width,
      )
      if (slide != imgActive) {
        setimgActive(slide)
      }
    }
  }

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
              source={require('../../../assets/Icons/MaskGroup121.png')}
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
      <View style={{ height: '100%', padding: 8, margin: 8 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={{ fontSize: 20, fontWeight: '600', color: 'black' }}>{productDetails?.title}</Text>
            <Text style={{ fontSize: 20, fontWeight: '600', marginTop: 5 }}>€ {productDetails?.price}</Text>
          </View>

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
            {/* {t('common:productdetails')} */}
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
          onPress={() => navigation.navigate('MyProfile')}
          style={{ flexDirection: 'row', alignItems: 'center', marginTop: '6%' }}>
          <Image
            style={{ height: 50, width: 50, borderRadius: 100 }}
            source={
              productDetails?.profile == null
                ? require('../../../assets/Icons/noPic.png')
                : { uri: productDetails?.profile }
            }
          />
          <View style={{ left: 15 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 15, color: 'black' }}>
              {productDetails.name == null ? '' : productDetails.name}
            </Text>
            <Text
              style={{
                color: Color.darkOrange,
              }}>
              {productDetails?.location}
            </Text>
          </View>
        </TouchableOpacity>
        <View style={{ flexDirection: 'column-reverse', marginTop: '20%' }}>
          <Buttons
            onpress={() =>
              navigation.navigate('UpdateListing', {
                allDetails: {
                  id: productDetails?.id,
                  images: productDetails.images,
                  title: productDetails?.title,
                  price: productDetails?.price,
                  cites: productDetails.location,
                  description: productDetails?.description,
                  category: productDetails?.category,
                },
              })
            }
            name={'Edit Listing'}
          />
        </View>
      </View>
      {/* //END PROFILE VIEW */}
    </ScrollView>
  )
}

export default MyListingDetails

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
})
