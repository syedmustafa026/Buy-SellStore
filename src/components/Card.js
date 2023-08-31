import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Color } from '../constants/colors';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Base_Url } from '../api/Api';
import Toast from './Toast';
const Card = ({
  name,
  price,
  id,
  bgImage,
  onPress,
  isFav,
  deleteIcon,
  isHide = false,
  productDetails,
  listing_id,
  checkChange,
  checkChangeFav,
  sellerDetails,
}) => {
  const [followe, setFollowed] = useState(isFav);
  const [userID, setuserID] = useState('');

  const getUID = async () => {
    const userId = await AsyncStorage.getItem('uid');
    setuserID(userId);
  };

  const focused = useIsFocused();
  useEffect(() => {
    getUID();
  }, [focused == true]);

  const AddFav = async () => {
    const userId = await AsyncStorage.getItem('uid');
    setuserID(userId);
    await fetch(`${Base_Url}/follow-listing`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: userId, listing_id: id }),
    })
      .then(response => response.json())
      .then(data => {
        const respo = data;

        if (respo?.message == 'Followed successfully') {
          Toast('Followed Sucessfully');
          checkChange(true);
        } else {
          console.log(respo?.message);
        }
      })
      .catch(error => {
        console.error(error);
      });
  };
  const nav = useNavigation();


  const RemoveFollowed = async () => {

    const userId = await AsyncStorage.getItem('uid');

    await fetch(`${Base_Url}/follow-listing`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: userId, listing_id: id }),
    })
      .then(response => response.json())
      .then(data => {

        const respo = data;


        if (respo?.message == 'Unfollowed successfully') {
          Toast('Unfollowed successfully');
          setFollowed('no');


        } else {
          console.log(respo?.message);
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  const RemoveFollowedListing = async id => {

    const userId = await AsyncStorage.getItem('uid');
    await fetch(`${Base_Url}/follow-listing`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: userId, listing_id: id }),
    })
      .then(response => response.json())
      .then(data => {
        const respo = data;
        if (respo?.message == 'Unfollowed successfully') {
          Toast('Unfollowed successfully');
          setFollowed('no');
          checkChangeFav(true);

        } else {
          console.log(respo?.message);
        }
      })
      .catch(error => {
        console.error(error);
      });
  };
  return (
    <TouchableOpacity
      onPress={() =>
        nav.navigate('ProductDetails', { productDetails: productDetails })
      }
      style={styles.container}>
      <Image
        // resizeMode="contain"
        style={{
          height: 120,
          width: '100%',
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
        }}
        source={
          bgImage == null
            ? require('../assets/Icons/MaskGroup121.png')
            : { uri: bgImage[0] }
        }
      />
      <View style={{ padding: 10 }}>
        {!isHide && <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            // margin: 10,
          }}>
          <Text style={{ color: 'gray' }}>{price}</Text>
          {!deleteIcon ? (
            <TouchableOpacity
              onPress={() => {
                if (userID == sellerDetails) {
                  Toast("You can't follow your own post")
                }
                else if (followe == 'yes') {
                  RemoveFollowed();
                } else {
                  AddFav();
                  followe == false ? RemoveFollowedListing(listing_id) : null;
                }
              }}>
              <AntDesign
                name={followe == 'no' ? 'hearto' : 'heart'}
                size={20}
                color={Color.darkOrange} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={onPress}>
              {/* <AntDesign name="delete" size={20} color={Color.black} /> */}
              <Image
                style={{ height: 20, width: 20 }}
                source={require('../assets/Icons/Group5268.png')}
              />
            </TouchableOpacity>
          )}
        </View>}
        <Text style={{ marginBottom: 10, fontWeight: 'bold', color: 'black' }}>
          {name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default Card;

const styles = StyleSheet.create({
  container: {
    // height: 290,
    // width: 150,

    margin: 5,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'lightgray',
    width: '47%',
    borderRadius: 10,
    // borderTopLeftRadius: 10,
    // borderTopRightRadius: 10,
  },
});