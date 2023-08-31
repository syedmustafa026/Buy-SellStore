import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {Color} from '../constants/colors';

const SellCategoryContainer = ({name, Icon, nexScreen}) => {
  return (
    <TouchableOpacity
      onPress={nexScreen}
      style={{
        width: '100%',
        padding: 10,
        borderBottomWidth: 0.5,
        borderColor: 'lightgray',
        // backgroundColor: 'yellow',
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}>
      <View style={{flexDirection: 'row'}}>
        <View style={styles.container}>{Icon}</View>
        <Text style={{left: 20, top: 15, color: 'black', fontSize: 15}}>
          {name}
        </Text>
      </View>
      <Image
        style={{height: 20, width: 20, top: 15}}
        source={require('../assets/Icons/forward.png')}
      />
    </TouchableOpacity>
  );
};

export default SellCategoryContainer;

const styles = StyleSheet.create({
  container: {
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'lightgray',
    backgroundColor: Color.yellow,
    borderWidth: 1,
    borderRadius: 30,
  },
});
