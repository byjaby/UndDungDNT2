import React, { useState } from "react";
import {
    View,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Alert,
} from "react-native";
import { Text } from "react-native-paper";
import firestore from "@react-native-firebase/firestore";
import { useFocusEffect } from "@react-navigation/native";
import { useMyContextController, loadThuePhong } from "../../TrungTam";

const DKPhong = () => {
    const [controller, dispatch] = useMyContextController();
    const { userLogin } = controller;
    const [requests, setRequests] = useState([]);

    const fetchRequests = async () => {
        try {
            const data = await loadThuePhong(dispatch, userLogin.user_id);

            const enriched = await Promise.all(
                data.map(async (item) => {
                    const khachSnapshot = await firestore()
                        .collection("KhachThue")
                        .doc(item.userId)
                        .get();
                    const phongSnapshot = await firestore()
                        .collection("Phong")
                        .doc(item.phongId)
                        .get();

                    return {
                        ...item,
                        khachThue: khachSnapshot.data() || {},
                        phong: phongSnapshot.data() || {},
                    };
                })
            );

            setRequests(enriched);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu thuê phòng:", error);
        }
    };

    const handleUpdateStatus = async (docId, status, phongId, userId) => {
        try {
            await firestore().collection("ThuePhong").doc(docId).update({
                trangThai: status,
            });

            if (status === "true") {
                await firestore().collection("Phong").doc(phongId).update({
                    nguoiThue: userId,
                    ngayThue: firestore.FieldValue.serverTimestamp(),
                    ngayTraPhong: "",
                });
            }

            Alert.alert("Thành công", `Đã cập nhật trạng thái: ${status === "true" ? "Chấp nhận" : "Từ chối"}`);
            fetchRequests();
        } catch (error) {
            Alert.alert("Lỗi", "Không thể cập nhật trạng thái: " + error.message);
            console.log(error.message);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            if (userLogin?.user_id) {
                fetchRequests();
            }
        }, [userLogin?.user_id])
    );

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Text style={styles.title}>Phòng: {item.phong?.tenPhong || "Không rõ"}</Text>
            <Text>Giá phòng: {item.phong?.giaPhong?.toLocaleString() || 0}đ</Text>
            <Text>Tên khách thuê: {item.khachThue?.fullName || "Không rõ"}</Text>
            <Text>SĐT: {item.khachThue?.phone || "Không rõ"}</Text>
            <Text>Địa chỉ: {item.khachThue?.address || "Không rõ"}</Text>
            <Text>
                Ngày đăng ký: {item.ngayDK ? item.ngayDK.toDate().toLocaleDateString("vi-VN") : "Không rõ"}
            </Text>
            {item.trangThai === "true" ? (
                <Text style={{ marginTop: 8, fontWeight: "bold", color: "green" }}>Đã chấp nhận</Text>
            ) : item.trangThai === "false" ? (
                <Text style={{ marginTop: 8, fontWeight: "bold", color: "red" }}>Đã từ chối</Text>
            ) : (
                <View style={styles.buttonGroup}>
                    <TouchableOpacity
                        style={styles.acceptButton}
                        onPress={() =>
                            handleUpdateStatus(item.id, "true", item.phongId, item.userId)
                        }
                    >
                        <Text style={styles.buttonText}>Chấp nhận</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.rejectButton}
                        onPress={() => handleUpdateStatus(item.id, "false")}
                    >
                        <Text style={styles.buttonText}>Từ chối</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            {requests.length > 0 ? (
                <>
                    <Text style={styles.headerText}>
                        Có {requests.length} yêu cầu đăng ký thuê phòng
                    </Text>
                    <FlatList
                        data={requests}
                        keyExtractor={(item) => item.id}
                        renderItem={renderItem}
                    />
                </>
            ) : (
                <Text style={styles.emptyText}>Không có yêu cầu thuê phòng nào</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#fff",
    },
    headerText: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    emptyText: {
        fontSize: 16,
        textAlign: "center",
        marginTop: 20,
        color: "#888",
    },
    card: {
        backgroundColor: "#f9f9f9",
        borderRadius: 10,
        padding: 16,
        marginBottom: 12,
        elevation: 3,
    },
    title: { fontSize: 16, fontWeight: "bold", marginBottom: 4 },
    buttonGroup: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 12,
    },
    acceptButton: {
        backgroundColor: "#4CAF50",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 6,
    },
    rejectButton: {
        backgroundColor: "#F44336",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 6,
    },
    buttonText: { color: "white", fontWeight: "bold" },
});

export default DKPhong;
