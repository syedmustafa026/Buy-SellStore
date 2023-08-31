import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {Color} from '../constants/colors';

const ProfileItemComp = ({name, Icon, onClick}) => {
  return (
    <TouchableOpacity
      onPress={onClick}
      style={{
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: 'lightgray',
        alignItems: 'center',
        paddingVertical: 20,
        justifyContent: 'space-between',
      }}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Image
          style={{height: 25, width: 25, tintColor: Color.darkGray}}
          source={Icon}
        />
        <Text
          style={{
            left: 10,
            color: 'black',
            fontSize: 16,
            textAlignVertical: 'center',
          }}>
          {name}
        </Text>
      </View>
      <Image
        style={{height: 20, width: 20, tintColor: 'gray'}}
        source={require('../assets/Icons/forward.png')}
      />
    </TouchableOpacity>
  );
};

export default ProfileItemComp;

const styles = StyleSheet.create({});
