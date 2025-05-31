import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { colors, fontType } from '../../theme';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

export default function Destinations() {
  const navigation = useNavigation();
  
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    const subscriber = firestore()
      .collection('destinations')
      .onSnapshot(querySnapshot => {
        const destinationsArray = [];
        if (querySnapshot) {
          querySnapshot.forEach(documentSnapshot => {
            destinationsArray.push({
              id: documentSnapshot.id,
              ...documentSnapshot.data(),
            });
          });
        }
        setDestinations(destinationsArray);
        setLoading(false);
        setError(null);
      }, err => {
        console.error("Error fetching destinations:", err);
        setError("Gagal memuat data destinasi. Silakan coba lagi nanti.");
        setLoading(false);
      });

    return () => subscriber();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => navigation.navigate('DestinationDetails', { destination: item })}
    >
      <Image source={{ uri: typeof item.image === 'string' && item.image ? item.image : 'https://via.placeholder.com/150' }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>{item.name || 'Nama Tidak Tersedia'}</Text>
        <Text style={styles.location} numberOfLines={1}>{item.location || 'Lokasi Tidak Tersedia'}</Text>
        <Text style={styles.category}>{item.category || 'Kategori Tidak Diketahui'}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.greenDark()} />
        <Text style={styles.loadingText}>Memuat destinasi...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTextHeader}>Oops!</Text>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }
  
  if (!loading && !error && destinations.length === 0) {
    return (
      <View style={styles.container}>
         <Text style={styles.header}>Destinasi Wisata</Text>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Belum ada destinasi yang ditambahkan.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Destinasi Wisata</Text>
      <FlatList
        data={destinations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={ 
          (!loading && !error) ? (
            <View style={styles.emptyContainerFull}>
              <Text style={styles.emptyText}>Tidak ada destinasi yang cocok.</Text>
            </View>
          ) : null
        }
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
    marginVertical: 18,
    marginHorizontal: 18,
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
    backgroundColor: colors.grey(0.1),
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white(),
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    fontFamily: fontType['Poppins-Regular'],
    color: colors.grey(),
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.white(),
  },
  errorTextHeader: {
    fontSize: 20,
    fontFamily: fontType['Poppins-Bold'],
    color: colors.red ? colors.red() : 'red',
    marginBottom: 10,
  },
  errorText: {
    fontSize: 16,
    color: colors.red ? colors.red(0.8) : '#cc0000',
    textAlign: 'center',
    fontFamily: fontType['Poppins-Regular'],
    lineHeight: 22,
  },
  emptyContainer: { 
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
   },
  emptyText: { 
    fontSize: 16,
    color: colors.grey(),
    fontFamily: fontType['Poppins-Regular'],
    textAlign: 'center',
  },
   emptyContainerFull: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  }
});