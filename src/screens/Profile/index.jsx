import React, { useState, useRef, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Image, Animated, ActivityIndicator, Alert, Platform } from 'react-native'; // Tambahkan Platform
import { Setting2, Edit2, Add, More } from 'iconsax-react-native';
import { useNavigation } from '@react-navigation/native';
import { ProfileData } from '../../data';
import { fontType, colors } from '../../theme';
import firestore from '@react-native-firebase/firestore';

const formatNumber = number => {
  if (number >= 1000000000) return (number / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
  if (number >= 1000000) return (number / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (number >= 1000) return (number / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  return String(number);
};

const Profile = () => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const navigation = useNavigation();
  const [showOptions, setShowOptions] = useState(false);

  const [destinations, setDestinations] = useState([]);
  const [news, setNews] = useState([]);
  const [loadingDestinations, setLoadingDestinations] = useState(true);
  const [loadingNews, setLoadingNews] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedType, setSelectedType] = useState(null);

  useEffect(() => {
    setLoadingDestinations(true);
    const destinationsSubscriber = firestore()
      .collection('destinations')
      .onSnapshot(querySnapshot => {
        const fetchedDestinations = [];
        if (querySnapshot) {
          querySnapshot.forEach(documentSnapshot => {
            fetchedDestinations.push({
              ...documentSnapshot.data(),
              id: documentSnapshot.id,
            });
          });
        }
        setDestinations(fetchedDestinations);
        setLoadingDestinations(false);
        setError(null);
      }, err => {
        console.error("Error fetching destinations snapshot:", err);
        setError("Gagal memuat data destinasi.");
        setLoadingDestinations(false);
      });

    setLoadingNews(true);
    const newsSubscriber = firestore()
      .collection('news')
      .orderBy('createdAt', 'desc')
      .onSnapshot(querySnapshot => {
        const fetchedNews = [];
        if (querySnapshot) {
          querySnapshot.forEach(documentSnapshot => {
            fetchedNews.push({
              ...documentSnapshot.data(),
              id: documentSnapshot.id,
            });
          });
        }
        setNews(fetchedNews);
        setLoadingNews(false);
        setError(null);
      }, err => {
        console.error("Error fetching news snapshot:", err);
        setError("Gagal memuat data berita.");
        setLoadingNews(false);
      });

    return () => {
      destinationsSubscriber();
      newsSubscriber();
    };
  }, []);

  const onPressIn = () => Animated.spring(scaleAnim, { toValue: 0.95, useNativeDriver: Platform.OS !== 'web' }).start();
  const onPressOut = () => Animated.spring(scaleAnim, { toValue: 1, friction: 3, tension: 40, useNativeDriver: Platform.OS !== 'web' }).start();
  const onPressEdit = () => { /* Action edit profile */ };
  const onPressSetting = () => { /* Action setting */ };
  const onAddData = () => setShowOptions(true);

  const handleDelete = async () => {
    if (!selectedItem || !selectedType) return;
    const itemToDelete = selectedItem; // Simpan sebelum di-null-kan oleh closeActionModal
    const typeToDelete = selectedType;
    closeActionModal(); // Tutup modal dulu

    Alert.alert(
      'Konfirmasi Hapus',
      `Yakin ingin menghapus data "${typeToDelete === 'destination' ? itemToDelete.name : itemToDelete.title}"?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              const collectionName = typeToDelete === 'destination' ? 'destinations' : 'news';
              await firestore().collection(collectionName).doc(itemToDelete.id).delete();
              Alert.alert('Sukses', 'Data berhasil dihapus.');
              // Listener onSnapshot akan otomatis update UI
            } catch (err) {
              console.error('Delete error:', err);
              Alert.alert('Gagal menghapus', 'Terjadi kesalahan saat menghapus data.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleMorePress = (item, type) => {
    setSelectedItem(item);
    setSelectedType(type);
  };

  const closeActionModal = () => {
    setSelectedItem(null);
    setSelectedType(null);
  };

  const renderEmptyList = (type) => (
    <View style={styles.emptyDataContainer}>
      <Text style={styles.emptyDataText}>Belum ada data {type} yang ditambahkan.</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={profile.profileHeader}>
          <Image style={profile.pic} source={{ uri: ProfileData.profilePict }} resizeMode="cover" />
          <View style={profile.infoContainer}>
            <Text style={profile.name}>{ProfileData.name || 'Nama Pengguna'}</Text>
            <Text style={profile.bio} numberOfLines={3}>
              {ProfileData.bio || 'Passionate traveler and blogger sharing my adventures and tips.'}
            </Text>
            <Text style={profile.memberSince}>Member since {ProfileData.createdAt || 'N/A'}</Text>
          </View>
        </View>

        <View style={profile.statsContainer}>
          <View style={profile.statBox}>
            <Text style={profile.sum}>{formatNumber(ProfileData.blogPosted || 0)}</Text>
            <Text style={profile.tag}>Posts</Text>
          </View>
          <View style={profile.statBox}>
            <Text style={profile.sum}>{formatNumber(ProfileData.following || 0)}</Text>
            <Text style={profile.tag}>Following</Text>
          </View>
          <View style={profile.statBox}>
            <Text style={profile.sum}>{formatNumber(ProfileData.follower || 0)}</Text>
            <Text style={profile.tag}>Followers</Text>
          </View>
        </View>

        <View style={profile.buttonsContainer}>
          <TouchableOpacity activeOpacity={0.8} onPressIn={onPressIn} onPressOut={onPressOut} onPress={onPressEdit}>
            <Animated.View style={[profile.buttonEdit, { transform: [{ scale: scaleAnim }] }]}>
              <Edit2 size={20} color={colors.white()} variant="Bold" />
              <Text style={profile.buttonText}>Edit Profile</Text>
            </Animated.View>
          </TouchableOpacity>
          <TouchableOpacity style={profile.buttonSetting} activeOpacity={0.7} onPress={onPressSetting}>
            <Setting2 size={24} color={colors.green()} variant="Linear" />
          </TouchableOpacity>
        </View>

        {error && (
          <View style={styles.errorContainerGlobal}>
            <Text style={styles.errorTextGlobal}>{error}</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Destinations</Text>
          {loadingDestinations ? <ActivityIndicator size="small" color={colors.green()} />
            : destinations.length === 0 ? renderEmptyList('destinasi')
              : destinations.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.itemCard}
                  activeOpacity={0.7}
                  onPress={() => navigation.navigate('DestinationDetails', { destination: item })}
                >
                  <View style={styles.itemCardHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.itemTitle}>{item.name || 'Nama Destinasi'}</Text>
                      <Text style={styles.itemDesc} numberOfLines={2}>{item.description || 'Deskripsi singkat...'}</Text>
                    </View>
                    <TouchableOpacity onPress={(e) => { e.stopPropagation(); handleMorePress(item, 'destination'); }}>
                      <More size={22} color={colors.greenDark()} variant="Linear" />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))
          }
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>News</Text>
          {loadingNews ? <ActivityIndicator size="small" color={colors.green()} />
            : news.length === 0 ? renderEmptyList('berita')
              : news.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.itemCard}
                  activeOpacity={0.7}
                  onPress={() => navigation.navigate('NewsDetails', { news: item })}
                >
                  <View style={styles.itemCardHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.itemTitle}>{item.title || 'Judul Berita'}</Text>
                      <Text style={styles.itemDesc} numberOfLines={2}>{item.content || 'Konten singkat...'}</Text>
                    </View>
                    <TouchableOpacity onPress={(e) => { e.stopPropagation(); handleMorePress(item, 'news'); }}>
                      <More size={22} color={colors.greenDark()} variant="Linear" />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))
          }
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={onAddData} activeOpacity={0.8}>
        <Add size={28} color={colors.white()} variant="Bold" />
      </TouchableOpacity>

      {showOptions && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Pilih Jenis Data</Text>
            <TouchableOpacity style={styles.modalButton} onPress={() => { setShowOptions(false); navigation.navigate('FormAddData', { type: 'destination' }); }}>
              <Text style={styles.modalButtonText}>Destination</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={() => { setShowOptions(false); navigation.navigate('FormAddData', { type: 'news' }); }}>
              <Text style={styles.modalButtonText}>News</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowOptions(false)}>
              <Text style={styles.modalCancelText}>Batal</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {selectedItem && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Aksi Data</Text>
            <TouchableOpacity style={styles.modalButton} onPress={() => { navigation.navigate('FormEditData', { id: selectedItem.id, type: selectedType }); closeActionModal(); }}>
              <Text style={styles.modalButtonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={handleDelete} >
              <Text style={[styles.modalButtonText, { color: 'red' }]}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={closeActionModal}>
              <Text style={styles.modalCancelText}>Batal</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

// Styles (Pastikan semua style sudah ada dan benar)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white(), },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 80, gap: 15, },
  section: { marginTop: 30, gap: 12, },
  sectionTitle: { fontSize: 20, fontFamily: fontType['Pjs-ExtraBold'] || 'System', color: colors.greenDark(), },
  fab: { position: 'absolute', bottom: 24, right: 24, backgroundColor: colors.green(), width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 6, shadowColor: colors.greenDark(), shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6, },
  itemCard: { backgroundColor: colors.green(0.05), padding: 12, borderRadius: 10, borderWidth: 1, borderColor: colors.green(0.1), marginBottom: 10, },
  itemTitle: { fontSize: 16, fontFamily: fontType['Pjs-SemiBold'] || 'System', color: colors.greenDark(), marginBottom: 4, },
  itemDesc: { fontSize: 14, fontFamily: fontType['Pjs-Regular'] || 'System', color: colors.grey(0.7), },
  modalOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', zIndex: 10, },
  modalContainer: { backgroundColor: colors.white(), borderRadius: 16, padding: 20, width: 260, alignItems: 'center', },
  modalTitle: { fontSize: 18, fontFamily: fontType['Pjs-Bold'] || 'System', color: colors.greenDark(), marginBottom: 16, },
  modalButton: { width: '100%', paddingVertical: 12, backgroundColor: colors.green(0.2), borderRadius: 10, marginBottom: 10, alignItems: 'center', },
  modalButtonText: { fontSize: 16, fontFamily: fontType['Pjs-Medium'] || 'System', color: colors.greenDark(), },
  modalCancelText: { marginTop: 10, fontSize: 14, color: colors.grey(), fontFamily: fontType['Pjs-Regular'] || 'System', },
  itemCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, },
  errorContainerGlobal: { padding: 10, backgroundColor: colors.red ? colors.red(0.1) : 'rgba(255,0,0,0.1)', borderRadius: 5, marginVertical: 10, alignItems: 'center', marginHorizontal: 24, },
  errorTextGlobal: { color: colors.red ? colors.red() : 'red', fontFamily: fontType['Pjs-Regular'] || 'System', fontSize: 14, },
  emptyDataContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyDataText: {
    fontSize: 14,
    fontFamily: fontType['Pjs-Regular'] || 'System',
    color: colors.grey(),
  }
});

const profile = StyleSheet.create({
  profileHeader: { flexDirection: 'row', gap: 20, alignItems: 'center', marginTop: 28, },
  pic: { width: 110, height: 110, borderRadius: 55, borderWidth: 3, borderColor: colors.green(), shadowColor: colors.green(0.4), shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.6, shadowRadius: 6, elevation: 5, },
  infoContainer: { flex: 1, },
  name: { color: colors.black(), fontSize: 24, fontFamily: fontType['Pjs-Bold'] || 'System', textTransform: 'capitalize', },
  bio: { fontSize: 15, fontFamily: fontType['Pjs-Italic'] || 'System', color: colors.grey(0.65), marginTop: 6, lineHeight: 22, fontStyle: 'italic', },
  memberSince: { marginTop: 8, fontSize: 13, fontFamily: fontType['Pjs-Regular'] || 'System', color: colors.grey(0.5), },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, marginBottom: 6, paddingHorizontal: 16, borderTopWidth: 1, borderTopColor: colors.grey(0.2), },
  statBox: { alignItems: 'center', flex: 1, borderBottomWidth: 3, borderBottomColor: colors.green(), paddingVertical: 8, },
  sum: { fontSize: 20, fontFamily: fontType['Pjs-SemiBold'] || 'System', color: colors.greenDark(), },
  tag: { fontSize: 14, fontFamily: fontType['Pjs-Regular'] || 'System', color: colors.grey(0.5), marginTop: 2, },
  buttonsContainer: { flexDirection: 'row', gap: 15, justifyContent: 'space-between', marginTop: 6, alignItems: 'center', },
  buttonEdit: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, paddingVertical: 10, paddingHorizontal: 20, backgroundColor: colors.green(), borderRadius: 16, shadowColor: colors.greenDark(), shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 8, },
  buttonText: { fontSize: 18, fontFamily: fontType['Pjs-SemiBold'] || 'System', color: colors.white(), backgroundColor: 'transparent', },
  buttonSetting: { padding: 12, borderRadius: 12, backgroundColor: colors.green(0.15), justifyContent: 'center', alignItems: 'center', },
});


export default Profile;