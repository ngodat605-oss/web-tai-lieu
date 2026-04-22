const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.static('public'));
app.use(fileUpload());

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// 1. Lấy danh sách nội dung (File & Folder) theo đường dẫn
app.get('/api/list/:path(*)', (req, res) => {
    const relPath = decodeURIComponent(req.params.path || "");
    const fullPath = path.join(uploadDir, relPath);

    if (!fs.existsSync(fullPath)) return res.json([]);

    fs.readdir(fullPath, { withFileTypes: true }, (err, items) => {
        if (err) return res.status(500).json({ error: err.message });
        const data = items.map(item => ({
            name: item.name,
            isDir: item.isDirectory()
        }));
        res.json(data);
    });
});

// 2. Tạo thư mục mới
app.post('/api/mkdir', express.json(), (req, res) => {
    const { parentPath, folderName } = req.body;
    const target = path.join(uploadDir, parentPath, folderName);
    if (!fs.existsSync(target)) {
        fs.mkdirSync(target, { recursive: true });
        res.send("OK");
    } else {
        res.status(400).send("Thư mục đã tồn tại");
    }
});

// 3. Tải lên file
app.post('/api/upload/:path(*)', (req, res) => {
    const relPath = decodeURIComponent(req.params.path || "");
    const targetDir = path.join(uploadDir, relPath);

    if (!req.files || !req.files.files) return res.status(400).send('No files');
    
    let files = req.files.files;
    if (!Array.isArray(files)) files = [files];

    files.forEach(file => {
        file.mv(path.join(targetDir, file.name));
    });
    res.send("OK");
});

// 4. Xem/Tải file
app.get('/api/view/:path(*)', (req, res) => {
    const filePath = path.join(uploadDir, decodeURIComponent(req.params.path));
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).send("File not found");
    }
});

// 5. Xóa (Hỗ trợ xóa cả file và folder)
app.delete('/api/delete/:path(*)', (req, res) => {
    const target = path.join(uploadDir, decodeURIComponent(req.params.path));
    if (fs.existsSync(target)) {
        fs.rmSync(target, { recursive: true, force: true });
        res.send("OK");
    } else {
        res.status(404).send("Not found");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`GLAM Server running on port ${PORT}`));