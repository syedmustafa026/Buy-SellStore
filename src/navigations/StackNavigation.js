import { StyleSheet } from 'react-native'
import React from 'react'
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack'
import { useNavigation } from '@react-navigation/native'

// @Screens
import Splash from '../screens/Splash/Splash'
import Login from '../screens/Login/Login'
import Walkthrough from '../screens/Walkthrough/Walkthrough'
import SignUp from '../screens/SignUp/SignUp'
import BottomNavigation from './BottomNavigation'
import ChatScreen from '../screens/ChatScreen/ChatScreen'
import ProductDetails from '../screens/ProductDetails/ProductDetails'
import Home from '../screens/Home/Home'
import ProfileDetails from '../screens/ProfileDetails/ProfileDetails'
import MyProfile from '../screens/MyProfile/MyProfile'
import PostingListing from '../screens/PostListing/PostingListing'

// @MyProfile
import MyListingDetails from '../screens/MyProfile/MyListingDetails/MyListingDetails'
import UpdateListing from '../screens/MyProfile/MyListingDetails/UpdateListing'
import { NotificationListener } from '../components/firebase'

const Stack = createStackNavigator()
const StackNavigation = () => {
  const navigation = useNavigation()

  React.useEffect(() => {
    NotificationListener(navigation)
  }, [])

  const config = {
    animation: 'spring',
    config: {
      stiffness: 1000,
      damping: 500,
      mass: 3,
      overshootClamping: true,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 0.01,
    },
  }
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="Walkthrough" component={Walkthrough} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen
        options={{
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          transitionSpec: {
            open: {
              animation: 'timing',
              config: {
                duration: 800,
                delay: 1,
              },
            },
            close: config,
          },
          cardStyleInterpolator: CardStyleInterpolators.forBottomSheetAndroid,
        }}
        name="Login"
        component={Login}
      />
      <Stack.Screen name="BottomNavigation" component={BottomNavigation} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="ProductDetails" component={ProductDetails} />
      <Stack.Screen name="ProfileDetails" component={ProfileDetails} />
      <Stack.Screen name="MyProfile" component={MyProfile} />
      <Stack.Screen name="PostingListing" component={PostingListing} />
      <Stack.Screen name="MyListingDetails" component={MyListingDetails} />
      <Stack.Screen name="UpdateListing" component={UpdateListing} />
    </Stack.Navigator>
  )
}

export default StackNavigation

const styles = StyleSheet.create({})
