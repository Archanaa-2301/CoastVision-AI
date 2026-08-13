# 🏖️ Sand Grain Analysis Using Deep Learning

An AI-powered sand grain analysis system that uses **computer vision and deep learning** to analyze sand images, classify grain characteristics, and estimate important grain-size parameters such as **D50 (median grain size)** and mean grain size.

The system is designed to automate sand-grain analysis that is traditionally performed through manual observation and laboratory-based measurements.

---

## 📌 Project Overview

Sand grain size and distribution are important parameters in applications such as:

* 🏗️ Construction and civil engineering
* 🌊 Coastal and beach analysis
* 🌱 Environmental studies
* 🪨 Geological research
* 🏖️ Sediment characterization

Traditional analysis can be time-consuming and requires manual measurement of individual grains.

This project uses **image processing + deep learning** to automate the analysis of sand samples from images.

### Core Pipeline

```text
                Sand Sample Image
                       │
                       ▼
              Image Preprocessing
                       │
          ┌────────────┴────────────┐
          │                         │
          ▼                         ▼
   Grain Classification      Grain Detection/
   Fine / Medium / Coarse      Segmentation
          │                         │
          └────────────┬────────────┘
                       ▼
                Grain Size Analysis
                       │
             ┌─────────┴─────────┐
             ▼                   ▼
           D50             Mean Grain Size
             │                   │
             └─────────┬─────────┘
                       ▼
                Analysis Report
```

---

## 🎯 Objectives

The main objectives of this project are:

1. Automatically preprocess sand-grain images.
2. Identify and analyze individual sand grains.
3. Classify sand samples into **Fine, Medium, and Coarse** categories.
4. Estimate grain-size characteristics from images.
5. Calculate **D50 (median grain size)**.
6. Calculate mean and standard deviation of grain sizes.
7. Reduce dependency on manual grain-size analysis.
8. Provide an automated and reproducible analysis pipeline.

---

## ✨ Key Features

### 🔹 Image Preprocessing

The input images are processed to improve their quality before being provided to the deep learning model.

The preprocessing pipeline may include:

* RGB conversion
* Contrast enhancement
* CLAHE
* Noise reduction
* Edge preservation
* Image cropping
* Image resizing
* Pixel normalization

---

### 🔹 Sand Grain Classification

The system classifies sand based on grain-size characteristics:

| Category | Description              |
| -------- | ------------------------ |
| Fine     | Smaller grain sizes      |
| Medium   | Intermediate grain sizes |
| Coarse   | Larger grain sizes       |

A CNN-based deep learning model is used to learn visual patterns associated with different grain-size categories.

---

### 🔹 Grain Size Analysis

The system analyzes detected grains and calculates statistical parameters such as:

* Mean grain size
* Median grain size
* D50
* Standard deviation
* Number of detected grains
* Grain-size distribution

---

### 🔹 D50 Estimation

**D50** represents the grain diameter at which approximately **50% of the sample is finer and 50% is coarser**.

The estimated grain-size distribution can be used to derive D50 automatically from image-based measurements.

```text
Grain Size Distribution
          │
          ▼
 Sort measured grain sizes
          │
          ▼
 Calculate cumulative distribution
          │
          ▼
 Find 50% point
          │
          ▼
         D50
```

---

## 🧠 Machine Learning Approach

The project uses deep learning and computer vision techniques for image-based sand analysis.

### Model

A **Convolutional Neural Network (CNN)** is used for sand-grain classification.

Transfer learning can be used to improve performance when the available dataset is relatively small.

Potential architectures include:

* MobileNetV2
* EfficientNet
* ResNet
* Custom CNN architectures

The model learns visual features such as:

* Grain shape
* Texture
* Size-related patterns
* Edge characteristics
* Surface appearance

---

## 🛠️ Technology Stack

### Programming

* Python

### Machine Learning

* TensorFlow
* Keras
* NumPy
* Pandas
* Scikit-learn

### Computer Vision

* OpenCV
* Image preprocessing
* Contour analysis
* Image segmentation

### Visualization

* Matplotlib

### Development

* Jupyter Notebook
* Google Colab / Local Python environment
* Git
* GitHub

---

## 📂 Project Structure

```text
sand-grain-analysis/
│
├── data/
│   ├── raw/
│   ├── processed/
│   └── labels/
│
├── notebooks/
│   ├── preprocessing.ipynb
│   ├── classification.ipynb
│   └── grain_analysis.ipynb
│
├── models/
│   └── trained_models/
│
├── utils/
│   ├── preprocessing.py
│   ├── grain_detection.py
│   └── grain_analysis.py
│
├── src/
│   ├── train.py
│   ├── predict.py
│   └── analysis.py
│
├── results/
│   ├── predictions/
│   ├── plots/
│   └── reports/
│
├── requirements.txt
├── README.md
└── .gitignore
```

---

## 🔄 Workflow

### Step 1 — Input

A sand sample image is provided as input.

### Step 2 — Preprocessing

The image is enhanced and normalized to improve the visibility of grain boundaries and important visual features.

### Step 3 — Grain Detection

Individual sand grains are identified using computer-vision techniques.

### Step 4 — Feature Extraction

Relevant visual and geometric characteristics are extracted from the grains.

Examples include:

* Area
* Diameter
* Shape
* Texture
* Grain distribution

### Step 5 — Classification

The trained CNN model predicts the sand category:

```text
Fine
Medium
Coarse
```

### Step 6 — Statistical Analysis

The measured grain sizes are analyzed to calculate:

```text
Mean Grain Size
Median Grain Size
D50
Standard Deviation
Detected Grain Count
```

### Step 7 — Final Output

The system produces a structured analysis containing the predicted category, confidence, and grain-size statistics.

---

## 📊 Example Output

```text
-----------------------------------------
        SAND GRAIN ANALYSIS
-----------------------------------------

Predicted Category : Medium
Model Confidence   : 94.6%

CNN Model          : MobileNetV2

Detected Grains    : 386

Mean Grain Size    : XX.XX mm
D50                : XX.XX mm
Standard Deviation : XX.XX mm

-----------------------------------------
```

---

## 📈 Dataset

The model requires labeled sand-grain images representing different grain-size categories.

The dataset can contain samples belonging to:

```text
Fine
Medium
Coarse
```

Each image should ideally have consistent imaging conditions, including:

* Similar camera setup
* Appropriate illumination
* Known reference scale
* Sufficient image resolution
* Minimal overlapping grains

A reference object or scale marker can be used to convert image measurements from **pixels to physical units such as millimeters**.

---

## 📏 Pixel-to-Real-World Measurement

Image-based grain measurements initially exist in pixel units.

To obtain physical grain sizes:

```text
Pixel Measurement
       │
       ▼
Reference Scale
       │
       ▼
Pixels → Millimeters
       │
       ▼
Physical Grain Size
```

For example, if a reference object of known length is present:

```text
pixels_per_mm = reference_pixels / reference_length_mm
```

Then:

```text
grain_size_mm = grain_size_pixels / pixels_per_mm
```

This allows the system to estimate actual grain dimensions.

---

## 🧪 Model Evaluation

The classification model can be evaluated using:

* Accuracy
* Precision
* Recall
* F1-score
* Confusion Matrix
* Validation Accuracy
* Validation Loss

For regression or grain-size estimation:

* MAE
* MSE
* RMSE
* R² Score

---

## 🚀 Installation

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/sand-grain-analysis.git
cd sand-grain-analysis
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

---

## ▶️ Running the Project

Place the dataset inside:

```text
data/
```

Run preprocessing:

```bash
python src/preprocessing.py
```

Train the classification model:

```bash
python src/train.py
```

Run prediction:

```bash
python src/predict.py
```

Run grain-size analysis:

```bash
python src/analysis.py
```

> The exact commands will be updated as the project implementation is finalized.

---

## 🔬 Expected Applications

This system can potentially be used for:

* Automated sediment analysis
* Beach sand characterization
* Construction material analysis
* Geological studies
* Environmental monitoring
* Research-oriented grain-size analysis

---

## 🔮 Future Improvements

Future versions of the project can include:

* Real-time sand-grain detection
* YOLO-based individual grain detection
* Instance segmentation for overlapping grains
* Automatic scale/reference detection
* Grain-shape classification
* Advanced grain-size distribution analysis
* Web-based analysis dashboard
* Automated PDF report generation
* GPS/GNSS tagging
* GIS visualization
* Mobile application integration

---

## 📌 Project Status

🚧 **Under Development**

The current project is being developed as an image-based AI system for automated sand-grain classification and grain-size analysis.

---

## 👩‍💻 Author

**Archanaa M**

Computer Science and Engineering
PSNA College of Engineering and Technology

---

## 📄 License

This project is intended for educational, research, and experimental purposes.
