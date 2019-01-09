from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def main():
    return render_template('contents.html', result="")

@app.route("/", methods=['POST'])
def predict():
    img_file = request.files['img_file']
    return request.data

if __name__ == "__main__":
    app.run(debug=True)