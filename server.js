const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(express.static('public'));
app.use(fileUpload());

const uploadDir = path.join(__dirname, 'uploads');

/* 📁 UPLOAD VÀO 1 THƯ MỤC */
app.post('/upload', (req, res) => {
    let folder = req.body.folder;

    if (!folder) return res.send("Thiếu tên thư mục");

    let folderPath = path.join(uploadDir, folder);

    // tạo folder nếu chưa có
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }

    let file = req.files.file;

    // giữ tên file gốc (fix tiếng Trung / Việt)
    let fileName = Buffer.from(file.name, 'latin1').toString('utf8');

    file.mv(path.join(folderPath, fileName), (err) => {
        if (err) return res.status(500).send(err);
        res.send("Upload OK");
    });
});

/* 📁 LẤY DANH SÁCH FOLDER */
app.get('/folders', (req, res) => {
    fs.readdir(uploadDir, (err, folders) => {
        if (err) return res.status(500).send(err);
        res.json(folders);
    });
});

/* 📄 LẤY FILE TRONG FOLDER */
app.get('/files/:folder', (req, res) => {
    let folderPath = path.join(uploadDir, req.params.folder);

    fs.readdir(folderPath, (err, files) => {
        if (err) return res.status(500).send(err);
        res.json(files);
    });
});

/* 📥 MỞ FILE */
app.get('/file/:folder/:file', (req, res) => {
    let filePath = path.join(uploadDir, req.params.folder, req.params.file);
    res.download(filePath);
});

app.listen(3000, () => {
    console.log("http://localhost:3000");
});
/* DOWNLOAD */
app.get('/files/:name', (req, res) => {
    res.download(path.join(uploadDir, req.params.name));
});

/* ⭐ QUAN TRỌNG CHO WEB VĨNH VIỄN */
app.listen(process.env.PORT || 3000, '0.0.0.0', () => {
    console.log("Server running");
});