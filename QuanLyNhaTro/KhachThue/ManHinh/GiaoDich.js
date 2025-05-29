import React, { useEffect } from "react";
import { View, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { IconButton, Text } from "react-native-paper";
import { useMyContextController, loadLSGD } from "../../TrungTam";
import { useFocusEffect } from '@react-navigation/native';

const GiaoDich = ({ navigation }) => {
    const [controller, dispatch] = useMyContextController();
    const { userLogin } = controller;
    useFocusEffect(
        React.useCallback(() => {
            loadLSGD(dispatch, userLogin.user_id);
        }, [])
    );

    const dichVuTheoUser = dichVu?.filter(
        (dv) => dv.creator === userLogin?.user_id
    ) || [];

    const soLuongDV = dichVuTheoUser.length;

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("ChiTietDV", { dichVu: item })}
        >
            <View style={styles.rowBetween}>
                <Text style={styles.name}>{item.tenDV}</Text>
                <Text style={styles.price}>{item.chiPhi?.toLocaleString()} đ</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={{ flex: 1, padding: 10 }}>
            <View style={styles.header}>
                <Text style={styles.title}>
                    {soLuongDV > 0 ? `Danh sách dịch vụ (${soLuongDV}):` : "Chưa có chủ trọ nào."}
                </Text>
                <IconButton
                    icon="plus"
                    iconColor="#fff"
                    size={28}
                    onPress={() => navigation.navigate("ThemDV")}
                    style={{
                        backgroundColor: "#e91e63",
                        borderRadius: 28,
                    }}
                />
            </View>

            {soLuongDV > 0 && (
                <FlatList
                    data={dichVuTheoUser}
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
});

export default GiaoDich;
