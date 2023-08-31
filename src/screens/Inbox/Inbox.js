import {
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import React, { useState, useEffect } from 'react'
import { Color } from '../../constants/colors'
import InboxMessages from '../../components/InboxMessages'
import { useTranslation } from 'react-i18next'
import { Base_Url } from '../../api/Api'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useIsFocused } from '@react-navigation/native'
import Toast from '../../components/Toast'

const Inbox = () => {
  const { t } = useTranslation()
  const [role, setRole] = useState('buying')
  const [buyerChat, setBuyerChat] = useState([])
  const [sellerChat, setSellerChat] = useState([])
  const [Loading, setLoading] = useState(true)
  const [noBuyerChat, setBuyerNoChat] = useState(false)
  const [noSellerChat, setSellerNoChat] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [myuid, setMyuid] = useState('')


  const onRefresh = () => {
    setRefreshing(true)
    Toast("Successfully Refreshed")
    getInbox()
    setRefreshing(false)
  }

  const getInbox = async () => {
    try {
      const userId = await AsyncStorage.getItem('uid')
      setMyuid(userId)
      fetch(`${Base_Url}/get-inbox`, {
        method: 'POST',
        body: JSON.stringify({ user_id: userId }),
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
        .then(response => response.json())
        .then(data => {
          setLoading(false)
          if (data.buying.length === 0) setBuyerNoChat(true)
          if (data.selling.length === 0) setSellerNoChat(true)
          if (data.buying.length > 0) setBuyerChat(data?.buying)
          if (data.selling.length > 0) setSellerChat(data?.selling)

          return data
        })
    } catch (error) {
      Toast(`Wait a moment ${error}`)
    }
  }
  
  
  const buyerSorted = buyerChat.sort((a,b)=>{
    const dateA = new Date(`${a.message_created_at}`).valueOf();
    const dateB = new Date(`${b.message_created_at}`).valueOf();
    if(dateA > dateB){
      return 1
    }
    return -1 
  }).reverse();


  const sellerSorted = sellerChat.sort((a,b)=>{
    const dateA = new Date(`${a.message_created_at}`).valueOf();
    const dateB = new Date(`${b.message_created_at}`).valueOf();
    if(dateA > dateB){
      return 1;
    }
    return -1 
  }).reverse();
  
  const focused = useIsFocused()

  useEffect(() => {
    getInbox()
  }, [focused == true])


  useEffect(() => {
    const interval = setInterval(() => getInbox(), 10000)
    return () => {
      clearInterval(interval)
    }
  }, [])


  return (
    <View style={styles.container}>
      <View style={styles.screenContainer}>
        <SwitchButton
          changeRole={txt => {
            setRole(txt)
          }}
        />
        <ScrollView refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
          {role == 'buying' && Loading ?
            <View style={styles.loadingContainer}>
              <ActivityIndicator
                animating={true}
                color={Color.darkOrange}
                size="large"
              />
            </View> :
            role == 'selling' && Loading ?
              <View style={styles.loadingContainer}>
                <ActivityIndicator
                  animating={true}
                  color={Color.darkOrange}
                  size="large"
                />
              </View> :
              role == 'buying' && noBuyerChat ?
                <View style={{ flex: 1, height: 550, justifyContent: "center", alignItems: "center" }}>
                  <Text>No Buying Chats Found</Text>
                </View> :
                role == 'selling' && noSellerChat ?
                  <View style={{ flex: 1, height: 550, justifyContent: "center", alignItems: "center" }}>
                    <Text>No Selling Chats Found</Text>
                  </View>
                  :
                  <ScrollView refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                  } showsVerticalScrollIndicator={false}>
                    {role == 'buying'
                      ?

                      buyerSorted.map((data, indx) => {
                        return (
                          <InboxMessages
                            key={indx}
                            name={data.with_user.name}
                            listingId={data?.listing_id}
                            withId={data?.with_id}
                            productName={data.listing?.title}
                            time={data?.time_ago}
                            imageUri={`http://95.179.209.186/${data.listing.images[0]}`}
                            message={data?.last_message}
                            price={data.listing.price}
                            isRead={myuid != data?.sender_id ? data.read : 'yes'}
                            otherData={data}
                            profilePic={data.with_user.profile_picture}
                          />
                        )
                      })
                      :
                      sellerSorted.map((data, indx) => {
                        return (
                          <InboxMessages
                            key={indx}
                            name={data.with_user.name}
                            listingId={data?.listing_id}
                            withId={data?.with_id}
                            productName={data.listing?.title}
                            time={data?.time_ago}
                            imageUri={`http://95.179.209.186/${data.listing.images[0]}`}
                            message={data?.last_message}
                            price={data.listing.price}
                            isRead={myuid != data?.sender_id ? data.read : 'yes'}
                            otherData={data}
                          />
                        )
                      })
                    }
                  </ScrollView>
          }
        </ScrollView>
      </View>
    </View>
  )
}

const SwitchButton = ({ changeRole }) => {
  const { t } = useTranslation()

  const [clicked, setClicked] = React.useState(true)
  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          borderRadius: 30,
          margin: 35,
        }}>
        <TouchableOpacity
          onPress={() => {
            setClicked(true), changeRole('buying')
          }}
          style={[
            styles.buttonStyle,
            {
              backgroundColor: clicked ? Color.darkOrange : Color.splashWhite,
              borderTopLeftRadius: 30,
              borderBottomLeftRadius: 30,
            },
          ]}>
          <Text
            style={{ textAlign: 'center', color: clicked ? 'white' : 'black' }}>
            {t('common:buying')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setClicked(false), changeRole('selling')
          }}
          style={[
            styles.buttonStyle,
            {
              backgroundColor: clicked ? Color.splashWhite : Color.darkOrange,
              borderBottomRightRadius: 30,
              borderTopRightRadius: 30,
            },
          ]}>
          <Text
            style={{ textAlign: 'center', color: clicked ? 'black' : 'white' }}>
            {t('common:selling')}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  )
}

export { SwitchButton }

export default Inbox

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.splashWhite,
  },
  screenContainer: {
    flex: 1,
    backgroundColor: Color.splashWhite,
    padding: 10,
  },

  buttonStyle: {
    padding: 20,

    borderWidth: 1,
    borderColor: 'lightgray',

    width: '60%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 550
  },
})
