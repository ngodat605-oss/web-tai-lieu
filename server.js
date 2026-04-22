const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.static('public'));
app.use(fileUpload());

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// API liệt kê nội dung: Quan trọng nhất để mở nhiều thư mục
app.get('/api/list/:path(*)', (req, res) => {
    const relPath = decodeURIComponent(req.params.path || "");
    const fullPath = path.join(uploadDir, relPath);

    if (!fs.existsSync(fullPath)) return res.json([]);

    try {
        const items = fs.readdirSync(fullPath, { withFileTypes: true });
        const result = items.map(item => ({
            name: item.name,
            isDir: item.isDirectory() // Trả về đúng/sai nếu là thư mục
        }));
        res.json(result);
    } catch (err) {
        res.status(500).json([]);
    }
});

// API xem file
app.get('/api/view/:path(*)', (req, res) => {
    const filePath = path.join(uploadDir, decodeURIComponent(req.params.path));
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).send("File không tồn tại");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log("GLAM System Ready!"));