import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

const ThanhToan = () => {
    const route = useRoute();
    const { tienPhongData } = route.params || {};
    const navigation = useNavigation();
    const handlePayment = async (method) => {
        if (method === "VNPay") {
            try {
                const response = await fetch('http://192.168.1.9:3000/api/create-vnpay-url', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        amount: tienPhongData.tongTien,
                        description: `Thanh toán tiền phòng ${tienPhongData.tenPhong}`,
                    }),
                });
                const result = await response.json();
                console.log('👉 payment_url từ server:', result.payment_url);
                if (result.payment_url) {
                    navigation.navigate('VNPayWebView', {
                        paymentUrl: result.payment_url,
                    });
                } else {
                    Alert.alert('Lỗi', 'Không lấy được URL thanh toán từ server.');
                }
            } catch (error) {
                console.error(error);
                Alert.alert('Lỗi', 'Không kết nối được tới máy chủ.');
            }
        } else {
            Alert.alert("Thanh toán", `Bạn đã chọn thanh toán bằng ${method}`);
        }
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

            <Text style={styles.paymentTitle}>Chọn phương thức thanh toán:</Text>
            <TouchableOpacity
                style={styles.button}
                onPress={() => handlePayment("VNPay")}
            >
                <Text style={styles.buttonText}>VNPay</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.button}
                onPress={() => handlePayment("NganHang")}
            >
                <Text style={styles.buttonText}>Ngân hàng</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.button}
                onPress={() => handlePayment("Momo")}
            >
                <Text style={styles.buttonText}>Momo</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.button}
                onPress={() => handlePayment("ZaloPay")}
            >
                <Text style={styles.buttonText}>ZaloPay</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.button}
                onPress={() => handlePayment("Visa")}
            >
                <Text style={styles.buttonText}>Visa / Mastercard</Text>
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
    },
    paymentTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginVertical: 12,
    },
    button: {
        backgroundColor: "#1976D2",
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
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
});

export default ThanhToan;
