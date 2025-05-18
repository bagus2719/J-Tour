import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { NewsList } from '../../data';
import { colors, fontType } from '../../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function NewsDetails() {
  // Hardcoded ID 1, bisa diganti sesuai kebutuhan
  const news = NewsList.find((item) => item.id === 1);

  if (!news) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Berita tidak ditemukan</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {news.image && (
        <Image source={{ uri: news.image }} style={styles.image} resizeMode="cover" />
      )}

      <View style={styles.content}>
        <Text style={styles.title}>{news.title}</Text>

        <View style={styles.row}>
          <FontAwesome name="calendar" size={16} color={colors.grey()} />
          <Text style={styles.date}>{news.date}</Text>
        </View>

        {news.author && (
          <View style={styles.row}>
            <FontAwesome name="user" size={16} color={colors.grey()} />
            <Text style={styles.author}>{news.author}</Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>Isi Berita</Text>
        <Text style={styles.contentText}>{news.content}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white(),
  },
  image: {
    width: SCREEN_WIDTH,
    height: 250,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontFamily: fontType['Poppins-Bold'],
    color: colors.greenDark(),
    marginTop: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  date: {
    fontSize: 14,
    fontFamily: fontType['Poppins-Regular'],
    color: colors.grey(),
    marginLeft: 6,
  },
  author: {
    fontSize: 14,
    fontFamily: fontType['Poppins-Regular'],
    color: colors.grey(),
    marginLeft: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: fontType['Poppins-SemiBold'],
    color: colors.greenDark(),
    marginTop: 20,
    marginBottom: 8,
  },
  contentText: {
    fontSize: 14,
    fontFamily: fontType['Poppins-Regular'],
    color: colors.grey(1),
    lineHeight: 22,
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
