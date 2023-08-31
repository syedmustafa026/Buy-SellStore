import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  NativeModule,
  NativeModules,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { Color } from '../../constants/colors';
import ProfileItemComp from '../../components/ProfileItemComp';

// @Languge import
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import * as firebase from '../../components/firebase'

const Profile = ({ navigation }) => {
  const { t } = useTranslation();
  const [img, setImg] = useState(null);
  const [name, setName] = useState('');

  const getUserDetails = async () => {
    console.log(img);
    let name = await AsyncStorage.getItem('userName');
    setName(name);
    let profileImg = await AsyncStorage.getItem('imgUri');
    setImg(profileImg);
  };
  const focused = useIsFocused();
  useEffect(() => {
    getUserDetails();
  }, [focused == true]);

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        {/* Profile Header Started */}
        <View
          style={{ flexDirection: 'row', alignItems: 'center', marginTop: 50 }}>
          <Image
            style={{ height: 65, width: 65, borderRadius: 30 }}
            source={
              img == null
                ? require('../../assets/Icons/noPic.png')
                : { uri: img }
            }
          />
          <View style={{ left: 10, marginBottom: 5 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'black' }}>
              {name?.replace('" "', ' ')}
            </Text>
            {/* <Text
              style={{
                color: Color.darkOrange,
              }}>
              Chicago - USA
            </Text> */}
          </View>
        </View>
        {/* Profile Header END */}
        <View style={{ marginTop: 30 }}>
          <ProfileItemComp
            onClick={() => navigation.navigate('MyProfile')}
            name={t('common:profile')}
            Icon={require('../../assets/Icons/Group4076.png')}
          />
          <ProfileItemComp
            name={t('common:changepassword')}
            Icon={require('../../assets/Icons/Group4085.png')}
          />
          <ProfileItemComp
            name={t('common:contactus')}
            Icon={require('../../assets/Icons/Group13736.png')}
          />
          <ProfileItemComp
            onClick={() => {
              navigation.replace('Login')
              AsyncStorage.clear()
              firebase.getFCMToken()
            }}
            name={t('common:logout')}
            Icon={require('../../assets/Icons/Group40901.png')}
          />
        </View>
      </View>
      {/* //CHANGE LANGUGE */}
      {/* <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 50,
        }}>
        {LANGUGE.map(languge => {
          const selectLanguge = languge.code == selectLangugeCode;
          return (
            <Pressable
              disabled={selectLanguge}
              onPress={() => setLanguge(localLang[0])}>
              <Text style={[selectLanguge ? styles.selectedTxt : styles.txt]}>
                {languge.lable}
              </Text>
            </Pressable>
          );
        })}
      </View> */}
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.splashWhite,
  },
  innerContainer: {
    backgroundColor: Color.splashWhite,
    padding: 20,
    flex: 1,
  },
  selectedTxt: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'green',
  },
  txt: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
});
