const form = document.getElementById("upload-form");
const audioFile = document.getElementById("audio-file");
const metadata = document.getElementById("metadata");
const language = document.getElementById("language");
const spinner = document.querySelector(".spinner-border");
const transcriptionText = document.getElementById("transcription-text");

const API_KEY = "<YOUR_ASSEMBLY_API_KEY>";

form.addEventListener("submit", (event) => {
  event.preventDefault();
  spinner.classList.remove("d-none");

  const formData = new FormData();
  formData.append("audio_file", audioFile.files[0]);
  formData.append("metadata", metadata.value);
  formData.append("language", language.value);

  fetch("https://api.assemblyai.com/v2/transcript", {
    method: "POST",
    body: formData,
    headers: {
      authorization: API_KEY,
      "content-type": "multipart/form-data",
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Failed to transcribe audio.");
      }
    })
    .then((data) => {
      checkTranscription(data.id);
    })
    .catch((error) => {
      console.error(error);
      spinner.classList.add("d-none");
    });
});

function checkTranscription(id) {
  fetch(`https://api.assemblyai.com/v2/transcript/${id}`, {
    headers: {
      authorization: API_KEY,
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Failed to check transcription status.");
      }
    })
    .then((data) => {
      if (data.status === "completed") {
        transcriptionText.innerText = data.text;
        spinner.classList.add("d-none");
      } else if (data.status === "queued" || data.status === "processing") {
        setTimeout(() => {
          checkTranscription(id);
        }, 5000);
      } else {
        throw new Error("Transcription failed.");
      }
    })
    .catch((error) => {
      console.error(error);
      spinner.classList.add("d-none");
    });
}
