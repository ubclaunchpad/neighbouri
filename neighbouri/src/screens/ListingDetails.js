import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  ScrollView,
  Image,
} from 'react-native';
import RelatedItemsList from '../components/details/RelatedItemsList';
import SellerInfoCard from '../components/details/SellerInfoCard';
import Header from '../components/navigation/Header';
import BackButton from '../components/navigation/BackButton';
import { TouchableOpacity } from 'react-native';
import BookmarkButton from '../components/BookmarkButton';
import MessageIconButton from '../components/MessageIconButton';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useIsFocused } from "@react-navigation/native";

export default function ListingDetailsScreen(props) {
  const item = props.route.params;
  const navigation = props.navigation;
  const [userBookmarks, setUserBookmarks] = useState([]);
  const [userDocumentId, setUserDocumentId] = useState('');
  const currentUser = auth().currentUser;
  const currentUserId = currentUser.uid;
  const isFocused = useIsFocused();

  useEffect(() => {
    getCurrentUser();
  }, [props, isFocused]);

  async function getCurrentUser() {
    await firestore()
      .collection('Users')
      .where('uid', '==', currentUserId)
      .get()
      .then((userDocs) => {
        setUserDocumentId(userDocs.docs[0].id);
        const bookmarks =
          userDocs.docs[0].data() && userDocs.docs[0].data().bookmarks;
        setUserBookmarks(bookmarks);
      })
      .catch((e) => {
        console.log('There was an error getting user: ', e);
      });
  }

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <ScrollView>
        <View style={{height: 30}} />
        <Image
          source={item.photo}
          style={{
            width: '100%',
            height: 300,
            resizeMode: 'cover',
            position: 'absolute',
          }}></Image>
        {Header(
          BackButton(navigation),
          <View style={{flex: 5}} />,
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              marginRight: 20,
              alignSelf: 'center'
            }}>
            {/* <MessageIconButton navigation={navigation}/> */}
          </View>,
        )}
        <View
          style={{
            backgroundColor: 'white',
            marginTop: 165,
            minHeight: 200,
            width: '100%',
            borderRadius: 20,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.08,
            shadowRadius: 3,
            elevation: 5,
          }}>
          <View
            style={{
              alignItems: 'center',
              alignSelf: 'stretch',
              margin: 5,
              flexDirection: 'row',
              justifyContent: 'space-evenly',
            }}>
            <View style={{flex: 1, height: 10}} />
            <Text
              style={{
                flex: 4,
                fontSize: 25,
                color: 'black',
                textAlign: 'center',
              }}>
              ABOUT ITEM
            </Text>
            <View style={{flex: 1}} >
            <BookmarkButton
              itemID={item.ListingID}
              bookmarks={userBookmarks}
              userDocumentId={userDocumentId}
              />
            </View>
          </View>
          <View
            style={{
              alignSelf: 'stretch',
              margin: 10,
              borderRadius: 8,
              padding: 5
            }}>
            <Text style={{fontSize: 16, fontWeight: 'bold'}}>{item.Item}</Text>
            <Text style={{fontSize: 16}}>${item.Price}</Text>
            {!!item.Condition && <View style={{flexDirection: 'row'}}>
              <Text style={{fontSize: 16, fontWeight: 'bold'}}>Condition: </Text>
              <Text style={{fontSize: 16}}>{item.Condition}</Text>
            </View>}
            {!!item.ExpiryDate && <View style={{flexDirection: 'row'}}>
              <Text style={{fontSize: 16, fontWeight: 'bold'}}>Expiry Date: </Text>
              <Text style={{fontSize: 16}}>{item.ExpiryDate.Month} {item.ExpiryDate.Day}, {item.ExpiryDate.Year}</Text>
            </View>}
            <Text style={{fontSize: 16, marginTop: 10, marginBottom: 20}}>{item.Description}</Text>
            {!!item.PickupLocation && !!item.PickupInstruction &&
              <View
                style={{
                  alignItems: 'center',
                  alignSelf: 'stretch',
                  marginBottom: 10,
                  justifyContent: 'space-evenly',
                }}>
                <View style={{borderWidth: 1, borderColor:'#989595', width: 200}}/>
                <Text style={{fontSize: 20, marginTop: 10}}>PICKUP INFO</Text>
              </View>}
            {!!item.PickupLocation && <View style={{flexDirection: 'row'}}>
              <Text style={{fontSize: 16, fontWeight: 'bold'}}>Pickup Location: </Text>
              <Text style={{fontSize: 16}}>{item.PickupLocation}</Text>
            </View>}
            {!!item.PickupInstruction && <View style={{flexDirection: 'row', marginBottom: 10}}>
              <Text style={{fontSize: 16, fontWeight: 'bold'}}>Pickup Instruction: </Text>
              <Text style={{fontSize: 16}}>{item.PickupInstruction}</Text>
            </View>}
          </View>
        </View>
        <View
            style={{
              alignItems: 'center',
              margin: 20,
              justifyContent: 'center',
            }}>
            <TouchableOpacity
               onPress={() => {
              // No Cart For Now
              // navigation.navigate('Checkout', {
              //   item: item,
              //   currentUserId: currentUserId,
              // });
              navigation.navigate('CardFormScreen', {
                item: item,
                currentUserId: currentUserId,
                navigation,
              });
            }}
              style={{
                flex: 1,
                alignItems: 'center',
                borderRadius: 25,
                backgroundColor: '#48CA36',
                width: 200
                }}
            >
              <Text style={{color: 'white', margin: 10, fontSize: 22}}>CHECKOUT</Text>
            </TouchableOpacity>
          </View>
        <View
          style={{
            alignSelf: 'stretch',
            marginLeft: 10,
            marginTop: 10,
          }}>
          <Text style={{fontSize: 16, fontWeight: 'bold'}}>Seller Info</Text>
        </View>
        <SellerInfoCard SellerID={item.SellerID} />
        <View
          style={{
            alignSelf: 'stretch',
            margin: 10,
            borderRadius: 8,
            padding: 5,
          }}>
          <Text style={{fontSize: 16, marginBottom: 10, fontWeight: 'bold'}}>Products related to this item</Text>
          <RelatedItemsList
            currentItemId={item.ListingID}
            currentItemTitle={item.Item}
            navigation={navigation}
            userBookmarks={userBookmarks}
            userDocumentId={userDocumentId}
          />
        </View>
      </ScrollView>
    </View>
  );
}
