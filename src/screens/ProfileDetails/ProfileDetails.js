import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
} from 'react-native'
import React from 'react'
import { Color } from '../../constants/colors'
import Back from 'react-native-vector-icons/AntDesign'
import Card from '../../components/Card'
import { useTranslation } from 'react-i18next'
import { Base_Url } from '../../api/Api'
import { useEffect } from 'react'
const ProfileDetails = ({ navigation, route }) => {
  const { t } = useTranslation()
  const { productDetails } = route.params
  const sellerDetail = productDetails['seller-details']
  const [allListing, setAllListing] = React.useState([]);

  console.log("productDetails", productDetails)
  console.log("sellerDetail", sellerDetail)

  const getMylisting = async () => {
    fetch(`${Base_Url}/get-my-listings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: sellerDetail.id }),
    })
      .then(response => response.json())
      .then(data => {
        const respo = data;
        setAllListing(respo?.data);
      })
      .catch(error => {
        console.error(error);
      });
  };
  useEffect(() => {
    getMylisting()
  }, [])
  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        style={{ marginTop: 20 }}
        onPress={() => navigation.goBack()}>
        <Back name="left" size={20} color="black" />
      </TouchableOpacity>
      {/* //Profile Section  */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View
          style={{ flexDirection: 'row', alignItems: 'center', marginTop: 30 }}>
          <Image
            style={{ margin: 5, height: 50, width: 50, borderRadius: 100 }}
            source={
              sellerDetail.profile_picture == "http://95.179.209.186/"
                ? require('../../assets/Icons/noPic.png')
                : { uri: sellerDetail.profile_picture }
            }
          />
          <View style={{ left: 10 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 24, color: 'black' }}>
              {sellerDetail.name}
            </Text>
            <Text
              style={{
                color: Color.darkOrange,
              }}>
              {sellerDetail.city}
            </Text>
          </View>
        </View>
        {/* <Image
          style={{ height: 70, width: 70, alignSelf: 'center', top: 22 }}
          source={require('../../assets/Icons/Group13720.png')}
        /> */}
      </View>
      {/* END PROFILE SECTION */}

      {/* ABOUT SECTION */}
      <View
        style={{
          marginTop: 10,
          paddingVertical: 30,
          borderBottomWidth: 0.3,
          borderColor: 'lightgray',
        }}>
        <Text style={{ fontWeight: 'bold', color: 'black', fontSize: 18 }}>
          {t('common:about')}
        </Text>
        <Text style={{ color: 'black', marginTop: 10, flexWrap: 'wrap' }}>
          {`I am from ${sellerDetail.city}, I am here to exchange these jeweleries`}
        </Text>
      </View>
      {/* END ABOUT SECTION */}

      {/* Listing View */}
      <View style={{ marginTop: 20 }}>
        <Text style={{ fontWeight: 'bold', color: 'black', fontSize: 18 }}>
          {t('common:listings')}
        </Text>

        <FlatList
          key={Math.random() * 100000}
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}
          style={{ margin: 5 }}
          data={allListing}
          numColumns={2}
          renderItem={item => {
            return (
              <Card
                name={item?.item?.title}
                price={`€ ${item?.item?.price}`}
                isFav={'no'}
                isHide={true}
                bgImage={item?.item?.images}
                productDetails={productDetails}
              />
            )
          }}
        />
      </View>
    </ScrollView>
  )
}

export default ProfileDetails

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.splashWhite,
    padding: 20,
  },
})
