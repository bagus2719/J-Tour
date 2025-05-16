import React from 'react';
import {
  FlatList,
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { colors, fontType } from '../theme';

const { width } = Dimensions.get('window');

export default function DestinationList({ data, onPress }) {
  return (
    <View style={styles.recommendations}>
      <Text style={styles.recommendationTitle}>Rekomendasi Wisata</Text>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <View style={styles.carouselCard}>
            <Pressable onPress={() => onPress(item)}>
              <Image source={{ uri: item.image }} style={styles.cardImage} />
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardLocation}>{item.location}</Text>
            </Pressable>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={width * 0.8 + 16}
        decelerationRate="fast"
        pagingEnabled
        contentContainerStyle={{ paddingHorizontal: 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  recommendations: { marginTop: 20 },
  recommendationTitle: {
    fontSize: 20,
    fontFamily: fontType['Poppins-SemiBold'],
    color: colors.greenDark(),
    marginLeft: 24,
    marginBottom: 10,
  },
  carouselCard: {
    width: width * 0.8,
    backgroundColor: colors.white(),
    borderRadius: 12,
    marginRight: 16,
    shadowColor: colors.green(0.1),
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 160,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: fontType['Poppins-SemiBold'],
    color: colors.greenDark(),
    paddingHorizontal: 10,
    paddingTop: 8,
  },
  cardLocation: {
    fontSize: 12,
    fontFamily: fontType['Poppins-Regular'],
    color: colors.grey(),
    paddingHorizontal: 10,
    paddingBottom: 12,
  },
});
