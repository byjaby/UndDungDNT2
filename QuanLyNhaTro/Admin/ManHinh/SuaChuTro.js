import React, { useState } from "react";
import { View, StyleSheet, Alert, ScrollView, StatusBar, Animated } from "react-native";
import { TextInput, Button, Text, Card, Avatar } from "react-native-paper";
import firestore from "@react-native-firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { useMyContextController } from "../../TrungTam";
import LinearGradient from 'react-native-linear-gradient';

const SuaChuTro = ({ route }) => {
    const navigation = useNavigation();
    const { user } = route.params;
    const [controller, dispatch] = useMyContextController();
    const { userLogin } = controller;

    const [fullName, setFullName] = useState(user.fullName || "");
    const [email, setEmail] = useState(user.email || "");
    const [phone, setPhone] = useState(user.phone || "");
    const [address, setAddress] = useState(user.address || "");
    const [loading, setLoading] = useState(false);

    if (userLogin) {
        console.log(userLogin.user_id);
    } else {
        console.log("Chưa có userLogin");
    }

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

        setLoading(true);
        const creatorId = userLogin?.user_id || null;

        try {
            await firestore().collection("ChuTro").doc(user.id).update({
                fullName,
                email,
                phone,
                address,
                creator: creatorId
            });

            Alert.alert("Thành công", "Đã cập nhật thông tin chủ trọ.");
            navigation.navigate("DSChuTro");
        } catch (error) {
            Alert.alert("Lỗi", "Không thể lưu: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <StatusBar barStyle="light-content" backgroundColor="#667eea" />
            <LinearGradient
                colors={['#667eea', '#764ba2', '#f093fb']}
                style={styles.container}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header Section */}
                    <View style={styles.header}>
                        <Avatar.Text
                            size={70}
                            label={fullName ? fullName.charAt(0).toUpperCase() : "U"}
                            style={styles.avatar}
                            labelStyle={styles.avatarLabel}
                        />
                        <Text style={styles.title}>Chỉnh sửa chủ trọ</Text>
                        <Text style={styles.subtitle}>Cập nhật thông tin của {fullName || "người dùng"}</Text>
                    </View>

                    {/* Form Card */}
                    <Card style={styles.formCard}>
                        <Card.Content style={styles.cardContent}>

                            {/* Full Name Input */}
                            <View style={styles.inputContainer}>
                                <View style={styles.inputIcon}>
                                    <Text style={styles.iconText}>👤</Text>
                                </View>
                                <TextInput
                                    label="Họ tên"
                                    value={fullName}
                                    onChangeText={setFullName}
                                    mode="outlined"
                                    style={styles.input}
                                    outlineColor="#e0e6ed"
                                    activeOutlineColor="#667eea"
                                    theme={{
                                        colors: {
                                            primary: '#667eea',
                                        },
                                    }}
                                />
                            </View>

                            {/* Email Input */}
                            <View style={styles.inputContainer}>
                                <View style={styles.inputIcon}>
                                    <Text style={styles.iconText}>📧</Text>
                                </View>
                                <TextInput
                                    label="Email"
                                    value={email}
                                    onChangeText={setEmail}
                                    mode="outlined"
                                    keyboardType="email-address"
                                    style={styles.input}
                                    outlineColor="#e0e6ed"
                                    activeOutlineColor="#667eea"
                                    theme={{
                                        colors: {
                                            primary: '#667eea',
                                        },
                                    }}
                                />
                            </View>

                            {/* Phone Input */}
                            <View style={styles.inputContainer}>
                                <View style={styles.inputIcon}>
                                    <Text style={styles.iconText}>📱</Text>
                                </View>
                                <TextInput
                                    label="Số điện thoại"
                                    value={phone}
                                    onChangeText={setPhone}
                                    mode="outlined"
                                    keyboardType="phone-pad"
                                    style={styles.input}
                                    outlineColor="#e0e6ed"
                                    activeOutlineColor="#667eea"
                                    theme={{
                                        colors: {
                                            primary: '#667eea',
                                        },
                                    }}
                                />
                            </View>

                            {/* Address Input */}
                            <View style={styles.inputContainer}>
                                <View style={[styles.inputIcon, styles.addressIcon]}>
                                    <Text style={styles.iconText}>📍</Text>
                                </View>
                                <TextInput
                                    label="Địa chỉ"
                                    value={address}
                                    onChangeText={setAddress}
                                    mode="outlined"
                                    multiline
                                    numberOfLines={3}
                                    style={[styles.input, styles.addressInput]}
                                    outlineColor="#e0e6ed"
                                    activeOutlineColor="#667eea"
                                    theme={{
                                        colors: {
                                            primary: '#667eea',
                                        },
                                    }}
                                />
                            </View>

                        </Card.Content>
                    </Card>

                    {/* Action Buttons */}
                    <View style={styles.buttonContainer}>
                        <Button
                            mode="contained"
                            onPress={handleSave}
                            style={styles.saveButton}
                            contentStyle={styles.buttonContent}
                            labelStyle={styles.buttonLabel}
                            icon="content-save"
                            loading={loading}
                            disabled={loading}
                        >
                            {loading ? "Đang lưu..." : "Lưu thay đổi"}
                        </Button>

                        <Button
                            mode="outlined"
                            onPress={() => navigation.goBack()}
                            style={styles.cancelButton}
                            contentStyle={styles.buttonContent}
                            labelStyle={styles.cancelButtonLabel}
                            icon="close"
                        >
                            Hủy
                        </Button>
                    </View>
                </ScrollView>
            </LinearGradient>
        </>
    );
};

export default SuaChuTro;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        paddingBottom: 30,
    },
    header: {
        alignItems: 'center',
        paddingTop: 40,
        paddingBottom: 30,
        paddingHorizontal: 20,
    },
    avatar: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        marginBottom: 15,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    avatarLabel: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#667eea',
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#ffffff",
        marginBottom: 8,
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    subtitle: {
        fontSize: 16,
        color: "rgba(255, 255, 255, 0.8)",
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    formCard: {
        margin: 20,
        borderRadius: 25,
        elevation: 15,
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
    },
    cardContent: {
        padding: 25,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    inputIcon: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        backgroundColor: '#f8f9ff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
        marginTop: 8,
        borderWidth: 1,
        borderColor: '#e6e9ff',
    },
    addressIcon: {
        marginTop: 15,
    },
    iconText: {
        fontSize: 18,
    },
    input: {
        flex: 1,
        backgroundColor: '#ffffff',
        fontSize: 16,
    },
    addressInput: {
        minHeight: 80,
    },
    buttonContainer: {
        paddingHorizontal: 20,
        paddingTop: 10,
        gap: 15,
    },
    saveButton: {
        backgroundColor: '#4CAF50',
        borderRadius: 15,
        elevation: 8,
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    cancelButton: {
        borderColor: 'rgba(255, 255, 255, 0.8)',
        borderWidth: 2,
        borderRadius: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    buttonContent: {
        paddingVertical: 12,
    },
    buttonLabel: {
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.5,
        color: '#ffffff',
    },
    cancelButtonLabel: {
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.5,
        color: '#ffffff',
    },
});