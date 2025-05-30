import React, { useState } from "react";
import { View, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { TextInput, Button, Text, Appbar } from "react-native-paper";
import { themKhachThue, useMyContextController } from "../../TrungTam";

const ThemKhachThue = ({ navigation }) => {
    const [controller, dispatch] = useMyContextController();
    const { userLogin } = controller;

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
        if (password.length < 6) {
            Alert.alert("Lỗi", "Mật khẩu phải có ít nhất 6 ký tự.");
            return;
        }
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phone)) {
            Alert.alert("Lỗi", "Số điện thoại phải đủ 10 chữ số.");
            return;
        }

        const result = await themKhachThue(dispatch, fullName, email, password, phone, address);
        if (result.success) {
            Alert.alert("Thành công", `Đã thêm khách thuê mới`);
            navigation.goBack();
        } else {
            Alert.alert("Lỗi", result.message || "Thêm khách thuê thất bại.");
        }
    };

    return (
        <>
            <Appbar.Header style={{ backgroundColor: "#343A40" }}>
                <Appbar.BackAction onPress={() => navigation.goBack()} color="#fff" />
                <Appbar.Content title="Thêm khách thuê mới" titleStyle={{ color: "#fff" }} />
            </Appbar.Header>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : null}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.container}>
                    <TextInput
                        label="Họ và tên"
                        value={fullName}
                        onChangeText={setFullName}
                        mode="outlined"
                        style={styles.input}
                        autoComplete="name"
                        returnKeyType="next"
                    />
                    <TextInput
                        label="Email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        mode="outlined"
                        style={styles.input}
                        autoComplete="email"
                        returnKeyType="next"
                    />
                    <TextInput
                        label="Mật khẩu"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        mode="outlined"
                        style={styles.input}
                        returnKeyType="next"
                    />
                    <TextInput
                        label="Số điện thoại"
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                        mode="outlined"
                        style={styles.input}
                        returnKeyType="next"
                    />
                    <TextInput
                        label="Địa chỉ"
                        value={address}
                        onChangeText={setAddress}
                        mode="outlined"
                        style={styles.input}
                        returnKeyType="done"
                    />

                    <Button
                        mode="contained"
                        onPress={handleAddChuTro}
                        style={styles.button}
                        contentStyle={{ paddingVertical: 8 }}
                    >
                        Thêm
                    </Button>
                </ScrollView>
            </KeyboardAvoidingView>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 24,
        paddingTop: 32,
        backgroundColor: "#fff",
        flexGrow: 1,
    },
    input: {
        marginBottom: 20,
        backgroundColor: "#fff",
    },
    button: {
        marginTop: 12,
        backgroundColor: "#343A40",
        borderRadius: 25,
        alignSelf: "center",
        width: "50%",
        elevation: 2,
    },
});

export default ThemKhachThue;
