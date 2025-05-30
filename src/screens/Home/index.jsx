import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StatusBar, StyleSheet,
  TouchableWithoutFeedback, Keyboard, Animated, ActivityIndicator
} from 'react-native';
import { CategoryList, DestinationCard, NewsCard, SearchBar } from '../../components';
import { CategoryList as categoriesData } from '../../data';
import { colors, fontType } from '../../theme';
import firestore from '@react-native-firebase/firestore';

const MAX_NEWS_ITEMS_HOME = 3; // Batasi jumlah berita yang dianimasikan dan ditampilkan

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Popular');

  const [allDestinations, setAllDestinations] = useState([]);
  const [allNews, setAllNews] = useState([]);
  const [loadingDestinations, setLoadingDestinations] = useState(true);
  const [loadingNews, setLoadingNews] = useState(true);
  const [error, setError] = useState(null);

  // Animated values untuk opacity section
  const destinationSectionOpacity = useRef(new Animated.Value(0)).current;
  const newsSectionOpacity = useRef(new Animated.Value(0)).current;
  
  // Animated values untuk item berita
  const newsItemAnims = useRef(
    [...Array(MAX_NEWS_ITEMS_HOME)].map(() => new Animated.Value(0))
  ).current;

  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Firestore listeners (sama seperti sebelumnya)
    setLoadingDestinations(true);
    const destinationsSubscriber = firestore()
      .collection('destinations')
      .onSnapshot(querySnapshot => {
        const fetchedDests = [];
        querySnapshot.forEach(documentSnapshot => {
          fetchedDests.push({
            id: documentSnapshot.id,
            ...documentSnapshot.data(),
          });
        });
        setAllDestinations(fetchedDests);
        setLoadingDestinations(false);
        setError(null);
      }, err => {
        console.error("Error fetching destinations:", err);
        setError("Gagal memuat destinasi.");
        setLoadingDestinations(false);
      });

    setLoadingNews(true);
    const newsSubscriber = firestore()
      .collection('news')
      .orderBy('createdAt', 'desc')
      .limit(MAX_NEWS_ITEMS_HOME + 2) // Ambil sedikit lebih banyak untuk jaga-jaga jika ada filter
      .onSnapshot(querySnapshot => {
        const fetchedNewsItems = [];
        querySnapshot.forEach(documentSnapshot => {
          fetchedNewsItems.push({
            id: documentSnapshot.id,
            ...documentSnapshot.data(),
          });
        });
        setAllNews(fetchedNewsItems);
        setLoadingNews(false);
        setError(null);
      }, err => {
        console.error("Error fetching news:", err);
        setError("Gagal memuat berita.");
        setLoadingNews(false);
      });

    return () => {
      destinationsSubscriber();
      newsSubscriber();
    };
  }, []);

  const filteredDestinations = allDestinations.filter((item) => {
    const itemCategory = item.category ? item.category.toLowerCase() : '';
    const selectedCatLower = selectedCategory ? selectedCategory.toLowerCase() : '';
    const matchesCategory = selectedCategory === 'Popular' || selectedCategory === 'Latest'
      ? true 
      : itemCategory === selectedCatLower;
    const matchesSearch = item.name ? item.name.toLowerCase().includes(searchTerm.toLowerCase()) : false;
    return matchesCategory && matchesSearch;
  });

  const filteredNews = allNews.filter((item) => {
    const itemCategory = item.category ? item.category.toLowerCase() : '';
    const selectedCatLower = selectedCategory ? selectedCategory.toLowerCase() : '';
    const matchesCategory = selectedCategory === 'Popular' || selectedCategory === 'Latest'
      ? true 
      : itemCategory === selectedCatLower;
    const matchesSearch = item.title ? item.title.toLowerCase().includes(searchTerm.toLowerCase()) : false;
    return matchesCategory && matchesSearch;
  });

  // Efek untuk animasi section opacity dan item berita
  useEffect(() => {
    // Animasi opacity untuk section destinasi
    if (!loadingDestinations) {
      Animated.timing(destinationSectionOpacity, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }).start();
    } else {
      destinationSectionOpacity.setValue(0); // Reset jika loading
    }

    // Animasi opacity untuk section berita dan animasi staggered untuk item berita
    if (!loadingNews) {
      Animated.timing(newsSectionOpacity, {
        toValue: 1,
        duration: 700,
        delay: 150, // Sedikit delay setelah destinasi
        useNativeDriver: true,
      }).start();

      const newsToAnimate = filteredNews.slice(0, MAX_NEWS_ITEMS_HOME);
      if (newsToAnimate.length > 0) {
        const animations = newsToAnimate.map((_, index) => {
          newsItemAnims[index].setValue(0); // Reset animasi item sebelum dimulai
          return Animated.timing(newsItemAnims[index], {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          });
        });
        // Jalankan animasi item berita secara staggered
        Animated.stagger(150, animations).start();
      }
    } else {
      newsSectionOpacity.setValue(0); // Reset jika loading
      newsItemAnims.forEach(anim => anim.setValue(0)); // Reset animasi item jika loading
    }
  }, [loadingDestinations, loadingNews, filteredNews, destinationSectionOpacity, newsSectionOpacity, newsItemAnims]);


  // Parallax untuk background header (opsional, bisa dikembangkan)
  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -30], // Background bergerak lebih lambat dari scroll
    extrapolate: 'clamp',
  });
  const headerElementsOpacity = scrollY.interpolate({
    inputRange: [0, 70, 120],
    outputRange: [1, 0.5, 0], // Logo dan search bar memudar lebih cepat
    extrapolate: 'clamp',
  });


  return (
    <>
      <StatusBar backgroundColor={colors.white()} barStyle="dark-content" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Animated.ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
          contentContainerStyle={{paddingBottom: 20}}
        >
          <Animated.View style={[styles.headerWrapper, 
            // { transform: [{ translateY: headerTranslateY }] } // Contoh implementasi parallax
          ]}>
            <Animated.View style={[styles.backgroundAbstract, { transform: [{ translateY: headerTranslateY }] }]} />
            <Animated.View style={[styles.backgroundCircleLarge, { transform: [{ translateY: headerTranslateY/2 }] }]} />
            <Animated.View style={[styles.backgroundCircleSmall, { transform: [{ translateY: headerTranslateY/1.5 }] }]} />
            <Animated.View style={[styles.backgroundLeafRight, { transform: [{ translateY: headerTranslateY/1.2 }] }]} />
            
            <Animated.View style={{opacity: headerElementsOpacity}}>
              <View style={styles.logoContainer}>
                <View style={styles.logoTextContainer}>
                  <Text style={styles.logoJ}>J</Text>
                  <Text style={styles.logoDash}>-</Text>
                  <Text style={styles.logoTour}>Tour</Text>
                </View>
                <Text style={styles.logoTagline}>Explore Jember's Hidden Gems</Text>
              </View>
              <SearchBar
                searchTerm={searchTerm}
                onChangeText={setSearchTerm}
                onSearch={() => {}}
              />
            </Animated.View>
          </Animated.View>

          <CategoryList
            categories={categoriesData}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
          
          {error && !loadingDestinations && !loadingNews && (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <Animated.View style={{opacity: destinationSectionOpacity}}>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Rekomendasi Wisata</Text>
            </View>
            {loadingDestinations ? (
              <ActivityIndicator size="large" color={colors.greenDark()} style={{marginTop: 20, marginBottom:20, minHeight: 180}}/>
            ) : (
              // Komponen DestinationCard akan menghandle animasi itemnya sendiri
              <DestinationCard data={filteredDestinations} />
            )}
          </Animated.View>
          

          <Animated.View style={[styles.newsSection, { opacity: newsSectionOpacity }]}>
            <Text style={styles.sectionTitle}>Berita Wisata</Text>
            {loadingNews ? (
              <ActivityIndicator size="large" color={colors.greenDark()} style={{marginTop: 10, minHeight: 150}} />
            ) : (
              filteredNews.slice(0, MAX_NEWS_ITEMS_HOME).map((newsItem, index) => (
                <Animated.View
                  key={newsItem.id}
                  style={{
                      opacity: newsItemAnims[index],
                      transform: [{
                          translateY: newsItemAnims[index].interpolate({
                              inputRange: [0, 1],
                              outputRange: [30, 0], // Slide up
                          }),
                      }],
                      marginBottom: 16, // Menambahkan margin bawah antar kartu berita
                  }}>
                  <NewsCard
                    item={newsItem}
                    // scrollY={scrollY} // scrollY bisa digunakan di NewsCard jika perlu animasi individual saat scroll
                    title={newsItem.title}
                    category={newsItem.category}
                    date={newsItem.date} 
                    content={newsItem.content}
                    image={newsItem.image}
                  />
                </Animated.View>
              ))
            )}
            {!loadingNews && filteredNews.length === 0 && (
              <View style={styles.emptyDataContainer}>
                <Text style={styles.emptyDataText}>Tidak ada berita yang ditemukan.</Text>
              </View>
            )}
          </Animated.View>
        </Animated.ScrollView>
      </TouchableWithoutFeedback>
    </>
  );
}

// Styles (gunakan styles yang sudah ada, pastikan fallback font aman)
const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 20,
    fontFamily: fontType['Poppins-SemiBold'] || 'System', // Fallback font
    color: colors.greenDark(),
    marginTop: 20,
    marginBottom: 10,
  },
  headerWrapper: {
    position: 'relative',
    paddingTop: 16,
    paddingBottom: 12,
    paddingHorizontal: 24,
    zIndex: 1,
    marginBottom: 5,
    overflow: 'hidden', // Untuk menjaga background elements tidak keluar saat parallax
  },
  backgroundCircleLarge: {
    position: 'absolute', 
    top: -40, 
    right: -50, 
    width: 140, 
    height: 140, 
    backgroundColor: colors.green(0.15), 
    borderRadius: 70, 
    zIndex: 0, 
  },
  backgroundCircleSmall: {
    position: 'absolute', 
    top: 20, 
    left: 10, 
    width: 70, 
    height: 70, 
    backgroundColor: colors.green(0.1), 
    borderRadius: 35, 
    zIndex: 0, 
  },
  backgroundLeafRight: {
    position: 'absolute', 
    bottom: 20, 
    right: -30, 
    width: 70, 
    height: 40, 
    backgroundColor: colors.green(0.1), 
    borderTopLeftRadius: 40, 
    borderBottomRightRadius: 40, 
    transform: [{ rotate: '15deg' }], 
    zIndex: 0, 
  },
  backgroundAbstract: {
    position: 'absolute', 
    top: 0, 
    left: 0, 
    right: 0, 
    height: 140, 
    backgroundColor: colors.green(0.25), 
    borderBottomLeftRadius: 100, 
    borderBottomRightRadius: 100, 
    transform: [{ scaleX: 1.5 }], 
    zIndex: -1, 
  },
  logoContainer: {
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingHorizontal: 16, 
    marginBottom: 12, 
  },
  logoTextContainer: {
    flexDirection: 'row', 
  },
  logoJ: {
    color: colors.greenDark(), 
    fontSize: 36, 
    fontFamily: fontType['Poppins-Bold'] || 'System',
  },
  logoDash: {
    color: colors.grey(), 
    fontSize: 32, 
    fontFamily: fontType['Poppins-Bold'] || 'System',
  },
  logoTour: {
    color: colors.green(), 
    fontSize: 32, 
    fontFamily: fontType['Poppins-Bold'] || 'System',
  },
  logoTagline: {
    marginTop: 0, 
    fontSize: 14, 
    fontFamily: fontType['Poppins-Regular'] || 'System',
    color: colors.grey(1), 
    textAlign: 'center', 
  },
  sectionContainer: { // Untuk judul "Rekomendasi Wisata"
    paddingHorizontal: 24, 
  },
  newsSection: {
    marginHorizontal: 24, 
    marginTop: 10, 
    marginBottom: 20, // Mengurangi margin bawah agar lebih pas dengan konten terakhir
  },
  errorContainer: {
    padding: 10,
    backgroundColor: colors.red ? colors.red(0.1) : 'rgba(255,0,0,0.1)',
    borderRadius: 5,
    marginHorizontal: 24,
    marginVertical: 10,
    alignItems: 'center',
  },
  errorText: {
    color: colors.red ? colors.red() : 'red',
    fontFamily: fontType['Poppins-Regular'] || 'System',
    fontSize: 14,
  },
  emptyDataContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    // marginHorizontal: 24, // Tidak perlu jika sudah ada di newsSection
  },
  emptyDataText: {
    fontSize: 14,
    fontFamily: fontType['Poppins-Regular'] || 'System',
    color: colors.grey(),
  }
});