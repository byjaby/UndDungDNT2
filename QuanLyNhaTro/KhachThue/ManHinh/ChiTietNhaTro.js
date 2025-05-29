import React, { useState } from "react";
import {
    View,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Image,
    Dimensions,
} from "react-native";
import { Text } from "react-native-paper";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import firestore from "@react-native-firebase/firestore";
import { useMyContextController } from "../../TrungTam";

const { width } = Dimensions.get('window');

const ChiTietNhaTro = ({ route }) => {
    const [controller] = useMyContextController();
    const { userLogin } = controller;
    const navigation = useNavigation();
    const { chuTro } = route.params;
    const [phongDaDangKy, setPhongDaDangKy] = useState([]);
    const [phongList, setPhongList] = useState([]);
    const [phongListTrong, setPhongListTrong] = useState([]);
    const [dichVuList, setDichVuList] = useState([]);
    const [activeTab, setActiveTab] = useState('rented');

    const handleDangKyThue = async (phong) => {
        try {
            const now = new Date();

            await firestore().collection('ThuePhong').add({
                userId: userLogin.user_id,
                phongId: phong.id,
                creator: phong.creator,
                trangThai: "",
                ngayDK: firestore.Timestamp.fromDate(now),
            });

            setPhongDaDangKy([...phongDaDangKy, phong.id]);

            Alert.alert(
                "Thành công",
                "Đã đăng ký thuê phòng thành công. Vui lòng đợi chủ trọ duyệt hoặc liên hệ!"
            );
        } catch (error) {
            Alert.alert("Lỗi", "Đăng ký thuê phòng thất bại: " + error.message);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            const fetchPhong = async () => {
                try {
                    const snapshot = await firestore()
                        .collection("Phong")
                        .where("creator", "==", chuTro.id)
                        .get();
                    const phongCoNguoiThue = snapshot.docs
                        .map(doc => ({ id: doc.id, ...doc.data() }))
                        .filter(phong => phong.nguoiThue && phong.nguoiThue.trim() !== "");

                    setPhongList(phongCoNguoiThue);
                } catch (error) {
                    console.error("Lỗi khi lấy dữ liệu phòng:", error);
                }
            };

            const fetchPhongTrong = async () => {
                try {
                    const snapshot = await firestore()
                        .collection("Phong")
                        .where("creator", "==", chuTro.id)
                        .where("nguoiThue", "==", "")
                        .get();

                    const list = snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }));

                    setPhongListTrong(list);
                } catch (error) {
                    console.error("Lỗi khi lấy dữ liệu phòng:", error);
                }
            };
            const fetchDV = async () => {
                try {
                    const snapshot = await firestore()
                        .collection("DichVu")
                        .where("creator", "==", chuTro.id)
                        .get();

                    const dichVuList = snapshot.docs.map(doc => ({
                        id: doc.id,
                        tenDV: doc.data().tenDV,
                        chiPhi: doc.data().chiPhi,
                    }));

                    setDichVuList(dichVuList);
                } catch (error) {
                    console.error("Lỗi khi lấy dữ liệu dịch vụ:", error);
                }
            };

            const fetchDangKy = async () => {
                try {
                    const snapshot = await firestore()
                        .collection('ThuePhong')
                        .where('userId', '==', userLogin.user_id)
                        .get();

                    const ids = snapshot.docs.map(doc => doc.data().phongId);
                    setPhongDaDangKy(ids);
                } catch (err) {
                    console.log("Lỗi lấy danh sách đăng ký:", err);
                }
            };

            if (chuTro?.id) {
                fetchPhong();
                fetchPhongTrong();
                fetchDV();
                fetchDangKy();
            }
        }, [chuTro?.id])
    );

    const renderRoomCard = ({ item }) => (
        <TouchableOpacity style={styles.roomCard} activeOpacity={0.8}>
            <View style={styles.roomImageContainer}>
                <Image
                    source={{ uri: item.hinhAnh }}
                    style={styles.roomImage}
                    resizeMode="cover"
                />
                <View style={[styles.statusBadge,
                activeTab === 'rented' ? styles.occupiedBadge : styles.availableBadge
                ]}>
                    <Text style={styles.statusText}>
                        {activeTab === 'rented' ? 'Đã thuê' : 'Trống'}
                    </Text>
                </View>
            </View>

            <View style={styles.roomInfo}>
                <View style={styles.roomHeader}>
                    <Text style={styles.roomName}>Phòng: {item.tenPhong}</Text>
                    <Text style={styles.roomPrice}>
                        {item.giaPhong?.toLocaleString() || 0}đ
                    </Text>
                </View>

                <View style={styles.roomDetails}>
                    <View style={styles.dimensionRow}>
                        <View style={styles.dimensionItem}>
                            <Text style={styles.dimensionIcon}>📏</Text>
                            <Text style={styles.dimensionText}>
                                {item.chieuDai}m × {item.chieuRong}m
                            </Text>
                        </View>
                        <View style={styles.areaItem}>
                            <Text style={styles.areaIcon}>📐</Text>
                            <Text style={styles.areaText}>
                                {(parseFloat(item.chieuDai) * parseFloat(item.chieuRong)).toFixed(1)}m²
                            </Text>
                        </View>
                    </View>
                    {dichVuList.map((dv) => (
                        <View key={dv.id} style={styles.dimensionRow}>
                            <View style={styles.dimensionItem}>
                                <Text style={styles.dimensionIcon}>🔧</Text>
                                <Text style={styles.dimensionText}>{dv.tenDV}</Text>
                            </View>
                            <View style={styles.areaItem}>
                                <Text style={styles.areaIcon}>💰</Text>
                                <Text style={styles.areaText}>{dv.chiPhi?.toLocaleString() || 0}đ</Text>
                            </View>
                        </View>
                    ))}
                </View>
                {activeTab === 'empty' && (
                    <TouchableOpacity
                        style={[
                            styles.registerButton,
                            phongDaDangKy.includes(item.id) && styles.disabledButton,
                        ]}
                        onPress={() => !phongDaDangKy.includes(item.id) && handleDangKyThue(item)}
                        disabled={phongDaDangKy.includes(item.id)}
                    >
                        <Text style={styles.registerText}>
                            {phongDaDangKy.includes(item.id) ? "Đã đăng ký" : "Đăng ký thuê phòng"}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </TouchableOpacity>
    );

    const renderEmptyState = (type) => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>
                {type === 'rented' ? '🏠' : '🏢'}
            </Text>
            <Text style={styles.emptyTitle}>
                {type === 'rented' ? 'Chưa có phòng đã thuê' : 'Không có phòng trống'}
            </Text>
            <Text style={styles.emptySubtitle}>
                {type === 'rented'
                    ? 'Các phòng đã cho thuê sẽ hiển thị ở đây'
                    : 'Tất cả phòng đều đã được thuê'
                }
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.houseInfo}>
                    <Text style={styles.houseName}>Chủ trọ: {chuTro.tenTro}</Text>
                    <Text style={styles.houseAddress}>Địa chỉ: {chuTro.address}</Text>
                </View>
            </View>

            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'rented' && styles.activeTab]}
                    onPress={() => setActiveTab('rented')}
                >
                    <Text style={[styles.tabText, activeTab === 'rented' && styles.activeTabText]}>
                        Đã thuê ({phongList.length})
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'empty' && styles.activeTab]}
                    onPress={() => setActiveTab('empty')}
                >
                    <Text style={[styles.tabText, activeTab === 'empty' && styles.activeTabText]}>
                        Phòng trống ({phongListTrong.length})
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                {activeTab === 'rented' ? (
                    phongList.length > 0 ? (
                        <FlatList
                            data={phongList}
                            keyExtractor={(item) => item.id}
                            renderItem={renderRoomCard}
                            contentContainerStyle={styles.listContainer}
                            showsVerticalScrollIndicator={false}
                        />
                    ) : (
                        renderEmptyState('rented')
                    )
                ) : (
                    phongListTrong.length > 0 ? (
                        <FlatList
                            data={phongListTrong}
                            keyExtractor={(item) => item.id}
                            renderItem={renderRoomCard}
                            contentContainerStyle={styles.listContainer}
                            showsVerticalScrollIndicator={false}
                        />
                    ) : (
                        renderEmptyState('empty')
                    )
                )}
            </View>
        </View>
    );
};

export default ChiTietNhaTro;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f9fa",
    },
    header: {
        backgroundColor: "#fff",
        paddingLeft: 20,
        paddingRight: 20,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    houseInfo: {
        marginBottom: 15,
    },
    houseName: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#2c3e50",
        marginBottom: 5,
    },
    houseAddress: {
        fontSize: 16,
        color: "#7f8c8d",
        lineHeight: 22,
    },
    statDivider: {
        width: 1,
        height: 40,
        backgroundColor: "#ecf0f1",
        marginHorizontal: 20,
    },
    tabContainer: {
        flexDirection: "row",
        backgroundColor: "#fff",
        marginHorizontal: 15,
        borderRadius: 12,
        padding: 4,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: "center",
        borderRadius: 8,
    },
    activeTab: {
        backgroundColor: "#3498db",
    },
    tabText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#7f8c8d",
    },
    activeTabText: {
        color: "#fff",
    },
    content: {
        flex: 1,
        paddingHorizontal: 15,
    },
    listContainer: {
        paddingBottom: 20,
    },
    roomCard: {
        backgroundColor: "#fff",
        borderRadius: 16,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        overflow: "hidden",
    },
    roomImageContainer: {
        position: "relative",
    },
    roomImage: {
        width: "100%",
        height: 180,
        backgroundColor: "#ecf0f1",
    },
    statusBadge: {
        position: "absolute",
        top: 12,
        right: 12,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    occupiedBadge: {
        backgroundColor: "#e74c3c",
    },
    availableBadge: {
        backgroundColor: "#27ae60",
    },
    statusText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "bold",
    },
    roomInfo: {
        padding: 16,
    },
    roomHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    roomName: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#2c3e50",
        flex: 1,
    },
    roomPrice: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#27ae60",
    },
    roomDetails: {
        marginTop: 8,
    },
    dimensionRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    dimensionItem: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    dimensionIcon: {
        fontSize: 16,
        marginRight: 8,
    },
    dimensionText: {
        fontSize: 16,
        color: "#34495e",
    },
    areaItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#ecf0f1",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    areaIcon: {
        fontSize: 14,
        marginRight: 6,
    },
    areaText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#2c3e50",
    },
    emptyContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 40,
    },
    emptyIcon: {
        fontSize: 60,
        marginBottom: 20,
        opacity: 0.5,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#7f8c8d",
        marginBottom: 8,
        textAlign: "center",
    },
    emptySubtitle: {
        fontSize: 16,
        color: "#95a5a6",
        textAlign: "center",
        lineHeight: 22,
    },
    registerButton: {
        marginTop: 10,
        backgroundColor: '#BC4B51',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 25,
    },
    registerText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    disabledButton: {
        backgroundColor: "#ccc",
    },

});
