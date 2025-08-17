# 🎙️ Vietnamese Text-to-Speech System (TTS) 🇻🇳 

## 🌟 Introduction
This project develops a **Text-to-Speech (TTS) System** with advanced **voice cloning** capabilities tailored specifically for Vietnamese.  
It leverages state-of-the-art technologies such as **Deep Learning**, **Transformer**, **U-Net**, **Tacotron**, **FastSpeech**, **VITS**, and uses the **pretrained XTTS-v2** model.

---

## ▶️ Demo Video
📺 Watch the system demo [here](https://www.youtube.com/watch?v=LRkJD9daWrs)

---

## 🚀 Key Features
- 🔊 **Vietnamese Text-to-Speech Conversion:** Generate natural, high-accuracy audio from text input.  
- 🎤 **Voice Cloning:** Clone a voice from just a short sample recording.  
- 🎚️ **Noise Reduction & Audio Enhancement:** Remove noise and unwanted sounds for clearer audio.  
- 🔍 **Voice Similarity Analysis:** Compare and determine the similarity between different voices.

---

## 🛠️ Technologies Used

### Frontend
- ⚛️ **React (with Vite):** Fast, efficient, and intuitive UI development.  
- 🎨 **HTML/CSS/JavaScript:** Modern, user-friendly, and interactive interface design.  

### Backend
- 🐍 **Python 3.11:** Robust and scalable backend logic.  
- 🌐 **FastAPI:** High-performance, secure, and rapid API development framework.  
- 📚 **TensorFlow, PyTorch:** Leading deep learning libraries for model training and deployment.  
- 🎧 **Librosa, Soundfile:** Advanced audio processing libraries for voice feature extraction and analysis.  

### Deep Learning Models
- 🧠 **Transformer** – Efficient processing of natural language and audio.  
- 📢 **Tacotron** – Converts text into Mel Spectrograms.  
- 🚅 **FastSpeech** – Fast and stable speech synthesis without attention mechanisms.  
- 🔊 **VITS** – Combines VAE and GAN for highly natural speech.  
- 🌀 **U-Net** – Noise reduction and audio enhancement.  
- 📌 **XTTS-v2** – Pretrained multilingual model optimized for Vietnamese.  

---

## 📂 Project Structure

```
Voice_cloning_VN
│
├── fe        # Giao diện React
├── be        # Backend FastAPI
├── ai        # Cách mô hình Deep Learning được huấn luyện
├── data      # Dữ liệu được thu thập, tiền xử lý và sử dụng

```
---

## 📂 Dataset

The system was trained and evaluated on a variety of datasets:

- **[VLSP2020](https://institute.vinbigdata.org/events/vinbigdata-chia-se-100-gio-du-lieu-tieng-noi-cho-cong-dong/)** – A Vietnamese speech dataset with over 100 hours of recorded audio, designed for speech processing research.

- **LibriSpeech** – A large-scale, high-quality English speech dataset extracted from public audiobooks.

- **VoxCeleb** – A diverse speech dataset collected from online videos of various celebrities.

- **AISHELL-3** – A Mandarin Chinese speech dataset with multiple speakers, used for both TTS and ASR training.

- **VIVOS** – A Vietnamese speech dataset consisting of short spoken sentences for speech recognition and synthesis.

- **[ESC-50](https://github.com/karolpiczak/ESC-50?tab=readme-ov-file)** – A dataset of 2,000 labeled environmental audio recordings, each 5 seconds long, categorized into 50 semantic classes (40 samples per class).  
  The dataset is divided into 5 major categories:
  1. **Animal sounds** (e.g., chirping birds, barking dogs).
  2. **Natural soundscapes & water sounds** (e.g., rain, sea waves, wind).
  3. **Human non-speech sounds** (e.g., clapping, coughing, footsteps).
  4. **Indoor sounds** (e.g., keyboard typing, door opening, vacuum cleaner).
  5. **Urban noise/outdoor sounds** (e.g., traffic, sirens, trains).


---

## 📸 Illustrations
### 🚧 Deep Learning Model Architecture
| | | | |
|---|---|---|---|
| ![](image/1.JPG) | ![](image/2.JPG) | ![](image/3.JPG) | ![](image/4.JPG) |

### 🎨 System Design & Implementation
| | | | |
|---|---|---|---|
| ![](image/5.JPG) | ![](image/6.JPG) | ![](image/7.JPG) | ![](image/8.JPG) |

### 📊 Model Results
| | |
|---|---|
| ![](image/9.JPG) | ![](image/10.JPG) |

---

## 🚧 Hướng dẫn cài đặt

### Clone Repository
```bash
git clone https://github.com/tttiuem2k3/Voice_cloning_VN.git
cd Voice_cloning_VN
```

### Backend
```bash
pip install -r requirements.txt
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Download Pretrained XTTS-v2 Model
```python
from huggingface_hub import snapshot_download
model_dir = r"./Model"
snapshot_download(repo_id="thinhlpg/viXTTS", repo_type="model", local_dir=model_dir)
```

---

## 🌱 Contribution Guidelines
- ⭐ Star the repository
- 🐞 Report issues via [issues](https://github.com/tttiuem2k3/Voice_cloning_VN/issues)
- 📥 Submit pull requests

---

## 📜 References

- [Tacotron](https://github.com/Rayhane-mamah/Tacotron-2)
- [FastSpeech](https://github.com/ming024/FastSpeech2)
- [XTTS-v2](https://huggingface.co/coqui/XTTS-v2)

---

##  📞 Contact
- 📧 Email: tttiuem2k3@gmail.com
- 👥 Linkedin: [Thịnh Trần](https://www.linkedin.com/in/thinh-tran-04122k3/)
- 💬 Zalo - phone: +84 329966939 | +84 336639775

---
