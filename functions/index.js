const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({origin: true});

admin.initializeApp();

exports.uploadResume = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }

    const fileName = req.body.fileName;
    const fileContent = req.body.fileContent;

    const bucket = admin.storage().bucket();
    const file = bucket.file(`resumes/${req.body.userId}/${fileName}`);
    await file.save(Buffer.from(fileContent, "base64"));

    res.status(200).send("File uploaded successfully");
  });
});
