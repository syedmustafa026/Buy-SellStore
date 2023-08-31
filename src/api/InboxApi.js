//write a function Post api using fetch function in react native?

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Base_Url } from './Api';

export const getInbox = async (data) => {
  const userId = await AsyncStorage.getItem('uid');
  try {
    const response = await fetch(`${Base_Url}/get-inbox`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    return responseData;
  } catch (error) {
    console.log('Error in Post API: ', error);
  }
};
