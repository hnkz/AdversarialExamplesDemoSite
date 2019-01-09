document.addEventListener('DOMContentLoaded', function () {
  var
    dropArea = document.getElementById('dropArea'),
    output = document.getElementById('output'),
    child_elm = document.createElement('div'),

    // 画像の最大ファイルサイズ（20MB）
    maxSize = 20 * 1024 * 1024;

  // ドロップされたファイルの整理
  function organizeFiles(files) {
    var
      length = files.length,
      i = 0, file;

    for (; i < length; i++) {
      // file には Fileオブジェクト というローカルのファイル情報を含むオブジェクトが入る
      file = files[i];

      // 画像以外は無視
      if (!file || file.type.indexOf('image/') < 0) {
        continue;
      }

      // 指定したサイズを超える画像は無視
      if (file.size > maxSize) {
        continue;
      }

      // 画像出力処理へ進む
      // outputImage(file);
    }
  }

  // 画像の出力
  function outputImage(blob) {
    var
      // 画像要素の生成
      image = new Image(50, 50),

      // File/BlobオブジェクトにアクセスできるURLを生成
      blobURL = URL.createObjectURL(blob);

    // src にURLを入れる
    image.src = blobURL;

    // 画像読み込み完了後
    image.addEventListener('load', function () {
      // File/BlobオブジェクトにアクセスできるURLを開放
      URL.revokeObjectURL(blobURL);

      // #output へ出力
      child_elm.append(image);
    });
  }

  // ドラッグ中の要素がドロップ要素に重なった時
  dropArea.addEventListener('dragover', function (ev) {
    ev.preventDefault();

    // ファイルのコピーを渡すようにする
    ev.dataTransfer.dropEffect = 'copy';

    dropArea.classList.add('dragover');
  });

  // ドラッグ中の要素がドロップ要素から外れた時
  dropArea.addEventListener('dragleave', function () {
    dropArea.classList.remove('dragover');
  });

  // ドロップ要素にドロップされた時
  dropArea.addEventListener('drop', function (ev) {
    ev.preventDefault();

    dropArea.classList.remove('dragover');
    output.textContent = '';

    outputImage(ev.dataTransfer.files[0]);
    sendImage(ev.dataTransfer.files[0]);
    ev.dataTransfer.files = null;
  });

  // #dropArea がクリックされた時
  dropArea.addEventListener('click', function () {
    fileInput.click();
  });

  // ファイル参照で画像を追加した場合
  fileInput.addEventListener('change', function (ev) {
    output.textContent = '';

    outputImage(ev.target.files[0]);
    sendImage(ev.target.files[0]);
    ev.target.files = null;

    // 値のリセット
    fileInput.value = '';
  });

  function sendImage(image) {
    var xhr = new XMLHttpRequest();
    var fd = new FormData();
    var url = "http://127.0.0.1:5000/predict";

    fd.append("image", image);
    xhr.open('POST', url, true);

    // result
    xhr.onload = function() {
      if (this.status == 200) {
        var resp = JSON.parse(this.response);
        console.log('Server got:', resp);
        if(resp['predict_number']) {
          var elem = document.getElementById("predict");
          child_elm.id = 'child';
          res_elm = document.createElement('p');
          res_elm.textContent = 'Probable result is "' + resp['predict_number'] + '".';
          child_elm.append(res_elm);
          elem.insertBefore(child_elm, elem.firstChild);
          
          child_elm = document.createElement('div');
        }
      };
    };

    xhr.send(fd);
  }
});