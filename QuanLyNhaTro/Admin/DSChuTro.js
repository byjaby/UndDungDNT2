import React, { useEffect } from "react";
import { View, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { IconButton, Text } from "react-native-paper";
import { useMyContextController, loadChuTro } from "../TrungTam";
import { useFocusEffect } from '@react-navigation/native';

const DSChuTro = ({ navigation }) => {
    const [controller, dispatch] = useMyContextController();
    const { chuTro } = controller;

    useFocusEffect(
        React.useCallback(() => {
            loadChuTro(dispatch);
        }, [])
    );

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("ChiTietChuTro", { user: item })}
        >
            <Text style={styles.name}>{item.fullName}</Text>
        </TouchableOpacity>
    );

    const soLuongChuTro = chuTro?.length || 0;

    return (
        <View style={{ flex: 1, padding: 10 }}>
            <View style={styles.header}>
                <Text style={styles.title}>
                    {soLuongChuTro > 0 ? `Danh sách Chủ trọ (${soLuongChuTro}):` : "Chưa có chủ trọ nào."}
                </Text>
                <IconButton
                    icon="plus"
                    iconColor="#fff"
                    size={28}
                    onPress={() => navigation.navigate("ThemChuTro")}
                    style={{
                        backgroundColor: "#e91e63",
                        borderRadius: 28,
                    }}
                />
            </View>

            {soLuongChuTro > 0 && (
                <FlatList
                    data={chuTro}
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
});

export default DSChuTro;
