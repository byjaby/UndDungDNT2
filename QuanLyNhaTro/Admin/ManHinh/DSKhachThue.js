import React, { useEffect, useState } from "react";
import {
    View,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    StatusBar,
    Platform,
    Animated,
    TextInput
} from "react-native";
import { IconButton, Text, Avatar } from "react-native-paper";
import { useMyContextController, loadKhachThue } from "../../TrungTam";
import { useFocusEffect } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const DSKhachThue = ({ navigation }) => {
    const [controller, dispatch] = useMyContextController();
    const { khachThue } = controller;
    const [searchQuery, setSearchQuery] = useState('');
    const scrollY = new Animated.Value(0);

    useFocusEffect(
        React.useCallback(() => {
            loadKhachThue(dispatch);
        }, [])
    );

    const filteredKhachThue = khachThue?.filter(item =>
        item.fullName.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    const soLuongKhachThue = filteredKhachThue.length;

    const renderItem = ({ item, index }) => {
        const inputRange = [-1, 0, 80 * index, 80 * (index + 2)];
        const scale = scrollY.interpolate({
            inputRange,
            outputRange: [1, 1, 1, 0.8],
            extrapolate: 'clamp',
        });

        const opacity = scrollY.interpolate({
            inputRange,
            outputRange: [1, 1, 1, 0.6],
            extrapolate: 'clamp',
        });

        return (
            <Animated.View style={{ transform: [{ scale }], opacity }}>
                <TouchableOpacity
                    style={[styles.card, {
                        backgroundColor: index % 2 === 0 ? '#667eea' : '#764ba2'
                    }]}
                    onPress={() => navigation.navigate("ChiTietKhachThue", { user: item })}
                    activeOpacity={0.9}
                >
                    <View style={styles.cardContent}>
                        <View style={styles.avatarContainer}>
                            <Avatar.Text
                                size={56}
                                label={item.fullName.charAt(0).toUpperCase()}
                                style={styles.avatar}
                                labelStyle={styles.avatarLabel}
                            />
                            <View style={styles.statusDot} />
                        </View>

                        <View style={styles.textContainer}>
                            <Text style={styles.name}>{item.fullName}</Text>
                            <Text style={styles.subtitle}>
                                {item.phone || "Chưa có số điện thoại"}
                            </Text>
                        </View>

                        <View style={styles.arrowContainer}>
                            <View style={styles.arrowIcon}>
                                <Text style={styles.arrowText}>›</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </Animated.View>
        );
    };

    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
                <Text style={styles.emptyIcon}>👥</Text>
            </View>
            <Text style={styles.emptyTitle}>Chưa có khách thuê trọ</Text>
            <Text style={styles.emptySubtitle}>
                Nhấn nút + để thêm khách thuê mới
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#667eea" />

            {/* Header với gradient background */}
            <View style={styles.headerContainer}>
                <View style={styles.headerGradient}>
                    <View style={styles.headerContent}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.mainTitle}>Khách Thuê Trọ</Text>
                            <Text style={styles.countBadge}>
                                {soLuongKhachThue} người
                            </Text>
                        </View>

                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={() => navigation.navigate("ThemKhachThue")}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.addButtonText}>+</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <View style={styles.searchContainer}>
                <View style={styles.searchInputContainer}>
                    <Text style={styles.searchIcon}>🔍</Text>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Tìm kiếm khách thuê..."
                        placeholderTextColor="#999"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity
                            onPress={() => setSearchQuery('')}
                            style={styles.clearButton}
                        >
                            <Text style={styles.clearButtonText}>✕</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Content */}
            <View style={styles.contentContainer}>
                {soLuongKhachThue > 0 ? (
                    <Animated.FlatList
                        data={filteredKhachThue}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={renderItem}
                        contentContainerStyle={styles.listContainer}
                        showsVerticalScrollIndicator={false}
                        onScroll={Animated.event(
                            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                            { useNativeDriver: true }
                        )}
                        scrollEventThrottle={16}
                    />
                ) : (
                    renderEmptyState()
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9ff',
    },
    headerContainer: {
        height: 120,
        overflow: 'hidden',
    },
    headerGradient: {
        flex: 1,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        backgroundColor: '#667eea', // Fallback cho React Native
    },
    headerContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 50 : 30,
    },
    titleContainer: {
        flex: 1,
    },
    mainTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    countBadge: {
        fontSize: 14,
        color: '#e8eaff',
        fontWeight: '500',
    },
    addButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    addButtonText: {
        fontSize: 24,
        color: '#fff',
        fontWeight: 'bold',
        marginTop: -2,
    },
    searchContainer: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#f8f9ff',
    },
    searchInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 25,
        paddingHorizontal: 20,
        height: 50,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    searchIcon: {
        fontSize: 18,
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    clearButton: {
        width: 20,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    clearButtonText: {
        fontSize: 14,
        color: '#999',
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 20,
    },
    listContainer: {
        paddingBottom: 20,
    },
    card: {
        borderRadius: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 5,
        overflow: 'hidden',
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
    },
    avatarContainer: {
        position: 'relative',
        marginRight: 16,
    },
    avatar: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    avatarLabel: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    statusDot: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: '#4CAF50',
        borderWidth: 3,
        borderColor: '#fff',
    },
    textContainer: {
        flex: 1,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        marginBottom: 2,
    },
    roomInfo: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.7)',
        fontWeight: '500',
    },
    arrowContainer: {
        marginLeft: 10,
    },
    arrowIcon: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    arrowText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
    },
    emptyIconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#e8eaff',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    emptyIcon: {
        fontSize: 40,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
        textAlign: 'center',
    },
    emptySubtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 24,
    },
});

export default DSKhachThue;