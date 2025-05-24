import React, { useState } from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert} from 'react-native';
import { colors, fontType } from '../../theme';

import { launchImageLibrary } from 'react-native-image-picker';
import { Image } from 'react-native';
export default function FormAddData({ route, navigation }) {
    const { type } = route.params; // 'destination' or 'news'

    // State form fields
    const [form, setForm] = useState({
        // Destination fields
        name: '',
        location: '',
        category: '',
        image: '',
        // News fields
        title: '',
        date: '',
        content: '',
    });

    // Handle text input changes
    const onChange = (key, value) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };

    const handleChoosePhoto = () => {
        launchImageLibrary(
            { mediaType: 'photo', quality: 0.7 },
            (response) => {
                if (response.didCancel) return;
                if (response.errorCode) {
                    Alert.alert('Error', 'Gagal memilih gambar');
                    return;
                }

                const uri = response.assets?.[0]?.uri;
                if (uri) {
                    onChange('image', uri);
                }
            }
        );
    };

    // Validate & submit form
    const onSubmit = () => {
        // Simple validation
        if (type === 'destination') {
            if (!form.name || !form.location || !form.category || !form.image) {
                Alert.alert('Error', 'Please fill all fields!');
                return;
            }
            // TODO: submit destination data
            Alert.alert('Success', 'Destination added!');
        } else if (type === 'news') {
            if (!form.title || !form.category || !form.date || !form.content || !form.image) {
                Alert.alert('Error', 'Please fill all fields!');
                return;
            }
            // TODO: submit news data
            Alert.alert('Success', 'News added!');
        }
        navigation.goBack();
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
            <Text style={styles.header}>
                {type === 'destination' ? 'Tambah Destinasi' : 'Tambah Berita'}
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
                    <TouchableOpacity style={styles.imagePicker} onPress={handleChoosePhoto}>
                        {form.image ? (
                            <Image source={{ uri: form.image }} style={styles.imagePreview} />
                        ) : (
                            <Text style={styles.imagePickerText}>Pilih Gambar</Text>
                        )}
                    </TouchableOpacity>
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
                    <TextInput
                        style={styles.input}
                        placeholder="Tanggal (YYYY-MM-DD)"
                        value={form.date}
                        onChangeText={(text) => onChange('date', text)}
                    />
                    <TextInput
                        style={[styles.input, { height: 100 }]}
                        placeholder="Isi Konten"
                        value={form.content}
                        onChangeText={(text) => onChange('content', text)}
                        multiline
                    />
                    <TouchableOpacity style={styles.imagePicker} onPress={handleChoosePhoto}>
                        {form.image ? (
                            <Image source={{ uri: form.image }} style={styles.imagePreview} />
                        ) : (
                            <Text style={styles.imagePickerText}>Pilih Gambar</Text>
                        )}
                    </TouchableOpacity>
                </>
            )}

            <TouchableOpacity style={styles.button} onPress={onSubmit}>
                <Text style={styles.buttonText}>Tambah {type === 'destination' ? 'Destinasi' : 'Berita'}</Text>
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
    imagePicker: {
  borderWidth: 1,
  borderColor: colors.grey(),
  borderRadius: 8,
  padding: 12,
  justifyContent: 'center',
  alignItems: 'center',
  height: 180,
  marginBottom: 16,
  backgroundColor: colors.white(),
},
imagePickerText: {
  fontFamily: fontType['Poppins-Regular'],
  color: colors.grey(),
},
imagePreview: {
  width: '100%',
  height: '100%',
  borderRadius: 6,
},
});
