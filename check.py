import sys
import os
from PIL import Image
import numpy as np
from AdversarialMNIST import AdversarialMNIST

def check():
    model = AdversarialMNIST()
    model.load_model(model_path='./model/MNIST.ckpt')

    n_imgpaths = os.listdir('./n_img')
    ad_imgpaths = os.listdir('./ad_img')

    n_imgs = [np.array(Image.open(os.path.join('./n_img', imgpath)).convert('L')).reshape(-1, ) for imgpath in n_imgpaths]
    ad_imgs = [np.array(Image.open(os.path.join('./ad_img', imgpath)).convert('L')).reshape(-1, ) for imgpath in ad_imgpaths]

    print(n_imgs[0].shape)
    n_result = model.predict(n_imgs, True)
    ad_result = model.predict(ad_imgs, True)

    print("----- Normal Image Prediction -----")
    for i in range(10):
        print(n_imgpaths[i] + ': ' + str(n_result[0][i]))

    print("----- AD Image Prediction -----")
    for i in range(10):
        print(ad_imgpaths[i] + ': ' + str(ad_result[0][i]))

if __name__ == '__main__':
    check()