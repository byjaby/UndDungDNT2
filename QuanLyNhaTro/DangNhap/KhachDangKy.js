import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, StatusBar, Alert } from 'react-native';
import { Button, HelperText, TextInput, ActivityIndicator } from "react-native-paper";
import React from 'react';
import { useMyContextController, khachDangKy } from '../TrungTam';

const KhachDangKy = ({ navigation }) => {
    const [controller, dispatch] = useMyContextController();

    const [fullName, setFullName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [passwordConfirm, setPasswordConfirm] = React.useState('');
    const [phone, setPhone] = React.useState('');
    const [address, setAddress] = React.useState('');
    const [hiddenPassword, setHiddenPassword] = React.useState(true);
    const [hiddenPasswordConfirm, setHiddenPasswordConfirm] = React.useState(true);
    const [submitted, setSubmitted] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const isFullNameValid = () => {
        return fullName.trim() !== '';
    };

    const isEmailValid = () => {
        return email.includes('@') && email.includes('.');
    };

    const isPasswordValid = () => {
        return password.length >= 6;
    };

    const isPasswordConfirmValid = () => {
        return password === passwordConfirm;
    };

    const isPhoneValid = () => {
        return phone.trim().length === 10 && /^\d+$/.test(phone);
    };

    const handleCreateAccount = async () => {
        setSubmitted(true);

        if (
            isFullNameValid() &&
            isEmailValid() &&
            isPasswordValid() &&
            isPasswordConfirmValid() &&
            isPhoneValid()
        ) {
            setLoading(true);
            const result = await khachDangKy(dispatch, fullName, email, password, phone, address);
            if (result.success) {
                Alert.alert("Thành công", "Tạo tài khoản thành công!");
                navigation.navigate("DangNhap");
            } else {
                Alert.alert("Lỗi", result.message);
                setLoading(false);
            }
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >

                {/* Tiêu đề đăng ký */}
                <Text style={styles.headerText}>Tạo tài khoản mới</Text>
                <Text style={styles.subHeaderText}>Vui lòng hoàn thành thông tin bên dưới</Text>

                {/* Form đăng ký */}
                <View style={styles.formContainer}>
                    {/* Họ và tên */}
                    <TextInput
                        style={styles.input}
                        label="Họ và tên"
                        value={fullName}
                        onChangeText={setFullName}
                        outlineColor="#e0e0e0"
                        activeOutlineColor="#e91e63"
                        contentStyle={styles.inputContent}
                        theme={{ roundness: 10 }}
                        left={<TextInput.Icon icon="account" color="#666" />}
                    />
                    <HelperText type="error" visible={submitted && !isFullNameValid()}>
                        Họ tên không được để trống
                    </HelperText>

                    {/* Email */}

                    <TextInput
                        style={styles.input}
                        label="Địa chỉ email"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        outlineColor="#e0e0e0"
                        activeOutlineColor="#e91e63"
                        contentStyle={styles.inputContent}
                        theme={{ roundness: 10 }}
                        left={<TextInput.Icon icon="email" color="#666" />}
                    />
                    <HelperText type="error" visible={submitted && !isEmailValid()}>
                        Email không hợp lệ
                    </HelperText>

                    {/* Mật khẩu */}
                    <TextInput
                        style={styles.input}
                        label="Mật khẩu"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={hiddenPassword}
                        outlineColor="#e0e0e0"
                        activeOutlineColor="#e91e63"
                        contentStyle={styles.inputContent}
                        theme={{ roundness: 10 }}
                        left={<TextInput.Icon icon="lock" color="#666" />}
                        right={
                            <TextInput.Icon
                                icon={hiddenPassword ? "eye" : "eye-off"}
                                onPress={() => setHiddenPassword(!hiddenPassword)}
                                color="#666"
                            />
                        }
                    />
                    <HelperText type="error" visible={submitted && !isPasswordValid()}>
                        Mật khẩu phải có ít nhất 6 ký tự
                    </HelperText>

                    {/* Xác nhận mật khẩu */}
                    <TextInput
                        style={styles.input}
                        label="Nhập lại mật khẩu"
                        value={passwordConfirm}
                        onChangeText={setPasswordConfirm}
                        secureTextEntry={hiddenPasswordConfirm}
                        outlineColor="#e0e0e0"
                        activeOutlineColor="#e91e63"
                        contentStyle={styles.inputContent}
                        theme={{ roundness: 10 }}
                        left={<TextInput.Icon icon="lock" color="#666" />}
                        right={
                            <TextInput.Icon
                                icon={hiddenPasswordConfirm ? "eye" : "eye-off"}
                                onPress={() => setHiddenPasswordConfirm(!hiddenPasswordConfirm)}
                                color="#666"
                            />
                        }
                    />
                    <HelperText type="error" visible={submitted && !isPasswordConfirmValid()}>
                        Mật khẩu xác nhận không khớp
                    </HelperText>

                    {/* Số điện thoại */}
                    <TextInput
                        style={styles.input}
                        label="Số điện thoại"
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                        outlineColor="#e0e0e0"
                        activeOutlineColor="#e91e63"
                        contentStyle={styles.inputContent}
                        theme={{ roundness: 10 }}
                        left={<TextInput.Icon icon="phone" color="#666" />}
                    />
                    <HelperText type="error" visible={submitted && !isPhoneValid()}>
                        Số điện thoại phải gồm đúng 10 số
                    </HelperText>

                    {/* Địa chỉ */}
                    <TextInput
                        style={styles.input}
                        label="Địa chỉ"
                        value={address}
                        onChangeText={setAddress}
                        outlineColor="#e0e0e0"
                        activeOutlineColor="#e91e63"
                        contentStyle={styles.inputContent}
                        theme={{ roundness: 10 }}
                        left={<TextInput.Icon icon="home" color="#666" />}
                    />
                    {loading ? (
                        <ActivityIndicator size="large" color="#e91e63" style={styles.loading} />
                    ) : (
                        <Button
                            mode="contained"
                            onPress={handleCreateAccount}
                            style={styles.registerButton}
                            contentStyle={styles.registerButtonContent}
                            buttonColor="#e91e63"
                            labelStyle={styles.buttonLabel}
                            android_ripple={{ color: 'rgba(255, 255, 255, 0.3)' }}
                        >
                            Đăng ký
                        </Button>
                    )}

                    {/* Đã có tài khoản */}
                    <View style={styles.loginContainer}>
                        <Text style={styles.loginText}>Bạn đã có tài khoản? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate("DangNhap")}>
                            <Text style={styles.loginLinkText}>Đăng nhập</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: 30,
        flex: 1,
        backgroundColor: '#D4C7B0',
    },
    scrollContainer: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingBottom: 40,
    },

    headerText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
    subHeaderText: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
        textAlign: 'center',
    },
    formContainer: {
        width: '100%',
    },
    input: {
        backgroundColor: '#fff',
    },
    loading: {
        marginVertical: 20,
    },
    registerButton: {
        alignSelf: 'center',
        width: 150,
        borderRadius: 12,

        marginTop: 20,
        marginBottom: 20,
        elevation: 3,
    },
    registerButtonContent: {
        height: 52,
    },
    buttonLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',

    },
    loginText: {
        color: '#666',
        fontSize: 16,
    },
    loginLinkText: {
        color: '#e91e63',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
export default KhachDangKy;
