from flask import Flask, render_template, request
import json
import numpy as np
import cv2
from PIL import Image
from AdversarialMNIST import AdversarialMNIST

model = AdversarialMNIST()
app = Flask(__name__)

@app.route('/')
def main():
    return render_template('contents.html')

@app.route("/predict", methods=['POST'])
def predict():
    img_stream = request.files['image'].stream
    img_array = np.asarray(bytearray(img_stream.read()), dtype=np.uint8)
    img = cv2.imdecode(img_array, 2).reshape(-1,)
    res = model.predict([img], True)
    
    res = {
        'predict_number' : str(res[0][0]),
        'prob': str(res[1])
    }
    return json.dumps(res)

if __name__ == "__main__":
    model.load_model(model_path='./model/MNIST.ckpt')
    app.run(debug=True)