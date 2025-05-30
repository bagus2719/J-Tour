import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView,
  Alert, Image, ActivityIndicator, Platform
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors, fontType } from '../../theme';
import * as ImagePicker from 'react-native-image-picker';
import firestore from '@react-native-firebase/firestore';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import { CategoryList } from '../../data'; // 👈 Import dari data.jsx

export default function FormAddData({ route, navigation }) {
  const { type } = route.params;

  const defaultForm = type === 'destination'
    ? { name: '', location: '', category: '', description: '', facilities: '', image: '' }
    : { title: '', category: '', date: '', content: '', image: '' };

  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [dateObj, setDateObj] = useState(new Date());

  // Filter kategori sesuai type
  const filteredCategories = CategoryList.filter(item =>
    type === 'destination'
      ? ['Pantai', 'Gunung', 'Kuliner', 'Budaya', 'Taman'].includes(item.name)
      : ['Acara', 'Informasi', 'Tips', 'Promo'].includes(item.name)
  );

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const onDateChange = (event, selectedDate) => {
    setDatePickerVisible(Platform.OS === 'ios');
    if (selectedDate) {
      setDateObj(selectedDate);
      setForm(prev => ({ ...prev, date: formatDate(selectedDate) }));
    }
  };

  const onChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibrary({ mediaType: 'photo' });
    if (result.assets && result.assets.length > 0) {
      const image = result.assets[0];
      const formData = new FormData();
      formData.append('file', {
        uri: image.uri,
        name: image.fileName || 'image.jpg',
        type: image.type || 'image/jpeg'
      });

      try {
        const res = await axios.post('https://backend-file-praktikum.vercel.app/upload/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        if (res.data && res.data.url) {
          setForm(prev => ({ ...prev, image: res.data.url }));
        } else {
          Alert.alert('Upload Gagal', 'Gagal mendapatkan URL gambar.');
        }
      } catch (error) {
        Alert.alert('Upload Error', error.message);
      }
    }
  };

  const onSubmit = async () => {
    setLoading(true);

    try {
      if (type === 'destination') {
        const { name, location, category, description, facilities, image } = form;

        if (!name || !location || !category || !description || !facilities || !image) {
          Alert.alert('Error', 'Semua field destinasi harus diisi!');
          setLoading(false);
          return;
        }

        await firestore().collection('destinations').add({
          name,
          location,
          category,
          description,
          facilities: facilities.split(',').map(item => item.trim()),
          image,
          createdAt: firestore.FieldValue.serverTimestamp()
        });

        Alert.alert('Sukses', 'Destinasi berhasil ditambahkan!');
      } else if (type === 'news') {
        const { title, category, date, content, image } = form;

        if (!title || !category || !date || !content || !image) {
          Alert.alert('Error', 'Semua field berita harus diisi!');
          setLoading(false);
          return;
        }

        await firestore().collection('news').add({
          title,
          category,
          date,
          content,
          image,
          createdAt: firestore.FieldValue.serverTimestamp()
        });

        Alert.alert('Sukses', 'Berita berhasil ditambahkan!');
      }

      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
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
            >
              <Picker.Item label="Pilih Kategori" value="" />
              {filteredCategories.map((item) => (
                <Picker.Item label={item.name} value={item.name} key={item.id} />
              ))}
            </Picker>
          </View>

          <TextInput style={[styles.input, { height: 100 }]} placeholder="Deskripsi" value={form.description} onChangeText={(text) => onChange('description', text)} multiline />
          <TextInput style={[styles.input, { height: 80 }]} placeholder="Fasilitas (pisahkan dengan koma)" value={form.facilities} onChangeText={(text) => onChange('facilities', text)} multiline />
        </>
      ) : (
        <>
          <TextInput style={styles.input} placeholder="Judul Berita" value={form.title} onChangeText={(text) => onChange('title', text)} />

          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={form.category}
              onValueChange={(value) => onChange('category', value)}
            >
              <Picker.Item label="Pilih Kategori" value="" />
              {filteredCategories.map((item) => (
                <Picker.Item label={item.name} value={item.name} key={item.id} />
              ))}
            </Picker>
          </View>

          <TouchableOpacity onPress={() => setDatePickerVisible(true)} style={[styles.input, { justifyContent: 'center' }]}>
            <Text style={{ color: form.date ? colors.black() : colors.grey() }}>{form.date || 'Pilih Tanggal'}</Text>
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
          <TextInput style={[styles.input, { height: 100 }]} placeholder="Isi Konten" value={form.content} onChangeText={(text) => onChange('content', text)} multiline />
        </>
      )}

      <TouchableOpacity style={styles.button} onPress={handleImagePick}>
        <Text style={styles.buttonText}>Pilih Gambar</Text>
      </TouchableOpacity>

      {form.image ? (
        <Image source={{ uri: form.image }} style={styles.imagePreview} />
      ) : null}

      <TouchableOpacity style={styles.button} onPress={onSubmit} disabled={loading}>
        {loading ? (
          <ActivityIndicator color={colors.white()} />
        ) : (
          <Text style={styles.buttonText}>Tambah {type === 'destination' ? 'Destinasi' : 'Berita'}</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white(),
  },
  header: {
    fontSize: 22,
    fontFamily: fontType['Poppins-Bold'],
    marginBottom: 20,
    color: colors.greenDark(),
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.grey(),
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontFamily: fontType['Poppins-Regular'],
    fontSize: 16,
    backgroundColor: colors.white(),
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: colors.grey(),
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
    backgroundColor: colors.white(),
  },
  button: {
    backgroundColor: colors.greenDark(),
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 4,
  },
  buttonText: {
    color: colors.white(),
    fontSize: 16,
    fontFamily: fontType['Poppins-SemiBold'],
  },
  imagePreview: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 16,
  },
});
