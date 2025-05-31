// src/screens/FormAddData/index.jsx
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView,
  Alert, Image, ActivityIndicator, Platform
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors, fontType } from '../../theme'; //
import * as ImagePicker from 'react-native-image-picker';
import firestore from '@react-native-firebase/firestore';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import { CategoryList } from '../../data'; //

// Tambahkan import Notifee
import notifee, { AndroidImportance } from '@notifee/react-native';

export default function FormAddData({ route, navigation }) {
  const { type } = route.params;

  const defaultForm = type === 'destination'
    ? { name: '', location: '', category: '', description: '', facilities: '', image: '' }
    : { title: '', category: '', date: '', content: '', image: '' };

  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [dateObj, setDateObj] = useState(new Date());

  const filteredCategories = CategoryList.filter(item =>
    type === 'destination'
      ? ['Pantai', 'Gunung', 'Kuliner', 'Budaya', 'Taman'].includes(item.name)
      : ['Acara', 'Informasi', 'Tips', 'Promo'].includes(item.name)
  ); //

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }; //

  const onDateChange = (event, selectedDate) => {
    setDatePickerVisible(Platform.OS === 'ios');
    if (selectedDate) {
      setDateObj(selectedDate);
      setForm(prev => ({ ...prev, date: formatDate(selectedDate) }));
    }
  }; //

  const onChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  }; //

  const handleImagePick = async () => {
    ImagePicker.launchImageLibrary({ mediaType: 'photo', quality: 0.7 }, async (response) => { // Menggunakan ImagePicker dari import
      if (response.didCancel) {
        console.log('User cancelled image picker');
        return;
      }
      if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
        Alert.alert('Error', `Gagal memilih gambar: ${response.errorMessage}`);
        return;
      }
      if (response.assets && response.assets.length > 0) {
        const imageAsset = response.assets[0];
        if (!imageAsset.uri) {
          Alert.alert('Error', 'URI gambar tidak ditemukan.');
          return;
        }
        // Langsung upload gambar setelah dipilih untuk mendapatkan URL
        setLoading(true); // Tampilkan loading saat gambar diupload
        try {
          const formData = new FormData();
          formData.append('file', {
            uri: imageAsset.uri,
            name: imageAsset.fileName || 'image.jpg',
            type: imageAsset.type || 'image/jpeg'
          });

          const res = await axios.post('https://backend-file-praktikum.vercel.app/upload/', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });

          if (res.data && res.data.url) {
            setForm(prev => ({ ...prev, image: res.data.url }));
            Alert.alert('Sukses', 'Gambar berhasil diupload!');
          } else {
            Alert.alert('Upload Gagal', 'Gagal mendapatkan URL gambar dari server.');
          }
        } catch (error) {
          console.error("Error uploading image: ", error);
          Alert.alert('Upload Error', `Gagal mengupload gambar: ${error.message}`);
        } finally {
          setLoading(false);
        }
      }
    });
  }; // Modifikasi dari

  // --- Fungsi untuk Menampilkan Notifikasi Lokal ---
  async function displayUploadSuccessNotification(itemType, itemName) {
    try {
      await notifee.requestPermission(); // Minta izin jika belum ada

      const channelId = await notifee.createChannel({
        id: 'upload_success_channel', // ID channel bisa lebih spesifik
        name: 'Upload Sukses',
        importance: AndroidImportance.HIGH,
        sound: 'default',
      });

      await notifee.displayNotification({
        title: `${itemType} Berhasil Diupload!`,
        body: `${itemName} telah berhasil ditambahkan ke J-Tour.`,
        android: {
          channelId,
          smallIcon: 'ic_launcher', // Pastikan ikon ini ada
          pressAction: {
            id: 'default',
          },
        },
        ios: {
          sound: 'default',
        }
      });
      console.log(`Notifikasi sukses upload untuk ${itemType}: ${itemName} ditampilkan.`);
    } catch (e) {
      console.error('Gagal menampilkan notifikasi sukses upload:', e);
    }
  }

  const onSubmit = async () => {
    setLoading(true);
    let itemName = ''; // Untuk digunakan di notifikasi

    try {
      if (!form.image) {
        Alert.alert('Error', 'Gambar belum diupload. Silakan pilih dan tunggu proses upload gambar selesai.');
        setLoading(false);
        return;
      }

      if (type === 'destination') {
        const { name, location, category, description, facilities, image } = form;
        itemName = name; //
        if (!name || !location || !category || !description || !facilities ) { // image sudah dicek di atas
          Alert.alert('Error', 'Semua field destinasi (kecuali gambar) harus diisi!');
          setLoading(false);
          return;
        }

        await firestore().collection('destinations').add({
          name,
          location,
          category,
          description,
          facilities: facilities.split(',').map(item => item.trim()),
          image, // URL gambar dari state form
          createdAt: firestore.FieldValue.serverTimestamp()
        }); //

        Alert.alert('Sukses', 'Destinasi berhasil ditambahkan!');
        await displayUploadSuccessNotification('Destinasi', name); // Tampilkan notifikasi Notifee

      } else if (type === 'news') {
        const { title, category, date, content, image } = form;
        itemName = title; //
        if (!title || !category || !date || !content ) { // image sudah dicek di atas
          Alert.alert('Error', 'Semua field berita (kecuali gambar) harus diisi!');
          setLoading(false);
          return;
        }

        await firestore().collection('news').add({
          title,
          category,
          date,
          content,
          image, // URL gambar dari state form
          createdAt: firestore.FieldValue.serverTimestamp()
        }); //

        Alert.alert('Sukses', 'Berita berhasil ditambahkan!');
        await displayUploadSuccessNotification('Berita', title); // Tampilkan notifikasi Notifee
      }

      navigation.goBack();
    } catch (error) {
      console.error(`Error saat menambahkan ${type}:`, error )
      Alert.alert('Error', `Gagal menambahkan data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }; // Modifikasi dari

  // ... sisa JSX (return statement) Anda tidak perlu diubah secara signifikan untuk logika ini
  // Pastikan tombol "Tambah" memanggil `onSubmit`

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }} keyboardShouldPersistTaps="handled">
      <Text style={styles.header}>
        {type === 'destination' ? 'Tambah Destinasi' : 'Tambah Berita'}
      </Text>

      {type === 'destination' ? (
        <>
          <TextInput style={styles.input} placeholder="Nama Destinasi" value={form.name} onChangeText={(text) => onChange('name', text)} />
          <TextInput style={styles.input} placeholder="Lokasi" value={form.location} onChangeText={(text) => onChange('location', text)} />

          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={form.category}
              onValueChange={(value) => onChange('category', value)}
              prompt={`Pilih Kategori ${type === 'destination' ? 'Destinasi' : 'Berita'}`}
            >
              <Picker.Item label={`Pilih Kategori ${type === 'destination' ? 'Destinasi' : 'Berita'}`} value="" />
              {filteredCategories.map((item) => (
                <Picker.Item label={item.name} value={item.name} key={item.id} />
              ))}
            </Picker>
          </View>

          <TextInput style={[styles.input, { height: 100, textAlignVertical: 'top' }]} placeholder="Deskripsi" value={form.description} onChangeText={(text) => onChange('description', text)} multiline />
          <TextInput style={[styles.input, { height: 80, textAlignVertical: 'top' }]} placeholder="Fasilitas (pisahkan dengan koma)" value={form.facilities} onChangeText={(text) => onChange('facilities', text)} multiline />
        </>
      ) : (
        <>
          <TextInput style={styles.input} placeholder="Judul Berita" value={form.title} onChangeText={(text) => onChange('title', text)} />

          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={form.category}
              onValueChange={(value) => onChange('category', value)}
              prompt="Pilih Kategori Berita"
            >
              <Picker.Item label="Pilih Kategori Berita" value="" />
              {filteredCategories.map((item) => (
                <Picker.Item label={item.name} value={item.name} key={item.id} />
              ))}
            </Picker>
          </View>

          <TouchableOpacity onPress={() => setDatePickerVisible(true)} style={[styles.input, { justifyContent: 'center', height: 50 }]}>
            <Text style={{ color: form.date ? colors.black() : colors.grey(0.6) }}>{form.date || 'Pilih Tanggal'}</Text>
          </TouchableOpacity>

          {datePickerVisible && (
            <DateTimePicker
              value={dateObj}
              mode="date"
              display="default"
              onChange={onDateChange}
              maximumDate={new Date()}
            />
          )}
          <TextInput style={[styles.input, { height: 100, textAlignVertical: 'top' }]} placeholder="Isi Konten" value={form.content} onChangeText={(text) => onChange('content', text)} multiline />
        </>
      )}

      <TouchableOpacity style={styles.buttonImage} onPress={handleImagePick}>
        <Text style={styles.buttonImageText}>Pilih Gambar Thumbnail</Text>
      </TouchableOpacity>

      {form.image ? (
        <View style={{alignItems: 'center', marginVertical: 10}}>
            <Image source={{ uri: form.image }} style={styles.imagePreview} />
            <Text style={{fontSize: 10, color: colors.grey()}}>URL: {form.image}</Text>
        </View>
      ) : null}

      <TouchableOpacity style={styles.button} onPress={onSubmit} disabled={loading}>
        {loading ? (
          <ActivityIndicator color={colors.white()} />
        ) : (
          <Text style={styles.buttonText}>Tambah {type === 'destination' ? 'Destinasi' : 'Berita'}</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  ); // JSX dari
}

// Styles (gunakan styles yang sudah ada dari file FormAddData.jsx Anda)
// Saya akan menyalinnya dari file yang Anda berikan
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white(), //
  },
  header: {
    fontSize: 22,
    fontFamily: fontType['Poppins-Bold'], //
    marginBottom: 20,
    color: colors.greenDark(), //
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.grey(0.5), //
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    marginBottom: 16,
    fontFamily: fontType['Poppins-Regular'], //
    fontSize: 16,
    backgroundColor: colors.white(), //
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: colors.grey(0.5), //
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: colors.white(), //
  },
  button: {
    backgroundColor: colors.greenDark(), //
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10, // Diubah dari 10 ke 20 untuk memberi jarak dari preview gambar
    marginBottom: 20, // Memberi jarak di bawah tombol
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 4,
  },
  buttonText: {
    color: colors.white(), //
    fontSize: 16,
    fontFamily: fontType['Poppins-SemiBold'], //
  },
  buttonImage: { // Style baru untuk tombol pilih gambar
    backgroundColor: colors.green(0.8), //
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonImageText: { // Style baru untuk teks tombol pilih gambar
    color: colors.white(), //
    fontSize: 14,
    fontFamily: fontType['Poppins-Medium'], //
  },
  imagePreview: {
    width: '80%', // Ubah agar tidak terlalu lebar
    height: 180,
    borderRadius: 8,
    marginBottom: 5, // Kurangi margin bawah
    borderWidth: 1,
    borderColor: colors.grey(0.3), //
  },
}); //