import React, { useEffect } from "react";
import { Image, View, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { IconButton, Text } from "react-native-paper";
import { useMyContextController, loadServices } from "../store";

const Services = ({ navigation }) => {
    const [controller, dispatch] = useMyContextController();
    const { services } = controller;

    useEffect(() => {
        loadServices(dispatch);
    }, []);

    const renderItem = ({ item }) => (
        <TouchableOpacity
            onPress={() => navigation.navigate("ServiceDetail", { service: item })}
            style={styles.serviceItem}
        >
            <Text style={styles.serviceName}>{item.name}</Text>
            <Text style={styles.servicePrice}>{item.price.toLocaleString()} ₫</Text>
        </TouchableOpacity>
    );

    return (
        <View style={{ flex: 1, padding: 10 }}>
            <Image
                source={require("../assets/logo.png")}
                style={{ alignSelf: "center", marginVertical: 20 }}
            />
            <View style={styles.header}>
                <Text style={styles.title}>Danh sách dịch vụ</Text>
                <IconButton
                    icon="plus-circle"
                    iconColor="red"
                    size={30}
                    onPress={() => navigation.navigate("AddNewService")}
                />
            </View>

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
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
    },
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

export default Services;
