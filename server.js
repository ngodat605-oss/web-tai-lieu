const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.static('public'));
app.use(fileUpload());

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Lấy danh sách File & Folder (Hỗ trợ đa tầng)
app.get('/api/list/:path(*)', (req, res) => {
    const relPath = decodeURIComponent(req.params.path || "");
    const fullPath = path.join(uploadDir, relPath);

    if (!fs.existsSync(fullPath)) return res.json([]);

    fs.readdir(fullPath, { withFileTypes: true }, (err, items) => {
        if (err) return res.status(500).json([]);
        const data = items.map(item => ({
            name: item.name,
            isDir: item.isDirectory()
        }));
        res.json(data);
    });
});

// Xem file (Hỗ trợ đường dẫn dài)
app.get('/api/view/:path(*)', (req, res) => {
    const filePath = path.join(uploadDir, decodeURIComponent(req.params.path));
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).send("Không tìm thấy file");
    }
});

// Xóa (Hỗ trợ cả file và thư mục con)
app.delete('/api/delete/:path(*)', (req, res) => {
    const target = path.join(uploadDir, decodeURIComponent(req.params.path));
    if (fs.existsSync(target)) {
        fs.rmSync(target, { recursive: true, force: true });
        res.send("OK");
    } else {
        res.status(404).send("Không tồn tại");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log("GLAM System Started"));