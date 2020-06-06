import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import Constants from 'expo-constants';
import { useNavigation, useRoute } from '@react-navigation/native';
import Map, { Marker } from 'react-native-maps';
import { Feather as Icon } from '@expo/vector-icons';
import { SvgUri } from 'react-native-svg';
import * as Location from 'expo-location';
import api from '../../services/api';

interface Item {
  id: number,
  title: string,
  imageUrl: string
}

interface Point {
  id: number,
  name: string,
  image: string,
  latitude: number,
  longitude: number
}

interface Params {
  UF: string,
  city: string
}

const Points = () => {
    const navigation = useNavigation();
    const [items, setItems] = useState<Item[]>([]);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [initialPosition, setinitialPosition] = useState<[number, number]>([
      0,
      0,
    ]);
    const [points, setPoints] = useState<Point[]>([]);
    const route = useRoute();
    const params = route.params as Params;

    useEffect(() => {
      const URLParams = {
        city: params.city,
        uf: params.UF,
        items: selectedItems
      };
      api.get("points", {
        params: URLParams
      }).then((response) => {
        setPoints(response.data);
      });
    }, [selectedItems])

    useEffect(() => {
      async function getLocation() {
        const { status } = await Location.requestPermissionsAsync();

        if (status !== 'granted') {
          Alert.alert('Oooops...', 'Precisamos da sua permissão para usar sua localização no mapa!')
          return;
        }

        const location = await Location.getCurrentPositionAsync();

        const { latitude, longitude } = location.coords;

        setinitialPosition([latitude, longitude]);
      }

      getLocation();
    }, [])
    
    useEffect(() => {
      api.get("items").then((response) => {
        setItems(response.data);
      });
    }, [items])

    function handleSelectedItem(id: number) {
      const repeatedItem = selectedItems.includes(id);
  
      if (repeatedItem) {
        const filteredItens = selectedItems.filter(item => item !== id);
        setSelectedItems(filteredItens);
      } else {
        setSelectedItems([...selectedItems, id]);
      }
    }

    function handleNavigationBackwards() {
        navigation.navigate('Home');
    }

    function handleMapNavigation(pointId: number) {
      navigation.navigate('Detail', { pointId });
    }

    return (
        <>
            <View style={styles.container}>
                <TouchableOpacity onPress={handleNavigationBackwards}>
                    <Icon name='arrow-left' size={20} color='#34cb79' />
                </TouchableOpacity>

                <Text style={styles.title}>Bem-Vindo!</Text>
                <Text style={styles.description}>Encontre no mapa um ponto de coleta</Text>

                <View style={styles.mapContainer}>
                    {initialPosition[0] !== 0 && (
                      <Map style={styles.map} initialRegion={{
                          latitude: initialPosition[0],
                          longitude: initialPosition[1],
                          latitudeDelta: 0.014,
                          longitudeDelta: 0.014
                        }}
                      >
                        {points.map(point => (
                          <Marker key={point.id}
                            coordinate={{
                              latitude: point.latitude,
                              longitude: point.longitude,
                            }}
                            style={styles.mapMarker}
                            onPress={() => handleMapNavigation(point.id)}
                          >
                            <View style={styles.mapMarkerContainer}>
                              <Image source={{
                                uri: point.image
                              }}
                              style={styles.mapMarkerImage}
                              />
                              <Text style={styles.mapMarkerTitle}>{point.name}</Text>
                            </View>
                          </Marker>
                          ))}
                      </Map>
                    )}
                </View>
            </View>

            <View style={styles.itemsContainer}>
                <ScrollView horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ padding: 20}}>
                    {items.map(item => (
                      <TouchableOpacity key={item.id} 
                        style={[
                          styles.item,
                          selectedItems.includes(item.id) ? styles.selectedItem : {}
                        ]}
                        onPress={() => handleSelectedItem(item.id)}
                        activeOpacity={0.7}
                      >
                        <SvgUri width={42} height={42} uri={item.imageUrl} />
                        <Text style={styles.itemTitle}>{item.title}</Text>
                      </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </>
    )
}

export default Points;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 32,
      paddingTop: 20 + Constants.statusBarHeight,
    },
  
    title: {
      fontSize: 20,
      fontFamily: 'Ubuntu_700Bold',
      marginTop: 24,
    },
  
    description: {
      color: '#6C6C80',
      fontSize: 16,
      marginTop: 4,
      fontFamily: 'Roboto_400Regular',
    },
  
    mapContainer: {
      flex: 1,
      width: '100%',
      borderRadius: 10,
      overflow: 'hidden',
      marginTop: 16,
    },
  
    map: {
      width: '100%',
      height: '100%',
    },
  
    mapMarker: {
      width: 90,
      height: 80, 
    },
  
    mapMarkerContainer: {
      width: 90,
      height: 70,
      backgroundColor: '#34CB79',
      flexDirection: 'column',
      borderRadius: 8,
      overflow: 'hidden',
      alignItems: 'center'
    },
  
    mapMarkerImage: {
      width: 90,
      height: 45,
      resizeMode: 'cover',
    },
  
    mapMarkerTitle: {
      flex: 1,
      fontFamily: 'Roboto_400Regular',
      color: '#FFF',
      fontSize: 13,
      lineHeight: 23,
    },
  
    itemsContainer: {
      flexDirection: 'row',
      marginTop: 16,
      marginBottom: 32,
    },
  
    item: {
      backgroundColor: '#fff',
      borderWidth: 2,
      borderColor: '#eee',
      height: 120,
      width: 120,
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingTop: 20,
      paddingBottom: 16,
      marginRight: 8,
      alignItems: 'center',
      justifyContent: 'space-between',
  
      textAlign: 'center',
    },
  
    selectedItem: {
      borderColor: '#34CB79',
      borderWidth: 2,
    },
  
    itemTitle: {
      fontFamily: 'Roboto_400Regular',
      textAlign: 'center',
      fontSize: 13,
    },
  });