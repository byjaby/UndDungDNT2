import React, { useEffect } from "react";
import { Image, View, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { IconButton, Text } from "react-native-paper";
import { useMyContextController, loadServices } from "../store";

const ServicesList = ({ navigation }) => {
    const [controller, dispatch] = useMyContextController();
    const { services } = controller;

    useEffect(() => {
        loadServices(dispatch);
    }, []);

    const renderItem = ({ item }) => (
        <TouchableOpacity
            onPress={() => navigation.navigate("DangKyService", { service: item })} // tên đúng ở đây
            style={styles.serviceItem}
        >
            <Text style={styles.serviceName}>{item.name}</Text>
            <Text style={styles.servicePrice}>{item.price.toLocaleString()} ₫</Text>
        </TouchableOpacity>
    );

    return (
        <View style={{ flex: 1, padding: 10 }}>

            <FlatList
                data={services}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </View>
    );
};

const styles = StyleSheet.create({

    serviceItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 15,
        backgroundColor: "#f2f2f2",
        borderRadius: 8,
        marginBottom: 10,
    },
    serviceName: {
        fontSize: 20,
        fontWeight: "600",
    },
    servicePrice: {
        fontSize: 20,
        color: "#555",
    },
});

export default ServicesList;
