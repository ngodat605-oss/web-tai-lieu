const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(express.static('public'));
app.use(fileUpload());

const baseDir = path.join(__dirname, 'uploads');

/* tạo folder nếu chưa có */
if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir);
}

/* upload vào folder */
app.post('/upload/:folder', (req, res) => {
    let folder = req.params.folder;
    let dir = path.join(baseDir, folder);

    if (!fs.existsSync(dir)) fs.mkdirSync(dir);

    let file = req.files.file;

    let safeName = Date.now() + "-" + file.name;

    file.mv(path.join(dir, safeName), err => {
        if (err) return res.send('error');
        res.send('ok');
    });
});

/* list file trong folder */
app.get('/files/:folder', (req, res) => {
    let folder = req.params.folder;
    let dir = path.join(baseDir, folder);

    if (!fs.existsSync(dir)) return res.json([]);

    fs.readdir(dir, (err, files) => {
        res.json(files);
    });
});

/* download file */
app.get('/file/:folder/:name', (req, res) => {
    let folder = req.params.folder;
    let name = decodeURIComponent(req.params.name);

    let filePath = path.join(baseDir, folder, name);
    res.download(filePath);
});

/* delete file */
app.delete('/file/:folder/:name', (req, res) => {
    let folder = req.params.folder;
    let name = decodeURIComponent(req.params.name);

    let filePath = path.join(baseDir, folder, name);

    fs.unlinkSync(filePath);

    res.send('deleted');
});

/* chạy server */
app.listen(process.env.PORT || 3000, '0.0.0.0', () => {
    console.log("Drive running");
});