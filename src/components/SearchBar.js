import {StyleSheet, Text, View, Image, TextInput} from 'react-native';
import React from 'react';
import {Color} from '../constants/colors';
import Search from 'react-native-vector-icons/AntDesign';

import {useTranslation} from 'react-i18next';

const SearchBar = ({getSearch}) => {
  const {t} = useTranslation();
  return (
    <View style={styles.container}>
      <Image
        resizeMode="contain"
        style={{height: 25, width: 25, left: 10}}
        source={require('../assets/Icons/Group13732.png')}
      />
      <TextInput
        style={{left: 20,width:'80%'}}
        placeholder={t('common:Search')}
        placeholderTextColor={'gray'}
        onChangeText={txt => getSearch(txt)}
      />
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderWidth: 1,
    borderColor: Color.gray,

    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
