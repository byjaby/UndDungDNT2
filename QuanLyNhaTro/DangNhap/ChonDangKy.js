import React from "react";
import {
    View,
    StatusBar,
    Text,
    StyleSheet,
    Image,
    ScrollView,
} from "react-native";
import { Button } from "react-native-paper";

const ChonDangKy = ({ navigation }) => {

    const handleChuTropress = () => {
        navigation.navigate("ChuDangKy");
    };

    const handleKhachThuePress = () => {
        navigation.navigate("KhachDangKy");
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
                        source={require('../HinhAnh/logo.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </View>

                {/* Tiêu đề trang */}
                <Text style={styles.headerText}>QUẢN LÝ NHÀ TRỌ</Text>
                <Text style={styles.subHeaderText}>Chọn loại người dùng</Text>

                {/* Nút chọn */}
                <Button
                    mode="contained"
                    onPress={handleChuTropress}
                    style={styles.loginButton}
                    contentStyle={styles.loginButtonContent}
                    buttonColor="#3f51b5"
                    labelStyle={styles.buttonLabel}
                    android_ripple={{ color: 'rgba(255, 255, 255, 0.3)' }}
                >
                    Chủ trọ
                </Button>

                <Button
                    mode="contained"
                    onPress={handleKhachThuePress}
                    style={[styles.loginButton, { marginTop: 12 }]}
                    contentStyle={styles.loginButtonContent}
                    buttonColor="#3f51b5"
                    labelStyle={styles.buttonLabel}
                    android_ripple={{ color: 'rgba(255, 255, 255, 0.3)' }}
                >
                    Khách thuê
                </Button>
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
        paddingTop: 20,
        paddingBottom: 10,
        justifyContent: 'center',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 20,
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
        marginVertical: 12,
    },
    loginButton: {
        backgroundColor: '#774936',
        alignSelf: 'center',
        width: 180,
        borderRadius: 12,
        elevation: 2,
    },
    loginButtonContent: {
        height: 52,
    },
    buttonLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
});

export default ChonDangKy;
