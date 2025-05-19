import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const QuenMK = ({ navigation }) => {
    const [email, setEmail] = useState('');

    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handlePasswordReset = async () => {
        if (!email.trim()) {
            Alert.alert("Lỗi", "Vui lòng nhập email.");
            return;
        }

        if (!isValidEmail(email)) {
            Alert.alert("Lỗi", "Vui lòng nhập đúng định dạng email.");
            return;
        }

        try {
            const usersRef = firestore().collection('KhachThue');
            const querySnapshot = await usersRef
                .where('email', '==', email.trim())
                .where('id_loaiNguoiDung', '==', '2')  // 👈 Chỉ lọc loại người dùng có id = "2"
                .get();

            if (querySnapshot.empty) {
                Alert.alert("Lỗi", "Email không tồn tại hoặc không thuộc loại người dùng được phép.");
                return;
            }

            await auth().sendPasswordResetEmail(email.trim());
            Alert.alert("Thành công", "Email khôi phục mật khẩu đã được gửi.");
            navigation.navigate('DangNhap');
        } catch (error) {
            Alert.alert("Lỗi", error.message);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <View style={styles.card}>
                <Text style={styles.title}>Khôi phục mật khẩu</Text>
                <Text style={styles.subtitle}>
                    Nhập email đã đăng ký để nhận liên kết đặt lại mật khẩu
                </Text>

                <TextInput
                    style={styles.input}
                    placeholder="example@email.com"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor="#aaa"
                />

                <TouchableOpacity style={styles.button} onPress={handlePasswordReset}>
                    <Text style={styles.buttonText}>Gửi liên kết</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backText}>← Quay lại đăng nhập</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffe4e6', // hồng nhạt
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    card: {
        backgroundColor: '#fff',
        width: '100%',
        borderRadius: 16,
        padding: 25,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#d6336c',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: '#555',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 15,
        fontSize: 16,
        marginBottom: 20,
        color: '#000',
    },
    button: {
        backgroundColor: '#d6336c',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 12,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    backText: {
        color: '#d6336c',
        textAlign: 'center',
        fontSize: 14,
    },
});

export default QuenMK;
