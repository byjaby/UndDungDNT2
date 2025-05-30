import React, { useState } from "react";
import { View, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { TextInput, Button, Text, Appbar } from "react-native-paper";
import firestore from "@react-native-firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { useMyContextController } from "../../TrungTam";

const SuaKhachThue = ({ route }) => {
    const navigation = useNavigation();
    const { user } = route.params;
    const [controller, dispatch] = useMyContextController();

    const [fullName, setFullName] = useState(user.fullName || "");
    const [email, setEmail] = useState(user.email || "");
    const [phone, setPhone] = useState(user.phone || "");
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
            await firestore().collection("KhachThue").doc(user.id).update({
                fullName,
                email,
                phone,
                address,
            });

            Alert.alert("Thành công", "Đã cập nhật thông tin khách thuê.");
            navigation.navigate("DSKhachThue");
        } catch (error) {
            Alert.alert("Lỗi", "Không thể lưu: " + error.message);
        }
    };

    return (
        <>
            <Appbar.Header style={styles.appbar}>
                <Appbar.BackAction onPress={() => navigation.goBack()} color="#fff" />
                <Appbar.Content title="Chỉnh sửa khách thuê" titleStyle={styles.appbarTitle} />
            </Appbar.Header>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : null}
            >
                <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                    <TextInput
                        label="Họ tên"
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
                        mode="outlined"
                        keyboardType="email-address"
                        style={styles.input}
                        autoComplete="email"
                        returnKeyType="next"
                    />
                    <TextInput
                        label="Số điện thoại"
                        value={phone}
                        onChangeText={setPhone}
                        mode="outlined"
                        keyboardType="phone-pad"
                        style={styles.input}
                        returnKeyType="next"
                    />
                    <TextInput
                        label="Địa chỉ"
                        value={address}
                        onChangeText={setAddress}
                        mode="outlined"
                        multiline
                        style={[styles.input, { height: 90 }]}
                        returnKeyType="done"
                    />

                    <Button
                        mode="contained"
                        onPress={handleSave}
                        style={styles.button}
                        contentStyle={{ paddingVertical: 10 }}
                        icon="content-save"
                    >
                        Lưu
                    </Button>
                </ScrollView>
            </KeyboardAvoidingView>
        </>
    );
};

const styles = StyleSheet.create({
    appbar: {
        backgroundColor: "#4A90E2",
    },
    appbarTitle: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 20,
    },
    container: {
        padding: 24,
        backgroundColor: "#f9fafd",
        flexGrow: 1,
    },
    input: {
        marginBottom: 18,
        backgroundColor: "#fff",
        borderRadius: 6,
    },
    button: {
        backgroundColor: "#4A90E2",
        borderRadius: 8,
        alignSelf: "center",
        width: "50%",
        elevation: 3,
        marginTop: 12,
    },
});

export default SuaKhachThue;
