import { View, StatusBar, Text, TouchableOpacity, StyleSheet, Image, ScrollView, ActivityIndicator } from "react-native";
import { Button, HelperText, TextInput } from "react-native-paper";
import { dangNhap, useMyContextController } from "../TrungTam";
import React, { useEffect } from "react";
import firestore from "@react-native-firebase/firestore";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const DangNhap = ({ navigation }) => {
    const [controller, dispatch] = useMyContextController();
    const { userLogin } = controller;

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [hiddenPassword, setHiddenPassword] = React.useState(true);
    const [loginError, setLoginError] = React.useState('');
    const [loading, setLoading] = React.useState(true);

    const hasErrorEmail = () => {
        return email.trim() !== '' && (!email.includes('@') || !email.includes('.'));
    };

    const hasErrorPassword = () => {
        return password.trim() !== '' && password.length < 6;
    };

    const handleLogin = async () => {
        if (email.trim() === '') {
            setLoginError('Vui lòng nhập email');
            return;
        }

        if (password.trim() === '') {
            setLoginError('Vui lòng nhập mật khẩu');
            return;
        }

        if (hasErrorEmail()) {
            setLoginError('Email không hợp lệ');
            return;
        }

        if (hasErrorPassword()) {
            setLoginError('Mật khẩu phải từ 6 ký tự trở lên');
            return;
        }

        try {
            const result = await dangNhap(dispatch, email, password);
            if (!result.success) {
                setLoginError(result.message || "Email hoặc mật khẩu không đúng");
            }
        } catch (err) {
            setLoginError("Đã xảy ra lỗi. Vui lòng thử lại sau.");
        }
    };

    useEffect(() => {
        const fetchLoaiNguoiDung = async () => {
            if (userLogin && userLogin.id_loaiNguoiDung) {
                try {
                    const loaiNguoiDungDoc = await firestore()
                        .collection("LoaiNguoiDung")
                        .doc(userLogin.id_loaiNguoiDung)
                        .get();

                    if (loaiNguoiDungDoc.exists) {
                        const data = loaiNguoiDungDoc.data();
                        const tenLoai = data?.tenLoai;

                        console.log("Loại người dùng:", tenLoai);

                        setTimeout(() => {
                            setLoading(false);

                            if (tenLoai === "Admin") {
                                navigation.reset({ index: 0, routes: [{ name: "MenuAdmin" }] });
                            } else if (tenLoai === "Khách thuê") {
                                navigation.reset({ index: 0, routes: [{ name: "TrangChuKhachThue" }] });
                            } else if (tenLoai === "Chủ trọ") {
                                navigation.reset({ index: 0, routes: [{ name: "MenuChuTro" }] });
                            } else {
                                console.log("Loại người dùng không hợp lệ:", tenLoai);
                            }
                        }, 1000); // Delay 1s
                    } else {
                        console.log("Không tìm thấy loại người dùng.");
                        setLoading(false);
                    }
                } catch (error) {
                    console.log("Lỗi khi truy vấn loại người dùng:", error);
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        fetchLoaiNguoiDung();
    }, [userLogin]);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color="#6200ee" />
            </View>
        );
    }
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
                        source={require('../HinhAnh/logo.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </View>

                {/* Tiêu đề trang */}
                <Text style={styles.headerText}>QUẢN LÝ NHÀ TRỌ</Text>
                <Text style={styles.subHeaderText}>Chào mừng bạn quay trở lại!</Text>

                {/* Form đăng nhập */}
                <View style={styles.formContainer}>
                    <TextInput
                        label="Địa chỉ email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        outlineColor="#e0e0e0"
                        activeOutlineColor="#3f51b5"
                        theme={{ roundness: 10 }}
                        left={<TextInput.Icon icon="email" />}
                        style={{ backgroundColor: 'white' }}
                    />

                    <HelperText type="error" visible={hasErrorEmail()}>
                        {email.trim() === "" ? "Vui lòng nhập Email" : "Email không hợp lệ"}
                    </HelperText>
                    <TextInput
                        label="Mật khẩu"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={hiddenPassword}
                        outlineColor="#e0e0e0"
                        activeOutlineColor="#3f51b5"
                        theme={{ roundness: 10 }}
                        left={<TextInput.Icon icon="lock" />}
                        right={
                            <TextInput.Icon
                                icon={hiddenPassword ? "eye" : "eye-off"}
                                onPress={() => setHiddenPassword(!hiddenPassword)}
                            />
                        }
                        style={{ backgroundColor: 'white' }}
                    />

                    <HelperText type="error" visible={hasErrorPassword()}>
                        Mật khẩu phải từ 6 ký tự trở lên
                    </HelperText>

                    {/* Thêm nút quên mật khẩu */}
                    <TouchableOpacity
                        style={styles.forgotPasswordContainer}
                        onPress={() => navigation.navigate('QuenMK')}
                    >
                        <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
                    </TouchableOpacity>

                    {/* Hiển thị lỗi đăng nhập */}
                    {loginError !== "" && (
                        <HelperText type="error" visible={true} style={styles.errorMessage}>
                            {loginError}
                        </HelperText>
                    )}

                    {/* Nút đăng nhập */}
                    <Button
                        mode="contained"
                        onPress={handleLogin}
                        style={styles.loginButton}
                        contentStyle={styles.loginButtonContent}
                        buttonColor="#3f51b5"
                        labelStyle={styles.buttonLabel}
                        android_ripple={{ color: 'rgba(255, 255, 255, 0.3)' }}
                    >
                        Đăng nhập
                    </Button>

                    <View style={styles.orContainer}>
                        <View style={styles.divider} />
                        <Text style={styles.orText}>Hoặc đăng nhập với</Text>
                        <View style={styles.divider} />
                    </View>

                    <View style={styles.socialButtonsContainer}>
                        <TouchableOpacity
                            style={[styles.socialButton, { backgroundColor: '#DB4437' }]}
                            android_ripple={{ color: 'rgba(255, 255, 255, 0.3)' }}
                        >
                            <MaterialCommunityIcons name="google" size={24} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.socialButton, { backgroundColor: '#000000' }]}
                            android_ripple={{ color: 'rgba(255, 255, 255, 0.3)' }}
                        >
                            <MaterialCommunityIcons name="cellphone" size={24} color="white" />
                        </TouchableOpacity>
                    </View>

                    {/* Phần đăng ký */}
                    <View style={styles.registerContainer}>
                        <Text style={styles.registerText}>Bạn chưa có tài khoản? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate("ChonDangKy")}>
                            <Text style={styles.registerLinkText}>Tạo tài khoản</Text>
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
        backgroundColor: '#D4C7B0',
    },
    scrollContainer: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 10,
        paddingBottom: 10,
    },
    logoContainer: {
        alignItems: 'center',
    },
    logo: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: '#e0e0e0',
    },
    headerText: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#2c3e50',
        textAlign: 'center',
        marginTop: 10,
    },
    subHeaderText: {
        fontSize: 16,
        color: '#7f8c8d',
        textAlign: 'center',
        marginBottom: 10,
    },
    formContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 10,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },

    forgotPasswordContainer: {
        alignSelf: 'flex-end',
        marginTop: 5,
        marginBottom: 15,
    },
    forgotPasswordText: {
        color: '#1A8FE3',
        fontWeight: 'bold',
    },
    errorMessage: {
        textAlign: 'center',
        marginBottom: 5,
    },
    loginButton: {
        backgroundColor: '#774936',
        alignSelf: 'center',
        width: 150,
        borderRadius: 12,
        elevation: 2,
    },
    loginButtonContent: {
        height: 52,
    },
    buttonLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 0.5,
        color: '#fff',
    },
    orContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: '#dcdde1',
    },
    orText: {
        paddingHorizontal: 10,
        fontSize: 16,
    },
    socialButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    socialButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 12,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
    registerText: {

        fontSize: 16,
    },
    registerLinkText: {
        color: '#1A8FE3',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default DangNhap;
