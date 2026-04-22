const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(express.static('public'));
app.use(fileUpload());

const uploadDir = path.join(__dirname, 'uploads');

/* UPLOAD FILE */
app.post('/upload', (req, res) => {
    let file = req.files.file;

    // ⭐ FIX: đổi tên file để không lỗi ký tự đặc biệt
    let safeName = Date.now() + "-" + file.name;

    file.mv(path.join(uploadDir, safeName), (err) => {
        if (err) return res.send('error');
        res.send('ok');
    });
});

/* LIST FILE */
app.get('/files', (req, res) => {
    fs.readdir(uploadDir, (err, files) => {
        res.json(files);
    });
});

/* DOWNLOAD FILE (FIX FULL UTF-8 + & + tiếng Trung) */
app.get('/files/:name', (req, res) => {
    let fileName = decodeURIComponent(req.params.name);
    let filePath = path.join(uploadDir, fileName);
    res.download(filePath);
});

/* RUN SERVER */
app.listen(process.env.PORT || 3000, '0.0.0.0', () => {
    console.log("Server running");
});