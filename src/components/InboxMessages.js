import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import Check from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';

const InboxMessages = ({
  name,
  productName,
  message,
  time,
  imageUri,
  price,
  isRead,
  listingId,
  withId,
  otherData,
  profilePic
}) => {
  const nav = useNavigation();
  return (
    <TouchableOpacity
      onPress={() =>
        nav.navigate('ChatScreen', {
          imageUri,
          name,
          price,
          productName,
          listingId,
          withId,
          otherData,
          profilePic
        })
      }
      style={{
        //   backgroundColor: 'yellow',
        flexDirection: 'row',
        padding: 15,
        justifyContent: 'space-between',
        borderBottomWidth: 0.8,
        borderColor: 'lightgray',
      }}>
      {/* Images and details */}
      <View style={{ flexDirection: 'row' }}>
        <View style={{ flexDirection: 'row' }}>
          {isRead == 'no' ? (
            <View
              style={{
                height: 20,
                width: 20,
                backgroundColor: 'orange',
                borderRadius: 30,
                position: 'absolute',
                zIndex: 1,
                right: 60,
                top: 0,
              }}></View>
          ) : null}
          <Image
            style={{ height: 70, width: 70, borderRadius: 5, zIndex: -1 }}
            source={{ uri: imageUri }}
          />
        </View>
        <View style={{ left: 20 }}>
          <Text style={{ color: 'black' }}>{name}</Text>
          <Text style={{ fontWeight: 'bold', color: 'black' }}>
            {productName}
          </Text>
          <View style={{ flexDirection: 'row' }}>
            <Check
              name="check"
              color={'#000000'}
              size={10}
              style={{ top: 5, right: 5 }}
            />
            <Text style={{ color: '#000000' }}>{message}</Text>
          </View>
        </View>
      </View>
      <Text style={{ color: '#000000', right: 10 }}>{time}</Text>
    </TouchableOpacity>
  );
};

export default InboxMessages;

const styles = StyleSheet.create({});
