import React, { useState, useEffect } from "react";
import {
    View,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Text,
    Dimensions,
    Image,
} from "react-native";
import firestore from "@react-native-firebase/firestore";
import { useFocusEffect } from "@react-navigation/native";
import { useMyContextController, loadTro } from "../../TrungTam";

const { width } = Dimensions.get("window");

const Tro = ({ navigation }) => {
    const [controller, dispatch] = useMyContextController();
    const { userLogin } = controller;

    const [rooms, setRooms] = useState([]);
    const [chuTro, setChuTro] = useState(null);
    const [dichVuList, setDichVuList] = useState([]);
    const [phong, setPhong] = useState([]);
    const [tienPhongList, setTienPhongList] = useState([]);

    const fetchTienPhong = async () => {
        try {
            const snapshot = await firestore()
                .collection("TienPhong")
                .where("nguoiThueId", "==", userLogin.user_id)
                .get();

            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            setTienPhongList(data);
        } catch (error) {
            console.error("Lỗi khi load TienPhong:", error);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            const fetchTro = async () => {
                if (!userLogin?.user_id) return;

                try {
                    const result = await loadTro(dispatch, userLogin.user_id);
                    setRooms(result || []);

                    if (result && result.length > 0) {
                        const creatorId = result[0].creator;
                        const chuTroDoc = await firestore()
                            .collection("ChuTro")
                            .doc(creatorId)
                            .get();

                        if (chuTroDoc.exists) {
                            const chuTroData = chuTroDoc.data();
                            setChuTro(chuTroData);

                            const dvSnapshot = await firestore()
                                .collection("DichVu")
                                .where("creator", "==", chuTroDoc.id)
                                .get();

                            const dvList = dvSnapshot.docs.map(doc => ({
                                id: doc.id,
                                ...doc.data()
                            }));

                            setDichVuList(dvList);
                        }

                        const phongId = result[0].phongId;
                        const phongDoc = await firestore()
                            .collection("Phong")
                            .doc(phongId)
                            .get();

                        if (phongDoc.exists) {
                            const phongData = phongDoc.data();
                            setPhong(phongData);
                        }
                    }
                } catch (error) {
                    console.error("Lỗi khi load phòng/chủ trọ:", error);
                }
            };

            fetchTro();
            fetchTienPhong();
        }, [userLogin?.user_id])
    );

    const renderRoomCard = ({ item }) => {
        const tienPhong = tienPhongList.find(t => t.phongId === item.phongId);
        return (
            <View style={styles.roomCard} activeOpacity={0.8}>
                <Image
                    source={{ uri: phong.hinhAnh }}
                    style={styles.roomImage}
                    resizeMode="cover"
                />

                <View style={styles.roomInfo}>
                    <Text style={styles.roomName}>Phòng: {phong.tenPhong}</Text>
                    <Text style={styles.roomPrice}>
                        Giá phòng: {phong.giaPhong?.toLocaleString() || 0}đ
                    </Text>
                    <Text style={styles.roomDimensions}>
                        Kích thước: {phong.chieuDai}m × {phong.chieuRong}m
                    </Text>
                    <Text style={styles.roomArea}>
                        Diện tích: {(parseFloat(phong.chieuDai) * parseFloat(phong.chieuRong)).toFixed(1)} m²
                    </Text>
                    <View style={styles.serviceContainer}>
                        <Text style={styles.serviceTitle}>Dịch vụ:</Text>
                        {dichVuList.length > 0 ? (
                            dichVuList.map(dv => (
                                <View key={dv.id} style={styles.serviceItem}>
                                    <Text style={styles.serviceName}>• {dv.tenDV}</Text>
                                    <Text style={styles.serviceCost}>{dv.chiPhi?.toLocaleString() || 0}đ</Text>
                                </View>
                            ))
                        ) : (
                            <Text style={styles.serviceName}>Không có dịch vụ</Text>
                        )}
                    </View>
                </View>
                {tienPhong ? (
                    <View style={styles.billContainer}>
                        <Text style={styles.billTitle}>Thông tin tiền phòng:</Text>
                        <Text>Chỉ số điện: {tienPhong.chiSoDienCu} → {tienPhong.chiSoDienMoi}</Text>
                        <Text>Chỉ số nước: {tienPhong.chiSoNuocCu} → {tienPhong.chiSoNuocMoi}</Text>
                        <Text>Ngày tạo: {tienPhong.createdAt.toDate().toLocaleDateString("vi-VN")}</Text>
                        <Text>Tiền dịch vụ: {tienPhong.tienDichVu.toLocaleString()}đ</Text>
                        <Text style={styles.totalAmount}>
                            Tổng tiền: {tienPhong.tongTien.toLocaleString()}đ
                        </Text>
                        <TouchableOpacity
                            style={styles.payButton}
                            onPress={() => navigation.navigate("ThanhToan", { tienPhongData: tienPhong })}
                        >
                            <Text style={styles.payButtonText}>Thanh toán</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.billContainer}>
                        <Text style={{ fontStyle: "italic", color: "#888" }}>
                            Chưa có tiền phòng cần thanh toán
                        </Text>
                    </View>
                )}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Thông tin chi tiết phòng trọ</Text>

            {chuTro && rooms.length > 0 && (
                <View style={styles.header}>
                    <Text style={styles.houseName}>Chủ trọ: {chuTro.fullName}</Text>
                    <Text style={styles.housePhone}>SĐT: {chuTro.phone}</Text>
                    <Text style={styles.housePhone}>Tên trọ: {chuTro.tenTro}</Text>
                    <Text style={styles.houseAddress}>Địa chỉ: {chuTro.address}</Text>
                </View>
            )}

            {rooms.length > 0 ? (
                <FlatList
                    data={rooms}
                    keyExtractor={(item) => item.id}
                    renderItem={renderRoomCard}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Bạn chưa có thuê phòng trọ</Text>
                </View>
            )}
        </View>
    );
};

export default Tro;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f9fa",
        padding: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    header: {
        marginBottom: 15,
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 10,
        elevation: 2,
    },
    houseName: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#2c3e50",
    },
    housePhone: {
        fontSize: 16,
        color: "#34495e",
        marginTop: 5,
    },
    houseAddress: {
        fontSize: 16,
        color: "#34495e",
        marginTop: 5,
    },
    listContainer: {
        paddingBottom: 20,
    },
    roomCard: {
        backgroundColor: "#fff",
        borderRadius: 10,
        marginBottom: 15,
        elevation: 3,
        overflow: "hidden",
    },
    roomImage: {
        width: "100%",
        height: 180,
    },
    statusBadge: {
        position: "absolute",
        top: 10,
        right: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
    },
    statusText: {
        color: "#fff",
        fontWeight: "bold",
    },
    roomInfo: {
        padding: 10,
    },
    roomName: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#2c3e50",
    },
    roomPrice: {
        fontSize: 16,
        color: "#27ae60",
        marginTop: 5,
    },
    roomDimensions: {
        fontSize: 14,
        color: "#7f8c8d",
        marginTop: 5,
    },
    roomArea: {
        fontSize: 14,
        color: "#7f8c8d",
        marginTop: 5,
    },
    serviceContainer: {
        marginTop: 8,
    },
    serviceTitle: {
        fontWeight: "bold",
        color: "#444",
    },
    serviceItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 2,
    },
    serviceName: {
        fontSize: 14,
        color: "#333",
    },
    serviceCost: {
        fontSize: 14,
        color: "#666",
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 50,
    },
    emptyText: {
        fontSize: 16,
        color: "gray",
    },
    billContainer: {
        marginTop: 10,
        padding: 10,
        backgroundColor: "#f1f1f1",
        borderRadius: 8,
    },
    billTitle: {
        fontWeight: "bold",
        marginBottom: 4,
    },
    totalAmount: {
        marginTop: 6,
        fontWeight: "bold",
        color: "#e91e63",
    },
    payButton: {
        marginTop: 8,
        backgroundColor: "#4caf50",
        width: 120,
        alignSelf: "center",
        paddingVertical: 6,
        borderRadius: 25,
        alignItems: "center",
    },
    payButtonText: {
        padding: 5,
        color: "#fff",
        fontWeight: "bold",
    },
});
