import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, fontType } from '../theme';

export default function NewsCard({ title, category, date, content, image, item }) {
  const navigation = useNavigation();

  const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };

  const isContentLong = content && content.length > 100;

  const handlePress = () => {
    navigation.navigate('NewsDetails', { news: item });
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.85} style={styles.card}>
      <Image source={{ uri: image }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.categoryDate}>{category} • {date}</Text>
        <Text style={styles.content}>
          {truncateText(content)}
          {isContentLong && <Text style={styles.readMore}> Baca Selengkapnya</Text>}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white(),
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: colors.black(0.1),
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  textContainer: {
    padding: 14,
  },
  title: {
    fontSize: 16,
    fontFamily: fontType['Poppins-SemiBold'],
    color: colors.greenDark(),
    marginBottom: 4,
  },
  categoryDate: {
    fontSize: 12,
    fontFamily: fontType['Poppins-Regular'],
    color: colors.grey(0.8),
    marginBottom: 8,
  },
  content: {
    fontSize: 13,
    fontFamily: fontType['Poppins-Regular'],
    color: colors.grey(0.9),
    lineHeight: 18,
  },
  readMore: {
    fontFamily: fontType['Poppins-Medium'],
    color: colors.greenDark(),
  },
});
