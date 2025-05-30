import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Alert,
    ScrollView,
    StatusBar,
    TouchableOpacity,
    Dimensions,
    Platform,
    Animated
} from "react-native";
import { Button, Avatar, Divider } from "react-native-paper";
import firestore from "@react-native-firebase/firestore";
import { useNavigation } from '@react-navigation/native';
import { useMyContextController } from "../../TrungTam";
import auth from "@react-native-firebase/auth";

const { width, height } = Dimensions.get('window');

const ChiTietKhachThue = ({ route }) => {
    const [controller, dispatch] = useMyContextController();
    const navigation = useNavigation();
    const { user } = route.params;
    const [isLoading, setIsLoading] = useState(false);

    // Animation values
    const fadeAnim = new Animated.Value(0);
    const slideAnim = new Animated.Value(30);
    const scaleAnim = new Animated.Value(0.9);

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
            })
        ]).start();
    }, []);

    console.log("user.id: ", user.id);

    const deleteUser = async () => {
        setIsLoading(true);
        try {
            await firestore().collection("KhachThue").doc(user.id).delete();
            Alert.alert("Thành công", "Đã xóa khách thuê.", [
                {
                    text: "OK",
                    onPress: () => {
                        dispatch({ type: 'RELOAD_KHACHTHUE' });
                        navigation.goBack();
                    }
                }
            ]);
        } catch (error) {
            Alert.alert("Lỗi", "Không thể xóa: " + error.message);
            console.log(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = () => {
        Alert.alert(
            "⚠️ Xác nhận xóa",
            `Bạn có chắc chắn muốn xóa khách thuê "${user.fullName}"?\n\nHành động này không thể hoàn tác!`,
            [
                {
                    text: "Hủy",
                    style: "cancel",
                    onPress: () => console.log("Đã hủy xóa")
                },
                {
                    text: "Xóa",
                    style: "destructive",
                    onPress: deleteUser
                }
            ]
        );
    };

    const resetPassword = async () => {
        setIsLoading(true);
        try {
            await auth().sendPasswordResetEmail(user.email);
            Alert.alert(
                "✅ Thành công",
                `Đã gửi email đặt lại mật khẩu đến:\n${user.email}\n\nVui lòng kiểm tra hộp thư và làm theo hướng dẫn.`
            );
        } catch (error) {
            console.error("Lỗi khi gửi email reset password:", error);
            Alert.alert("❌ Lỗi", "Không thể gửi email: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return "Không rõ";
        const date = new Date(timestamp.seconds * 1000);
        return date.toLocaleDateString('vi-VN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const InfoRow = ({ icon, label, value, isLast = false }) => (
        <Animated.View
            style={[
                styles.infoRow,
                !isLast && styles.infoRowBorder,
                {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }]
                }
            ]}
        >
            <View style={styles.infoLeft}>
                <Text style={styles.infoIcon}>{icon}</Text>
                <Text style={styles.infoLabel}>{label}</Text>
            </View>
            <Text style={styles.infoValue}>{value || "Chưa có thông tin"}</Text>
        </Animated.View>
    );

    const ActionButton = ({ title, icon, color, onPress, variant = 'primary' }) => (
        <TouchableOpacity
            style={[
                styles.actionButton,
                { backgroundColor: color },
                variant === 'secondary' && styles.actionButtonSecondary
            ]}
            onPress={onPress}
            activeOpacity={0.8}
            disabled={isLoading}
        >
            <Text style={styles.actionButtonIcon}>{icon}</Text>
            <Text style={[
                styles.actionButtonText,
                variant === 'secondary' && styles.actionButtonTextSecondary
            ]}>
                {title}
            </Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#667eea" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                    disabled={isLoading}
                >
                    <Text style={styles.backButtonText}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Chi tiết khách thuê</Text>
                <TouchableOpacity
                    style={styles.editIconButton}
                    onPress={() => navigation.navigate("SuaKhachThue", { user })}
                    disabled={isLoading}
                >
                    <Text style={styles.editIcon}>✏️</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                {/* Profile Section */}
                <Animated.View
                    style={[
                        styles.profileSection,
                        {
                            opacity: fadeAnim,
                            transform: [{ scale: scaleAnim }]
                        }
                    ]}
                >
                    <View style={styles.avatarContainer}>
                        <Avatar.Text
                            size={100}
                            label={user.fullName ? user.fullName.charAt(0).toUpperCase() : "?"}
                            style={styles.avatar}
                            labelStyle={styles.avatarLabel}
                        />
                        <View style={styles.statusDot} />
                    </View>
                    <Text style={styles.userName}>{user.fullName || "Khách thuê"}</Text>
                    <Text style={styles.userEmail}>{user.email}</Text>
                </Animated.View>

                {/* Information Card */}
                <Animated.View
                    style={[
                        styles.infoCard,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }]
                        }
                    ]}
                >
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>Thông tin cá nhân</Text>
                        <Text style={styles.cardSubtitle}>Chi tiết khách thuê</Text>
                    </View>

                    <InfoRow
                        icon="👤"
                        label="Họ và tên"
                        value={user.fullName}
                    />
                    <InfoRow
                        icon="📧"
                        label="Email"
                        value={user.email}
                    />
                    <InfoRow
                        icon="📱"
                        label="Số điện thoại"
                        value={user.phone}
                    />
                    <InfoRow
                        icon="🏠"
                        label="Địa chỉ"
                        value={user.address}
                    />
                    <InfoRow
                        icon="📅"
                        label="Ngày tạo"
                        value={formatDate(user.createdAt)}
                        isLast={true}
                    />
                </Animated.View>

                {/* Action Buttons */}
                <Animated.View
                    style={[
                        styles.actionsSection,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }]
                        }
                    ]}
                >
                    <Text style={styles.actionsTitle}>Hành động</Text>

                    <ActionButton
                        title="Chỉnh sửa thông tin"
                        icon="✏️"
                        color="#4CAF50"
                        onPress={() => navigation.navigate("SuaKhachThue", { user })}
                    />

                    <ActionButton
                        title="Đặt lại mật khẩu"
                        icon="🔐"
                        color="#2196F3"
                        onPress={resetPassword}
                    />

                    <ActionButton
                        title="Xóa khách thuê"
                        icon="🗑️"
                        color="#f44336"
                        onPress={handleDelete}
                        variant="secondary"
                    />
                </Animated.View>

                {/* Safety Note */}
                <Animated.View
                    style={[
                        styles.safetyNote,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }]
                        }
                    ]}
                >
                    <Text style={styles.safetyIcon}>⚠️</Text>
                    <Text style={styles.safetyText}>
                        Hành động xóa khách thuê không thể hoàn tác. Vui lòng cân nhắc kỹ trước khi thực hiện.
                    </Text>
                </Animated.View>

                <View style={{ height: 30 }} />
            </ScrollView>

            {/* Loading Overlay */}
            {isLoading && (
                <View style={styles.loadingOverlay}>
                    <View style={styles.loadingContainer}>
                        <Text style={styles.loadingText}>Đang xử lý...</Text>
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9ff',
    },
    header: {
        height: 100,
        backgroundColor: '#667eea',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 50 : 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    backButtonText: {
        fontSize: 20,
        color: '#fff',
        fontWeight: 'bold',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    editIconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    editIcon: {
        fontSize: 18,
    },
    scrollContainer: {
        flex: 1,
    },
    profileSection: {
        alignItems: 'center',
        backgroundColor: '#fff',
        marginHorizontal: 20,
        marginTop: 20,
        padding: 30,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 20,
    },
    avatar: {
        backgroundColor: '#667eea',
    },
    avatarLabel: {
        color: '#fff',
        fontSize: 36,
        fontWeight: 'bold',
    },
    statusDot: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#4CAF50',
        borderWidth: 3,
        borderColor: '#fff',
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
        textAlign: 'center',
    },
    userEmail: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    infoCard: {
        backgroundColor: '#fff',
        marginHorizontal: 20,
        marginTop: 20,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
        overflow: 'hidden',
    },
    cardHeader: {
        padding: 20,
        backgroundColor: '#f8f9ff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    cardSubtitle: {
        fontSize: 14,
        color: '#666',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        minHeight: 70,
    },
    infoRowBorder: {
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    infoLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        width: 140,
    },
    infoIcon: {
        fontSize: 20,
        marginRight: 12,
    },
    infoLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        flex: 1,
    },
    infoValue: {
        fontSize: 16,
        color: '#555',
        flex: 1,
        textAlign: 'right',
    },
    actionsSection: {
        marginHorizontal: 20,
        marginTop: 20,
    },
    actionsTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
        marginLeft: 4,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4CAF50',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    actionButtonSecondary: {
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#f44336',
    },
    actionButtonIcon: {
        fontSize: 20,
        marginRight: 12,
    },
    actionButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
        flex: 1,
    },
    actionButtonTextSecondary: {
        color: '#f44336',
    },
    safetyNote: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#fff3cd',
        marginHorizontal: 20,
        marginTop: 20,
        padding: 16,
        borderRadius: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#ffc107',
    },
    safetyIcon: {
        fontSize: 16,
        marginRight: 12,
        marginTop: 2,
    },
    safetyText: {
        flex: 1,
        fontSize: 14,
        color: '#856404',
        lineHeight: 20,
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        minWidth: 120,
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 16,
        color: '#333',
        marginTop: 10,
    },
});

export default ChiTietKhachThue;