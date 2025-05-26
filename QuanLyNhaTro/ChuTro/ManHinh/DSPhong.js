import React, { useEffect } from "react";
import { View, FlatList, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Icon, IconButton, Text } from "react-native-paper";
import { useMyContextController, loadPhong } from "../../TrungTam";
import { useFocusEffect } from '@react-navigation/native';
import { Image } from "react-native";

const DSPhong = ({ navigation }) => {
    const [controller, dispatch] = useMyContextController();
    const { phong, userLogin } = controller;
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

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("ChiTietPhong", { phong: item })}
        >
            <View style={styles.rowBetween}>
                <Image
                    source={{ uri: item.hinhAnh }}
                    style={styles.image}
                    resizeMode="cover"
                />
                <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.name}>Phòng: <Text style={styles.name}>{item.tenPhong}</Text></Text>
                    <Text style={styles.price}>Giá: <Text style={styles.price}>{item.giaPhong?.toLocaleString()} đ</Text></Text>
                </View>
                <IconButton
                    icon="calculator"
                    iconColor="#fff"
                    containerColor="#4CAF50"
                    size={24}
                    onPress={() => {
                        if (item.nguoiThue && item.nguoiThue.trim() !== "") {
                            navigation.navigate("TinhTien", { phong: item });
                        } else {
                            Alert.alert("Thông báo", "Phòng này chưa có người thuê, không thể tính tiền.");
                        }
                    }}
                    style={styles.calcButton}
                />

            </View>

        </TouchableOpacity>
    );

    return (
        <View style={{ flex: 1, padding: 10 }}>
            <View style={styles.header}>
                <Text style={styles.title}>
                    {soLuongPhong > 0 ? `Danh sách phòng (${soLuongPhong}):` : "Chưa có phòng thuê nào"}
                </Text>
                <IconButton
                    icon="plus"
                    iconColor="#fff"
                    size={28}
                    onPress={() => navigation.navigate("ThemPhong")}
                    style={{
                        backgroundColor: "#e91e63",
                        borderRadius: 28,
                    }}
                />
            </View>

            {soLuongPhong > 0 && (
                <FlatList
                    data={phong}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
    },
    card: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        elevation: 3,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    price: {
        fontSize: 16,
        fontWeight: '600',
        color: '#28a745',
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 8,
        backgroundColor: '#eee',
    },
    payButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4CAF50', // xanh lá
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
    },
    payButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
        marginLeft: 6,
    },
});

export default DSPhong;
