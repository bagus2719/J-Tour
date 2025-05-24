import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { NewsList } from '../../data';
import { colors, fontType } from '../../theme';
import { useNavigation } from '@react-navigation/native';

export default function News() {
  const navigation = useNavigation();

  const truncateText = (text, maxLength = 120) =>
    text.length > maxLength ? text.slice(0, maxLength) + '...' : text;

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => navigation.navigate('NewsDetails', { news: item })}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.meta}>{item.category} · {item.date}</Text>
        <Text style={styles.preview}>{truncateText(item.content)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Berita Terkini</Text>
      <FlatList
        data={NewsList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white(),
  },
  header: {
    fontSize: 24,
    fontFamily: fontType['Poppins-Bold'],
    margin: 18,
    color: colors.greenDark(),
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: colors.white(),
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 160,
  },
  content: {
    padding: 14,
  },
  title: {
    fontSize: 18,
    fontFamily: fontType['Poppins-SemiBold'],
    color: colors.greenDark(),
    marginBottom: 6,
  },
  meta: {
    fontSize: 13,
    color: colors.grey(),
    fontFamily: fontType['Poppins-Regular'],
    marginBottom: 8,
  },
  preview: {
    fontSize: 14,
    color: colors.grey(0.85),
    fontFamily: fontType['Poppins-Regular'],
    lineHeight: 20,
  },
});
