import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';
import { Setting2, Edit2 } from 'iconsax-react-native';
import { ProfileData, NewsList } from '../../data';
import { ItemSmall } from '../../components';
import { fontType, colors } from '../../theme';

const formatNumber = number => {
  if (number >= 1000000000) {
    return (number / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
  }
  if (number >= 1000000) {
    return (number / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (number >= 1000) {
    return (number / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return number.toString();
};

const data = Array.isArray(NewsList) ? NewsList.slice(5) : [];

const Profile = () => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

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

        <View style={styles.newsSection}>
          <Text style={styles.newsTitle}>News</Text>
          {data.map((item, index) => (
            <ItemSmall item={item} key={index} />
          ))}
        </View>
      </ScrollView>
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
    paddingBottom: 40,
    gap: 15,
  },
  newsSection: {
    marginTop: 30,
    gap: 12,
  },
  newsTitle: {
    fontSize: 20,
    fontFamily: fontType['Pjs-ExtraBold'],
    color: colors.greenDark(),
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
