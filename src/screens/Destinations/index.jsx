import React from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { DestinationList } from '../../data';
import { colors, fontType } from '../../theme';
import { useNavigation } from '@react-navigation/native';

export default function Destinations() {
  const navigation = useNavigation();
  
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => navigation.navigate('DestinationDetails', { destination: item })}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.location}>{item.location}</Text>
        <Text style={styles.category}>{item.category}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Destinasi Wisata</Text>
      <FlatList
        data={DestinationList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white(),
  },
  header: {
    fontSize: 24,
    fontFamily: fontType['Poppins-Bold'],
    margin: 18,
    color: colors.greenDark(),
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: colors.white(),
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 150,
  },
  content: {
    padding: 15,
  },
  name: {
    fontSize: 18,
    fontFamily: fontType['Poppins-SemiBold'],
    color: colors.greenDark(),
    marginBottom: 5,
  },
  location: {
    fontSize: 14,
    color: colors.grey(),
    fontFamily: fontType['Poppins-Regular'],
    marginBottom: 5,
  },
  category: {
    fontSize: 12,
    color: colors.green(0.7),
    fontFamily: fontType['Poppins-Regular'],
  },
});
