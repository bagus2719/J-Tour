import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { launchImageLibrary } from 'react-native-image-picker';
// import { doc, getDoc, updateDoc } from 'firebase/firestore';
import firestore from '@react-native-firebase/firestore';
import { colors, fontType } from '../../theme';

export default function FormEditData({ route, navigation }) {
  const { type, id } = route.params || {};

  const [form, setForm] = useState(null); 
  const [loading, setLoading] = useState(false); 
  const [loadingData, setLoadingData] = useState(true); 
  const [datePickerVisible, setDatePickerVisible] = useState(false); 
  const [dateObj, setDateObj] = useState(new Date()); 

  useEffect(() => {
    if (!id) {
      Alert.alert('Error', 'ID tidak ditemukan!');
      navigation.goBack();
      return;
    }

    async function fetchData() {
      setLoadingData(true);
      try {
        const collectionName = type === 'destination' ? 'destinations' : 'news';
        const docRef = firestore().collection(collectionName).doc(id);
        const docSnap = await docRef.get();
        
        if (!docSnap.exists) throw new Error('Data tidak ditemukan');

        const data = docSnap.data();

        if (type === 'destination') {
          setForm({
            name: data.name || '',
            location: data.location || '',
            category: data.category || '',
            description: data.description || '',
            facilities: Array.isArray(data.facilities) ? data.facilities.join(', ') : (data.facilities || ''),
            image: data.image || '',
          });
        } else if (type === 'news') {
          setForm({
            title: data.title || '',
            category: data.category || '',
            date: data.date || '',
            content: data.content || '',
            image: data.image || '',
          });

          if (data.date) {
            const parts = data.date.split('/');
            if (parts.length === 3) {
                setDateObj(new Date(parts[2], parts[1] - 1, parts[0]));
            } else {
                setDateObj(new Date(data.date)); 
            }
          }
        }
      } catch (error) {
        console.error("Error fetching document: ", error);
        Alert.alert('Error', error.message);
        navigation.goBack();
      } finally {
        setLoadingData(false);
      }
    }

    fetchData();
  }, [id, type, navigation]);

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
      setForm((prev) => ({ ...prev, date: formatDate(selectedDate) }));
    }
  };

  const onChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const pickImage = async () => {
    launchImageLibrary({ mediaType: 'photo' }, async (response) => {
      if (response.didCancel || response.errorCode) {
        return;
      }
      const asset = response.assets[0];
      if (!asset.uri) {
        Alert.alert('Error', 'URI gambar tidak ditemukan.');
        return;
      }
      const imageUri = asset.uri;

      const formData = new FormData();
      formData.append('file', {
        uri: imageUri,
        type: asset.type || 'image/jpeg',
        name: asset.fileName || 'image.jpg',
      });

      try {
        setLoading(true);
        const res = await fetch('https://backend-file-praktikum.vercel.app/upload', {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        const data = await res.json();
        if (data.url) {
          onChange('image', data.url);
        } else {
          Alert.alert('Upload Gagal', 'Gagal mendapatkan URL gambar');
        }
      } catch (err) {
        Alert.alert('Error Upload', err.message);
      } finally {
        setLoading(false);
      }
    });
  };

  const onSubmit = async () => {
    if (!form) {
      Alert.alert('Error', 'Form belum siap.');
      return;
    } 

    setLoading(true);

    try {
      const collectionName = type === 'destination' ? 'destinations' : 'news';
      const docRef = firestore().collection(collectionName).doc(id);
      let dataToUpdate = {};

      if (type === 'destination') {
        const { name, location, category, description, facilities, image } = form;
        if (!name || !location || !category || !description ) {
          Alert.alert('Error', 'Nama, Lokasi, Kategori, dan Deskripsi harus diisi!');
          setLoading(false);
          return;
        }
        dataToUpdate = {
          name,
          location,
          category,
          description,
          facilities: facilities ? facilities.split(',').map((f) => f.trim()) : [],
          image,
        };
      } else if (type === 'news') {
        const { title, category, date, content, image } = form;
        if (!title || !category || !date || !content ) {
          Alert.alert('Error', 'Judul, Kategori, Tanggal, dan Konten harus diisi!');
          setLoading(false);
          return;
        }
        dataToUpdate = {
          title,
          category,
          date,
          content,
          image,
        };
      }
      
      await docRef.update(dataToUpdate);
      Alert.alert('Sukses', `Data ${type} berhasil diperbarui!`);
      navigation.goBack();
    } catch (error) {
      console.error("Error updating document: ", error);
      Alert.alert('Error Update', error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loadingData || !form) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.greenDark()} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }} keyboardShouldPersistTaps="handled">
      <Text style={styles.header}>
        {type === 'destination' ? 'Edit Destinasi' : 'Edit Berita'}
      </Text>

      {type === 'destination' ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="Nama Destinasi"
            value={form.name}
            onChangeText={(text) => onChange('name', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Lokasi"
            value={form.location}
            onChangeText={(text) => onChange('location', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Kategori"
            value={form.category}
            onChangeText={(text) => onChange('category', text)}
          />
          <TextInput
            style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
            placeholder="Deskripsi"
            value={form.description}
            onChangeText={(text) => onChange('description', text)}
            multiline
          />
          <TextInput
            style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
            placeholder="Fasilitas (pisahkan dengan koma)"
            value={form.facilities}
            onChangeText={(text) => onChange('facilities', text)}
            multiline
          />
        </>
      ) : ( 
        <>
          <TextInput
            style={styles.input}
            placeholder="Judul Berita"
            value={form.title}
            onChangeText={(text) => onChange('title', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Kategori"
            value={form.category}
            onChangeText={(text) => onChange('category', text)}
          />

          <TouchableOpacity
            onPress={() => setDatePickerVisible(true)}
            style={[styles.input, { justifyContent: 'center', height: 50 }]}
          >
            <Text style={{ color: form.date ? colors.black() : colors.grey() }}>
              {form.date || 'Pilih Tanggal'}
            </Text>
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

          <TextInput
            style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
            placeholder="Isi Konten"
            value={form.content}
            onChangeText={(text) => onChange('content', text)}
            multiline
          />
        </>
      )}

      <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
        <Text style={{ color: colors.white(), fontFamily: fontType['Pjs-Bold'] || 'Poppins-Bold' }}>Upload Gambar</Text>
      </TouchableOpacity>

      {form.image ? <Image source={{ uri: form.image }} style={styles.imagePreview} /> : null}

      <TouchableOpacity style={styles.button} onPress={onSubmit} disabled={loading}>
        {loading ? (
          <ActivityIndicator color={colors.white()} />
        ) : (
          <Text style={styles.buttonText}>Simpan Perubahan</Text>
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
    fontSize: 24, 
    fontFamily: fontType['Pjs-Bold'] || 'Poppins-Bold', 
    marginBottom: 16, 
    color: colors.greenDark(),
    textAlign: 'center',
  },
  input: {
    borderWidth: 1, 
    borderColor: colors.grey(), 
    borderRadius: 8, 
    paddingHorizontal: 12, 
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    marginBottom: 12,
    fontFamily: fontType['Pjs-Regular'] || 'Poppins-Regular',
    fontSize: 16,
    color: colors.black(), //
    backgroundColor: colors.white(), //
  },
  button: {
    backgroundColor: colors.greenDark(), //
    padding: 15, //
    borderRadius: 8, //
    alignItems: 'center', //
    marginTop: 16, //
    marginBottom: 40, //
  },
  buttonText: {
    color: colors.white(), //
    fontFamily: fontType['Pjs-Bold'] || 'Poppins-Bold', // Fallback
    fontSize: 18, //
  },
  imagePreview: {
    width: '100%', //
    height: 200, //
    marginBottom: 12, //
    borderRadius: 8, //
  },
  uploadButton: {
    backgroundColor: colors.greyDark ? colors.greyDark() : '#555', //
    padding: 12, //
    borderRadius: 8, //
    alignItems: 'center', //
    marginBottom: 12, //
  },
});