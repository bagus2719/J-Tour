import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { colors, fontType } from '../theme';

export default function NewsCard({ title, category, date, content, image }) {
  return (
    <View style={styles.newsCard}>
      <Image source={{ uri: image }} style={styles.newsImage} />
      <Text style={styles.newsTitle}>{title}</Text>
      <Text style={styles.newsCategoryDate}>{category} - {date}</Text>
      <Text style={styles.newsContent}>{content}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  newsCard: {
    marginBottom: 16,
    backgroundColor: colors.greenLight(0.05),
    borderRadius: 8,
    padding: 12,
  },
  newsImage: {
    width: '100%',
    height: 140,
    borderRadius: 8,
  },
  newsTitle: {
    fontSize: 16,
    fontFamily: fontType['Poppins-Medium'],
    color: colors.greenDark(),
    marginTop: 8,
  },
  newsCategoryDate: {
    fontSize: 12,
    fontFamily: fontType['Poppins-Regular'],
    color: colors.grey(),
    marginTop: 4,
  },
  newsContent: {
    fontSize: 13,
    fontFamily: fontType['Poppins-Regular'],
    color: colors.grey(),
    marginTop: 6,
  },
});
