import {
  StyleSheet,
  Text,
  View,
  Modal,
  StatusBar,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {Color} from '../../constants/colors';
import SellCategoryContainer from '../../components/SellCategoryContainer';
import {useTranslation} from 'react-i18next';

const Sell = () => {
  const {t} = useTranslation();
  const nav = useNavigation();

  return (
    <>
      <StatusBar hidden />
      <View
        style={{
          flex: 1,
          backgroundColor: Color.splashWhite,
        }}>
        {/* TOP BANNER STARTED */}
        <View
          style={{
            backgroundColor: '#F3F3F3',
            padding: 20,
            marginTop: 10,
            flexDirection: 'row',
          }}>
          <TouchableOpacity onPress={() => nav.navigate('Home')}>
            <Image
              style={{height: 25, width: 25, right: 10}}
              source={require('../../assets/Icons/Group13726.png')}
            />
          </TouchableOpacity>
          <Text style={{color: 'black', fontWeight: 'bold', fontSize: 19}}>
            {t('common:whatyouareselling')}
          </Text>
        </View>
        {/* TOP BANNER END */}
        <ScrollView
          style={{margin: 10, marginTop: 30}}
          showsVerticalScrollIndicator={false}>
          <Text style={{fontWeight: 'bold', fontSize: 17, color: 'black'}}>
            {t('common:categories')}
          </Text>
          <View style={{marginTop: 20}}>
            <SellCategoryContainer
              Icon={
                <Image
                  style={{height: 20, width: 20}}
                  source={require('../../assets/Icons/Group13722.png')}
                />
              }
              nexScreen={() =>
                nav.navigate('PostingListing', {Categories: 'Rings'})
              }
              name={t('common:rings')}
            />
            <SellCategoryContainer
              Icon={
                <Image
                  style={{height: 20, width: 20}}
                  source={require('../../assets/Icons/Group13723.png')}
                />
              }
              nexScreen={() =>
                nav.navigate('PostingListing', {Categories: 'Necklaces'})
              }
              name={t('common:necklaces')}
            />
            <SellCategoryContainer
              Icon={
                <Image
                  style={{height: 20, width: 20}}
                  source={require('../../assets/Icons/Group13724.png')}
                />
              }
              nexScreen={() =>
                nav.navigate('PostingListing', {Categories: 'Earrings'})
              }
              name={t('common:earrings')}
            />
            <SellCategoryContainer
              Icon={
                <Image
                  style={{height: 20, width: 20}}
                  source={require('../../assets/Icons/Group13725.png')}
                />
              }
              nexScreen={() =>
                nav.navigate('PostingListing', {Categories: 'Bracelat'})
              }
              name={t('common:bracelat')}
            />
            <SellCategoryContainer
              Icon={
                <Image
                  style={{height: 20, width: 20}}
                  source={require('../../assets/Icons/Group13731.png')}
                />
              }
              nexScreen={() =>
                nav.navigate('PostingListing', {Categories: 'Bangles'})
              }
              name={t('common:bangles')}
            />
            <SellCategoryContainer
              Icon={
                <Image
                  style={{height: 20, width: 20}}
                  source={require('../../assets/Icons/Group13730.png')}
                />
              }
              nexScreen={() =>
                nav.navigate('PostingListing', {Categories: 'Diamonds'})
              }
              name={t('common:diamonds')}
            />
          </View>
        </ScrollView>
      </View>
    </>
  );
};

export default Sell;

const styles = StyleSheet.create({});
