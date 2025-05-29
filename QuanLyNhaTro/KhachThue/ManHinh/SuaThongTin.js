import React, { useState } from "react";
import { View, StyleSheet, Alert, ScrollView } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import firestore from "@react-native-firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { useMyContextController } from "../../TrungTam";

const SuaThongTin = ({ route }) => {
    const navigation = useNavigation();
    const { user } = route.params;
    const [controller, dispatch] = useMyContextController();
    const { userLogin } = controller;
    if (userLogin) {
        console.log(userLogin.user_id);
    } else {
        console.log("Chưa có userLogin");
    }
    const [fullName, setFullName] = useState(user.fullName || "");
    const [email, setEmail] = useState(user.email || "");
    const [phone, setPhone] = useState(user.phone || "");
    const [tenTro, setTenTro] = useState(user.tenTro || "");
    const [address, setAddress] = useState(user.address || "");

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
            Alert.alert("Thành công", "Đã cập nhật thông tin cá nhân.");
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
                keyboardType="phone-pad"
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

export default SuaThongTin;

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
