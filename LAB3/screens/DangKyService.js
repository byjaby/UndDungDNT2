import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { ScrollView, Alert, StyleSheet, Platform, View } from "react-native";
import { Text, Button } from "react-native-paper";
import { useMyContextController, addLichSuGD } from "../store";
import DateTimePicker from "@react-native-community/datetimepicker";

const DangKyService = ({ route, navigation }) => {
    const { service: initialService } = route.params;
    const [controller, dispatch] = useMyContextController();
    const [service, setService] = useState(initialService);
    const [selectedStartTime, setSelectedStartTime] = useState(new Date());
    const [showStartPicker, setShowStartPicker] = useState(false);

    useFocusEffect(
        useCallback(() => {
            const updated = controller.services.find(s => s.id === initialService.id);
            if (updated) {
                setService(updated);
            }
        }, [controller.services])
    );

    const handleDangKy = async () => {
        const user = controller.userLogin;
        if (!user) {
            Alert.alert("Lỗi", "Bạn cần đăng nhập để đăng ký dịch vụ.");
            return;
        }

        const data = {
            name: service.name,
            price: service.price,
            worker: service.worker,
            creator: service.creator,
            startTime: selectedStartTime.toISOString(),
            TrangThai: false,
            NguoiBook: user.fullName,
            NguoiBookID: user.user_id
        };

        try {
            await addLichSuGD(dispatch, data);
            Alert.alert("Thành công", "Bạn đã đăng ký dịch vụ thành công. Vui lòng chờ xác nhận từ admin.");
            navigation.goBack();
        } catch (error) {
            Alert.alert("Lỗi", "Đã xảy ra lỗi khi đăng ký.");
            console.error(error);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>{service.name}</Text>
            <Text style={styles.detail}>💰 Giá: {service.price.toLocaleString()} ₫</Text>
            <Text style={styles.detail}>👤 Người làm: {service.worker}</Text>
            <View>
                <Text style={styles.detail}>🕒 Giờ bắt đầu: <Text>{selectedStartTime.toLocaleTimeString()}</Text>
                    {showStartPicker && (
                        <DateTimePicker
                            value={selectedStartTime}
                            mode="time"
                            is24Hour={true}
                            display="default"
                            onChange={(event, date) => {
                                setShowStartPicker(Platform.OS === "ios");
                                if (date) setSelectedStartTime(date);
                            }}
                        />
                    )}</Text>
                <Button onPress={() => setShowStartPicker(true)}>Chọn giờ bắt đầu</Button>

            </View>

            <Button
                mode="contained"
                icon="check"
                style={[styles.button, { backgroundColor: "green" }]}
                onPress={handleDangKy}
            >
                Đăng ký dịch vụ
            </Button>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 15,
    },
    detail: {
        fontSize: 20,
        marginBottom: 10,
    },
    button: {
        marginTop: 20,
    },
});

export default DangKyService;
