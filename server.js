const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.static('public'));
app.use(express.json()); // Để đọc dữ liệu JSON từ giao diện
app.use(fileUpload());

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// 1. API lấy danh sách nội dung
app.get('/api/list/:path(*)', (req, res) => {
    try {
        const relPath = decodeURIComponent(req.params.path || "");
        const fullPath = path.join(uploadDir, relPath);
        if (!fs.existsSync(fullPath)) return res.json([]);
        const items = fs.readdirSync(fullPath, { withFileTypes: true });
        res.json(items.map(item => ({ name: item.name, isDir: item.isDirectory() })));
    } catch (e) { res.status(500).json([]); }
});

// 2. API TẠO THƯ MỤC MỚI (Tính năng bạn cần)
app.post('/api/create-folder', (req, res) => {
    try {
        const { folderPath, folderName } = req.body;
        const targetDir = path.join(uploadDir, folderPath, folderName);
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
            res.send("Đã tạo thư mục thành công");
        } else {
            res.status(400).send("Thư mục đã tồn tại");
        }
    } catch (e) { res.status(500).send("Lỗi khi tạo thư mục"); }
});

// 3. API Xem file
app.get('/api/view/:path(*)', (req, res) => {
    const filePath = path.join(uploadDir, decodeURIComponent(req.params.path));
    if (fs.existsSync(filePath)) res.sendFile(filePath);
    else res.status(404).send("File không tồn tại");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log("Hệ thống GLAM Đa Tầng Ready!"));