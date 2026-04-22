const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(fileUpload());

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// API 1: Liệt kê nội dung (Xử lý tiếng Trung & Thư mục con)
app.get('/api/list/:path(*)', (req, res) => {
    try {
        const relPath = decodeURIComponent(req.params.path || "");
        const fullPath = path.join(uploadDir, relPath);
        if (!fs.existsSync(fullPath)) return res.json([]);

        const items = fs.readdirSync(fullPath, { withFileTypes: true });
        res.json(items.map(item => ({
            name: item.name,
            isDir: item.isDirectory()
        })));
    } catch (e) { res.status(500).json([]); }
});

// API 2: Xem file
app.get('/api/view/:path(*)', (req, res) => {
    const filePath = path.join(uploadDir, decodeURIComponent(req.params.path));
    if (fs.existsSync(filePath)) res.sendFile(filePath);
    else res.status(404).send("File không tồn tại");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log("Hệ thống GLAM đã sẵn sàng!"));