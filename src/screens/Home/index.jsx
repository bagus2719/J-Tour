import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StatusBar, StyleSheet,
  TouchableWithoutFeedback, Keyboard, Animated
} from 'react-native';
import { CategoryList, DestinationCard, NewsCard, SearchBar } from '../../components';
import { CategoryList as categories, DestinationList as destinations, NewsList } from '../../data';
import { colors, fontType } from '../../theme';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Popular');

  // Animation refs
  const destinationOpacity = useRef(new Animated.Value(0)).current;
  const newsOpacity = useRef(new Animated.Value(0)).current;
  const scrollY = useRef(new Animated.Value(0)).current;

  // Filtered data
  const filteredDestinations = destinations.filter((item) => {
    const matchesCategory = selectedCategory === 'Popular' || selectedCategory === 'Latest'
      ? true : item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const filteredNews = NewsList.filter((item) => {
    const matchesCategory = selectedCategory === 'Popular' || selectedCategory === 'Latest'
      ? true : item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Animation on mount
  useEffect(() => {
    Animated.timing(destinationOpacity, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    Animated.timing(newsOpacity, {
      toValue: 1,
      duration: 1000,
      delay: 200,
      useNativeDriver: true,
    }).start();
  }, [selectedCategory, searchTerm]);

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
        >
          <View style={styles.headerWrapper}>
            <View style={styles.backgroundAbstract} />
            <View style={styles.backgroundCircleLarge} />
            <View style={styles.backgroundCircleSmall} />
            <View style={styles.backgroundLeafRight} />
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
          </View>

          <CategoryList
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          <Animated.View style={{ opacity: destinationOpacity }}>
            <DestinationCard data={filteredDestinations} />
          </Animated.View>

          <Animated.View style={[styles.newsSection, { opacity: newsOpacity }]}>
            <Text style={styles.newsTitle}>Berita Wisata</Text>
            {filteredNews.slice(0, 3).map((news, index) => (
              <NewsCard
                key={news.id}
                {...news}
                item={news}
                index={index}
                scrollY={scrollY}
              />
            ))}
          </Animated.View>
        </Animated.ScrollView>
      </TouchableWithoutFeedback>
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontFamily: fontType['Poppins-Bold'],
    marginLeft: 24,
    marginTop: 12,
    marginBottom: 8,
    color: colors.greenDark(),
  },
  headerWrapper: {
    position: 'relative',
    paddingTop: 16,
    paddingBottom: 12,
    paddingHorizontal: 24,
    zIndex: 1,
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
    fontFamily: fontType['Poppins-Bold'],
  },
  logoDash: {
    color: colors.grey(),
    fontSize: 32,
    fontFamily: fontType['Poppins-Bold'],
  },
  logoTour: {
    color: colors.green(),
    fontSize: 32,
    fontFamily: fontType['Poppins-Bold'],
  },
  logoTagline: {
    marginTop: 0,
    fontSize: 14,
    fontFamily: fontType['Poppins-Regular'],
    color: colors.grey(1),
    textAlign: 'center',
  },
  newsSection: {
    marginHorizontal: 24,
    marginTop: 20,
    marginBottom: 40,
  },
  newsTitle: {
    fontSize: 20,
    fontFamily: fontType['Poppins-SemiBold'],
    color: colors.greenDark(),
    marginBottom: 10,
  },
});