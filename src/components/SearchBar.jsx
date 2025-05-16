import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { colors, fontType } from '../theme';

export default function SearchBar({ searchTerm, onChangeText, onSearch }) {
    return (
        <View style={styles.searchWrapper}>
            <TextInput
                value={searchTerm}
                onChangeText={onChangeText}
                placeholder="Cari destinasi atau berita..."
                placeholderTextColor={colors.grey(0.6)}
                style={styles.searchInput}
                returnKeyType="search"
                onSubmitEditing={onSearch}
                clearButtonMode="while-editing"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    searchWrapper: {
        marginHorizontal: 24,
        marginTop: 10,
        marginBottom: 6,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 30,
        paddingHorizontal: 20,
        height: 42,
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 18,
    },
    searchInput: {
        fontFamily: fontType['Poppins-Regular'],
        fontSize: 14,
        color: colors.greenDark(),
        paddingVertical: 6,
    },
});
