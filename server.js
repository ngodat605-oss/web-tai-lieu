const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(express.static('public'));
app.use(fileUpload());

const uploadDir = path.join(__dirname, 'uploads');

// UPLOAD FILE
app.post('/upload', (req, res) => {
    let file = req.files.file;

    // đổi tên để tránh lỗi trùng + ký tự đặc biệt
    let fileName = Date.now() + "-" + file.name;

    file.mv(path.join(uploadDir, fileName), (err) => {
        if (err) return res.send('error');
        res.send('ok');
    });
});

// LIST FILE
app.get('/files', (req, res) => {
    fs.readdir(uploadDir, (err, files) => {
        res.json(files);
    });
});

// DOWNLOAD FILE (FIX FULL)
app.get('/files/:name', (req, res) => {
    let fileName = decodeURIComponent(req.params.name);
    let filePath = path.join(__dirname, 'uploads', fileName);

    if (!fs.existsSync(filePath)) {
        return res.send("File không tồn tại");
    }

    res.download(filePath);
});

// RUN SERVER
app.listen(process.env.PORT || 3000, '0.0.0.0', () => {
    console.log("Server running...");
});