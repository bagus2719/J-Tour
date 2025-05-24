import React from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Image, Animated, } from 'react-native';
import { Setting2, Edit2, Add } from 'iconsax-react-native';
import { useNavigation } from '@react-navigation/native';
import { ProfileData, DestinationList, NewsList } from '../../data';
import { fontType, colors } from '../../theme';

const formatNumber = number => {
  if (number >= 1000000000) return (number / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
  if (number >= 1000000) return (number / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (number >= 1000) return (number / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  return number.toString();
};

const Profile = () => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const navigation = useNavigation();
  const [showOptions, setShowOptions] = React.useState(false);

  const onPressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const onPressEdit = () => {
    // Action edit profile
  };

  const onPressSetting = () => {
    // Action setting
  };

  const onAddData = () => {
    setShowOptions(true);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={profile.profileHeader}>
          <Image
            style={profile.pic}
            source={{ uri: ProfileData.profilePict }}
            resizeMode="cover"
          />
          <View style={profile.infoContainer}>
            <Text style={profile.name}>{ProfileData.name}</Text>
            <Text style={profile.bio} numberOfLines={3}>
              {ProfileData.bio || 'Passionate traveler and blogger sharing my adventures and tips.'}
            </Text>
            <Text style={profile.memberSince}>
              Member since {ProfileData.createdAt}
            </Text>
          </View>
        </View>

        <View style={profile.statsContainer}>
          <View style={profile.statBox}>
            <Text style={profile.sum}>{ProfileData.blogPosted}</Text>
            <Text style={profile.tag}>Posts</Text>
          </View>
          <View style={profile.statBox}>
            <Text style={profile.sum}>{formatNumber(ProfileData.following)}</Text>
            <Text style={profile.tag}>Following</Text>
          </View>
          <View style={profile.statBox}>
            <Text style={profile.sum}>{formatNumber(ProfileData.follower)}</Text>
            <Text style={profile.tag}>Followers</Text>
          </View>
        </View>

        <View style={profile.buttonsContainer}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            onPress={onPressEdit}
          >
            <Animated.View style={[profile.buttonEdit, { transform: [{ scale: scaleAnim }] }]}>
              <Edit2 size={20} color={colors.white()} variant="Bold" />
              <Text style={profile.buttonText}>Edit Profile</Text>
            </Animated.View>
          </TouchableOpacity>

          <TouchableOpacity
            style={profile.buttonSetting}
            activeOpacity={0.7}
            onPress={onPressSetting}
          >
            <Setting2 size={24} color={colors.green()} variant="Linear" />
          </TouchableOpacity>
        </View>

        {/* Destination Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Destinations</Text>
          {DestinationList.map((item, index) => (
            <View key={index} style={styles.itemCard}>
              <Text style={styles.itemTitle}>{item.name}</Text>
              <Text style={styles.itemDesc} numberOfLines={2}>{item.description}</Text>
            </View>
          ))}
        </View>

        {/* News Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>News</Text>
          {NewsList.map((item, index) => (
            <View key={index} style={styles.itemCard}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemDesc} numberOfLines={2}>{item.content}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={onAddData} activeOpacity={0.8}>
        <Add size={28} color={colors.white()} variant="Bold" />
      </TouchableOpacity>

      {showOptions && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Pilih Jenis Data</Text>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setShowOptions(false);
                navigation.navigate('FormAddData', { type: 'destination' });
              }}
            >
              <Text style={styles.modalButtonText}>Destination</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setShowOptions(false);
                navigation.navigate('FormAddData', { type: 'news' });
              }}
            >
              <Text style={styles.modalButtonText}>News</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowOptions(false)}>
              <Text style={styles.modalCancelText}>Batal</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white(),
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 80,
    gap: 15,
  },
  section: {
    marginTop: 30,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: fontType['Pjs-ExtraBold'],
    color: colors.greenDark(),
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: colors.green(),
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: colors.greenDark(),
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  itemCard: {
    backgroundColor: colors.green(0.05),
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.green(0.1),
  },
  itemTitle: {
    fontSize: 16,
    fontFamily: fontType['Pjs-SemiBold'],
    color: colors.greenDark(),
    marginBottom: 4,
  },
  itemDesc: {
    fontSize: 14,
    fontFamily: fontType['Pjs-Regular'],
    color: colors.grey(0.7),
  },
  modalOverlay: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 10,
},
modalContainer: {
  backgroundColor: colors.white(),
  borderRadius: 16,
  padding: 20,
  width: 260,
  alignItems: 'center',
},
modalTitle: {
  fontSize: 18,
  fontFamily: fontType['Pjs-Bold'],
  color: colors.greenDark(),
  marginBottom: 16,
},
modalButton: {
  width: '100%',
  paddingVertical: 12,
  backgroundColor: colors.green(0.2),
  borderRadius: 10,
  marginBottom: 10,
  alignItems: 'center',
},
modalButtonText: {
  fontSize: 16,
  fontFamily: fontType['Pjs-Medium'],
  color: colors.greenDark(),
},
modalCancelText: {
  marginTop: 10,
  fontSize: 14,
  color: colors.grey(),
  fontFamily: fontType['Pjs-Regular'],
},
});

const profile = StyleSheet.create({
  profileHeader: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
    marginTop: 28,
  },
  pic: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: colors.green(),
    shadowColor: colors.green(0.4),
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 5,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    color: colors.black(),
    fontSize: 24,
    fontFamily: fontType['Pjs-Bold'],
    textTransform: 'capitalize',
  },
  bio: {
    fontSize: 15,
    fontFamily: fontType['Pjs-Italic'],
    color: colors.grey(0.65),
    marginTop: 6,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  memberSince: {
    marginTop: 8,
    fontSize: 13,
    fontFamily: fontType['Pjs-Regular'],
    color: colors.grey(0.5),
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    marginBottom: 6,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: colors.grey(0.2),
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
    borderBottomWidth: 3,
    borderBottomColor: colors.green(),
    paddingVertical: 8,
  },
  sum: {
    fontSize: 20,
    fontFamily: fontType['Pjs-SemiBold'],
    color: colors.greenDark(),
  },
  tag: {
    fontSize: 14,
    fontFamily: fontType['Pjs-Regular'],
    color: colors.grey(0.5),
    marginTop: 2,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 15,
    justifyContent: 'space-between',
    marginTop: 6,
    alignItems: 'center',
  },
  buttonEdit: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 90,
    backgroundColor: colors.green(),
    borderRadius: 16,
    shadowColor: colors.greenDark(),
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: fontType['Pjs-SemiBold'],
    color: colors.white(),
    backgroundColor: 'transparent',
  },
  buttonSetting: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: colors.green(0.15),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
