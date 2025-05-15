import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import firestore from "@react-native-firebase/firestore";
import { useNavigation } from "@react-navigation/native";

const Customers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    useEffect(() => {
        const unsubscribe = firestore()
            .collection("USERS")
            .where("role", "==", "customer") // 👈 chỉ lấy user có role là 'customer'
            .onSnapshot(snapshot => {
                const userList = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setUsers(userList);
                setLoading(false);
            }, error => {
                console.error("Lỗi khi tải USERS:", error);
                setLoading(false);
            });

        return () => unsubscribe(); // Cleanup
    }, []);

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => navigation.navigate("CustomersDetail", { user: item })}
        >
            <Text style={styles.name}>{item.fullName || "Chưa có tên"}</Text>
        </TouchableOpacity>
    );

    if (loading) {
        return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={users}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                ListEmptyComponent={<Text>Không có người dùng nào.</Text>}
            />
        </View>
    );
};

export default Customers;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    itemContainer: {
        padding: 16,
        backgroundColor: "#f9f9f9",
        borderBottomColor: "#ddd",
        borderBottomWidth: 1,
        borderRadius: 8,
        marginBottom: 10,
    },
    name: {
        fontSize: 20,
        color: "#333",
    },
});
