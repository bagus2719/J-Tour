import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions, TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import { NewsList } from '../../data'; // Dihapus karena data dari route.params
import { colors, fontType } from '../../theme'; //

const { width: SCREEN_WIDTH } = Dimensions.get('window'); //

export default function NewsDetails({ route }) { // Menerima route
  const { news } = route.params || {}; // Mengambil 'news' dari route.params
  const [liked, setLiked] = useState(null); //

  if (!news) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Berita tidak ditemukan</Text> {/* */}
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {news.image && (
        <Image source={{ uri: news.image }} style={styles.image} resizeMode="cover" />
      )}

      <View style={styles.content}>
        <Text style={styles.title}>{news.title}</Text> {/* */}

        <View style={styles.row}>
          <FontAwesome name="calendar" size={16} color={colors.grey()} /> {/* */}
          <Text style={styles.date}>{news.date}</Text> {/* */}
        </View>

        {/* Menampilkan kategori berita jika ada */}
        {news.category && (
           <View style={styles.row}>
            <FontAwesome name="tag" size={16} color={colors.grey()} />
            <Text style={styles.author}>{news.category}</Text> 
            {/* Menggunakan style 'author' untuk sementara, bisa dibuat style baru 'category' */}
          </View>
        )}

        {/* Menghapus author karena tidak ada di FormAddData */}
        {/* {news.author && (
          <View style={styles.row}>
            <FontAwesome name="user" size={16} color={colors.grey()} />
            <Text style={styles.author}>{news.author}</Text>
          </View>
        )} */}

        <Text style={styles.sectionTitle}>Isi Berita</Text> {/* */}
        <Text style={styles.contentText}>{news.content}</Text> {/* */}
      </View>
      <View style={styles.likeContainer}>
        <TouchableOpacity
          style={[
            styles.likeButton,
            liked === true && { backgroundColor: '#4CAF50' }, //
          ]}
          onPress={() => setLiked(true)} //
        >
          <Text style={styles.likeText}>👍 Like</Text> {/* */}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.likeButton,
            liked === false && { backgroundColor: '#F44336' }, //
          ]}
          onPress={() => setLiked(false)} //
        >
          <Text style={styles.likeText}>👎 Dislike</Text> {/* */}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// Styles (tetap sama, pastikan konsisten)
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white(), //
  },
  image: {
    width: SCREEN_WIDTH, //
    height: 250, //
  },
  content: {
    paddingHorizontal: 24, //
    paddingBottom: 40, //
  },
  title: {
    fontSize: 24, //
    fontFamily: fontType['Poppins-Bold'], //
    color: colors.greenDark(), //
    marginTop: 16, //
  },
  row: {
    flexDirection: 'row', //
    alignItems: 'center', //
    marginTop: 8, //
  },
  date: {
    fontSize: 14, //
    fontFamily: fontType['Poppins-Regular'], //
    color: colors.grey(), //
    marginLeft: 6, //
  },
  author: { // Style ini bisa juga digunakan untuk kategori jika cocok
    fontSize: 14, //
    fontFamily: fontType['Poppins-Regular'], //
    color: colors.grey(), //
    marginLeft: 6, //
  },
  sectionTitle: {
    fontSize: 18, //
    fontFamily: fontType['Poppins-SemiBold'], //
    color: colors.greenDark(), //
    marginTop: 20, //
    marginBottom: 8, //
  },
  contentText: {
    fontSize: 14, //
    fontFamily: fontType['Poppins-Regular'], //
    color: colors.black(), //
    lineHeight: 22, //
  },
  centered: {
    flex: 1, //
    justifyContent: 'center', //
    alignItems: 'center', //
    padding: 24, //
  },
  errorText: {
    fontSize: 16, //
    color: colors.red ? colors.red() : 'red', //
  },
  likeContainer: {
    flexDirection: 'row', //
    justifyContent: 'space-around', //
    marginTop: 8, //
    marginBottom: 22, //
  },
  likeButton: {
    paddingVertical: 10, //
    paddingHorizontal: 20, //
    borderRadius: 8, //
    backgroundColor: '#e0e0e0', //
  },
  likeText: {
    fontSize: 16, //
    fontWeight: 'bold', //
  },
});