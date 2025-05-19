import { View, StatusBar, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from "react-native";
import { Button, HelperText, TextInput } from "react-native-paper";
import { dangNhap, useMyContextController } from "../TrungTam";
import React, { useEffect } from "react";
import firestore from "@react-native-firebase/firestore";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const DangNhap = ({ navigation }) => {
    const [controller, dispatch] = useMyContextController();
    const { loaiNguoiDungLogin } = controller;

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [hiddenPassword, setHiddenPassword] = React.useState(true);
    const [loginError, setLoginError] = React.useState('');

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
            if (loaiNguoiDungLogin != null && loaiNguoiDungLogin.id_loaiNguoiDung) {
                try {
                    const loaiNguoiDungRef = await firestore()
                        .collection("LoaiNguoiDung")
                        .doc(loaiNguoiDungLogin.id_loaiNguoiDung)
                        .get();

                    if (loaiNguoiDungRef.exists) {
                        const loaiData = loaiNguoiDungRef.data();
                        const role = loaiData.tenLoaiNguoiDung?.toLowerCase(); // vd: "Admin" hoặc "Customer"

                        if (role === "admin") {
                            navigation.reset({ index: 0, routes: [{ name: "Admin" }] });
                        } else if (role === "customer") {
                            navigation.reset({ index: 0, routes: [{ name: "Customer" }] });
                        } else {
                            console.log("Không có quyền truy cập.");
                        }
                    } else {
                        console.log("Không tìm thấy loại người dùng.");
                    }
                } catch (error) {
                    console.log("Lỗi khi truy vấn loại người dùng:", error);
                }
            }
        };

        fetchLoaiNguoiDung();
    }, [loaiNguoiDungLogin]);

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

                {/* Tiêu đề trang */}
                <Text style={styles.headerText}>Đăng nhập</Text>
                <Text style={styles.subHeaderText}>Chào mừng bạn quay trở lại!</Text>

                {/* Form đăng nhập */}
                <View style={styles.formContainer}>
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
                            activeOutlineColor="#3f51b5"
                            contentStyle={styles.inputContent}
                            theme={{ roundness: 10 }}
                        />
                    </View>
                    <HelperText type="error" visible={hasErrorEmail()}>
                        {email.trim() === "" ? "Vui lòng nhập Email" : "Email không hợp lệ"}
                    </HelperText>

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
                            activeOutlineColor="#3f51b5"
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
                        <TouchableOpacity onPress={() => navigation.navigate("DangKy")}>
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
        backgroundColor: '#ffffff',
    },
    scrollContainer: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingBottom: 20,
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 20,
    },
    logo: {
        width: 120,
        height: 120,
        borderRadius: 60,
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
        marginBottom: 30,
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
    forgotPasswordContainer: {
        alignSelf: 'flex-end',
        marginTop: 5,
        marginBottom: 20,
    },
    forgotPasswordText: {
        color: '#3f51b5',
        fontWeight: '600',
    },
    errorMessage: {
        textAlign: 'center',
        marginBottom: 10,
    },
    loginButton: {
        marginTop: 10,
        borderRadius: 8,
        elevation: 3,
    },
    loginButtonContent: {
        height: 52,
    },
    buttonLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    orContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 25,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: '#e0e0e0',
    },
    orText: {
        color: '#888',
        paddingHorizontal: 10,
        fontSize: 14,
    },
    socialButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 30,
    },
    socialButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 15,
    },
    registerText: {
        color: '#666',
        fontSize: 16,
    },
    registerLinkText: {
        color: '#3f51b5',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default DangNhap;
