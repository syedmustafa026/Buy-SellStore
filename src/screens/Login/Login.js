import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native'
import React, { useState } from 'react'
import { Color } from '../../constants/colors'
import TextField from '../../components/TextField'
import Buttons from '../../components/Buttons'
import { Checkbox } from 'react-native-paper'
import Back from 'react-native-vector-icons/AntDesign'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import * as firebase from '../../components/firebase'

// @API_Callefef
import { Base_Url } from '../../api/Api'

// @LANGUGE IMPORTSsef
import { useTranslation } from 'react-i18next'
import Toast from '../../components/Toast'

const Login = ({ navigation }) => {
  const [checked, setChecked] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [togglePassword, setTogglePassword] = useState(true)
  const [Loading, setLoading] = useState(false)


  const { t } = useTranslation()

  const validateEmail = email => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,:\s@"]+(\.[^<>()[\]\\.,:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      )
  }

  const loginUser = async () => {
    try {
      let fcmToken = await AsyncStorage.getItem("FCMToken")
      setLoading(true)
      if (!validateEmail(email)) Toast('Enter a valid Email')
      if (password < 6) Toast('Enter a correct password')
      else {
        fetch(`${Base_Url}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: email, password: password }),
        })
          .then(response => response.json())
          .then(data => {
            const respo = data
            console.log(respo, 'loginn detailss')
            if (respo?.message == 'Logged In successfully') {
              if (checked) {
                AsyncStorage.setItem('rememberMe', 'true')
              }
              AsyncStorage.setItem('status', 'loggedIn')
              AsyncStorage.setItem('userName', respo?.data?.name)
              console.log(respo?.data);
              AsyncStorage.setItem('imgUri', respo.data.profile_picture)
              AsyncStorage.setItem('userCity', JSON.stringify(respo?.data?.city))
              Toast(respo?.message)
              const uid = respo?.data?.id
              AsyncStorage.setItem('uid', JSON.stringify(uid))
              AsyncStorage.setItem('userData', JSON.stringify(respo?.data))
              setLoading(false)
              firebase.getMessage(uid, fcmToken)
              navigation.replace('BottomNavigation')
            } else {
              Toast(respo?.message)
              setLoading(false)
            }
          })
      }
    } catch (error) {
      Toast(error)
    }
  }

  return (
    <ScrollView
      scrollEnabled={true}
      showsVerticalScrollIndicator={false}
      style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Back name="left" size={20} color="black" />
      </TouchableOpacity>
      <View style={{ marginTop: '15%' }}>
        <Text style={{ fontWeight: 'bold', color: Color.black, fontSize: 28 }}>
          {t('common:Login')}
        </Text>
        <Text style={{ color: Color.darkGray, fontSize: 15 }}>
          {t('common:Goldybee')}
        </Text>
        <View style={{ marginTop: 20 }}>
          <TextField
            val={email}
            setTxt={txt => setEmail(txt)}
            placeHolder={t('common:email')}
          />
          <View style={{ position: 'relative' }}>
            <TextField
              val={password}
              setTxt={txt => setPassword(txt)}
              placeHolder={t('common:password')}
              secureTextEntry={togglePassword}
            />
            <Icon
              style={{ position: 'absolute', top: 25, right: 20 }}
              name={togglePassword ? "eye-off-outline" : "eye-outline"}
              size={23}
              color="black"
              onPress={() => setTogglePassword(!togglePassword)}
            />
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 10,
          }}>
          <View style={{ flexDirection: 'row' }}>
            {/* <Text>checkBox</Text> */}
            <Checkbox
              color={checked ? Color.darkOrange : 'black'}
              status={checked ? 'checked' : 'unchecked'}
              onPress={() => {
                setChecked(!checked)
              }}
            />
            <Text style={{ marginTop: 8, color: 'black' }}>
              {t('common:rememberme')}
            </Text>
          </View>
          <TouchableOpacity>
            <Text
              style={{
                color: Color.darkOrange,
                fontWeight: 'bold',
                marginTop: 10,
              }}>
              {t('common:forgotpassword')}
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            marginTop: '50%',
          }}>
          <View>
            <Buttons onpress={() => loginUser()} name={Loading ?
              <>
                <TouchableOpacity disabled style={styles.containe11}>
                  <ActivityIndicator size={20} color={Color.yellow} />
                </TouchableOpacity>
              </> :
              t('common:Login')} />
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: '5%',
            }}>
            <Text style={{ color: 'black' }}>
              {t('common:donthaveanaccount')}{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={{ color: Color.darkOrange, fontWeight: 'bold' }}>
                {t('common:Signup')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

export default Login

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.splashWhite,
    padding: 20,
  },
})
