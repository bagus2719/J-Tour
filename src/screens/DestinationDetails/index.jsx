import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions, TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { colors, fontType } from '../../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function DestinationDetails({ route }) {
  const { destination } = route.params || {};
  const [liked, setLiked] = useState(null);

  if (!destination) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Destinasi tidak ditemukan</Text>
      </View>
    );
  }

  const facilitiesString = Array.isArray(destination.facilities) 
    ? destination.facilities.join(', ') 
    : (destination.facilities || 'Tidak ada data fasilitas');

  return (
    <ScrollView style={styles.container}>
      {destination.image && (
        <Image source={{ uri: destination.image }} style={styles.image} resizeMode="cover" />
      )}

      <View style={styles.content}>
        <Text style={styles.title}>{destination.name}</Text>

        <View style={styles.row}>
          <FontAwesome name="map-marker" size={18} color={colors.greenDark()} />
          <Text style={styles.location}>{destination.location}</Text>
        </View>

        {destination.category && (
          <View style={styles.row}>
            <FontAwesome name="tag" size={18} color={colors.greenDark()} />
            <Text style={styles.category}>{destination.category}</Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>Deskripsi</Text>
        <Text style={styles.description}>{destination.description}</Text>

        <Text style={styles.sectionTitle}>Fasilitas</Text>
        <Text style={styles.description}>
          {facilitiesString} {/* SEBELUMNYA: {destination.facilities.join('\n')} */}
        </Text>
        
        <View style={styles.likeContainer}>
          <TouchableOpacity
            style={[
              styles.likeButton,
              liked === true && { backgroundColor: '#4CAF50' },
            ]}
            onPress={() => setLiked(true)}
          >
            <Text style={styles.likeText}>👍 Like</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.likeButton,
              liked === false && { backgroundColor: '#F44336' },
            ]}
            onPress={() => setLiked(false)}
          >
            <Text style={styles.likeText}>👎 Dislike</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

// Styles (tetap sama seperti respons sebelumnya)
// ... (styles lengkap dari respons sebelumnya)
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white(),
  },
  image: {
    width: SCREEN_WIDTH,
    height: 250,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 26,
    fontFamily: fontType['Poppins-Bold'],
    color: colors.greenDark(),
    marginTop: 16,
  },
  location: {
    fontSize: 14,
    fontFamily: fontType['Poppins-Regular'],
    color: colors.grey(),
    marginLeft: 8,
  },
  category: { 
    fontSize: 14,
    fontFamily: fontType['Poppins-Regular'],
    color: colors.green(),
    marginLeft: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8, 
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: fontType['Poppins-SemiBold'],
    color: colors.greenDark(),
    marginTop: 20,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    fontFamily: fontType['Poppins-Regular'],
    color: colors.black(), 
    lineHeight: 22,
  },
  likeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    marginBottom: 20,
  },
  likeButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
  },
  likeText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    color: colors.red ? colors.red() : 'red',
  },
});