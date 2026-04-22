const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.static('public'));
app.use(fileUpload());

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// API 1: Lấy danh sách (Hỗ trợ đường dẫn dài vô tận)
app.get('/api/list/:path(*)', (req, res) => {
    const relPath = decodeURIComponent(req.params.path || "");
    const fullPath = path.join(uploadDir, relPath);

    if (!fs.existsSync(fullPath)) return res.json([]);

    try {
        const items = fs.readdirSync(fullPath, { withFileTypes: true });
        const result = items.map(item => ({
            name: item.name,
            isDir: item.isDirectory()
        }));
        res.json(result);
    } catch (err) {
        res.status(500).json([]);
    }
});

// API 2: Xem file (Giải mã URL chuẩn)
app.get('/api/view/:path(*)', (req, res) => {
    const filePath = path.join(uploadDir, decodeURIComponent(req.params.path));
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).send("File không tồn tại");
    }
});

// API 3: Xóa sạch (Xóa file hoặc cả thư mục con)
app.delete('/api/delete/:path(*)', (req, res) => {
    const target = path.join(uploadDir, decodeURIComponent(req.params.path));
    if (fs.existsSync(target)) {
        fs.rmSync(target, { recursive: true, force: true });
        res.send("OK");
    } else {
        res.status(404).send("Không tìm thấy");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log("GLAM System: Đã sẵn sàng duyệt đa tầng!"));
const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.static('public'));
app.use(fileUpload());

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// 1. API LIỆT KÊ: Cho phép đọc thư mục ở mọi cấp độ
app.get('/api/list/:path(*)', (req, res) => {
    const relPath = decodeURIComponent(req.params.path || "");
    const fullPath = path.join(uploadDir, relPath);

    if (!fs.existsSync(fullPath)) return res.json([]);

    try {
        const items = fs.readdirSync(fullPath, { withFileTypes: true });
        const result = items.map(item => ({
            name: item.name,
            isDir: item.isDirectory()
        }));
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: "Lỗi đọc dữ liệu" });
    }
});

// 2. API XEM/TẢI: Xử lý giải mã tên tiếng Việt/Trung
app.get('/api/view/:path(*)', (req, res) => {
    const filePath = path.join(uploadDir, decodeURIComponent(req.params.path));
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).send("Không tìm thấy file này");
    }
});

// 3. API XÓA: Xóa file hoặc xóa cả thư mục con bên trong
app.delete('/api/delete/:path(*)', (req, res) => {
    const target = path.join(uploadDir, decodeURIComponent(req.params.path));
    if (fs.existsSync(target)) {
        fs.rmSync(target, { recursive: true, force: true });
        res.send("Đã xóa");
    } else {
        res.status(404).send("Mục không tồn tại");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log("Hệ thống GLAM đã sẵn sàng!"));
const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.static('public'));
app.use(fileUpload());

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// 1. API lấy danh sách: Hỗ trợ đa tầng và giải mã tiếng Trung/Việt
app.get('/api/list/:path(*)', (req, res) => {
    const relPath = decodeURIComponent(req.params.path || "");
    const fullPath = path.join(uploadDir, relPath);

    if (!fs.existsSync(fullPath)) return res.json([]);

    try {
        const items = fs.readdirSync(fullPath, { withFileTypes: true });
        const result = items.map(item => ({
            name: item.name,
            isDir: item.isDirectory()
        }));
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: "Lỗi đọc thư mục" });
    }
});

// 2. API Xem file: Xử lý đường dẫn chứa ký tự đặc biệt
app.get('/api/view/:path(*)', (req, res) => {
    const filePath = path.join(uploadDir, decodeURIComponent(req.params.path));
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).send("Không tìm thấy file");
    }
});

// 3. API Xóa: Xóa được cả file và toàn bộ thư mục con
app.delete('/api/delete/:path(*)', (req, res) => {
    const target = path.join(uploadDir, decodeURIComponent(req.params.path));
    if (fs.existsSync(target)) {
        fs.rmSync(target, { recursive: true, force: true });
        res.send("Đã xóa");
    } else {
        res.status(404).send("Mục không tồn tại");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log("Hệ thống GLAM đã sẵn sàng!"));