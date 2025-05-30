import React from 'react';
import { FlatList, View, Text, StyleSheet, Pressable } from 'react-native';
import { colors, fontType } from '../theme';

export default function CategoryList({ categories, selectedCategory, onSelectCategory }) {
  return (
    <View style={styles.listCategory}>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24 }}
        renderItem={({ item }) => {
          const isSelected = item.name === selectedCategory;
          return (
            <Pressable
              style={[styles.item, isSelected && styles.itemSelected]}
              onPress={() => onSelectCategory(item.name)} 
              android_ripple={{ color: colors.green(0.3), borderless: false }} 
            >
              <Text style={[styles.title, isSelected && styles.titleSelected]}>
                {item.name}
              </Text>
            </Pressable>
          );
        }}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  listCategory: { paddingVertical: 10, marginTop: 6 },
  item: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 25,
    alignItems: 'center',
    backgroundColor: colors.greenLight(0.15),
    marginHorizontal: 5,
  },
  itemSelected: {
    backgroundColor: colors.greenDark(),
  },
  title: {
    fontFamily: fontType['Poppins-SemiBold'],
    fontSize: 14,
    lineHeight: 18,
    color: colors.greenDark(),
  },
  titleSelected: {
    color: colors.white(),
  },
});
