﻿!function(fromDateObj, toDateObj){
    var date1 = {
        ui : 'qunar',
        customClass : 'qunar-dp-toD',
        defaultDay :new Date(new Date().setDate(new Date().getDate() - 90)).getTime(),
        multi : 1,
        linkTo : toDateObj,
        linkRules : '+0D,+0D'
    };

    var date2 = {
        ui : 'qunar',
        customClass : 'qunar-dp-toD',
        refObj : fromDateObj,
        defaultDay : (new Date()).getTime(),
        multi : 1
    };

    fromDateObj.qdatepicker(date1);// 日期控件的设置
    toDateObj.qdatepicker(date2);
}($('#fromDate'),$('#toDate'));

$('#inquiry').bind('click',function(e){
    //TODO:添加时间的选项
    var val = $(this).closest('telephone').val();
    var data = {};
    data.uid = val;
    getData(data);

    return false;
});

//筛选按钮显隐
$('.filter').click(function(){ $(this).next('.filter-panel').toggle(); });
$('.filter-panel .keywords_cancel,.filter-panel .stat_cancel').click(function(){ $(this).parents('.filter-panel').hide(); });
$('.filter-panel .keywords_submit,.filter-panel .stat_submit').click(function(){
    var data= {};
    data.queryType = 'report';
    var words = $(this).parents('.filter-panel').find('label input:checked');
    if(!words.length) return;
    $(this).parents('.filter-panel').hide();
    if(this.className === 'keywords_submit'){
        data.keywords = [];
        words.each(function(w,obj){
            if(obj.value == '-1'){
                data.keywords = [];
                return false;
            }else{
                data.keywords.push(obj.value);
            }
        });
    }else{
        data.processStatus = [];
        words.each(function(w,obj){
            if(obj.value == '-1'){
                data.processStatus = [];
                return false;
            }else{
                data.processStatus.push(obj.value);
            }
        });
    }

    getData(data);

});
//筛选
function getData(data){
    var url="./publicOpinion/queryClue.json";
    $.ajax({
        url: url,
        data: data || '',
        type: "GET",
        cache: false,
        dataType: 'json',
        success:function(result){
            if(result.ret)
        addToTable(result.data);
        }
    })
}
//查询舆情关键字
function getKeyWords(){
    var url="./publicOpinion/querySetting.json";
    $.ajax({
        url: url,
        type: "GET",
        cache: false,
        dataType: 'json',
        success:function(result){
            if(result.ret && result.data.length>0)
        updateKeyWords(result.data[0].keywords);
        }
    })
}

function updateKeyWords(obj){
    obj = obj || [];
    for(var i=0,len=obj.length;i<len;i++){
        var strFmt = '<label><input type="checkbox" value="' + obj[i] + '"><span>' + obj[i] + '</span></label>';
        $(strFmt).insertAfter('.filter-keywords label:first-child');
    }
}


function oldFlow() {
    var url = "/flow/get.call";
    url += "?flowId=$flowPop.flow.flowId";
    url += "&forward=flowchannel/phone";
    framework.go(url);
}

function viewFlow(flowId) {
    var url = "/flow/get.call";
    url += "?flowId=" + flowId;
    url += "&forward=view";
    framework.open(url, "工单详细信息");
}

function openFlightServiceRule() {
    var url = "http://kegui.jptonghang.com/dm/Prescribe/guiding.html?Airways=#";
    framework.open(url, '服务规范');
}

function findCustomer() {
    var url = "/customerinfo/selectQunarIndex.call";
    framework.open(url, "客户查询");
}

function addToTable(ds) {
    $('.gridrlist>tbody tr').remove();
    for(var i=0,len=ds.length;i<len;i++){
        var d = ds[i];
        var img = typeof d.img !== 'undefined' ? '<a target="_black" href="' + d.img + '">图片</a>' : '';
        var contentUrl = typeof d.contentUrl !== 'undefined' ? '<a target="_black" href="' + d.contentUrl + '">微博</a>' : '';
        var statObj = {0:['待回复','red'],1:['已忽略','gray'],2:['待处理','green'],3:['已处理','orange']};
        var stat = '<span style="color:' + statObj[d.processStatus][1] + '">' + statObj[d.processStatus][0] + '</span>';
        var gongdan = '<a href="javascript:" onclick="' + "showFlow('a8d3f543ae3541af996c39fdcdbb089a','机票')" + '">' + d.gongdan + '</a>';

        var str = '<tr><td>' + d.pubTime + '</td><td>' + d.crawTime + '</td><td>' + d.replyTime + '</td><td>' + d.userinfo.nickName + '</td><td>' + d.userinfo.gender + '</td><td>' + d.historyCount + '</td><td class="content">' + d.content + '</td><td>' + d.keywords + '</td><td>' + img + '</td><td>' + contentUrl + '</td><td>' + d.userinfo.fans + '</td><td>' + stat + '</td><td>' + gongdan + '</td><td>' + d.lastprocessTime + '</td><td>' + d.lastprocessres + '</td></tr>';
        $('.gridrlist>tbody').append($(str));
    }
}

getData();
getKeyWords();
/**下载文件*/
function download(fileInfoId){
    var url="/fileinfo/downloadPage.call";
    url+="?fileInfoId="+fileInfoId;
    url=framework.addUser(url);
    window.open(url);
}


$('.download_report').click(function(){
    //TODO: 发送ajax请求，下载文件；
    alert('download');
})