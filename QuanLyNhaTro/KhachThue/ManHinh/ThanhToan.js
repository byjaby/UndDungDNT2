import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import firestore from "@react-native-firebase/firestore";
import { useMyContextController } from "../../TrungTam";

const ThanhToan = () => {
    const [controller] = useMyContextController();
    const { userLogin } = controller;
    const route = useRoute();
    const { tienPhongData } = route.params || {};
    const navigation = useNavigation();
    const [bankInfo, setBankInfo] = useState(null);

    useEffect(() => {
        const fetchBankInfo = async () => {
            try {
                const bankSnap = await firestore()
                    .collection("TheNganHang")
                    .where("creator", "==", tienPhongData.creator)
                    .limit(1)
                    .get();

                if (!bankSnap.empty) {
                    setBankInfo(bankSnap.docs[0].data());
                }
            } catch (error) {
                console.log("Lỗi khi lấy thông tin ngân hàng:", error);
            }
        };

        if (tienPhongData?.creator) {
            fetchBankInfo();
        }
    }, [tienPhongData]);

    const handleConfirmPayment = () => {
        Alert.alert(
            "Xác nhận thanh toán",
            "Bạn đã chuyển tiền cho chủ trọ chưa?",
            [
                {
                    text: "Hủy",
                    style: "cancel",
                },
                {
                    text: "Xác nhận",
                    onPress: async () => {
                        try {
                            // Tìm bản ghi LichSuGiaoDich theo tienPhongId
                            const snapshot = await firestore()
                                .collection("LichSuGiaoDich")
                                .where("tienPhongId", "==", tienPhongData.id)
                                .limit(1)
                                .get();

                            if (!snapshot.empty) {
                                // Lấy document đầu tiên
                                const doc = snapshot.docs[0];
                                const docRef = doc.ref;

                                // Cập nhật trangThai và thoiGian
                                await docRef.update({
                                    trangThai: "true",
                                    thoiGian: firestore.FieldValue.serverTimestamp(),
                                });

                                // Thêm bản ghi vào LichSuThanhToan
                                await firestore()
                                    .collection("LichSuThanhToan")
                                    .add({
                                        giaoDichId: doc.id,
                                        idNguoiThanhToan: userLogin.user_id,
                                        ngayThanhToan: firestore.FieldValue.serverTimestamp(),
                                    });

                                Alert.alert("Thành công", "Đã xác nhận thanh toán.");
                                navigation.navigate("TrangChu");
                            } else {
                                Alert.alert("Lỗi", "Không tìm thấy lịch sử giao dịch để cập nhật.");
                            }
                        } catch (error) {
                            Alert.alert("Lỗi", "Không thể cập nhật lịch sử giao dịch: " + error.message);
                        }
                    }
                },
            ]
        );
    };

    if (!tienPhongData) {
        return (
            <View style={styles.container}>
                <Text style={styles.warningText}>Không có dữ liệu tiền phòng.</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Chi tiết tiền phòng</Text>
            <View style={styles.section}>
                <Text>Phòng: {tienPhongData.tenPhong}</Text>
                <Text>Người thuê: {tienPhongData.tenNguoiThue}</Text>
                <Text>Chỉ số điện: {tienPhongData.chiSoDienCu} → {tienPhongData.chiSoDienMoi}</Text>
                <Text>Chỉ số nước: {tienPhongData.chiSoNuocCu} → {tienPhongData.chiSoNuocMoi}</Text>
                <Text>Tiền dịch vụ: {tienPhongData.tienDichVu.toLocaleString()}đ</Text>
                <Text style={styles.totalAmount}>
                    Tổng tiền: {tienPhongData.tongTien.toLocaleString()}đ
                </Text>
            </View>

            {bankInfo ? (
                <View style={styles.bankInfo}>
                    <Text style={styles.paymentTitle}>Thông tin thẻ ngân hàng chủ trọ:</Text>
                    <Text>Ngân hàng: {bankInfo.tenNganHang}</Text>
                    <Text>Họ tên: {bankInfo.hoTen}</Text>
                    <Text>Số thẻ: {bankInfo.soThe}</Text>
                    <Text style={styles.totalAmount}>Hướng dẫn: Người dùng chuyển khoản vào tài khoản chủ trọ rồi sau đó bấm "Xác nhận đã thanh toán".</Text>
                </View>
            ) : (
                <Text style={styles.warningText}>
                    Không tìm thấy thông tin thẻ ngân hàng của chủ trọ.
                </Text>
            )}

            <TouchableOpacity
                style={[styles.button, { backgroundColor: "#4CAF50" }]}
                onPress={handleConfirmPayment}
            >
                <Text style={styles.buttonText}>Xác nhận đã thanh toán</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingLeft: 16,
        paddingRight: 16,
        paddingBottom: 16,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 16,
    },
    section: {
        marginBottom: 20,
    },
    totalAmount: {
        fontWeight: "bold",
        color: "green",
        fontSize: 16,
        marginTop: 8,
        textAlign: "justify"
    },
    paymentTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginVertical: 12,
    },
    button: {
        padding: 12,
        borderRadius: 8,
        marginTop: 20,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
    },
    warningText: {
        textAlign: "center",
        marginTop: 50,
        fontStyle: "italic",
        color: "#999",
    },
    bankInfo: {
        backgroundColor: "#f0f0f0",
        padding: 12,
        borderRadius: 8,
        marginTop: 10,
    },
});

export default ThanhToan;
