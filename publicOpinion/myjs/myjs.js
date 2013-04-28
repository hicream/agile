$(function(){
    //TODO:该变量要删除
    var webRoot = '';
    !function(fromDateObj, toDateObj){
        var fromDateObj = $('#fromDate'), toDateObj = $('#toDate');
        var date1 = {
            ui : 'qunar',
            customClass : 'qunar-dp-toD',
            defaultDay :(new Date()).getTime(),
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
    }();

    //查询按钮
    $('#inquiry').bind('click',function(e){
        var me = $(this),data = {};
        data.uid = $('#uid').val();
        data.startTime = $('#fromDate').val() + ' ' + $('#beginTime').val();
        data.endTime = $('#toDate').val() + ' ' + $('#endTime').val();
        getData(data,function(count){$('.query_result').text('共 '+count+' 条结果')});
        return false;
    });

    //筛选按钮显隐
    $('.filter').click(function(){ $(this).next('.filter-panel').toggle(); });
    $('.filter-panel .keywords_cancel,.filter-panel .stat_cancel').click(function(){ $(this).parents('.filter-panel').hide(); });
    $('.filter-panel .keywords_submit,.filter-panel .stat_submit').click(function(){
        var data= {queryType: 'clue'};
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
    //toggler select
    $('.toggle_select').click(function(e){
        var allCheck = $('.gridrlist tbody td:first-child input');
        $(this).attr('checked') ? allCheck.attr('checked',true) : allCheck.attr('checked',false);
        e.stopPropagation();
    });
    //获取舆情信息
    function getData(data,opt){
        var url="./publicOpinion/queryClue.json";
        $.ajax({
            url: url,
            data: data || '',
            type: "GET",
            cache: false,
            dataType: 'json',
            success:function(result){
                if(result.ret && result.data)
            addToTable(result.data);
        opt && opt(result.data.length);
            }
        })
    }
    //查询舆情关键词
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
    //填充关键词面板
    function updateKeyWords(obj){
        obj = obj || [];
        for(var i=0,len=obj.length;i<len;i++){
            var strFmt = '<label><input type="checkbox" value="' + obj[i] + '"><span>' + obj[i] + '</span></label>';
            $(strFmt).insertAfter('.filter-keywords label:first-child');
        }
    }

    //工单详情
    function viewFlow(flowId) {
        var url = "/flow/get.call";
        url += "?flowId=" + flowId;
        url += "&forward=view";
        framework.open(url, "工单详细信息");
    }

    //点击生成工单按钮，弹出添加联系人面板
    function addRelative(that){
        fm.show();
        var parent = $(that).parents('tr');
        var id = parent.data('id');
        fm.data('id',id);
    }
    //添加联系人面板
    var fm = $('.addRelative form');
    $('.addRelative form .commit').click(function(){
        var ip = fm.find('[name^=]');
        var len = ip.length;
        var data={id: fm.data('id')};
        while(len--){
            var obj = $(ip[len]);
            data[obj.attr('name')] = obj.val();
        }
        var url = '';
        $.ajax({
            url: url,
            type: 'POST',
            cache: false,
            data: data,
            dataType: 'json',
            success: function(){
                //TODO:
                if(true){
                    resetForm();
                    addOrder(parent.find('td:last-child a'));
                }
            }
        });
        return false;
    })
    $('.addRelative form .cancel').click(function(){ resetForm(); });
    //隐藏联系人面板，清除数据
    function resetForm(){
        var fm = $('.addRelative form');
        fm.find('[name^=]').val('');
        fm.hide();
    }
    //生成工单
    function addOrder(that){
        var parnetTr = $(that).parents('tr');
        var data = {processStatus: 3,mid: parnetTr.data('mid'),id: parnetTr.data('id')};
        updateClue(data, function(stat){
            that.onclick = '';
            $(that).parent().prev('td').empty().append(changeStat(stat));
            $(that).parent().empty().append(changeOper(stat));
            parnetTr.data('stat',stat);
            window.open('new window');
        })
    }

    //回复线索,忽略线索
    function replyIgnoreClue(that,open){
        var parnetTr = $(that).parents('tr');
        var stat = open ? 0 : 1;
        var data = {processStatus: stat,mid: parnetTr.data('mid'),id: parnetTr.data('id')};
        updateClue(data, function(stat){
            that.onclick = '';
            $(that).parent().prev('td').empty().append(changeStat(stat));
            $(that).parent().empty().append(changeOper(stat));
            parnetTr.data('stat',stat);
            open && window.open('new window');
        })
    }

    //批量忽略线索
    $('.ignore_clues').click(function(){
        var checked = $('.gridrlist tbody input:checked');
        checked.each(function(index, obj){
            $(obj).parents('tr').find('.ignore').click();
        });
    })


    //更新线索状态ajax
    function updateClue(data,callback){
        var url="./publicOpinion/updateClueStatus.json";
        $.ajax({
            url: url,
            data: data || '',
            type: "POST",
            cache: false,
            dataType: 'json',
            success:function(obj){
                if(obj.ret)
            callback(obj.data.processStatus);
            }
        })

    }
    //将查询的数据放到页面上
    function addToTable(ds) {
        $('.gridrlist>tbody tr').remove();
        for(var i=0,len=ds.length;i<len;i++){
            var d = ds[i];
            var img = typeof d.img !== 'undefined' ? '<a target="_black" href="' + d.img + '">图片</a>' : '';
            var contentUrl = typeof d.contentUrl !== 'undefined' ? '<a target="_black" href="' + d.contentUrl + '">微博</a>' : '';
            var stat = changeStat(d.processStatus);
            var operate = changeOper(d.processStatus);
            var gongdan = '<a href="javascript:" onclick="' + "showFlow('a8d3f543ae3541af996c39fdcdbb089a','机票')" + '">' + d.gongdan + '</a>';
            //待处理时黄色显示tr
            var bkg = d.processStatus === 2 ? 'orange' : '';
            var uInfo = getUInfo(d.userinfo);
            var genderObj = {male: '男', female: '女', no: '未知'};

            var str = '<tr style="background-color:' + bkg + '" data-stat="' + d.processStatus + '" data-id="' + d.id + '" data-mid="' + d.mid + '"><td><input type="checkbox" value="' + d.mid + '">' + d.pubTime + '</td><td>' + d.crawTime + '</td><td>' + uInfo + '</td><td>' + genderObj[d.userinfo.gender] + '</td><td>' + d.historyCount + '</td><td class="content">' + d.content + '</td><td>' + d.keywords + '</td><td>' + img + '</td><td>' + contentUrl + '</td><td>' + d.userinfo.fans + '</td><td>' + stat + '</td><td>' + operate + '</td></tr>';
            $('.gridrlist>tbody').append($(str));
        }
    }
    function getUInfo(info){
        var str = '<a href="' + info.homeUrl + '" target="_blank">' + info.uid + '<br/>' + info.nickName + '</a><br/>';
        var imgs = info.iconList;
        //TODO:会员信息和认证信息
        for(var i=0,len=imgs.length;i<len;i++){
            str += '<img src="' + imgs[i] + '"></img>';
        }
        return str;
    }
    var statObj = {0:['待回复','red','生成工单'],1:['已忽略','gray', '生成工单'],2:['待处理','green','回复线索,忽略线索'],3:['已处理','orange','工单详情']};
    function changeStat(stat){
        var str = '<span style="color:' + statObj[stat][1] + '">' + statObj[stat][0] + '</span>';
        return str;
    }
    function changeOper(stat){
        var res = '';
        switch(stat){
            case 0:
            case 1:
                res = '<a href="javascript:" onclick="addRelative(this)">'  + statObj[stat][2]+ '</a>';
                break;
            case 2:
                var op = statObj[stat][2].split(',');
                res = '<a href="javascript:" onclick="replyIgnoreClue(this,true)">' + op[0] + '</a><br/><br/><a href="javascript:" class="ignore" onclick="replyIgnoreClue(this,false)">' + op[1] + '</a>';
                break;
            case 3:
                res = '<a href="javascript:" onclick="alert(\'' + statObj[stat][2] + '\')">' + statObj[stat][2] + '</a>';
                break;
            default:
                break;
        }
        return res;

    }
    //初始化数据
    getData();
    getKeyWords();
})
