import React, { useState, useRef } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Image,
  Modal,
  Dimensions,
  ScrollView,
} from 'react-native';
import { Location, SearchNormal } from 'iconsax-react-native';
import { fontType, colors } from './src/theme';

const { width } = Dimensions.get('window');

// Data destinasi wisata
const Data = [
  {
    id: '1',
    title: 'Pantai Papuma',
    location: 'Jember, Jawa Timur',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Sunset_papuma_beach.jpg/330px-Sunset_papuma_beach.jpg',
  },
  {
    id: '2',
    title: 'Air Terjun Tancak',
    location: 'Jember, Jawa Timur',
    image: 'https://assets.promediateknologi.id/crop/0x0:0x0/750x500/webp/photo/p1/86/2023/10/04/Air-Terjun-Tancak-ttm-2158871595.jpg',
  },
];

// Data berita 
const NewsData = [
  {
    id: '1',
    title: 'Festival Kopi Jember 2025',
    summary: 'Pemerintah daerah mengadakan Festival Kopi untuk mendukung wisata agro dan menarik wisatawan lokal maupun mancanegara.',
    source: 'Radar Jember',
  },
  {
    id: '2',
    title: 'Pantai Watu Ulo Ramai Wisatawan',
    summary: 'Pantai Watu Ulo dipadati wisatawan selama libur panjang, menjadi destinasi favorit wisata keluarga di Jember.',
    source: 'Jember Today',
  },
];


export default function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const flatListRef = useRef(null);

  const handleScroll = (event) => {
    const slide = Math.round(event.nativeEvent.contentOffset.x / (width * 0.8));
    setActiveIndex(slide);
  };

  const handleSearch = () => {
    const found = Data.find((item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (found) {
      setSelectedDestination(found);
      setSearchResult(found);
    } else {
      setSelectedDestination(null);
      setSearchResult(null);
    }
    setModalVisible(true);
  };

  const handleDestinationPress = (item) => {
    setSelectedDestination(item);
    setModalVisible(true);
  };

  const renderItem = ({ item }) => (
    <View style={styles.carouselCard}>
      <Pressable onPress={() => handleDestinationPress(item)}>
        <Image source={{ uri: item.image }} style={styles.cardImage} />
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardLocation}>{item.location}</Text>
      </Pressable>
    </View>
  );

  const renderNewsItem = ({ item }) => (
    <View style={styles.newsCard}>
      <Text style={styles.newsTitle}>{item.title}</Text>
      <Text style={styles.newsSummary}>{item.summary}</Text>
      <Text style={styles.newsSource}>Sumber: {item.source}</Text>
    </View>
  );


  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>J-Tour</Text>
        <Location color={colors.white()} variant="Bold" size={24} />
      </View>

      {/* Search Bar */}
      <View style={searchBar.container}>
        <TextInput
          style={searchBar.input}
          placeholder="Cari Destinasi"
          placeholderTextColor={colors.grey(0.7)}
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        <Pressable style={searchBar.button} onPress={handleSearch}>
          <SearchNormal size={20} color={colors.white()} />
        </Pressable>
      </View>

      {/* Kategori */}
      <View style={styles.listCategory}>
        <FlatList
          data={['Populer', 'Alam', 'Pantai', 'Air Terjun', 'Kuliner', 'Budaya']}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24 }}
          renderItem={({ item, index }) => (
            <View
              style={[
                category.item,
                index === 0 && { marginLeft: 0 },
                index === 5 && { marginRight: 0 },
              ]}
            >
              <Text
                style={[
                  category.title,
                  index === 0 && { color: colors.greenDark() },
                ]}
              >
                {item}
              </Text>
            </View>
          )}
        />
      </View>

      {/* Rekomendasi Wisata */}
      <View style={styles.recommendations}>
        <Text style={styles.recommendationTitle}>Rekomendasi Wisata</Text>
        <FlatList
          ref={flatListRef}
          data={Data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          onScroll={handleScroll}
          showsHorizontalScrollIndicator={false}
          snapToInterval={width * 0.8 + 16}
          decelerationRate="fast"
          contentContainerStyle={{ paddingHorizontal: 16 }}
        />
        <View style={styles.dotContainer}>
          {Data.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    index === activeIndex
                      ? colors.greenDark()
                      : colors.greenLight(0.5),
                },
              ]}
            />
          ))}
        </View>
      </View>

      {/* News Section */}
      <View style={styles.newsSection}>
        <Text style={styles.newsHeader}>News</Text>
        <FlatList
          data={NewsData}
          renderItem={renderNewsItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          contentContainerStyle={{ paddingBottom: 30 }}
        />
      </View>

      {/* Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={modalStyles.modalBackground}>
          <View style={modalStyles.modalContainer}>
            {selectedDestination ? (
              <>
                <Image source={{ uri: selectedDestination.image }} style={modalStyles.image} />
                <Text style={modalStyles.title}>{selectedDestination.title}</Text>
                <Text style={modalStyles.location}>{selectedDestination.location}</Text>
                <View style={modalStyles.buttonContainer}>
                  <Pressable
                    style={[modalStyles.button, { backgroundColor: colors.green() }]}
                    onPress={() => {
                      setModalVisible(false);
                      alert('Menuju halaman detail: ' + selectedDestination.title);
                    }}
                  >
                    <Text style={modalStyles.buttonText}>Detail</Text>
                  </Pressable>
                  <Pressable
                    style={[modalStyles.button, { backgroundColor: colors.grey(0.3) }]}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={[modalStyles.buttonText, { color: colors.greenDark() }]}>
                      Tutup
                    </Text>
                  </Pressable>
                </View>
              </>
            ) : (
              <>
                <Text style={modalStyles.title}>Destinasi tidak ditemukan</Text>
                <Pressable
                  style={modalStyles.modalButtonSingle}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={[modalStyles.buttonText, { color: colors.greenDark() }]}>Tutup</Text>
                </Pressable>

              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

// StyleSheet
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white() },
  header: {
    paddingHorizontal: 32,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    height: 100,
    backgroundColor: colors.greenDark(),
    elevation: 8,
    paddingTop: 18,
    paddingBottom: 9,
  },
  title: {
    fontSize: 28,
    fontFamily: fontType['Poppins-ExtraBold'],
    color: colors.white(),
    marginRight: 8,
  },
  listCategory: { paddingVertical: 10, marginTop: 6 },
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
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  dot: { width: 10, height: 10, borderRadius: 5, marginHorizontal: 5 },
  newsSection: {
    marginTop: 20,
    paddingHorizontal: 24,
  },
  newsHeader: {
    fontSize: 20,
    fontFamily: fontType['Poppins-SemiBold'],
    color: colors.greenDark(),
    marginBottom: 10,
  },
  newsCard: {
    marginBottom: 12,
    backgroundColor: colors.greenLight(0.05),
    borderRadius: 8,
    padding: 12,
  },
  newsTitle: {
    fontSize: 16,
    fontFamily: fontType['Poppins-Medium'],
    color: colors.greenDark(),
  },
  newsSummary: {
    fontSize: 13,
    fontFamily: fontType['Poppins-Regular'],
    color: colors.grey(),
    marginTop: 4,
  },
});

const category = StyleSheet.create({
  item: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 25,
    alignItems: 'center',
    backgroundColor: colors.greenLight(0.15),
    marginHorizontal: 5,
  },
  title: {
    fontFamily: fontType['Poppins-SemiBold'],
    fontSize: 14,
    lineHeight: 18,
    color: colors.greenDark(),
  },
});

const searchBar = StyleSheet.create({
  container: {
    marginHorizontal: 24,
    backgroundColor: colors.greenLight(0.1),
    borderColor: colors.greenLight(0.3),
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    marginTop: 16,
  },
  input: {
    height: 40,
    padding: 10,
    width: '90%',
    fontFamily: fontType['Poppins-Regular'],
    color: colors.black(),
  },
  button: {
    backgroundColor: colors.green(),
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    width: 40,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
});

const modalStyles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: colors.white(),
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 5,
  },
  image: { width: '100%', height: 150, borderRadius: 8 },
  title: {
    fontSize: 18,
    fontFamily: fontType['Poppins-SemiBold'],
    color: colors.greenDark(),
    marginTop: 12,
    textAlign: 'center',
  },
  location: {
    fontSize: 14,
    fontFamily: fontType['Poppins-Regular'],
    color: colors.grey(),
    marginBottom: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: fontType['Poppins-Medium'],
    color: colors.white(),
    fontSize: 14,
  },
  modalButtonSingle: {
    marginTop: 20,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: colors.grey(0.3),
    width: '100%',
  },
});
