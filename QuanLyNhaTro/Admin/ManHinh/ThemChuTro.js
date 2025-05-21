import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { themChuTro, useMyContextController } from "../../TrungTam";

const ThemChuTro = ({ navigation }) => {
    const [controller, dispatch] = useMyContextController();
    const { userLogin } = controller;
    if (userLogin) {
        console.log(userLogin.user_id);
    } else {
        console.log("Chưa có userLogin");
    }
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [password, setPassword] = useState("");

    const handleAddChuTro = async () => {
        if (!fullName || !email || !phone || !address || !password) {
            Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin.");
            return;
        }
        // Kiểm tra độ dài mật khẩu
        if (password.length < 6) {
            Alert.alert("Lỗi", "Mật khẩu phải có ít nhất 6 ký tự.");
            return;
        }

        // Kiểm tra số điện thoại phải có đúng 10 chữ số
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phone)) {
            Alert.alert("Lỗi", "Số điện thoại phải đủ 10 chữ số.");
            return;
        }

        const creatorId = userLogin?.user_id || null;

        const result = await themChuTro(dispatch, fullName, email, password, phone, address, creatorId);
        if (result.success) {
            Alert.alert("Thành công", `Đã thêm Chủ trọ mới`);
            navigation.goBack();
        } else {
            Alert.alert("Lỗi", result.message || "Thêm Chủ trọ thất bại.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Thêm Chủ trọ mới</Text>
            <TextInput
                label="Họ và tên"
                value={fullName}
                onChangeText={setFullName}
                mode="outlined"
                style={styles.input}
            />
            <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                mode="outlined"
                style={styles.input}
            />
            <TextInput
                label="Mật khẩu"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                mode="outlined"
                style={styles.input}
            />
            <TextInput
                label="Số điện thoại"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                mode="outlined"
                style={styles.input}
            />
            <TextInput
                label="Địa chỉ"
                value={address}
                onChangeText={setAddress}
                mode="outlined"
                style={styles.input}
            />
            <Button
                mode="contained"
                style={{ marginTop: 20, width: 100, alignSelf: 'center', backgroundColor: '#343A40', fontWeight: 'bold' }}
                onPress={handleAddChuTro}
            >
                Thêm
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        flex: 1,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    input: {
        marginBottom: 16,
    },
});

export default ThemChuTro;
