import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { colors, fontType } from '../../theme';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

export default function News() {
  const navigation = useNavigation();

  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    const subscriber = firestore()
      .collection('news')
      .orderBy('createdAt', 'desc')
      .onSnapshot(querySnapshot => {
        const newsArray = [];
        if (querySnapshot) {
          querySnapshot.forEach(documentSnapshot => {
            newsArray.push({
              id: documentSnapshot.id,
              ...documentSnapshot.data(),
            });
          });
        }
        setNewsData(newsArray);
        setLoading(false);
        setError(null); // Reset error on successful fetch
      }, err => {
        console.error("Error fetching news:", err);
        setError("Gagal memuat data berita. Silakan coba lagi nanti.");
        setLoading(false);
      });

    return () => subscriber();
  }, []);

  const truncateText = (text, maxLength = 120) => {
    if (typeof text !== 'string') return ''; // Ensure text is a string
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };

  const renderItem = ({ item }) => {
    // Fallback untuk semua field yang akan dirender sebagai teks
    const title = item.title || 'Judul Tidak Tersedia';
    const category = item.category || 'Umum';
    const date = item.date || 'Tanggal Tidak Ada';
    const content = item.content || ''; // Konten bisa string kosong jika tidak ada
    const imageUrl = (typeof item.image === 'string' && item.image) ? item.image : 'https://via.placeholder.com/160';

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.85}
        onPress={() => navigation.navigate('NewsDetails', { news: item })}
      >
        <Image source={{ uri: imageUrl }} style={styles.image} />
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>{title}</Text>
          <Text style={styles.meta}>{category} · {date}</Text>
          <Text style={styles.preview}>{truncateText(content)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.greenDark()} />
        <Text style={styles.loadingText}>Memuat berita...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTextHeader}>Oops!</Text>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // Header tetap ditampilkan meskipun list kosong, ListEmptyComponent akan menangani pesan kosong
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Berita Terkini</Text>
      <FlatList
        data={newsData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={ // Ditambahkan untuk kasus newsData kosong
          (!loading && !error) ? (
            <View style={styles.emptyContainerFull}>
              <Text style={styles.emptyText}>Belum ada berita untuk ditampilkan.</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}

// Styles (gunakan styles yang sudah ada dari respons sebelumnya)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white(),
  },
  header: {
    fontSize: 24,
    fontFamily: fontType['Poppins-Bold'],
    marginVertical: 18, 
    marginHorizontal: 18,
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
    backgroundColor: colors.grey(0.1), 
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white(),
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    fontFamily: fontType['Poppins-Regular'],
    color: colors.grey(),
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.white(),
  },
  errorTextHeader: {
    fontSize: 20,
    fontFamily: fontType['Poppins-Bold'],
    color: colors.red ? colors.red() : 'red',
    marginBottom: 10,
  },
  errorText: {
    fontSize: 16,
    color: colors.red ? colors.red(0.8) : '#cc0000',
    textAlign: 'center',
    fontFamily: fontType['Poppins-Regular'],
    lineHeight: 22,
  },
  emptyContainerFull: { 
    height: 200, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: colors.grey(),
    fontFamily: fontType['Poppins-Regular'],
    textAlign: 'center',
  }
});