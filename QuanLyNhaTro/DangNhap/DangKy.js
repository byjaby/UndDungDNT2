import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, StatusBar, Alert } from 'react-native';
import { Button, HelperText, TextInput, ActivityIndicator } from "react-native-paper";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import React from 'react';
import { useMyContextController, dangKy } from '../TrungTam';

const DangKy = ({ navigation }) => {
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
            const result = await dangKy(dispatch, fullName, email, password, phone, address);
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
                {/* Logo hoặc biểu tượng app */}
                <View style={styles.logoContainer}>
                    <Image
                        source={{ uri: 'https://via.placeholder.com/150' }}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </View>

                {/* Tiêu đề đăng ký */}
                <Text style={styles.headerText}>Tạo tài khoản mới</Text>
                <Text style={styles.subHeaderText}>Vui lòng hoàn thành thông tin bên dưới</Text>

                {/* Form đăng ký */}
                <View style={styles.formContainer}>
                    {/* Họ và tên */}
                    <View style={styles.inputContainer}>
                        <View style={styles.inputIconContainer}>
                            <MaterialIcons name="person" size={20} color="#666" />
                        </View>
                        <TextInput
                            style={styles.input}
                            label="Họ và tên"
                            value={fullName}
                            onChangeText={setFullName}
                            mode="outlined"
                            outlineColor="#e0e0e0"
                            activeOutlineColor="#e91e63"
                            contentStyle={styles.inputContent}
                            theme={{ roundness: 10 }}
                        />
                    </View>
                    <HelperText type="error" visible={submitted && !isFullNameValid()}>
                        Họ tên không được để trống
                    </HelperText>

                    {/* Email */}
                    <View style={styles.inputContainer}>
                        <View style={styles.inputIconContainer}>
                            <MaterialIcons name="email" size={20} color="#666" />
                        </View>
                        <TextInput
                            style={styles.input}
                            label="Địa chỉ email"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            mode="outlined"
                            outlineColor="#e0e0e0"
                            activeOutlineColor="#e91e63"
                            contentStyle={styles.inputContent}
                            theme={{ roundness: 10 }}
                        />
                    </View>
                    <HelperText type="error" visible={submitted && !isEmailValid()}>
                        Email không hợp lệ
                    </HelperText>

                    {/* Mật khẩu */}
                    <View style={styles.inputContainer}>
                        <View style={styles.inputIconContainer}>
                            <MaterialIcons name="lock" size={20} color="#666" />
                        </View>
                        <TextInput
                            style={styles.input}
                            label="Mật khẩu"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={hiddenPassword}
                            mode="outlined"
                            outlineColor="#e0e0e0"
                            activeOutlineColor="#e91e63"
                            contentStyle={styles.inputContent}
                            theme={{ roundness: 10 }}
                            right={
                                <TextInput.Icon
                                    icon={hiddenPassword ? "eye" : "eye-off"}
                                    onPress={() => setHiddenPassword(!hiddenPassword)}
                                    color="#666"
                                />
                            }
                        />
                    </View>
                    <HelperText type="error" visible={submitted && !isPasswordValid()}>
                        Mật khẩu phải có ít nhất 6 ký tự
                    </HelperText>

                    {/* Xác nhận mật khẩu */}
                    <View style={styles.inputContainer}>
                        <View style={styles.inputIconContainer}>
                            <MaterialIcons name="lock" size={20} color="#666" />
                        </View>
                        <TextInput
                            style={styles.input}
                            label="Nhập lại mật khẩu"
                            value={passwordConfirm}
                            onChangeText={setPasswordConfirm}
                            secureTextEntry={hiddenPasswordConfirm}
                            mode="outlined"
                            outlineColor="#e0e0e0"
                            activeOutlineColor="#e91e63"
                            contentStyle={styles.inputContent}
                            theme={{ roundness: 10 }}
                            right={
                                <TextInput.Icon
                                    icon={hiddenPasswordConfirm ? "eye" : "eye-off"}
                                    onPress={() => setHiddenPasswordConfirm(!hiddenPasswordConfirm)}
                                    color="#666"
                                />
                            }
                        />
                    </View>
                    <HelperText type="error" visible={submitted && !isPasswordConfirmValid()}>
                        Mật khẩu xác nhận không khớp
                    </HelperText>

                    {/* Số điện thoại */}
                    <View style={styles.inputContainer}>
                        <View style={styles.inputIconContainer}>
                            <MaterialIcons name="phone" size={20} color="#666" />
                        </View>
                        <TextInput
                            style={styles.input}
                            label="Số điện thoại"
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="phone-pad"
                            mode="outlined"
                            outlineColor="#e0e0e0"
                            activeOutlineColor="#e91e63"
                            contentStyle={styles.inputContent}
                            theme={{ roundness: 10 }}
                        />
                    </View>
                    <HelperText type="error" visible={submitted && !isPhoneValid()}>
                        Số điện thoại phải gồm đúng 10 số
                    </HelperText>

                    {/* Địa chỉ */}
                    <View style={styles.inputContainer}>
                        <View style={styles.inputIconContainer}>
                            <MaterialIcons name="home" size={20} color="#666" />
                        </View>
                        <TextInput
                            style={styles.input}
                            label="Địa chỉ"
                            value={address}
                            onChangeText={setAddress}
                            mode="outlined"
                            outlineColor="#e0e0e0"
                            activeOutlineColor="#e91e63"
                            contentStyle={styles.inputContent}
                            theme={{ roundness: 10 }}
                        />
                    </View>
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
                            Tạo tài khoản
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
        flex: 1,
        backgroundColor: '#ffffff',
    },
    scrollContainer: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 10,
    },
    logo: {
        width: 80,
        height: 80,
        borderRadius: 40,
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
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: -5,
    },
    inputIconContainer: {
        position: 'absolute',
        left: 12,
        zIndex: 1,
        height: '100%',
        justifyContent: 'center',
        paddingTop: 15,
    },
    input: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    inputContent: {
        paddingLeft: 35,
    },
    loading: {
        marginVertical: 20,
    },
    registerButton: {
        marginTop: 20,
        marginBottom: 20,
        borderRadius: 8,
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
        marginTop: 10,
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
export default DangKy;
