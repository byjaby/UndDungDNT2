import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const ForgotPassword = ({ navigation }) => {
    const [email, setEmail] = useState('');

    const isValidEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handlePasswordReset = async () => {
        if (!email) {
            Alert.alert("Lỗi", "Vui lòng nhập email.");
            return;
        }

        if (!isValidEmail(email)) {
            Alert.alert("Lỗi", "Vui lòng nhập đúng định dạng email.");
            return;
        }

        try {
            // 🔍 Kiểm tra xem email có trong collection USERS không
            const usersRef = firestore().collection('USERS');
            const querySnapshot = await usersRef.where('email', '==', email).get();

            if (querySnapshot.empty) {
                Alert.alert("Lỗi", "Email chưa được đăng ký trong hệ thống.");
                return;
            }

            await auth().sendPasswordResetEmail(email);
            Alert.alert("Thành công", "Email khôi phục mật khẩu đã được gửi.");
            navigation.navigate('Login');
        } catch (error) {
            Alert.alert("Lỗi", error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Quên Mật Khẩu</Text>
            <TextInput
                style={styles.input}
                placeholder="Nhập email của bạn"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TouchableOpacity style={styles.button} onPress={handlePasswordReset}>
                <Text style={styles.buttonText}>Gửi Email</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.backText}>← Quay lại đăng nhập</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    backText: {
        color: '#007AFF',
        textAlign: 'center',
        marginTop: 10,
    },
});

export default ForgotPassword;
