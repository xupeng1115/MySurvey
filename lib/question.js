

var requestUrl = {
    QuestionnaireUrl: '../Question/Questionnaire',                // '@Url.Action("Questionnaire", "Question")',
    QuestionnaireViewUrl: '../Question/QuestionnaireView',        // '@Url.Action("QuestionnaireView", "Question")',
    QuestionnaireFormUrl: '../Question/QuestionnaireForm',       //'@Url.Action("QuestionnaireForm", "Question")',
    SaveQuestionUrl: '../Question/SaveQuestion',                 //'@Url.Action("SaveQuestion", "Question")'
    QuestionsUrl: '../Question/QuestionList',
    DeleteQuestionInfoUrl: '../Question/DeleteQuestionInfo',
    EditQustionsDescUrl: '../Question/EditQustionsDesc'

};

var questionnaireId;
var typeId;
var qNum = 0;
var ReQnum = 0;
var sumWidth = 99;
var islocked;
//文本框只能输入数字，并屏蔽输入法和粘贴
$.fn.numeral = function () {
    this.bind("keypress", function (e) {
        var currKey = 0, e = e || event;
        if (e.keyCode >= 48 && e.keyCode <= 57) {
            return true;
        }
        return false;
    });
    this.bind("paste", function () {
        var s = clipboardData.getData('text');
        if (!/\D/.test(s));
        value = s.replace(/^0*/, '');
        return false;
    });
    this.bind("keyup", function () {
        this.value = this.value.replace(/[^0-9-]+/, '');
    });
};

$(document).ready(function () {

    $("#navbar").find(".tabQTypet li a[href^='#']").on('click', function (e) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: $(this.hash).offset().top - 60
        }, 500);
    });
    $('body').scrollspy({
        offset: 60
    });

    $("#qstContent").height($(document).height() - 67);
    $(window).resize(function () {
        $("#qstContent").height(100);
        $("#qstContent").height($(document).height() - 67);
    });
    questionnaireId = $("#txt_QuestionnaireId").val();


    var Request = new Object();
    Request = GetRequest();
    questionnaireId = Request["id"] ? Request["id"] : "";

    $('input').on("focus", function () {
        if (this.value == '' || this.value == this.defaultValue) {
            if (this.value == this.defaultValue && this.type != "button") {
                this.value = '';
            }
        }
    });
    $('input').on("blur", function () {
        if ((this.value == '' || this.value == this.defaultValue) && this.type != "button") {
            this.value = this.defaultValue;
        }
    });
    $("#divId").click(function () {
        var QuestionId = $("#txtQstionId_desc").val();
        dialog({
            id: 'winAdd', url: requestUrl.EditQustionsDescUrl + "?QuestionnaireId=" + questionnaireId + "&QuestionId=" +QuestionId, width: 550
        }).showModal();
    });
    BindData(questionnaireId);

    $(".div_question").hover(function () {
        $(this).find(".div_preview").find(".spanRight").css("visibility", "visible");
    }, function () {
        $(this).find(".div_preview").find(".spanRight").css("visibility", "hidden")
    });

    islocked = $("#txt_IsLocked").val();//问卷已锁，不能删除
    if (islocked == "1") {
        $(".div_question").each(function () {
            $(this).find(".design-delete").parent().parent().css("display", "none");
        });
    }
});

function GetPaterDesc(desc) {
    if (desc == 'get') {
        var txtDesc = $("#pater_desc").html();
        return txtDesc
    }
    $("#pater_desc").html(desc);
}
function GetPaterTitle(title) {
    if (title == 'get') {
        var txtTitle = $("#pater_title").text();
        return txtTitle;
    }
    $("#pater_title").text(title);
}
function GetRequest() {
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
        }
    }
    return theRequest;
}

function openDialog(name) {
    window.open(requestUrl.QuestionnaireViewUrl + '?id=' + questionnaireId);
}

function IsShowRequireSpan(obj) {
    var ischecked = $(obj).is(":checked");
    var id = $(obj).parents(".div_question").attr("id");
    if (ischecked) {
        $("#" + id).find(".div_title_question").find("#isRequire").css("display", "block");
    } else {
        $("#" + id).find(".div_title_question").find("#isRequire").css("display", "none");
    }
}

function getOptionRow(optionId, optionContent, allowWrite, optionScore) {
    if (!optionId)
        optionId = "";
    if (!optionContent)
        optionContent = "";
    if (!allowWrite)
        allowWrite = "";
    if (!optionScore)
        optionScore = "0";
    var row = $("<tr class='trOption'></tr>");
    var td1 = $("<td style='width: 150px;'>"
            + "<input tabindex='1' name='OptionId' type='hidden' value='" + optionId + "' />"
            + "<input tabindex='1' name='OptionContent' onkeyup='optionContentKeyup(this)' onfocus='optionContentFocus(this)' onblur='optionContentBlur(this)' value='" + optionContent + "' title='回车添加新选项，上下键编辑前后选项' class='inputtext choicetxt' style='width: 150px;' type='text'>"
            + "</td>"
        );
    var td2 = $("<td><span style='vertical-align: bottom; text-align: center;'>"
            + "<input tabindex='-1' name='AllowWrite' title='允许填空' onchange='optionAllowWriteChanage(this)' style='vertical-align: bottom;' type='checkbox' " + allowWrite + ">"
            + "<span style='visibility: hidden;'>&nbsp;必填"
            + "<input tabindex='-1' name='InputMustFill' title='文本框必填' type='checkbox'>"
            + "</span></span></td>"
        );
    var td3 = $("<td align='left' style=''><span>&nbsp;"
            + "<input name='OptionScore' title='在此可以设置每个选项的分数（请输入整数）' value='" + optionScore + "' class='inputtext' style='width: 40px;'"
            + "type='text' maxlength='5'></span></td>"
        );
    var td4 = $("<td align='center'>"
            + "<span title='在此选项下面插入一个新的选项' onclick='addNewItem(this)' class='glyphicon glyphicon-plus' style='cursor: pointer;'></span>&nbsp;"
            + "<span title='删除当前选项（最少保留2个选项）' onclick='deleteItem(this)' class='glyphicon glyphicon-minus' style='cursor: pointer;'></span>&nbsp;"
            + "<span title='将当前选项上移一个位置' onclick='moveUp(this)' class='glyphicon glyphicon-arrow-up' style='cursor: pointer;'></span>&nbsp;"
            + "<span title='将当前选项下移一个位置' onclick='moveDown(this)' class='glyphicon glyphicon-arrow-down' style='cursor: pointer;'></span>"
            + "</td>"
        );
    row.append(td1);
    row.append(td2);
    row.append(td3);
    row.append(td4);
    return row;
}

function optionContentKeyup(obj) {
    //var inputType = "radio";
    //if (typeId == 2)
    //    inputType = "checkbox";
    //var text = $(obj).val();
    //var index = $(obj).parent().parent('tr').parent().find("tr.trOption").index($(obj).parent().parent("tr")) + 1;

}

function optionContentFocus(obj) {
    //            if (obj.value == '' || obj.value == obj.defaultValue) {
    //                if (obj.value == obj.defaultValue && obj.type != "button") {
    //                    obj.value = '';
    //                }
    //            }
}

function optionContentBlur(obj) {
    var id = $(obj).parents(".div_question").attr("id");
    var tblObj = $(obj).parent().parent().parent();
    //var divobj = $(tblObj).parent().parent().parent().parent().parent().parent();
    var divobj = $("#" + id);
    var selval = Number($("#selShowStyle", divobj).val());//获取每列显示几个
    var width = sumWidth / selval;
    var currentQType = $(divobj).find("#currentQType").text();//获取当前题型

    var rows = tblObj.find("tr.trOption").not("#Template_trOption");
    var i = 0;
    if (checkOption(obj)) {
        var ul = $(".div_preview", divobj).find(".div_table_radio_question").find("ul");
        var lis = $(ul).find("li");

        if (rows.length != lis.length) {
            $(ul).find("li").remove();
            for (var i = 0; i < rows.length; i++) {
                var txtContent = $(rows[i]).find("input[name='OptionContent']").val();
                var html = AppendLi(width, currentQType, txtContent);
                $(ul).append(html);
            }
        } else {
            $(ul).find("li").each(function () {
                var lbtxt = $(this).find("label").text($(rows[i]).find("input[name='OptionContent']").val());
                i++;
            });
        }
    }
}
//可填写选中，则在对应的选项下追加文本框
function optionAllowWriteChanage(obj) {
    var id = $(obj).parents(".div_question").attr("id");
    var tblObj = $("#" + id).find("#QuestionOptions");
    var divobj = $("#" + id);

    var lis = $(".div_preview", divobj).find(".div_table_radio_question").find("ul").find("li");
    var rows = tblObj.find("tr.trOption").not("#Template_trOption");

    var index = $(rows).index($(obj).parent().parent().parent("tr"));//获取当前选中行的下标

    if ($(obj).is(":checked")) {
        var strHtml = "<input type='text' />"
        lis.eq(index).append(strHtml);
    } else {
        lis.eq(index).find("input:text").remove();
    }

}
function AppendLi(width, currentQType, OptionContent) {
    var html = "";
    switch (currentQType) {
        case "单选题":
            html += '<li style="width:' + width + '%;">';
            html += '<input style="" type="radio">';
            html += '<label style="vertical-align:middle;padding-left:2px;">' + OptionContent + '</label>';
            html += "</li>";
            break;
        case "多选题":
            html += '<li style="width:' + width + '%;">';
            html += '<input style="" type="checkbox">';
            html += '<label style="vertical-align:middle;padding-left:2px;">' + OptionContent + '</label>';
            html += "</li>";
            break;
    }
    return html;
}

//验证选项是否重复新增
function checkOption(obj) {
    var id = $(obj).parents(".div_question").attr("id");
    var tblObj = $("#" + id).find("#QuestionOptions");
    var divobj = $("#" + id);

    var rows = tblObj.find("tr.trOption").not("#Template_trOption");
    var index = rows.index($(obj).parent().parent("tr")) + 1;//当前选项的下标
    var CurrentOptionContent = $(obj).val();
    for (var i = 0; i < rows.length; i++) {
        if ((i + 1) == index || index == 0)
            continue;
        var trtxt = $(rows[i]).find("input[name='OptionContent']").val();
        if (trtxt.trim() == CurrentOptionContent.trim()) {
            var html = "<b>提示：</b>";
            html += "第" + (i + 1) + "个选项和第" + index + "个选项重复，请修改！";
            $("#ErrorMsg", divobj).html(html);
            return false;
        }
    }
    $("#ErrorMsg", divobj).html("");
    return true;
}

function addNewItem(opreateobj, obj) {
    var row = getOptionRow();
    if (typeof (opreateobj) == "object") {
        $(opreateobj).parent().parent('tr').after(row);
    }
    else {
        var tblobj = $(obj).parent().parent().parent();
        var tableOption = tblobj.find("#tableOption");
        tableOption.append(row);
        if (typeof (opreateobj) == "string")
            $("#tableOption", tblobj).find("tr:last").find("input[name=OptionContent]").val(opreateobj);
        if (checkOption(obj))
            AddNewLi(tblobj);
    }
}
function AddNewLi(obj) {
    var divobj = obj.parent().parent().parent().parent();
    var tableOption = obj.find("#tableOption");
    var id = $(divobj).attr("id");
    var currentQType = $("#" + id).find("#currentQType").text();

    var selval = Number($("#selShowStyle", divobj).val());
    var width = sumWidth / selval;

    var lastRow = tableOption.find("tr.trOption").last();

    var OptionContent = $(lastRow).find("input[name='OptionContent']").val();
    var html = AppendLi(width, currentQType, OptionContent);

    $("#" + id).find(".div_table_radio_question").find("ul li").last().after(html);
}

function addBatchNewItem(obj) {
    dialog({
        title: '批量添加',
        content: '<textarea name="txtOptionItems" rows="10" cols="200" id="txtOptionItems" class="form-control" style="height:200px;width:300px;"></textarea>',
        okValue: '确定',
        ok: function () {
            var val = $('#txtOptionItems').val();
            var valArray = val.split("\n");
            for (var i = 0; i < valArray.length; i++) {
                addNewItem(valArray[i], obj);
            }
            //this.remove();
        },
        cancelValue: '取消',
        cancel: function () { }
    }).showModal();
}

function deleteItem(obj) {
    var tblObj = $(obj).parent().parent().parent();

    var rows = tblObj.find("tr.trOption").not("#Template_trOption").length;
    if (rows > 2) {
        var txt = $(obj).parent().parent().find("input[name='OptionContent']").val();
        var divobj = $(tblObj).parent().parent().parent().parent().parent().parent();
        $(".div_preview", divobj).find(".div_table_radio_question").find("ul li").each(function () {
            var lbtxt = $(this).find("label").text();
            if (lbtxt.trim() == txt.trim()) {
                $(this).remove();
                return false;
            }
        });
        $(obj).parent().parent().remove();


    }
    else {
        var str = "选择题至少要有两个选项!";
        ShowRemindMessage(str)
    }
}

function moveUp(obj) {
    var tblObj = $(obj).parent().parent().parent();
    if ($(obj).parent().parent('tr').prev() && $(obj).parent().parent('tr').prev()[0].className == "trOption") {
        var txt = $(obj).parent().parent().find("input[name='OptionContent']").val();
        var divobj = $(tblObj).parent().parent().parent().parent().parent().parent();
        $(".div_preview", divobj).find(".div_table_radio_question").find("ul li").each(function () {
            var lbtxt = $(this).find("label").text();
            if (lbtxt.trim() == txt.trim()) {
                $(this).prev().before($(this));
                return false;
            }
        });
        $(obj).parent().parent('tr').prev().before($(obj).parent().parent('tr'));
    }
}
function moveDown(obj) {
    var tblObj = $(obj).parent().parent().parent();
    var txt = $(obj).parent().parent().find("input[name='OptionContent']").val();
    var divobj = $(tblObj).parent().parent().parent().parent().parent().parent();
    $(".div_preview", divobj).find(".div_table_radio_question").find("ul li").each(function () {
        var lbtxt = $(this).find("label").text();
        if (lbtxt.trim() == txt.trim()) {
            $(this).next().after($(this));
            return false;
        }
    });
    $(obj).parent().parent('tr').next().after($(obj).parent().parent('tr'));
}

function ShowRemindMessage(msg)
{
    $("#remindMessage").css("width", "990px");
    $("#remindMessage").css("top", $(document).height() - 50);
    $("#remindMessage").show();
    $("#remindMessage")[0].innerHTML = msg;
    setTimeout("clearRemind()", 3000);
}
function clearRemind() {
    $("#remindMessage").hide();
    $("#remindMessage")[0].innerHTML = "";
}

function deleteQuestion(Id) {
    if (confirm("确定删除选中题目吗？")) {
        var param = [{ name: 'id', value: Id }];
        $.ajax({
            url: '',
            async: false,
            type: "post",
            data: param,
            success: function (data) {
                if ($(data).find("Return").text() == "0") {
                    window.location.reload();
                }
            },
            error: function (result) {

            }
        });
    }
}

function CreateQuestion(id, obj) {
    var typeName = $(obj).text();
    typeId = Number(id);
    ReEditQnumber();
    ReQnum++;

    var cloneObj = $("#singleSelectQ").clone();
    cloneObj = cloneObj.removeAttr("style");
  
    editFormController(cloneObj);
    recoverSelectQ(cloneObj);

    cloneObj = cloneObj.attr("id", "singleSelectQ_" + qNum);

    var ops = $(".div_table_clear_top", cloneObj);
    var tableOption = $("#tableOption", cloneObj);
    var trRows = tableOption.find("tr.trOption");
    var html = "";
    switch (typeId) {
        case 1:
            $("#txt_Height", cloneObj).val('1');
            html += "<ul>";
            for (var i = 0; i < trRows.length; i++) {
                html += '<li style="width:99%;">';
                html += '<input style="" type="radio">';
                html += '<label style="vertical-align:middle;padding-left:2px;">' + $(trRows[i]).find("input[name='OptionContent']").val() + '</label>';
                html += "</li>";
            }
            html += "</ul>";
            break
        case 2:
            $("#txt_Height", cloneObj).val('1');
            html += "<ul>";
            for (var i = 0; i < trRows.length; i++) {
                html += '<li style="width:99%;">';
                html += '<input style="" type="checkbox">';
                html += '<label style="vertical-align:middle;padding-left:2px;">' + $(trRows[i]).find("input[name='OptionContent']").val() + '</label>';
                html += "</li>";
            }
            html += "</ul>";
            break;
        case 3:
            $("#txt_Height", cloneObj).val('4');
            html += "<div style=\"position: relative;\">";
            html += "<textarea wrap=\"soft\" rows=\"4\" class=\"inputtext\" style=\"width: 62%; height: 66px; overflow: auto;\"></textarea>"
            html += "<span style=\"position: absolute; left: 3px; top: 3px;\"></span></div>";
            break;
        case 4:
            var txtHtml = "<div class=\"div_title_cut_question\">";
            txtHtml += "     <div class=\"div_title_question\">";
            txtHtml += "       <span style='float:left;'><strong>请在此输入说明内容</strong></span>";
            txtHtml += "<span id=\"#isRequire\" style=\"color:red;float:left;\">*</span>";
            txtHtml += "          </div>";
            txtHtml += "      <div style=\"clear: both;\"></div>";
            txtHtml += "  </div>";
            $(".div_title_question_all", cloneObj).remove();
            $(".div_table_radio_question", cloneObj).remove();
            cloneObj.find(".div_preview").prepend(txtHtml);
            $("#tcradio", cloneObj)[0].innerText = "<strong>请在此输入说明内容</strong>";

            $("#txt_Height", cloneObj).val('4');
            break;
        case 5:
            $("#txt_Height", cloneObj).val('1');
            html += " <div><ul>";
            for (var i = 0; i < trRows.length; i++) {
                html += "<li style=\"float:none;margin-bottom:6px;padding:3px 0;\">";
                html += "<input type=\"checkbox\" style=\"display:none;\"><span class=\"sortnum\"></span>";
                html += $(trRows[i]).find("input[name='OptionContent']").val() + "</li>";
            }
            html += " </ul></div>";
            break;
        case 6:
            html += "<div>";
            tyName = "juzheng";
            break;
    }

    //编辑按钮变为完成
    var tag = $(cloneObj).find(".stuff").find("li:first");
    var strhtml = "<span class=\"design-icon design-finish\"></span><span>完成</span>";
    $(tag).find("a").attr("EditOrFinishTag", "finish");
    $(tag).find("a")[0].innerHTML = strhtml;

    ops.after(html);
    $("#tcradio", cloneObj).attr("onkeyup", "QuestionNameChange(this,'singleSelectQ_" + qNum + "')");
    $("#tcradio", cloneObj).attr("onfocus", "InputareaFocus(this)");
    $("#tcradio", cloneObj).attr("onblur", "InputareaBlur(this)");

    //typeName = typeName + "题";
    $("#currentQType", cloneObj)[0].innerHTML = typeName;//修改题型
    $(".div_topic_question", cloneObj).text(ReQnum + ".");//修改题号
    $(".inputarea", cloneObj).attr("id", "tcradio_" + qNum);

    $("#currentQTypeId", cloneObj).val(typeId);

    //调用文本框的id
    $("#txt_Score", cloneObj).numeral();
    $("#txt_Height", cloneObj).numeral();
    $("#txt_DisplayOrder", cloneObj).numeral();
    $("input[name='OptionScore']", cloneObj).numeral();
    $("#selShowStyle", cloneObj).attr("onchange", "checkNumPer(this,'singleSelectQ_" + qNum + "')");
    $("#question").append(cloneObj);
    $("#singleSelectQ_" + qNum).addClass("div_question_onclick");

    CreateEditor("tcradio_" + qNum, "singleSelectQ_" + qNum);

}

function CreateEditor(name, id) {
    KindEditor.create("#" + name, {
        items: ['source', '|', 'undo', 'redo', '|', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold', 'italic', 'underline', 'strikethrough', 'removeformat'],
        filterMode: false,
        designMode: false,
        resizeType: 0,
        width: '100%',
        afterBlur: function () {
            this.sync();
        },
        afterChange: function () {
            var txt = this.html();
            if (txt != "") {

                $("#" + id).find(".div_title_question").find("span").eq(0).html(txt);
            } else {
                $("#" + id).find(".div_title_question").find("span").eq(0).text("请在此输入说明内容");
            }
        }
    });
}
function InputareaFocus(obj) {
    var divtext = "请在此输入问题标题";
    if (obj.innerHTML.trim() == '' || obj.innerHTML.trim() == divtext) {
        if (obj.innerHTML.trim() == divtext) {
            obj.innerHTML = '';
        }
    }
}
function InputareaBlur(obj) {
    var divtext = "请在此输入问题标题";
    if (obj.innerHTML.trim() == '' || obj.innerHTML.trim() == '<br>' || obj.innerHTML.trim() == divtext) {
        obj.innerHTML = divtext;
    }

}
function QuestionNameChange(obj, id) {
    var txt = $(obj).val();
    $("#" + id).find(".div_title_question").find("span").eq(0).text(txt);
}
function recoverSelectQ(cloneObj) {
    $("#txt_QuestionId", cloneObj)[0].value = "";
    $("#tcradio", cloneObj)[0].innerText = "请在此输入问题标题";
    $("#checkbox_isMustFill", cloneObj)[0].checked = true;
    $("#txt_Score", cloneObj).val('0');
    $("#txt_DisplayOrder", cloneObj).val(qNum);
    $(".div_title_question", cloneObj).find("#isRequire").css("display", "block");
    var tableOption = $("#tableOption", cloneObj);
    tableOption.find("tr.trOption").remove();
    tableOption.append(getOptionRow('', '选项1'));
    tableOption.append(getOptionRow('', '选项2'));
}

function editFormController(cloneObj) {
    switch (typeId) {
        case 1:
        case 2:
        case 5:
            $("#QuestionOptions", cloneObj).css("display", "");
            break;
        case 3:
        case 4:
            $("#QuestionOptions", cloneObj).css("display", "none");
            break;
    }
}

function BindData(questionnaireId) {
    $.ajax({
        url: requestUrl.QuestionsUrl,
        async: false,
        type: "post",
        dataType: 'json',
        data: { QuestionnaireId: questionnaireId },
        success: function (result) {
            if (result.IsSuccess) {
                var jsonStr = eval(result.Data);
                qNum = 1;
                ReQnum = 1;
                $.each(jsonStr, function (key, value) {
                    var DisplayOrder = value["DisplayOrder"];
                    typeId = value["TypeId"];
                    var displayModel = value["DisplayMode"];
                    var widthLi = 99;
                    if (displayModel != 0 && displayModel != 1) {
                        widthLi = widthLi / displayModel;
                    }

                    if (DisplayOrder == 0 && typeId == 4) {
                        $("#pater_desc").html(value["Content"]);
                        $("#txtQstionId_desc").val(value["QuestionId"]);
                        return true;
                    }

                    var cloneObj = $("#singleSelectQ").clone();
                    cloneObj = cloneObj.removeAttr("style");
                    cloneObj = cloneObj.attr("id", "singleSelectQ_" + qNum);
                    $("#tcradio", cloneObj).attr("onkeyup", "QuestionNameChange(this,'singleSelectQ_" + qNum + "')");
                    $("#tcradio", cloneObj).attr("onfocus", "InputareaFocus(this)");
                    $("#tcradio", cloneObj).attr("onblur", "InputareaBlur(this)");

                    $("#currentQTypeId", cloneObj).val(typeId);
                    $(".div_topic_question", cloneObj).text(ReQnum + ".");//题号重新排序
                    $("#txt_QuestionId", cloneObj).val(value["QuestionId"]);
                    $("#tcradio", cloneObj).val(value["Content"]);
                    $("#checkbox_isMustFill", cloneObj)[0].checked = value["MustFill"];
                    $("#txt_Height", cloneObj).val(value["Height"]);
                    $("#txt_Score", cloneObj).val(value["Score"]);
                    $("#txt_DisplayOrder", cloneObj).val(qNum);//显示数据库保存的排序
                    $(".div_title_question", cloneObj).find("span").eq(0).html(value["Content"]);
                    if (value["MustFill"] == 1) {
                        $(".div_title_question", cloneObj).find("#isRequire").css("display", "block")
                    }

                    $("#selShowStyle", cloneObj).val(displayModel);
                    var ops = $(".div_table_clear_top", cloneObj);//

                    var editContent = $(".div_title_attr_question", cloneObj).parent();
                    editContent.attr("style", "display:none");
                    var QustionOptions = eval(value["QustionOptions"]);
                    var tableOption = $("#tableOption", cloneObj);


                    var html = "";
                    var typeid = value["TypeId"];
                    var tname = "";
                    switch (typeid) {
                        case 1:
                            tname = "单选题";
                            html += "<ul>";
                            $.each(QustionOptions, function (key, item) {
                                html += '<li style="width:' + widthLi + '%;">';
                                html += '<input style="" type="radio">';
                                html += '<label style="vertical-align:middle;padding-left:2px;">' + item["OptionContent"] + '</label>';
                                if (item["AllowWrite"] > 0) {
                                    html += "<input type='text' />";
                                }
                                html += "</li>";
                            });
                            html += "</ul>"

                            break;
                        case 2:
                            tname = "多选题";
                            html += "<ul>";
                            $.each(QustionOptions, function (key, item) {
                                html += '<li style="width:' + widthLi + '%;">';
                                html += '<input style="" type="checkbox">';
                                html += '<label style="vertical-align:middle;padding-left:2px;">' + item["OptionContent"] + '</label>';
                                if (item["AllowWrite"] > 0) {
                                    html += "<input type='text' />";
                                }
                                html += "</li>";
                            });
                            html += "</ul>"
                            break;
                        case 3:
                            html += "<div style=\"position: relative;\">";
                            html += "<textarea wrap=\"soft\" rows=\"4\" class=\"inputtext\" style=\"width: 62%; height: 66px; overflow: auto;\"></textarea>"
                            html += "<span style=\"position: absolute; left: 3px; top: 3px;\"></span></div>";
                            $("#QuestionOptions", cloneObj).remove();
                            break

                        case 4:
                            tname = "段落文本";
                            var txtHtml = "<div class=\"div_title_cut_question\">";
                            txtHtml += "     <div class=\"div_title_question\">";
                            txtHtml += "       <span style='float:left;'>" + value["Content"] + "</span>"
                            if (value["MustFill"] == 1) {
                                txtHtml += "<span id='isRequire' style=\"color:red;width:10px;float:left;\">*</span>";
                            }

                            txtHtml += "          </div>";
                            txtHtml += "      <div style=\"clear: both;\"></div>";
                            txtHtml += "  </div>";
                            $(".div_title_question_all", cloneObj).remove();
                            $(".div_table_radio_question", cloneObj).remove();
                            cloneObj.find(".div_preview").prepend(txtHtml);
                            $("#QuestionOptions", cloneObj).remove();
                            break
                        case 5:
                            tname = "排序题";
                            html += " <div><ul>";
                            $.each(QustionOptions, function (key, item) {
                                html += "<li style=\"float:none;margin-bottom:6px;padding:3px 0;\">";
                                html += "<input type=\"checkbox\" style=\"display:none;\"><span class=\"sortnum\"></span>";
                                html += item["OptionContent"] + "</li>";
                            });
                            html += " </ul></div>";
                            break;
                        case 6:
                            tname = "矩阵题";
                            break;
                    }
                    ops.after(html);

                    if (typeId != 3 || typeId != 4) {
                        $(tableOption).find("tbody tr:first").nextAll().remove();
                        $.each(QustionOptions, function (key, item) {
                            var trTemplate = $("#Template_trOption", tableOption).clone();
                            trTemplate = trTemplate.removeAttr("style");
                            trTemplate = trTemplate.removeAttr("id");
                            $("input[name='OptionId']", trTemplate).val("");
                            $("input[name='OptionContent']", trTemplate).val(item["OptionContent"]);
                            $("input[name='AllowWrite']", trTemplate)[0].checked = item["AllowWrite"];
                            $("input[name='OptionScore']", trTemplate).val(item["OptionScore"]);

                            $(tableOption).find("tbody tr").last().after(trTemplate);
                        });
                    }

                    //调用文本框的id
                    $("#txt_Score", cloneObj).numeral();
                    $("#txt_Height", cloneObj).numeral();
                    $("#txt_DisplayOrder", cloneObj).numeral();
                    $("input[name='OptionScore']", cloneObj).numeral();
                    $(cloneObj.find("#tcradio")).attr("id", "tcradio_" + qNum);
                    $("#currentQType", cloneObj)[0].innerHTML = tname;
                    $("#selShowStyle", cloneObj).attr("onchange", "checkNumPer(this,'singleSelectQ_" + qNum + "')");
                    $("#question").append(cloneObj);
                    CreateEditor("tcradio_" + qNum, "singleSelectQ_" + qNum);
                    qNum++;
                    if (typeId != 4) {
                        ReQnum++;
                    }
                });

            }
            //alert(qNum);

        }
    });
}
function completeQuestion(obj) {

    var EditContent;
    var id = $(obj).attr("id")
    if (id == "submitBtn") {
        EditContent = $(obj).parent().parent().parent();
    } else {
        EditContent = $(obj).next();
    }
    EditContent.attr("style", "display:none");
    //修改编辑按钮
    var editBtn = $(EditContent).parent();
    var tag = $(editBtn).find(".stuff").find("li:first");
    var strhtml = "<span class=\"design-icon design-edit\"></span><span>编辑</span>";
    $(tag).find("a").attr("EditOrFinishTag", "edit");
    $(tag).find("a")[0].innerHTML = strhtml;

    var tableOption = $("#tableOption", EditContent);
    var questionId = $("#txt_QuestionId", EditContent).val();
    var contentQ = $(".inputarea", EditContent).val();

    var isMustFillQ = $("#checkbox_isMustFill", EditContent)[0].checked == true ? 1 : 0;
    var heightQ = $("#txt_Height", EditContent).val();
    var scoreQ = $("#txt_Score", EditContent).val();
    var displayOrderQ = $("#txt_DisplayOrder", EditContent).val();
    var dm = $("#selShowStyle", EditContent).val();
    var DisplayMode = dm;
    var currentTypeId = $("#currentQTypeId", EditContent).val();
    var question = {};
    question["QuestionId"] = questionId;
    question["TypeId"] = currentTypeId;
    question["QuestionnaireId"] = questionnaireId;
    question["MustFill"] = isMustFillQ;
    question["Content"] = contentQ;
    question["DisplayOrder"] = displayOrderQ;
    question["Height"] = Number(heightQ);
    question["Score"] = Number(scoreQ);
    question["DisplayMode"] = Number(DisplayMode);
    var options = [];
    var trRows = tableOption.find("tr.trOption").not("#Template_trOption");
    for (var i = 0; i < trRows.length; i++) {
        var option = {};
        //$(trRows[i]).find("input[name='OptionId']").val()
        option["OptionId"] = i + 1;
        option["OptionContent"] = $(trRows[i]).find("input[name='OptionContent']").val();
        option["AllowWrite"] = $(trRows[i]).find("input[name='AllowWrite']")[0].checked == true ? 1 : 0;
        option["OptionScore"] = Number($(trRows[i]).find("input[name='OptionScore']").val());
        option["DisplayOrder"] = i + 1;
        options.push(option);
    }
    if (options.length == 0) {
        options = "";
    }
    $.ajax({
        url: requestUrl.SaveQuestionUrl,
        async: false,
        type: "post",
        dataType: 'json',
        data: { jsonStr: JSON.stringify(question), optionInfo: JSON.stringify(options), QuestionnaireId: questionnaireId },
        success: function (result) {
            if (result.IsSuccess) {
                $("#txt_QuestionId", EditContent).val(result.Data);
                window.location.reload();
            }
        }

    });

}
function AllCompleteQ()
{
    var arr = new Array();
    $("#question").find(".div_question").each(function () {
        var tableOption = $("#tableOption", $(this));
        var questionId = $("#txt_QuestionId", $(this)).val();
        var contentQ = $(".inputarea", $(this)).val();

        var isMustFillQ = $("#checkbox_isMustFill", $(this))[0].checked == true ? 1 : 0;
        var heightQ = $("#txt_Height", $(this)).val();
        var scoreQ = $("#txt_Score", $(this)).val();
        var displayOrderQ = $("#txt_DisplayOrder", $(this)).val();
        var dm = $("#selShowStyle", $(this)).val();
        var DisplayMode = dm;
        var currentTypeId = $("#currentQTypeId", $(this)).val();
        var question = {};
        question["QuestionId"] = questionId;
        question["TypeId"] = currentTypeId;
        question["QuestionnaireId"] = questionnaireId;
        question["MustFill"] = isMustFillQ;
        question["Content"] = contentQ;
        question["DisplayOrder"] = displayOrderQ;
        question["Height"] = Number(heightQ);
        question["Score"] = Number(scoreQ);
        question["DisplayMode"] = Number(DisplayMode);
        var options = [];
        var trRows = tableOption.find("tr.trOption").not("#Template_trOption");
        for (var i = 0; i < trRows.length; i++) {
            var option = {};
            //$(trRows[i]).find("input[name='OptionId']").val()
            option["OptionId"] = i + 1;
            option["OptionContent"] = $(trRows[i]).find("input[name='OptionContent']").val();
            option["AllowWrite"] = $(trRows[i]).find("input[name='AllowWrite']")[0].checked == true ? 1 : 0;
            option["OptionScore"] = Number($(trRows[i]).find("input[name='OptionScore']").val());
            option["DisplayOrder"] = i + 1;
            options.push(option);
        }
        if (options.length == 0) {
            options = "";
        }
        $.ajax({
            url: requestUrl.SaveQuestionUrl,
            async: false,
            type: "post",
            dataType: 'json',
            data: { jsonStr: JSON.stringify(question), optionInfo: JSON.stringify(options), QuestionnaireId: questionnaireId },
            success: function (result) {
                arr.push(result.IsSuccess);
                if (result.IsSuccess) {
                    $("#txt_QuestionId", $(this)).val(result.Data);
                }
            }

        });
    })

    var newArr = $.grep(arr, function (n, i) {
        return n == false;
    });
    if (newArr.length > 0) {
        return false;
    }
    else {
        ShowRemindMessage("保存成功！");
    }
}
function checkNumPer(obj, id) {
    var showType = Number($(obj).val());
    var width = sumWidth / showType;
    $("#" + id).find(".div_preview").find(".div_table_radio_question").find("ul li").css("width", width + "%");
}

/* ================== 问题编辑，取消，删除，上下移动等按钮 =================== */
function editQ(obj) {
    var id = $(obj).parents(".div_question").attr("id");

    var tag = $(obj).attr("EditOrFinishTag");
    var pre_viewobj = $("#" + id).find(".div_preview");
    if (tag == "edit") {
        $(obj).parent().next().css("display", "block");
        if (islocked=="1") {
            $("#" + id).find("#tableOption").find(".p").css("display", "none");
            $("#" + id).find("#tableOption").find(".m").css("display", "none");
        }

        //显示编辑层
        pre_viewobj.next().removeAttr("style");
        var strhtml = "<span class=\"design-icon design-finish\"></span><span>完成</span>";
        $(obj).attr("EditOrFinishTag", "finish");
        $(obj)[0].innerHTML = strhtml;

    } else {
        $(obj).parent().next().css("display", "none");
        pre_viewobj.next().attr("style", "display:none");
        var strhtml = "<span class=\"design-icon design-edit\"></span><span>编辑</span>";
        $(obj).attr("EditOrFinishTag", "edit");
        $(obj)[0].innerHTML = strhtml;

        completeQuestion(pre_viewobj);

    }

}

function cancelQ(obj) {
  
    window.location.reload();
}
function deleteQ(obj) {
    if (confirm("确定要删除吗？")) {
        var divobj = $(obj).parent().parent().parent().parent().parent();
        var qustionId = $("#txt_QuestionId", divobj).val();
        if (qustionId == "") {
            qNum--;

        }
        else {
            $.ajax({
                url: requestUrl.DeleteQuestionInfoUrl,
                type: "post",
                dataType: "json",
                data: {
                    id: qustionId
                },
                success: function (result) {
                    if (result.IsSuccess) {
                        ReEditQnumber();
                    }
                }
            });
        }
        divobj.remove();
    }

}

function ReEditQnumber() {
    var i = 0;
    $("#question").find(".div_question").find(".div_preview").find(".div_topic_question").each(function () {
        i++;
        $(this).text(i + ".");
    });
    ReQnum = i;
}

function copyQ(obj) {

}

function moveUpQ(obj)
{
    var id = $(obj).parents(".div_question").attr("id");
    if (!$("#" + id).prev().is("#divId")) {
       var currentOrder= $("#" + id).find("#txt_DisplayOrder").val();
        var prevOrder=$("#" + id).prev().find("#txt_DisplayOrder").val();
        $("#" + id).find("#txt_DisplayOrder").val(prevOrder);
        $("#" + id).prev().find("#txt_DisplayOrder").val(currentOrder);
        $("#" + id).prev().before($("#" + id));
    }
    ReEditQnumber();
    AllCompleteQ();
}
function moveDownQ(obj) {
    var id = $(obj).parents(".div_question").attr("id");
    var currentOrder = $("#" + id).find("#txt_DisplayOrder").val();
    var nextOrder = $("#" + id).next().find("#txt_DisplayOrder").val();

    $("#" + id).find("#txt_DisplayOrder").val(nextOrder);
    $("#" + id).next().find("#txt_DisplayOrder").val(currentOrder);

    $("#" + id).next().after($("#" + id));
  
    ReEditQnumber();
    AllCompleteQ();
}


function moveFirst() {

}
function moveLast() {

}

/* ================== 问题编辑等按钮 =================== */


