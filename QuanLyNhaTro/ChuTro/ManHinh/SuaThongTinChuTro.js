import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert, ScrollView } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import firestore from "@react-native-firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { useMyContextController } from "../../TrungTam";

const SuaThongTinChuTro = ({ route }) => {
    const navigation = useNavigation();
    const { user } = route.params;
    const [controller, dispatch] = useMyContextController();
    const { userLogin } = controller;

    const [fullName, setFullName] = useState(user.fullName || "");
    const [email, setEmail] = useState(user.email || "");
    const [phone, setPhone] = useState(user.phone || "");
    const [tenTro, setTenTro] = useState(user.tenTro || "");
    const [address, setAddress] = useState(user.address || "");
    const [tenNganHang, setTenNganHang] = useState(user.tenNganHang || "");
    const [hoTen, setHoTen] = useState(user.hoTen || "");
    const [soThe, setSoThe] = useState(user.soThe || "");
    const [bankDocId, setBankDocId] = useState(null);

    useEffect(() => {
        const fetchBankInfo = async () => {
            try {
                const snapshot = await firestore()
                    .collection("TheNganHang")
                    .where("creator", "==", userLogin.user_id)
                    .limit(1)
                    .get();

                if (!snapshot.empty) {
                    const doc = snapshot.docs[0];
                    const data = doc.data();
                    setBankDocId(doc.id);
                    setTenNganHang(data.tenNganHang || "");
                    setHoTen(data.hoTen || "");
                    setSoThe(data.soThe || "");
                }
            } catch (error) {
                console.error("Lỗi khi lấy thông tin ngân hàng:", error);
            }
        };

        fetchBankInfo();
    }, [userLogin.user_id]);

    const handleSave = async () => {
        if (!fullName.trim()) {
            Alert.alert("Lỗi", "Vui lòng nhập họ tên.");
            return;
        }

        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phone)) {
            Alert.alert("Lỗi", "Số điện thoại phải đủ 10 chữ số.");
            return;
        }

        try {
            if (soThe) {
                const soTheSnapshot = await firestore()
                    .collection("TheNganHang")
                    .where("soThe", "==", soThe)
                    .get();

                const isDuplicate = soTheSnapshot.docs.some(doc => doc.id !== bankDocId);

                if (isDuplicate) {
                    Alert.alert("Lỗi", "Số thẻ này đã được sử dụng. Vui lòng nhập số khác.");
                    return;
                }
            }
            // Cập nhật thông tin chủ trọ
            await firestore().collection("ChuTro").doc(user.user_id).update({
                fullName,
                email,
                phone,
                tenTro,
                address
            });

            dispatch({
                type: "SET_USER_LOGIN",
                value: {
                    ...user,
                    fullName,
                    email,
                    phone,
                    tenTro,
                    address
                }
            });

            // Thêm hoặc cập nhật thông tin ngân hàng
            if (tenNganHang && hoTen && soThe) {
                if (bankDocId) {
                    // Cập nhật nếu đã tồn tại
                    await firestore().collection("TheNganHang").doc(bankDocId).update({
                        tenNganHang,
                        hoTen,
                        soThe
                    });
                } else {
                    // Thêm mới
                    await firestore().collection("TheNganHang").add({
                        tenNganHang,
                        hoTen,
                        soThe,
                        creator: userLogin.user_id,
                        createdAt: firestore.FieldValue.serverTimestamp()
                    });
                }
            }

            Alert.alert("Thành công", "Đã cập nhật thông tin.");
            navigation.navigate("HoSo");
        } catch (error) {
            Alert.alert("Lỗi", "Không thể lưu: " + error.message);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TextInput
                label="Họ tên"
                value={fullName}
                onChangeText={setFullName}
                mode="outlined"
                style={styles.input}
            />

            <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                mode="outlined"
                keyboardType="email-address"
                style={styles.input}
            />

            <TextInput
                label="Số điện thoại"
                value={phone}
                onChangeText={setPhone}
                mode="outlined"
                keyboardType="phone-pad"
                style={styles.input}
            />

            <TextInput
                label="Tên trọ"
                value={tenTro}
                onChangeText={setTenTro}
                mode="outlined"
                style={styles.input}
            />

            <TextInput
                label="Địa chỉ"
                value={address}
                onChangeText={setAddress}
                mode="outlined"
                multiline
                style={[styles.input, { height: 80 }]}
            />

            <Text style={styles.sectionTitle}>Thông tin ngân hàng</Text>

            <TextInput
                label="Tên ngân hàng"
                value={tenNganHang}
                onChangeText={setTenNganHang}
                mode="outlined"
                style={styles.input}
            />
            <TextInput
                label="Họ tên chủ tài khoản"
                value={hoTen}
                onChangeText={setHoTen}
                mode="outlined"
                style={styles.input}
            />
            <TextInput
                label="Số thẻ"
                value={soThe}
                onChangeText={setSoThe}
                mode="outlined"
                keyboardType="numeric"
                style={styles.input}
            />

            <Button
                mode="contained"
                onPress={handleSave}
                style={styles.button}
                icon="content-save"
            >
                Lưu
            </Button>
        </ScrollView>
    );
};

export default SuaThongTinChuTro;

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        alignSelf: "center",
        color: "#3f51b5",
    },
    input: {
        marginBottom: 16,
    },
    button: {
        alignSelf: 'center',
        width: 100,
        marginTop: 20,
        backgroundColor: "#66E879",
    },
});
