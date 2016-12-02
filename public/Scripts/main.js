var reRunData = "";
var optiontype = 0;
var browserType = 0;
var ipAddress = 0;
var urlText = "";
var testCases = [];
function readTextFile(file)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    var allTextLines;
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                allTextLines = allText.split('\n');
            }
        }
    }
    rawFile.send(null);
    return allTextLines;
}

function Validate(type){
    if(type=='runAll') {
        $('input[type=checkbox]').each(function () {
         var typeParent = $(this).attr('parent');
        if(typeParent==null || typeParent == undefined) {
           $(this).prop("checked", true);
        } else {
            $("#collapse"+typeParent).slideDown();
             $(this).prop("checked", true);
        }
        });
    }
    var result = true;
    if($("#selectTypes").val()==0) {
        $("#error").text("Please fill all the required information");
        result = false;
        return false;
    }
    if($("#selectBrowser").val()==0) {
        $("#error").text("Please fill all the required information");
        result = false;
        return false;
    }
    if($("#selectIPAddress").val()==0 || $("#selectIPAddress").val()==undefined){
        $("#error").text("Please fill all the required information");
        result = false;
        return false;
    }
    if($("#selectUrl").val()==0 || $("#selectUrl").val()==undefined){
        $("#error").text("Please select url");
        result = false;
        return false;
    }
	//  if($("#inputUrl").val()=="" || $("#inputUrl").val()==undefined){
 //        $("#error").text("Please fill all the required information");
 //        result = false;
 //        return false;
 //    }
	// if(!is_correctUrl($("#inputUrl").val())) {
	// 	$("#error").text("Please enter valid url with http or https.");
 //        result = false;
 //        return false;
	// }
    if(result && type!='runAll') {
        result = false;
        $('input[type=checkbox]').each(function () {
            var typeParent = $(this).attr('parent');
            if(typeParent==null || typeParent == undefined) {
                if(this.checked) {
                    result = true;
                }
            }
        });
        if(!result) {
            $("#error").text("Please select atleast one test case.");
            result = false;
            return false;
        }
    }
    if(result) {
        $("#error").text("");
        if(type=='rerun') {
            ReRun();
        } else {
            creatXml(type);
        }
    }
    return result;
}
function clearAll(){
    $("#selectTypes").val(0);
    $("#selectBrowser").val(0);
    $("#selectIPAddress").val(0);
    $("#selectUrl").val(0);
    $("#listOptions").html("");
}
function getOptions(value) {
	var file = "";
	if($("#selectTypes").val() == "Smoke Test") {
		file = "/Content/SmikeSuite.csv";
		var data = readTextFile(file);
		var html="";
        var type = "";
		for(i=0; i<data.length-1; i++) {
            var items = data[i+1].split(',');
            if(type == "") {
                html += '<li><input parent="'+items[3]+'" type="checkbox" id="inlineCheckbox'+items[3]+'" value="'+items[1]+'"/>'
                    +'<label for="inlineCheckbox'+items[3]+'"> '+items[3]+'</li><ul class="ulCollapse" id="collapse'+items[3]+'">';
            }
            if(type != items[3] && type!="") {
                 html += '</ul><li ><input parent="'+items[3]+'" type="checkbox" id="inlineCheckbox'+items[3]+'" value="'+items[1]+'"/>'
                    +'<label for="inlineCheckbox'+items[3]+'"> '+items[3]+'</li><ul class="ulCollapse" id="collapse'+items[3]+'">';
            }
            html += '<li><input type="checkbox" key="'+items[3]+'" id="inlineCheckbox'+items[0]+'" value="'+items[1]+'"/>'
                    +'<label for="inlineCheckbox'+items[0]+'"> '+items[2]+'</li>';


            type = items[3];
		};
		$("#listOptions").html(html);
	} else {
		$("#listOptions").html("");
	}


}

function ReRun(){
    if(reRunData!="") {
        $("#btnRun, #btnReRun, #btnRunAll").attr("disabled","disabled").css({"color":"black"});
        $("#selectBrowser").val(browserType);
        $("#selectIPAddress").val(ipAddress);
        $("#selectUrl").val(urlText);
        $("#selectTypes").val(optiontype);
        getOptions();
        $(".ulCollapse").css({"display": "block"});
        for(i=0;i<testCases.length;i++) {
             $('input[type=checkbox]').each(function () {
                if($(this).attr("id")==testCases[i]) {
                    $(this).prop("checked", true);
                    var key = $(this).attr("key");
                    $('body').find("")
                }
             });
        }
        $.ajax({
          url: "/createFile",
          data:  { xmlData: reRunData },
           method: "POST",
           success: function(data) {
                $("#btnRun, #btnReRun, #btnRunAll").attr("disabled",false).css({"color":"white"});
                clearAll();
           }
        });
    }
}

function is_correctUrl(url) {
    return /^http[s]?:\/\/*/.test(url);
}

function creatXml(type){
   $("#btnRun, #btnReRun, #btnRunAll").attr("disabled","disabled").css({"color":"black"});
   var xmlDoc = new  XMLWriter('UTF-8', '1.0');
   xmlDoc.writeStartDocument();
   xmlDoc.writeDocType('SYSTEM "http://testng.org/testng-1.0.dtd"');
   xmlDoc.writeStartElement('suite');
   xmlDoc.writeAttributeString('name',$("#selectTypes").val());
   xmlDoc.writeAttributeString('verbose','1');
   xmlDoc.writeAttributeString('thread-count','1');
   xmlDoc.writeAttributeString('configfailurepolicy','continue');
        xmlDoc.writeStartElement('parameter');
            xmlDoc.writeAttributeString('name','url');
            xmlDoc.writeAttributeString('value',$("#selectUrl").val());
        xmlDoc.writeEndElement();
        xmlDoc.writeStartElement('parameter');
            xmlDoc.writeAttributeString('name','browser');
            xmlDoc.writeAttributeString('value',$("#selectBrowser").val());
        xmlDoc.writeEndElement();
        xmlDoc.writeComment("Smoke Test cases");
            $('input[type=checkbox]').each(function () {
                if(type!='runAll'){
                    if($(this).attr('parent')) {
                        if(this.checked) {
                            parent_name = $(this).attr('parent')
                            xmlDoc.writeComment(parent_name + " Test cases");
                            xmlDoc.writeStartElement('test');
                            xmlDoc.writeAttributeString('name',$(this).attr('parent'));
                            xmlDoc.writeAttributeString('thread-count','1');
                            xmlDoc.writeAttributeString('verbose','10');
                            xmlDoc.writeAttributeString('preserve-order','true');
                                xmlDoc.writeStartElement('classes');
                                $("input[type=checkbox][key="+parent_name+"]").each(function () {
                                    if(this.checked) {
                                        testCases.push($(this).attr("id"));
                                        xmlDoc.writeStartElement('class');
                                        xmlDoc.writeAttributeString('name',$(this).val());
                                        xmlDoc.writeEndElement();
                                    }
                                });
                                xmlDoc.writeEndElement();
                            xmlDoc.writeEndElement();
                        }
                    }
                }else{
                    if($(this).attr('parent')) {
                        parent_name = $(this).attr('parent')
                        xmlDoc.writeComment(parent_name + " Test cases");
                        xmlDoc.writeStartElement('test');
                        xmlDoc.writeAttributeString('name',$(this).attr('parent'));
                        xmlDoc.writeAttributeString('thread-count','1');
                        xmlDoc.writeAttributeString('verbose','10');
                        xmlDoc.writeAttributeString('preserve-order','true');
                            xmlDoc.writeStartElement('classes');
                            $("input[type=checkbox][key="+parent_name+"]").each(function () {
                                testCases.push($(this).attr("id"));
                                xmlDoc.writeStartElement('class');
                                xmlDoc.writeAttributeString('name',$(this).val());
                                xmlDoc.writeEndElement();
                            });
                            xmlDoc.writeEndElement();
                        xmlDoc.writeEndElement();
                    }
                }
            });
        xmlDoc.writeEndElement();
        xmlDoc.writeEndElement();
    xmlDoc.writeEndElement();
    xmlDoc.writeEndDocument();
    var data = xmlDoc.flush();
    console.log(data);
    reRunData = data;
    browserType = $("#selectBrowser").val();
    ipAddress = $("#selectIPAddress").val();
    urlText = $("#selectUrl").val();
    optiontype = $("#selectTypes").val();
    console.log(testCases);
  $.ajax({
      url: "/createFile",
      data:  { xmlData: data },
       method: "POST",
       success: function(data) {
			$("#btnRun, #btnReRun, #btnRunAll").attr("disabled",false).css({"color":"white"});
            clearAll();
       }
    });
}

$(document).ready(function(){
	$('#btnShowResult').click(function(e) {
		$("#iframeResult").removeClass('hide');
		$("#btnShowTest").removeClass('hide');
		$("#btnShowResult").addClass('hide');
	  e.preventDefault();
	  var iframe = $("#iframeResult");
	  iframe.attr("src", 'html');
	  $("#listOptions").addClass('hide');
	});

    $('body').on("click", 'input[type=checkbox]', function(){
        var typeParent = $(this).attr('parent');
         var typeKey = $(this).attr('key');
        var selected = this.checked;
        if(typeParent != undefined){
            $('input[type=checkbox]').each(function () {
                if(typeParent == $(this).attr('key')) {
                    if(selected)
                        $(this).prop('checked', true);
                    else
                        $(this).prop('checked', false);
                }
            });
            $("#collapse"+typeParent).slideToggle()
        }
        if(typeKey != undefined){
            var isTestCaseSelected = false;
            $('input[type=checkbox]').each(function () {
                if(typeKey == $(this).attr('key')) {
                    if(this.checked) {
                        isTestCaseSelected = true;
                    }

                }
            });
            if(!isTestCaseSelected) {
                $("#inlineCheckbox"+typeKey).prop("checked", false);
                $("#collapse"+typeKey).slideUp();
            }
        }
    })

	$('#btnShowTest').click(function(e) {
		$("#iframeResult").addClass('hide');
		$("#btnShowTest").addClass('hide');
		$("#btnShowResult").removeClass('hide');
		$("#listOptions").removeClass('hide');
	});
});
