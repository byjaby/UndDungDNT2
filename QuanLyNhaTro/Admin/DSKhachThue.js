import React, { useEffect } from "react";
import { View, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { IconButton, Text } from "react-native-paper";
import { useMyContextController, loadKhachThue } from "../TrungTam";
import { useFocusEffect } from '@react-navigation/native';

const DSKhachThue = ({ navigation }) => {
    const [controller, dispatch] = useMyContextController();
    const { khachThue } = controller;

    useFocusEffect(
        React.useCallback(() => {
            loadKhachThue(dispatch);
        }, [])
    );

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("ChiTietKhachThue", { user: item })}
        >
            <Text style={styles.name}>{item.fullName}</Text>
        </TouchableOpacity>
    );

    const soLuongKhachThue = khachThue?.length || 0;

    return (
        <View style={{ flex: 1, padding: 10 }}>
            <View style={styles.header}>
                <Text style={styles.title}>
                    {soLuongKhachThue > 0 ? `Danh sách khách thuê trọ (${soLuongKhachThue}):` : "Chưa có khách thuê trọ nào."}
                </Text>
                <IconButton
                    icon="plus"
                    iconColor="#fff"
                    size={28}
                    onPress={() => navigation.navigate("ThemKhachThue")}
                    style={{
                        backgroundColor: "#e91e63",
                        borderRadius: 28,
                    }}
                />
            </View>

            {soLuongKhachThue > 0 && (
                <FlatList
                    data={khachThue}
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

export default DSKhachThue;
