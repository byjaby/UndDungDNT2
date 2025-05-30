import React, { useEffect, useRef, useState } from "react";
import {
    View,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Dimensions,
    StatusBar
} from "react-native";
import { IconButton, Text, TextInput } from "react-native-paper";
import { useMyContextController, loadChuTro } from "../../TrungTam";
import { useFocusEffect } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const DSChuTro = ({ navigation }) => {
    const [controller, dispatch] = useMyContextController();
    const { chuTro } = controller;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;
    const [searchQuery, setSearchQuery] = useState('');
    const filteredchuTro = chuTro?.filter(item =>
        item.fullName.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];
    const soLuongChuTro = filteredchuTro.length;
    useFocusEffect(
        React.useCallback(() => {
            loadChuTro(dispatch);

            // Animation khi vào màn hình
            fadeAnim.setValue(0);
            slideAnim.setValue(30);

            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                })
            ]).start();
        }, [])
    );

    const AnimatedCard = ({ item, index }) => {
        const cardAnim = useRef(new Animated.Value(0)).current;
        const scaleAnim = useRef(new Animated.Value(0.9)).current;

        React.useEffect(() => {
            Animated.parallel([
                Animated.timing(cardAnim, {
                    toValue: 1,
                    duration: 400,
                    delay: index * 80,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 400,
                    delay: index * 80,
                    useNativeDriver: true,
                })
            ]).start();
        }, []);

        return (
            <Animated.View
                style={[
                    styles.cardContainer,
                    {
                        opacity: cardAnim,
                        transform: [
                            { scale: scaleAnim },
                            {
                                translateY: cardAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [20, 0],
                                })
                            }
                        ]
                    }
                ]}
            >
                <TouchableOpacity
                    style={styles.card}
                    onPress={() => navigation.navigate("ChiTietChuTro", { user: item })}
                    activeOpacity={0.85}
                >
                    <View style={styles.cardGradient}>
                        <View style={styles.cardContent}>
                            <View style={styles.avatar}>
                                <Text style={styles.avatarText}>
                                    {item.fullName?.charAt(0)?.toUpperCase() || 'C'}
                                </Text>
                            </View>
                            <View style={styles.cardInfo}>
                                <Text style={styles.name}>{item.fullName}</Text>
                                <Text style={styles.subtitle}>Chủ trọ</Text>
                            </View>
                            <View style={styles.statusBadge}>
                                <View style={styles.statusDot} />
                                <Text style={styles.statusText}>Hoạt động</Text>
                            </View>
                        </View>
                        <View style={styles.cardFooter}>
                            <Text style={styles.viewDetails}>Xem chi tiết →</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </Animated.View>
        );
    };

    const renderItem = ({ item, index }) => (
        <AnimatedCard item={item} index={index} />
    );

    const EmptyState = () => (
        <Animated.View
            style={[
                styles.emptyContainer,
                {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }]
                }
            ]}
        >
            <View style={styles.emptyCard}>
                <Text style={styles.emptyIcon}>🏠</Text>
                <Text style={styles.emptyTitle}>Chưa có chủ trọ nào</Text>
                <Text style={styles.emptySubtitle}>
                    Hãy thêm chủ trọ đầu tiên của bạn
                </Text>
            </View>
        </Animated.View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

            <Animated.View
                style={[
                    styles.header,
                    {
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }]
                    }
                ]}
            >
                <View style={styles.headerContent}>
                    <View>
                        <Text style={styles.title}>Quản lý Chủ Trọ</Text>
                        <Text style={styles.subtitle}>
                            {soLuongChuTro > 0 ? `${soLuongChuTro} chủ trọ` : "Chưa có dữ liệu"}
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => navigation.navigate("ThemChuTro")}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.addButtonText}>+</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.searchContainer}>
                    <View style={styles.searchInputContainer}>
                        <Text style={styles.searchIcon}>🔍</Text>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Tìm kiếm chủ trọ..."
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
            </Animated.View>

            <View style={styles.content}>
                {soLuongChuTro > 0 ? (
                    <Animated.View
                        style={[
                            { flex: 1 },
                            {
                                opacity: fadeAnim,
                                transform: [{ translateY: slideAnim }]
                            }
                        ]}
                    >
                        <FlatList
                            data={filteredchuTro}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={renderItem}
                            contentContainerStyle={styles.listContainer}
                            showsVerticalScrollIndicator={false}
                        />
                    </Animated.View>
                ) : (
                    <EmptyState />
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#5D737E',
    },
    header: {
        backgroundColor: '#FEFAE0',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
        color: '#64748b',
        fontWeight: '500',
    },
    addButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#3b82f6',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    addButtonText: {
        color: '#ffffff',
        fontSize: 24,
        fontWeight: '600',
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
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    listContainer: {
        paddingTop: 20,
        paddingBottom: 20,
    },
    cardContainer: {
        marginBottom: 16,
    },
    card: {
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
        elevation: 5,
    },
    cardGradient: {
        backgroundColor: '#ffffff',
        padding: 20,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#3b82f6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    avatarText: {
        color: '#ffffff',
        fontSize: 20,
        fontWeight: '700',
    },
    cardInfo: {
        flex: 1,
    },
    name: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: 4,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#dcfce7',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#22c55e',
        marginRight: 6,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#16a34a',
    },
    cardFooter: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
    },
    viewDetails: {
        fontSize: 14,
        color: '#3b82f6',
        fontWeight: '500',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyCard: {
        backgroundColor: '#ffffff',
        padding: 40,
        borderRadius: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
        width: '100%',
    },
    emptyIcon: {
        fontSize: 60,
        marginBottom: 20,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: 8,
        textAlign: 'center',
    },
    emptySubtitle: {
        fontSize: 16,
        color: '#64748b',
        textAlign: 'center',
        lineHeight: 24,
    },
});

export default DSChuTro;