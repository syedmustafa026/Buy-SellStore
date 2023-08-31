import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {
  GiftedChat,
  InputToolbar,
  Bubble,
  Send,
} from 'react-native-gifted-chat';
import { Color } from '../../constants/colors';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Base_Url } from '../../api/Api';
import Icon from "react-native-vector-icons//Feather"
import Toast from '../../components/Toast';

const ChatScreen = ({ navigation, route }) => {
  const [messages, setMessages] = useState([]);
  const [senderId, setSenderID] = useState(0);
  const listingId = route?.params.listingId;
  const receiverId = route.params.withId
  const postPic = route.params.imageUri
  const productName = route.params.productName
  const productPrice = route.params.price

  const CustomtInputToolbar = props => {
    return (
      <InputToolbar
        {...props}
        placeholderTextColor="#000000"
        containerStyle={styles.inputToolBar}
      />
    );
  };
  const getAllMessges = async () => {
    const userId = await AsyncStorage.getItem('uid');
    setSenderID(userId);
    console.log(userId,receiverId,listingId);
    await fetch(`${Base_Url}/get-chat-history`, {
      method: 'POST',
      body: JSON.stringify({
        user_id: userId,
        listing_id: listingId,
        with_id: receiverId,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        const filteredArr = data.data.sort((a, b) => a._id - b._id).reverse()
        setMessages(
          filteredArr.map((chatMessage) => {
            return {
              _id: chatMessage.id,
              text: chatMessage.text,
              createdAt: chatMessage.created_at,
              user: {
                _id: chatMessage.sender_id,
              }
            }
          })
        )
      })
      .catch(error => {
        console.error(error);
      });
  }

  useEffect(() => {
      getAllMessges()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => getAllMessges(), 9000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    )
    const { text } = messages[0];
    sendMessage(text);
  }, []);

  const renderSend = (props) => {
    return (
      <Send {...props}>
        <Icon
          name="send"
          style={{ marginHorizontal: 3, alignItems: "center", alignSelf: 'center' }}
          size={33}
          color={Color.darkOrange}
        />
      </Send>
    )
  }
  const sendMessage = async (text) => {
    const userId = await AsyncStorage.getItem('uid');

    await fetch(`${Base_Url}/send-message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sender_id: userId,
        receiver_id: receiverId,
        listing_id: listingId,
        text: text,
      }),
    })
      .then(response => response.json())
      .then(data => {
        console.log("helloooo",data)
        console.log("users",typeof receiverId,listingId,text)
      })
      .catch(error => {
        Toast(error.message)
      });
  };


  const CustomAvatar = (props) => {
    return (
      <View style={{ width: 40, height: 40, marginBottom: 50, borderRadius: 20 }}>
        <Image
          source={{ uri: props.img }}
          style={{ width: 40, height: 40, borderRadius: 20 }}
        />
      </View>
    );
  };
  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            style={{
              height: 25,
              width: 25,
              justifyContent: 'center',
              alignSelf: "center",
              top: 15,
            }}
            source={require('../../assets/Icons/back.png')}
          />
        </TouchableOpacity>
        <View style={{ flexDirection: 'row' }}>
          <Image
            style={{ height: 50, width: 50, left: 20, borderRadius: 5 }}
            // source={{uri: imageUri}}
            source={{ uri: postPic }}
            h
          />
          <View style={{ left: 35 }}>
            <Text
              style={{
                fontWeight: 'bold',
                color: Color.darkOrange,
                fontSize: 15,
              }}>
              € {productPrice}
            </Text>
            <Text
              style={{
                fontWeight: 'bold',
                color: 'black',
                top: 5,
                fontSize: 15,
              }}>
              {productName}
            </Text>
          </View>
        </View>
      </View>
      <GiftedChat
        messages={messages}
        alwaysShowSend={true}
        onSend={messages => onSend(messages)}
        showUserAvatar={true}
        scrollToBottom={true}
        placeholder='Send Message...'
        keyboardShouldPersistTaps={'never'}
        renderInputToolbar={props => CustomtInputToolbar(props)}
        renderAvatarOnTop={true}
        renderSend={renderSend}
        renderAvatar={null}
        user={{
          _id: senderId,
          name: 'akif',
        }}
        renderBubble={props => {
          const message_sender_id = props.currentMessage.user._id
          return (
            <Bubble
              {...props}
              position={message_sender_id === senderId ? 'right' : 'left'}
              textStyle={{
                right: {
                  color: Color.splashWhite,
                },
              }}
              wrapperStyle={{
                left: {
                  marginBottom: 25,
                  width: '70%',
                  backgroundColor: Color.splashWhite,
                  padding: 10,
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 2,

                  },
                },
                right: {
                  backgroundColor: Color.darkOrange,
                  marginBottom: 25,
                  width: '70%',
                  padding: 10,
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                },
              }}
            />
          );
        }}

      />
    </>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.splashWhite,
    padding: 20,
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderColor: 'gray',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 26,
  },
  inputToolBar: {
    backgroundColor: Color.splashWhite,
    borderTopColor: '#E8E8E8',
    borderTopWidth: 1,
    paddingBottom: 4,
    marginHorizontal: 10,
    marginVertical: 7,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
});
