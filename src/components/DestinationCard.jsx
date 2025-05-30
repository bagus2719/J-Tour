import React, { useRef, useEffect } from 'react'; // Tambahkan useRef dan useEffect
import { FlatList, View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, Animated } from 'react-native'; // Tambahkan Animated
import { useNavigation } from '@react-navigation/native';
import { colors, fontType } from '../theme';

const { width } = Dimensions.get('window');

// Komponen item individual untuk animasi
const AnimatedDestinationItem = ({ item, index }) => {
  const navigation = useNavigation();
  const itemAnimation = useRef(new Animated.Value(0)).current; // Nilai animasi untuk item ini

  useEffect(() => {
    // Animasikan item ini dengan delay berdasarkan indexnya
    Animated.timing(itemAnimation, {
      toValue: 1,
      duration: 500, // Durasi animasi
      delay: index * 150, // Delay staggered
      useNativeDriver: true,
    }).start();
  }, [itemAnimation, index]);

  const handlePress = () => {
    navigation.navigate('DestinationDetails', { destination: item });
  };

  // Style animasi
  const animatedStyle = {
    opacity: itemAnimation, // Fade-in
    transform: [
      {
        scale: itemAnimation.interpolate({ // Scale-up
          inputRange: [0, 1],
          outputRange: [0.85, 1],
        }),
      },
      {
        translateY: itemAnimation.interpolate({ // Sedikit slide-up
            inputRange: [0,1],
            outputRange: [20,0]
        })
      }
    ],
  };

  return (
    <Animated.View style={[styles.carouselCardContainer, animatedStyle]}>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.7}
        style={styles.carouselCard}
      >
        <Image source={{ uri: (typeof item.image === 'string' && item.image) ? item.image : 'https://via.placeholder.com/150' }} style={styles.cardImage} />
        <Text style={styles.cardTitle} numberOfLines={1}>{item.name || 'Nama Destinasi'}</Text>
        <Text style={styles.cardLocation} numberOfLines={1}>{item.location || 'Lokasi Tidak Ada'}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};


export default function DestinationCard({ data }) { // Nama komponen diubah agar konsisten dengan import
  if (!data || data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Tidak ada destinasi yang ditemukan.</Text>
      </View>
    );
  }

  return (
      <FlatList
        data={data}
        renderItem={({ item, index }) => <AnimatedDestinationItem item={item} index={index} />} // Menggunakan AnimatedDestinationItem
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        // Paging dan snap interval bisa disesuaikan atau dihilangkan jika tidak cocok
        // snapToInterval={width * 0.7 + 16} 
        // decelerationRate="fast"
        // pagingEnabled
        contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 10 }} // Disesuaikan paddingnya
      />
  );
}

const styles = StyleSheet.create({
  carouselCardContainer: { // Kontainer untuk Animated.View per item
    marginRight: 16,
  },
  carouselCard: {
    width: width * 0.65, // Sedikit disesuaikan
    backgroundColor: colors.white(),
    borderRadius: 12,
    // marginRight: 16, // Dipindahkan ke carouselCardContainer
    shadowColor: colors.black(0.5), 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, 
    shadowRadius: 4, 
    elevation: 3,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 160,
    backgroundColor: colors.grey(0.1), // Placeholder
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: fontType['Poppins-SemiBold'] || 'System',
    color: colors.greenDark(),
    paddingHorizontal: 10,
    paddingTop: 8,
  },
  cardLocation: {
    fontSize: 12,
    fontFamily: fontType['Poppins-Regular'] || 'System',
    color: colors.grey(),
    paddingHorizontal: 10,
    paddingBottom: 12,
  },
  emptyContainer: {
    width: width - 48, // Disesuaikan dengan paddingHorizontal FlatList
    height: 180, // Sesuaikan tinggi agar konsisten dengan area kartu
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 24, // Agar terpusat jika FlatList kosong
  },
  emptyText: {
    fontSize: 14,
    fontFamily: fontType['Poppins-Regular'] || 'System',
    color: colors.grey(),
    textAlign: 'center',
  }
});