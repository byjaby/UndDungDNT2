import React, { useState, useCallback } from "react";
import { View, FlatList, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { Button, Text } from "react-native-paper";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import firestore from "@react-native-firebase/firestore";

const { width } = Dimensions.get('window');

const TroDK = ({ route }) => {
    const { user } = route.params;
    const navigation = useNavigation();
    const [phongDaDangKy, setPhongDaDangKy] = useState([]);
    const handleCancelRegistration = async (docId) => {
        try {
            await firestore().collection("ThuePhong").doc(docId).update({
                trangThai: "false",
            });

            // Cập nhật lại danh sách phòng đã đăng ký sau khi hủy
            setPhongDaDangKy((prev) =>
                prev.map((item) =>
                    item.docId === docId ? { ...item, trangThai: "Đã hủy" } : item
                )
            );
        } catch (error) {
            console.error("Lỗi khi hủy đăng ký:", error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            const fetchDangKy = async () => {
                try {
                    const snapshot = await firestore()
                        .collection("ThuePhong")
                        .where("userId", "==", user.user_id)
                        .get();

                    const phongPromises = snapshot.docs.map(async (doc) => {
                        const data = doc.data();
                        const phongId = data.phongId;
                        const chuTroId = data.creator;
                        let trangThai;
                        if (typeof data.trangThai === "string") {
                            if (data.trangThai === "true") {
                                trangThai = "Đã duyệt";
                            } else if (data.trangThai === "false") {
                                trangThai = "Đã hủy";
                            } else {
                                trangThai = "Chờ duyệt"; // Chuỗi rỗng hoặc các giá trị khác
                            }
                        } else {
                            trangThai = "Chờ duyệt"; // Nếu không phải kiểu string
                        }

                        const phongDoc = await firestore().collection("Phong").doc(phongId).get();
                        const phongData = phongDoc.data();

                        const chuTroDoc = await firestore().collection("ChuTro").doc(chuTroId).get();
                        const chuTroData = chuTroDoc.data();
                        if (!phongDoc.exists) {
                            console.warn(`Phong ${phongId} không tồn tại`);
                            return null;
                        }
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
                    setPhongDaDangKy(phongList);
                } catch (err) {
                    console.log("Lỗi lấy danh sách phòng đã đăng ký:", err);
                }
            };

            if (user?.user_id) fetchDangKy();
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
                    <Text style={[styles.infoText, { fontStyle: "italic", color: item.trangThai === "Đã duyệt" ? "#44D78D" : "#F9C557" }]}>
                        Trạng thái: {item.trangThai}
                    </Text>
                </View>
            </View>

            {item.trangThai !== "Đã hủy" && item.trangThai !== "Đã duyệt" && (
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => handleCancelRegistration(item.docId)}
                >
                    <Text style={styles.buttonText}>Hủy đăng ký</Text>
                </TouchableOpacity>
            )}

        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <Text style={styles.title}>Phòng trọ đăng ký</Text>
                    <View style={styles.countBadge}>
                        <Text style={styles.countText}>{phongDaDangKy.length}</Text>
                    </View>
                </View>
                <Text style={styles.subtitle}>
                    {phongDaDangKy.length > 0
                        ? `${phongDaDangKy.length} phòng trọ đã đăng ký`
                        : "Chưa đăng ký phòng trọ nào"}
                </Text>
            </View>

            {phongDaDangKy.length > 0 ? (
                <FlatList
                    data={phongDaDangKy}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyIcon}>📭</Text>
                    <Text style={styles.emptyTitle}>Bạn chưa đăng ký phòng trọ nào</Text>
                </View>
            )}
        </View>
    );
};

export default TroDK;

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