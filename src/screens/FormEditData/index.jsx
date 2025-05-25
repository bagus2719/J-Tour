import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Image, ActivityIndicator, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors, fontType } from '../../theme';
import { getDestinationById, getNewsById, putDestination, putNews } from '../../services/api';

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
                let data;
                if (type === 'destination') {
                    data = await getDestinationById(id);
                } else if (type === 'news') {
                    data = await getNewsById(id);
                }
                if (!data) throw new Error('Data tidak ditemukan');

                // Setup form default
                if (type === 'destination') {
                    setForm({
                        name: data.name || '',
                        location: data.location || '',
                        category: data.category || '',
                        description: data.description || '',
                        facilities: data.facilities ? data.facilities.join(', ') : '',
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
                        // Parse date from "dd/mm/yyyy"
                        const [day, month, year] = data.date.split('/');
                        setDateObj(new Date(year, month - 1, day));
                    }
                }
            } catch (error) {
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
            setForm(prev => ({ ...prev, date: formatDate(selectedDate) }));
        }
    };

    const onChange = (key, value) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };

    const onSubmit = async () => {
        if (!id) {
            Alert.alert('Error', 'Data tidak valid, tidak ada ID.');
            return;
        }

        if (!form) {
            Alert.alert('Error', 'Form belum siap.');
            return;
        }

        setLoading(true);

        if (type === 'destination') {
            const { name, location, category, description, facilities, image } = form;

            if (!name || !location || !category || !description || !facilities || !image) {
                Alert.alert('Error', 'Semua field destinasi harus diisi!');
                setLoading(false);
                return;
            }

            try {
                await putDestination(id, {
                    name,
                    location,
                    category,
                    description,
                    facilities: facilities.split(',').map(item => item.trim()),
                    image,
                });

                Alert.alert('Sukses', 'Destinasi berhasil diperbarui!');
                navigation.goBack();
            } catch (error) {
                Alert.alert('Error', error.message);
            } finally {
                setLoading(false);
            }
        } else if (type === 'news') {
            const { title, category, date, content, image } = form;

            if (!title || !category || !date || !content || !image) {
                Alert.alert('Error', 'Semua field berita harus diisi!');
                setLoading(false);
                return;
            }

            try {
                await putNews(id, {
                    title,
                    category,
                    date,
                    content,
                    image,
                });

                Alert.alert('Sukses', 'Berita berhasil diperbarui!');
                navigation.goBack();
            } catch (error) {
                Alert.alert('Error', error.message);
            } finally {
                setLoading(false);
            }
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
        <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
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
                        style={[styles.input, { height: 100 }]}
                        placeholder="Deskripsi"
                        value={form.description}
                        onChangeText={(text) => onChange('description', text)}
                        multiline
                    />
                    <TextInput
                        style={[styles.input, { height: 80 }]}
                        placeholder="Fasilitas (pisahkan dengan koma)"
                        value={form.facilities}
                        onChangeText={(text) => onChange('facilities', text)}
                        multiline
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="URL Gambar"
                        value={form.image}
                        onChangeText={(text) => onChange('image', text)}
                    />
                    {form.image ? (
                        <Image source={{ uri: form.image }} style={styles.imagePreview} />
                    ) : null}
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
                        style={[styles.input, { justifyContent: 'center' }]}
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
                        style={[styles.input, { height: 100 }]}
                        placeholder="Isi Konten"
                        value={form.content}
                        onChangeText={(text) => onChange('content', text)}
                        multiline
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="URL Gambar"
                        value={form.image}
                        onChangeText={(text) => onChange('image', text)}
                    />
                    {form.image ? (
                        <Image source={{ uri: form.image }} style={styles.imagePreview} />
                    ) : null}
                </>
            )}

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
        fontFamily: fontType.bold,
        marginBottom: 16,
        color: colors.greenDark(),
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: colors.grey(),
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        fontFamily: fontType.regular,
        fontSize: 16,
        color: colors.black(),
        backgroundColor: colors.white(),
    },
    button: {
        backgroundColor: colors.greenDark(),
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 40,
    },
    buttonText: {
        color: colors.white(),
        fontFamily: fontType.bold,
        fontSize: 18,
    },
    imagePreview: {
        width: '100%',
        height: 200,
        marginBottom: 12,
        borderRadius: 8,
    },
});
