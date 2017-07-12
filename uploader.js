(function () {
    var defaultOption = {
        form_id: "fileForm",
        input_name: "data",
        file_types: ["image/jpg", "image/jpeg", "image/png"],
        file_size: 1024 * 1024 * 10,
        value_name: "data-value",
        success: function (data) {
            console.info(data);
        },
        fail: function (data) {
            console.info(data);
        },
        fileChange: function () {
            return true;
        }
    }
    $.fn.ddUploader = function (option) {
        var fileField = {};
        var options = $.extend({}, defaultOption, option);
        var fileForm = document.createElement("form");
        $(fileForm).prop("id", options.form_id);
        $(fileForm).prop("action", options.action);
        $(fileForm).prop("method", "POST");
        $(fileForm).prop("enctype", "multipart/form-data");
        fileField.input_file = $("<input type='file' name='" + options.input_name +"' id='file'/>");
        $(fileForm).append(fileField.input_file);
        document.body.appendChild(fileForm);
        $(fileForm).hide();
        $("#file").change(function () {fileChange(options, fileField, this)});
        $(this).click(function () {fileField.input_file.click()});
    };

    function fileChange(options, fileField, _this) {
        fileField.file_path = $(_this).val();
        fileField.file = $(_this)[0].files[0];
        if (options.fileChange(fileField)) {
            if(options.file_types.indexOf(fileField.file.type) < 0){
                WECHAT.layer_msg("请上传正确的文件格式");
                return;
            }
            if (options.file_size < fileField.file.size) {
                WECHAT.layer_msg("文件过大");
                return;
            }
            $("#" + options.form_id).ajaxSubmit({
                success: function (data) {
                    if (data.code == 0) {
                        options.success(data.data);
                    } else {
                        WECHAT.layer_msg("上传失败，请稍后重试");
                    }
                },
                fail: options.fail
            });
        }
    }

    $.fn.ddWeuiUploader = function (option) {
        var that = this;
        var fileField = {};
        var options = $.extend({}, defaultOption, option);
        var fileForm = document.createElement("form");
        $(fileForm).prop("id", options.form_id);
        $(fileForm).prop("action", options.action);
        $(fileForm).prop("method", "POST");
        $(fileForm).prop("enctype", "multipart/form-data");
        fileField.input_file = $("<input type='file' name='" + options.input_name +"' id='file'/>");
        $(fileForm).append(fileField.input_file);
        document.body.appendChild(fileForm);
        $(fileForm).hide();
        $("#file").change(function () {weuiFileChange(options, fileField, this, that)});
        $(that).click(function () {fileField.input_file.click()});
    };

    function weuiFileChange (options, fileField, _this, that) {
        fileField.file_path = $(_this).val();
        fileField.file = $(_this)[0].files[0];
        if (options.fileChange(fileField)) {
            if(options.file_types.indexOf(fileField.file.type) < 0){
                WECHAT.layer_msg("请上传正确的文件格式");
                return;
            }
            debugger;
            if (options.file_size < fileField.file.size) {
                WECHAT.layer_msg("文件过大");
                return;
            }
            returnWeuiImg(options, fileField, that);
        }
    }

    function returnWeuiImg(options, fileField, that){
        var reader = new FileReader();
        reader.onload = function (e) {
            var img = new Image();
            img.onload = function () {
                if (img.height > img.width) {
                    // 不要超出最大宽度
                    var w = 79;
                    // 高度按比例计算
                    var h = img.height * (w / img.width);
                } else {
                    var h = 79;
                    // 高度按比例计算
                    var w = img.width * (h / img.height);
                }
                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d');
                // 设置 canvas 的宽度和高度
                canvas.width = w;
                canvas.height = h;
                ctx.drawImage(img, 0, 0, w, h);
                var base64 = canvas.toDataURL('image/png');

                // 插入到预览区
                var $preview = $('<li class="weui_uploader_file weui_uploader_status up-style" ' + options.value_name +'="" style="background-image:url(' + base64 + '); width: 79px; height: 79px"><div class="weui_uploader_status_content">0%</div><i class="weui-icon-cancel"></i></li>');
                $(that).parent().find('.weui-uploader__files').append($preview);
                $preview.find(".weui-icon-cancel").click(deleteImg);
                var intervalUploader = setInterval(uploading, 30);
                $("#" + options.form_id).ajaxSubmit({
                    success: function (data) {
                        window.clearInterval(intervalUploader);
                        $preview.find('.weui_uploader_status_content').remove();
                        if (data.code == 0) {
                            options.success(data.data);
                            $preview.attr(options.value_name, data.data[0]);
                        }else {
                            WECHAT.layer_msg("上传失败");
                        }
                    },
                    fail: options.fail
                });

                var progress = 0;
                function uploading() {
                    progress ++;
                    if (progress > 1000) {
                     // 如果是失败，塞一个失败图标
                     //$preview.find('.weui_uploader_status_content').html('<i class="weui_icon_warn"></i>');
                        $preview.removeClass('weui_uploader_status').find('.weui_uploader_status_content').remove();
                    }
                    $preview.find('.weui_uploader_status_content').text((progress > 100? 99: progress) + '%');
                }
            };

            img.src = e.target.result;
        };
        reader.readAsDataURL(fileField.file);
    }

    function deleteImg() {
        $(this).parent().remove();
    }

})();
