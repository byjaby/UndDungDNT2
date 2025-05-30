import React, { useState, useCallback } from "react";
import { View, FlatList, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { Button, Text } from "react-native-paper";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import firestore from "@react-native-firebase/firestore";

const { width } = Dimensions.get('window');

const TroThue = ({ route }) => {
    const { user } = route.params;
    const navigation = useNavigation();
    const [phongDaThue, setPhongDaThue] = useState([]);

    useFocusEffect(
        useCallback(() => {
            const fetchThue = async () => {
                try {
                    const snapshot = await firestore()
                        .collection("LichSuThuePhong")
                        .where("nguoiThue", "==", user.user_id)
                        .get();

                    const phongPromises = snapshot.docs.map(async (doc) => {
                        const data = doc.data();
                        const phongId = data.phongId;
                        const chuTroId = data.creator;

                        // Lấy document Phong
                        const phongDoc = await firestore().collection("Phong").doc(phongId).get();

                        if (!phongDoc.exists) {
                            console.warn(`Phong ${phongId} không tồn tại`);
                            return null;
                        }

                        const phongData = phongDoc.data();

                        // Lấy trangThai kiểu boolean từ Phong
                        let trangThai;
                        if (data?.trangThai && data.trangThai.trim() === "Đã hủy") {
                            trangThai = data.trangThai ? "Đã hủy" : "Còn thuê";
                        } else {
                            trangThai = ""; // Nếu không có trường này hoặc không phải boolean
                        }

                        // Lấy dữ liệu chủ trọ
                        const chuTroDoc = await firestore().collection("ChuTro").doc(chuTroId).get();
                        const chuTroData = chuTroDoc.exists ? chuTroDoc.data() : {};

                        return {
                            id: phongId,
                            docId: doc.id,
                            tenPhong: phongData.tenPhong,
                            giaPhong: phongData.giaPhong,
                            tenTro: chuTroData.tenTro,
                            address: chuTroData.address,
                            trangThai,
                            fullName: chuTroData.fullName,
                            phone: chuTroData.phone,
                        };
                    });

                    const phongList = await Promise.all(phongPromises);
                    setPhongDaThue(phongList);
                } catch (err) {
                    console.log("Lỗi lấy danh sách phòng đã đăng ký:", err);
                }
            };

            if (user?.user_id) fetchThue();
        }, [user?.user_id])
    );

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={styles.iconContainer}>
                    <Text style={styles.iconText}>🏠</Text>
                </View>
                <View style={styles.cardContent}>
                    <Text style={styles.tenTro}>Tên trọ: {item.tenTro}</Text>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoText}>Phòng: {item.tenPhong}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoText}>Giá phòng: {item.giaPhong}</Text>
                    </View>
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
                <View style={styles.infoRow}>
                    <Text style={styles.infoIcon}>📄</Text>
                    <Text style={[styles.infoText, { fontStyle: "italic", color: item.trangThai === "Đã hủy" ? "#44D78D" : "#F9C557" }]}>
                        Trạng thái: {item.trangThai}
                    </Text>
                </View>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <Text style={styles.title}>Phòng trọ đã thuê</Text>
                    <View style={styles.countBadge}>
                        <Text style={styles.countText}>{phongDaThue.length}</Text>
                    </View>
                </View>
                <Text style={styles.subtitle}>
                    {phongDaThue.length > 0
                        ? `${phongDaThue.length} phòng trọ đã thuê`
                        : "Chưa thuê phòng trọ nào"}
                </Text>
            </View>

            {phongDaThue.length > 0 ? (
                <FlatList
                    data={phongDaThue}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyIcon}>📭</Text>
                    <Text style={styles.emptyTitle}>Bạn chưa thuê phòng trọ nào</Text>
                </View>
            )}
        </View>
    );
};

export default TroThue;

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
        color: "#415D43",
        fontWeight: "500",
    },
    listContainer: {
        paddingHorizontal: 15,
        paddingBottom: 20,
    },
    card: {
        backgroundColor: '#BC4B51',
        paddingTop: 20,
        paddingRight: 20,
        paddingLeft: 20,
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
        color: "#fff",
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
        color: "#fff",
        flex: 1,
        lineHeight: 22,
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
    button: {
        width: 120,
        backgroundColor: "#07C8F9",
        borderRadius: 25,
        padding: 10,
        marginBottom: 10,
        alignItems: "center",
        alignSelf: "center",
    },
    buttonText: {
        color: "#fff",
    }

});