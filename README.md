# jquery-fileUpload
####自己写的jquery异步上传组件，有两个jquery自定义方法，一个图片回显，一个图片不回显
用法：
  图片不回显示
    html: <div class="col-8 arrow" id="uploadHead" data-name="data"></div>
    js：$("#uploadHead").ddUploader({
        action: _base + "/exam/uploadHeadIcon",
        input_name: "data",
        success: function (data) {
            $("img[name=headCode]").attr("data-headCode", data[0]).prop("src", _base + "/exam/getFileStream?fileCode=" + data[0]);
        }
    });
  图片回显:(这里我使用weui的样式，自己可以通过已有dom自定义样式)
      html：<div class="weui-uploader__bd">
              <ul class="weui-uploader__files" name="dataName"></ul>
              <div class="weui-uploader__input-box" id="uploaderFiles"></div>
          </div>
      js： $("#uploaderFiles").ddWeuiUploader({
            action: _base + "/exam/uploadImg",
            input_name: "data",
            value_name: "data-code"
        });
