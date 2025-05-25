import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, FlatList, Dimensions, TouchableOpacity, } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { DestinationList } from '../../data';
import { colors, fontType } from '../../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function DestinationDetails() {
  const destination = DestinationList.find((item) => item.id === 1); // Hardcoded ID 1 (bisa diubah dinamis nanti)
  const [liked, setLiked] = useState(null);

  if (!destination) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Destinasi tidak ditemukan</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <FlatList
        data={destination.images}
        horizontal
        pagingEnabled
        keyExtractor={(_, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.image} resizeMode="cover" />
        )}
        style={styles.imageGallery}
      />

      <View style={styles.content}>
        <Text style={styles.title}>{destination.name}</Text>

        <View style={styles.row}>
          <FontAwesome name="map-marker" size={18} color={colors.greenDark()} />
          <Text style={styles.location}>{destination.location}</Text>
        </View>

        <View style={styles.row}>
          <FontAwesome name="star" size={18} color="#FFD700" />
          <Text style={styles.rating}>
            {destination.rating} ({destination.totalReviews} review)
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Deskripsi</Text>
        <Text style={styles.description}>{destination.description}</Text>

        <Text style={styles.sectionTitle}>Fasilitas</Text>
        <Text style={styles.description}>
          {destination.facilities.map((facility, index) => (
            <Text key={index}>{facility} {'\n'}</Text>
          ))}
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

        <Text style={styles.sectionTitle}>Review Pengunjung</Text>
        {destination.reviews.map((review, index) => (
          <View key={index} style={styles.reviewCard}>
            <Text style={styles.reviewer}>{review.name}</Text>
            <Text style={styles.reviewText}>{review.comment}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white(),
  },
  imageGallery: {
    maxHeight: 250,
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  rating: {
    marginLeft: 8,
    fontSize: 14,
    color: colors.grey(),
    fontFamily: fontType['Poppins-Regular'],
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
    color: colors.grey(1),
  },
  likeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
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
  reviewCard: {
    backgroundColor: colors.green(0.05),
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  reviewer: {
    fontFamily: fontType['Poppins-SemiBold'],
    color: colors.greenDark(),
    fontSize: 14,
    marginBottom: 4,
  },
  reviewText: {
    fontFamily: fontType['Poppins-Regular'],
    color: colors.grey(),
    fontSize: 13,
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
