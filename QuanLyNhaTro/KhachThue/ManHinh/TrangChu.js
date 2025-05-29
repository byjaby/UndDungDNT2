import React, { useEffect } from "react";
import { View, FlatList, StyleSheet, TouchableOpacity, Image, Dimensions } from "react-native";
import { IconButton, Text } from "react-native-paper";
import { useMyContextController, loadChuTro } from "../../TrungTam";
import { useFocusEffect } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const TrangChu = ({ navigation }) => {
    const [controller, dispatch] = useMyContextController();
    const { chuTro } = controller;

    useFocusEffect(
        React.useCallback(() => {
            loadChuTro(dispatch);
        }, [])
    );

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("ChiTietNhaTro", { chuTro: item })}
            activeOpacity={0.8}
        >
            <View style={styles.cardHeader}>
                <View style={styles.iconContainer}>
                    <Text style={styles.iconText}>🏠</Text>
                </View>
                <View style={styles.cardContent}>
                    <Text style={styles.tenTro}>Tên trọ: {item.tenTro}</Text>
                    <Text style={styles.soPhong}>{item.sLPhong} phòng</Text>
                </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoSection}>
                <View style={styles.infoRow}>
                    <Text style={styles.infoIcon}>📍</Text>
                    <Text style={styles.infoText}>{item.address}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoIcon}>👤</Text>
                    <Text style={styles.infoText}>{item.fullName}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoIcon}>📞</Text>
                    <Text style={styles.infoText}>{item.phone}</Text>
                </View>
            </View>

            <View style={styles.arrowContainer}>
                <Text style={styles.arrow}>→</Text>
            </View>
        </TouchableOpacity>
    );

    const soLuongChuTro = chuTro?.length || 0;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <Text style={styles.title}>Danh sách nhà trọ</Text>
                    <View style={styles.countBadge}>
                        <Text style={styles.countText}>{soLuongChuTro}</Text>
                    </View>
                </View>
                <Text style={styles.subtitle}>
                    {soLuongChuTro > 0
                        ? `${soLuongChuTro} nhà trọ đang hoạt động`
                        : "Chưa có nhà trọ nào"
                    }
                </Text>
            </View>

            {soLuongChuTro > 0 ? (
                <FlatList
                    data={chuTro}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyIcon}>🏠</Text>
                    <Text style={styles.emptyTitle}>Chưa có nhà trọ</Text>
                </View>
            )}
        </View>
    );
};

export default TrangChu;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF1E6",
    },
    header: {
        backgroundColor: "#fff",
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 15,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    headerContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#2c3e50",
    },
    countBadge: {
        backgroundColor: "#3498db",
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
        minWidth: 40,
        alignItems: "center",
    },
    countText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    subtitle: {
        fontSize: 16,
        color: "#7f8c8d",
        fontWeight: "500",
    },
    listContainer: {
        paddingHorizontal: 15,
        paddingBottom: 20,
    },
    card: {
        backgroundColor: '#BFDBF7',
        padding: 20,
        borderRadius: 16,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        borderLeftWidth: 4,
        borderLeftColor: "#3498db",
    },
    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15,
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "#ecf0f1",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 15,
    },
    iconText: {
        fontSize: 24,
    },
    cardContent: {
        flex: 1,
    },
    tenTro: {
        fontSize: 20,
        fontWeight: 'bold',
        color: "#081C15",
        marginBottom: 4,
    },
    soPhong: {
        fontSize: 16,
        color: "#3498db",
        fontWeight: "600",
    },
    divider: {
        height: 1,
        backgroundColor: "#ecf0f1",
        marginBottom: 15,
    },
    infoSection: {
        marginBottom: 10,
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    infoIcon: {
        fontSize: 16,
        marginRight: 12,
        width: 20,
    },
    infoText: {
        fontSize: 16,
        color: "#0B2027",
        flex: 1,
        lineHeight: 22,
    },
    arrowContainer: {
        position: "absolute",
        right: 20,
        top: "50%",
        marginTop: -12,
    },
    arrow: {
        fontSize: 24,
        color: "#bdc3c7",
        fontWeight: "bold",
    },
    emptyContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 40,
    },
    emptyIcon: {
        fontSize: 80,
        marginBottom: 20,
        opacity: 0.5,
    },
    emptyTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#7f8c8d",
        marginBottom: 10,
        textAlign: "center",
    },
});