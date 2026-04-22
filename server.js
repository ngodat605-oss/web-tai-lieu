const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.static('public'));
app.use(fileUpload());

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// 1. Tạo thư mục mới
app.get('/create-folder', (req, res) => {
    let folder = req.query.folder;
    if (!folder) return res.status(400).send('Thiếu tên thư mục');
    const folderPath = path.join(uploadDir, folder);
    if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath);
    res.send("Đã tạo thư mục");
});

// 2. Lấy danh sách thư mục
app.get('/folders', (req, res) => {
    fs.readdir(uploadDir, (err, folders) => {
        res.json(folders || []);
    });
});

// 3. Tải file lên thư mục được chọn
app.post('/upload/:folder', (req, res) => {
    let folder = req.params.folder;
    const folderPath = path.join(uploadDir, folder);
    if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath);

    if (!req.files || Object.keys(req.files).length === 0) return res.status(400).send('Không có file nào');
    
    let files = req.files.files;
    if (!Array.isArray(files)) files = [files];

    let uploadCount = 0;
    files.forEach(file => {
        const filePath = path.join(folderPath, file.name);
        file.mv(filePath, (err) => {
            uploadCount++;
            if (uploadCount === files.length) res.send("Upload thành công");
        });
    });
});

// 4. Lấy danh sách file trong thư mục
app.get('/files/:folder', (req, res) => {
    let folder = req.params.folder;
    const folderPath = path.join(uploadDir, folder);
    fs.readdir(folderPath, (err, files) => {
        if (err) return res.json([]);
        res.json(files.map(f => ({ name: f })));
    });
});

// 5. Xem hoặc Tải file
app.get('/file/:folder/:file', (req, res) => {
    const filePath = path.join(uploadDir, req.params.folder, req.params.file);
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).send("Không tìm thấy file");
    }
});

// 6. Xóa file (Chức năng quan trọng)
app.delete('/delete/:folder/:file', (req, res) => {
    const filePath = path.join(uploadDir, req.params.folder, req.params.file);
    if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
            if (err) return res.status(500).send("Lỗi khi xóa");
            res.send("Xóa thành công");
        });
    } else {
        res.status(404).send("File không tồn tại");
    }
});

// Khởi chạy Server cho Render
app.listen(process.env.PORT || 3000, '0.0.0.0', () => {
    console.log("Server đang chạy...");
});