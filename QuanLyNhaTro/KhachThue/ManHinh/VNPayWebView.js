import React from 'react';
import { View, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { WebView } from 'react-native-webview';

const VNPayWebView = ({ route, navigation }) => {
    const { paymentUrl } = route.params;

    const getParamFromUrl = (url, param) => {
        try {
            const urlObj = new URL(url);
            return urlObj.searchParams.get(param);
        } catch {
            return null;
        }
    };

    const handleNavigationChange = (navState) => {
        const url = navState.url;
        if (url.includes('vnp_ResponseCode')) {
            const responseCode = getParamFromUrl(url, 'vnp_ResponseCode');
            if (responseCode === '00') {
                Alert.alert('✅ Thành công', 'Thanh toán thành công!');
            } else {
                Alert.alert('❌ Thất bại', `Thanh toán thất bại. Mã lỗi: ${responseCode}`);
            }
            navigation.goBack();
        }
    };

    return (
        <WebView
            source={{ uri: paymentUrl }}
            onNavigationStateChange={handleNavigationChange}
            startInLoadingState
            renderLoading={() => <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />}
            onError={({ nativeEvent }) => {
                console.error('WebView error:', nativeEvent);
                Alert.alert('Lỗi', 'Không thể tải trang thanh toán.');
                navigation.goBack();
            }}
            onMessage={(event) => {
                const responseCode = event.nativeEvent.data;
                if (responseCode === '00') {
                    Alert.alert('✅ Thành công', 'Thanh toán thành công!');
                } else {
                    Alert.alert('❌ Thất bại', `Thanh toán thất bại. Mã lỗi: ${responseCode}`);
                }
                navigation.goBack();
            }}
        />
    );
};

const styles = StyleSheet.create({
    loading: {
        flex: 1,
        justifyContent: 'center',
    },
});

export default VNPayWebView;
