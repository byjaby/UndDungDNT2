import React from 'react';
import { View, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { WebView } from 'react-native-webview';

const VNPayWebView = ({ route, navigation }) => {
    const { paymentUrl } = route.params;

    const handleNavigationChange = (navState) => {
        const { url } = navState;

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

    const getParamFromUrl = (url, param) => {
        const match = url.match(new RegExp(`[?&]${param}=([^&]+)`));
        return match ? match[1] : null;
    };

    return (
        <WebView
            source={{ uri: paymentUrl }}
            onNavigationStateChange={handleNavigationChange}
            startInLoadingState
            renderLoading={() => <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />}
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
