import React, { useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Alert, Image, RefreshControl, Animated } from 'react-native';
import { IconButton, Text, FAB, Card, useTheme, TouchableRipple } from 'react-native-paper';
import { useMyContextController, loadPhong } from '../../TrungTam';
import { useFocusEffect } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LottieView from 'lottie-react-native';

const DSPhong = ({ navigation }) => {
    const theme = useTheme();
    const [controller, dispatch] = useMyContextController();
    const { phong, userLogin } = controller;
    const [refreshing, setRefreshing] = useState(false);
    const [scaleValue] = useState(new Animated.Value(1));

    useFocusEffect(
        React.useCallback(() => {
            if (userLogin?.user_id) {
                loadPhong(dispatch, userLogin.user_id);
            }
        }, [userLogin?.user_id])
    );

    const phongTheoUser = phong?.filter(
        (phong) => phong.creator === userLogin?.user_id
    ) || [];

    const soLuongPhong = phongTheoUser.length;

    const handleRefresh = () => {
        setRefreshing(true);
        if (userLogin?.user_id) {
            loadPhong(dispatch, userLogin.user_id).then(() => {
                setRefreshing(false);
            });
        }
    };

    const handlePressIn = () => {
        Animated.spring(scaleValue, {
            toValue: 0.98,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleValue, {
            toValue: 1,
            friction: 3,
            tension: 40,
            useNativeDriver: true,
        }).start();
    };

    const renderItem = ({ item }) => (
        <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
            <TouchableRipple
                onPress={() => navigation.navigate("ChiTietPhong", { phong: item })}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                rippleColor="rgba(0, 0, 0, 0.1)"
                style={styles.ripple}
            >
                <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
                    <View style={styles.cardContent}>
                        <Image
                            source={{ uri: item.hinhAnh || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' }}
                            style={styles.cardImage}
                            resizeMode="cover"
                        />
                        <View style={styles.textContainer}>
                            <View style={styles.headerRow}>
                                <Text variant="titleMedium" style={[styles.roomName, { color: theme.colors.onSurface }]}>
                                    Phòng: {item.tenPhong}
                                </Text>
                                <View style={styles.priceContainer}>
                                    <Text variant="bodyLarge" style={[styles.priceText, { color: theme.colors.primary }]}>
                                        {item.giaPhong?.toLocaleString()} đ
                                    </Text>
                                    <Text variant="bodySmall" style={[styles.priceLabel, { color: theme.colors.onSurfaceVariant }]}>
                                        /tháng
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.divider} />

                            <View style={styles.footerRow}>
                                <View style={[
                                    styles.statusBadge,
                                    item.nguoiThue && item.nguoiThue.trim() !== ""
                                        ? { backgroundColor: theme.colors.primaryContainer }
                                        : { backgroundColor: theme.colors.surfaceVariant }
                                ]}>
                                    <MaterialCommunityIcons
                                        name={item.nguoiThue && item.nguoiThue.trim() !== "" ? "account-check" : "bed-empty"}
                                        size={16}
                                        color={item.nguoiThue && item.nguoiThue.trim() !== "" ? theme.colors.onPrimaryContainer : theme.colors.onSurfaceVariant}
                                    />
                                    <Text style={[
                                        styles.statusText,
                                        {
                                            color: item.nguoiThue && item.nguoiThue.trim() !== ""
                                                ? theme.colors.onPrimaryContainer
                                                : theme.colors.onSurfaceVariant
                                        }
                                    ]}>
                                        {item.nguoiThue && item.nguoiThue.trim() !== "" ? "Đã thuê" : "Trống"}
                                    </Text>
                                </View>

                                <IconButton
                                    icon="calculator"
                                    iconColor={
                                        item.nguoiThue && item.nguoiThue.trim() !== ""
                                            ? theme.colors.onPrimary
                                            : theme.colors.onSurfaceDisabled
                                    }
                                    containerColor={
                                        item.nguoiThue && item.nguoiThue.trim() !== ""
                                            ? theme.colors.primary
                                            : theme.colors.surfaceDisabled
                                    }
                                    size={20}
                                    style={styles.calcButton}
                                    onPress={async () => {
                                        if (!item.nguoiThue || item.nguoiThue.trim() === "") {
                                            Alert.alert("Thông báo", "Phòng này chưa có người thuê, không thể tính tiền.");
                                            return;
                                        }

                                        try {
                                            const bankSnap = await firestore()
                                                .collection("TheNganHang")
                                                .where("creator", "==", userLogin.user_id)
                                                .limit(1)
                                                .get();

                                            if (bankSnap.empty) {
                                                Alert.alert("Thiếu thông tin", "Thông tin thẻ ngân hàng của bạn không đầy đủ. Vui lòng thêm đầy đủ thông tin trước khi tính tiền phòng!");
                                                return;
                                            }

                                            const bankData = bankSnap.docs[0].data();
                                            if (!bankData.tenNganHang || !bankData.hoTen || !bankData.soThe) {
                                                Alert.alert("Thiếu thông tin", "Thông tin thẻ ngân hàng của bạn không đầy đủ. Vui lòng thêm đầy đủ thông tin trước khi tính tiền phòng!");
                                                return;
                                            }

                                            const snapshot = await firestore()
                                                .collection("DichVu")
                                                .where("creator", "==", userLogin.user_id)
                                                .get();

                                            let dien = null;
                                            let nuoc = null;

                                            snapshot.docs.forEach(doc => {
                                                const { tenDV, chiPhi } = doc.data();
                                                if (tenDV.toLowerCase() === "điện") dien = chiPhi;
                                                if (tenDV.toLowerCase() === "nước") nuoc = chiPhi;
                                            });

                                            if (!dien || !nuoc) {
                                                Alert.alert(
                                                    "Thiếu chi phí dịch vụ",
                                                    "Bạn cần nhập chi phí cho dịch vụ Điện và Nước trước khi tính tiền.",
                                                    [
                                                        { text: "Đóng", style: "cancel" }
                                                    ]
                                                );
                                                return;
                                            }

                                            navigation.navigate("TinhTien", { phong: item });

                                        } catch (error) {
                                            Alert.alert("Lỗi", "Không thể kiểm tra thông tin: " + error.message);
                                        }
                                    }}
                                />
                            </View>
                        </View>
                    </View>
                </Card>
            </TouchableRipple>
        </Animated.View>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={styles.header}>
                <Text variant="headlineSmall" style={[styles.title, { color: theme.colors.onBackground }]}>
                    {soLuongPhong > 0 ? `Danh sách phòng (${soLuongPhong})` : "Quản lý phòng"}
                </Text>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                    {soLuongPhong > 0 ? "Danh sách các phòng bạn đang quản lý" : "Thêm phòng để bắt đầu quản lý"}
                </Text>
            </View>

            <FlatList
                data={phong}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        colors={[theme.colors.primary]}
                        progressBackgroundColor={theme.colors.surface}
                    />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <LottieView
                            source={require('../assets/empty-animation.json')}
                            autoPlay
                            loop
                            style={{ width: 200, height: 200 }}
                        />
                        <Text style={styles.emptyText}>Chưa có phòng nào trong trọ của bạn</Text>
                        <Text style={styles.emptySubtext}>Nhấn nút "+" bên dưới để thêm phòng đầu tiên</Text>
                    </View>
                }
            />

            <FAB
                icon="plus"
                style={[styles.fab, { backgroundColor: theme.colors.primary }]}
                color={theme.colors.onPrimary}
                onPress={async () => {
                    const creatorId = userLogin?.user_id;
                    if (!creatorId) {
                        Alert.alert("Lỗi", "Không tìm thấy ID người dùng.");
                        return;
                    }

                    try {
                        const chuTroSnap = await firestore()
                            .collection("ChuTro")
                            .doc(creatorId)
                            .get();

                        const tenTro = chuTroSnap.data()?.tenTro;

                        if (!tenTro || tenTro.trim() === "") {
                            Alert.alert(
                                "Thiếu thông tin trọ",
                                "Bạn cần thêm tên trọ trước khi thêm phòng.",
                                [
                                    {
                                        text: "Đóng",
                                        style: "cancel",
                                    }
                                ]
                            );
                        } else {
                            navigation.navigate("ThemPhong");
                        }
                    } catch (error) {
                        Alert.alert("Lỗi", "Không thể kiểm tra thông tin trọ: " + error.message);
                    }
                }}
                animated={true}
            />

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        marginBottom: 24,
    },
    title: {
        fontWeight: 'bold',
        marginBottom: 4,
    },
    listContent: {
        paddingBottom: 80,
    },
    ripple: {
        borderRadius: 12,
        marginBottom: 16,
        overflow: 'hidden',
    },
    card: {
        borderRadius: 16,
        elevation: 4, // tăng nhẹ để có chiều sâu
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        backgroundColor: '#fff',
        marginBottom: 16,
    },
    cardContent: {
        flexDirection: 'row',
        padding: 16,
    },
    cardImage: {
        width: 100,
        height: 100,
        borderRadius: 12,
        overflow: 'hidden',
    },
    textContainer: {
        flex: 1,
        marginLeft: 16,
        justifyContent: 'space-between',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    roomName: {
        fontWeight: 'bold',
        flex: 1,
        marginRight: 8,
    },
    priceContainer: {
        alignItems: 'flex-end',
    },
    priceText: {
        fontWeight: 'bold',
    },
    priceLabel: {
        opacity: 0.8,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        marginVertical: 12,
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '500',
        marginLeft: 6,
    },
    calcButton: {
        margin: -8,
    },
    fab: {
        position: 'absolute',
        margin: 24,
        right: 0,
        bottom: 0,
        borderRadius: 28,
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
    },
    emptyIcon: {
        opacity: 0.5,
        marginBottom: 16,
    },
    emptyText: {
        marginBottom: 8,
        textAlign: 'center',
    },
    emptySubtext: {
        textAlign: 'center',
        maxWidth: '80%',
    },
});

export default DSPhong;