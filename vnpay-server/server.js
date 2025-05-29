const express = require('express');
const app = express();
const crypto = require('crypto');
const moment = require('moment');
const qs = require('qs');

app.use(express.json());

// Cấu hình VNPay
const tmnCode = 'HF7BH12L';
const secretKey = '9JD6IVO1LRY91SHYMVEIBUMBQQDE6RAH';
const vnpUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';

// Địa chỉ returnUrl (dùng ngrok hoặc hosting thực tế)
const returnUrl = 'https://b4c0-2001-ee0-5211-2710-d495-baf0-6a81-1e32.ngrok-free.app/api/vnpay-return';

app.post('/api/create-vnpay-url', (req, res) => {
  let ipAddr = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  if (ipAddr.includes('::ffff:')) ipAddr = ipAddr.split('::ffff:')[1];

  const amount = req.body.amount.toString();
  const txnRef = moment().format('YYYYMMDDHHmmss') + Math.floor(Math.random() * 1000);

  const vnp_Params = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    vnp_TmnCode: tmnCode,
    vnp_Locale: 'vn',
    vnp_CurrCode: 'VND',
    vnp_TxnRef: txnRef,
    vnp_OrderInfo: req.body.description || 'Thanh toán tiền phòng',
    vnp_OrderType: 'other',
    vnp_Amount: amount,
    vnp_ReturnUrl: returnUrl,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: moment().format('YYYYMMDDHHmmss'),
  };

  const sortedParams = {};
  Object.keys(vnp_Params).sort().forEach(key => {
    sortedParams[key] = vnp_Params[key];
  });
  const signData = qs.stringify(sortedParams, { encode: false });
  const hmac = crypto.createHmac('sha512', secretKey);
  const secureHash = hmac.update(signData, 'utf-8').digest('hex');

  sortedParams.vnp_SecureHash = secureHash;

  // Tạo URL thanh toán
  const paymentUrl = vnpUrl + '?' + qs.stringify(sortedParams, { encode: true });

  console.log('👉 Received data:', req.body);
  console.log('👉 signData:', signData);
  console.log('👉 secureHash:', secureHash);
  console.log('👉 paymentUrl:', paymentUrl);

  res.json({ payment_url: paymentUrl });
});

// Xử lý callback trả về từ VNPay
app.get('/api/vnpay-return', (req, res) => {
  const vnp_Params = req.query;
  const secureHash = vnp_Params.vnp_SecureHash;
  delete vnp_Params.vnp_SecureHash;
  delete vnp_Params.vnp_SecureHashType;

  // Sắp xếp params lại để xác thực
  const sortedParams = {};
  Object.keys(vnp_Params).sort().forEach(key => {
    sortedParams[key] = vnp_Params[key];
  });

  const signData = qs.stringify(sortedParams, { encode: false });
  const hmac = crypto.createHmac('sha512', secretKey);
  const calculatedHash = hmac.update(signData, 'utf-8').digest('hex');

  if (secureHash !== calculatedHash) {
    console.error('❌ Invalid VNPay signature');
    return res.status(400).send('Invalid signature');
  }

  const responseCode = vnp_Params.vnp_ResponseCode || 'unknown';
  res.send(`
  <html>
    <head><title>VNPay Return</title></head>
    <body>
      <h3>Kết quả thanh toán:</h3>
      <p>Mã trả về: ${responseCode}</p>
      <script>
        window.ReactNativeWebView?.postMessage("${responseCode}");
      </script>
    </body>
  </html>
`);

});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
