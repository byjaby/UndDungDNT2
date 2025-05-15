import React, { useState } from "react";
import { View, StyleSheet, Alert, ScrollView } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { useMyContextController, updateAdminInfo } from "../store";
import { useNavigation } from "@react-navigation/native";

const EditAdminProfile = ({ route }) => {
    const { admin } = route.params;
    console.log(admin);
    console.log("userId:", admin.user_id);
    const [controller, dispatch] = useMyContextController();
    const navigation = useNavigation();

    const [fullName, setFullName] = useState(admin.fullName);
    const [email, setEmail] = useState(admin.email);
    const [phone, setPhone] = useState(admin.phone);
    const [address, setAddress] = useState(admin.address);

    const handleSave = async () => {
        if (!fullName || !email || !phone || !address) {
            Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin.");
            return;
        }

        const updatedAdmin = {
            fullName,
            email,
            phone,
            address,
            updatedAt: new Date().toISOString(),
        };

        try {
            await updateAdminInfo(dispatch, admin.user_id, updatedAdmin); // Cập nhật vào Firestore
            // Sau khi cập nhật Firestore, dispatch lại thông tin mới vào context
            dispatch({
                type: "USER_LOGIN",
                value: { user_id: admin.user_id, ...updatedAdmin },
            });
            Alert.alert("Thành công", "Thông tin đã được cập nhật.");
            navigation.goBack();
        } catch (error) {
            Alert.alert("Lỗi", "Cập nhật thất bại.");
            console.error("Error updating admin:", error.message);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Chỉnh sửa thông tin cá nhân</Text>

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

            <Button mode="contained" onPress={handleSave} style={styles.button}>
                Lưu thay đổi
            </Button>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
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
    button: {
        marginTop: 20,
    },
});

export default EditAdminProfile;
