// server.js
const express = require('express');
const app = express();
const crypto = require('crypto');
const moment = require('moment');
const qs = require('qs');

app.use(express.json());

app.post('/api/create-vnpay-url', (req, res) => {
    const tmnCode = 'HF7BH12L';
    const secretKey = '9JD6IVO1LRY91SHYMVEIBUMBQQDE6RAH';
    const returnUrl = 'https://sandbox.vnpayment.vn/merchantv2/ReturnMock'; // dùng cho test
    const vnpUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';

    let ipAddr = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    if (ipAddr.includes('::ffff:')) ipAddr = ipAddr.split('::ffff:')[1]; // IPv6 thành IPv4
    const amount = req.body.amount * 100;

    const vnp_Params = {
        vnp_Version: '2.1.0',
        vnp_Command: 'pay',
        vnp_TmnCode: tmnCode,
        vnp_Locale: 'vn',
        vnp_CurrCode: 'VND',
        vnp_TxnRef: moment().format('HHmmss'),
        vnp_OrderInfo: req.body.description,
        vnp_OrderType: 'other',
        vnp_Amount: amount,
        vnp_ReturnUrl: returnUrl,
        vnp_IpAddr: ipAddr,
        vnp_CreateDate: moment().format('YYYYMMDDHHmmss'),
    };

    const sortedParams = {};
    Object.keys(vnp_Params)
        .sort()
        .forEach((key) => {
            sortedParams[key] = vnp_Params[key];
        });

    const signData = qs.stringify(sortedParams, { encode: false });
    const hmac = crypto.createHmac('sha512', secretKey);
    const secureHash = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex'); // ✅ chuẩn theo VNPay
    console.log("👉 signData dùng để ký:", signData);
    console.log("👉 secureHash tạo ra:", secureHash);

    sortedParams.vnp_SecureHash = secureHash;
    const paymentUrl = `${vnpUrl}?${qs.stringify(sortedParams, { encode: true })}`;

    return res.json({ payment_url: paymentUrl });

});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
