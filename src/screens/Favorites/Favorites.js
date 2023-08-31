import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';
import React from 'react';
import {Color} from '../../constants/colors';
import Card from '../../components/Card';

import {useTranslation} from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';
import {Base_Url} from '../../api/Api';

const Favorites = () => {
  const {t} = useTranslation();
  const [data, setData] = React.useState([]);
  const [checkFav, setCheckFav] = React.useState(false);

  const getAllFav = async () => {
    const userId = await AsyncStorage.getItem('uid');
    console.log('USER ID ====>', userId);
    await fetch(`${Base_Url}/get-followed-listings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({user_id: userId}),
    })
      .then(response => response.json())
      .then(data => {
        //   const res = data.json();
        const respo = data;

        setData(respo?.data);

        if (respo?.status == 200) {
          console.log(respo?.status, '=====>');
          setCheckFav(false);
        } else {
          console.log(respo?.message);
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  const focused = useIsFocused();

  React.useEffect(() => {
    getAllFav();
  }, [focused == true, checkFav]);

  // React.useEffect(() => {
  //   getAllFav();
  // }, [check]);

  return (
    <View style={styles.container}>
      <Text style={{fontWeight: 'bold', fontSize: 25, color: 'black'}}>
        {t('common:favorites')}
      </Text>
      <Text style={{fontSize: 15, color: 'black'}}>
        {t('common:yousavewishlist')}
      </Text>

      {data.length == 0 ? (
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            resizeMode="contain"
            style={{height: 90, width: 90}}
            source={require('../../assets/Icons/Icon2.png')}
          />
          <Text style={{color: Color.gray, fontSize: 15, marginVertical: 10}}>
            No Favorites Yet!
          </Text>
        </View>
      ) : (
        <FlatList
          key={Math.random() * 100000}
          showsVerticalScrollIndicator={false}
          scrollEnabled
          style={{marginTop: 20}}
          data={data}
          keyExtractor={item => {
            return item.id;
          }}
          numColumns={2}
          renderItem={item => {
            return (
              <>
                <Card
                  id={item?.item?.id}
                  name={item?.item?.listing?.title}
                  price={`€ ${item?.item?.listing?.price}`}
                  bgImage={item?.item?.listing?.images}
                  isFav={!item?.item?.listing?.isFollowed}
                  listing_id={item?.item?.listing_id}
                  getAllFunc={() => alert('wlin')}
                  // getFUN={() => removeFollowed()}
                  checkChangeFav={text => setCheckFav(text)}
                  productDetails={item?.item?.listing}
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

export default Favorites;

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: Color.splashWhite,
    // backgroundColor: 'blue',
    padding: 20,

    // marginVertical: 30,
  },
});
