const express = require('express');
const router = express.Router();

const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});

const upload = multer({ storage: storage });

router.post('/upload', upload.single('audio'), (req, res) => {
  // Handle file upload
});

const assemblyai = require('assemblyai');

const api_token = process.env.ASSEMBLYAI_API_TOKEN;
const client = new assemblyai.Client(api_token);

router.post('/upload', upload.single('audio'), async (req, res) => {
    try {
      // Transcribe the audio file using AssemblyAI
      const { data } = await client.transcribe({
        audio_url: req.file.path,
        speaker_labels: true,
        language_model: 'assemblyai_default',
      });
  
      // Save the transcription to the database
      const transcription = new Transcription({
        fileName: req.file.originalname,
        text: data.text,
        confidence: data.confidence,
        words: data.words,
      });
      await transcription.save();
  
      // Return the transcription as a response
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error transcribing audio' });
    }
  });
  

module.exports = router;

