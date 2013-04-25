// 依赖jquery.qbox.js
function talking(){
	var _self = this;
	var Url = "/flowproblem/getProblemWordToSayView.json?t="+new Date().getTime();
    this.steps = {};
    this.$stepdom = $('#stepdom');
    this.load = function(url,param,callback){
        $.ajax({
            url : url ,
            type : "get",
            data : param ,
            dataType : "JSON",
            success : function(d){
                if(d.ret){
                    if(!!callback){
                        callback(d.data);
                    }else{
                        _self.dealdata(d.data);                            
                    }
                }else{
                    console.info(d);
                }
            }
        });    
    };
    this.dealdata = function(datas){
        if(!!datas){
        	_self.$stepdom.empty();
            _self.steps = datas.wordToSayWrapper;
            if(!!datas.wordToSayWrapper){
                _self.creatStep("1");
            }           
        }
    };
    this.creatStep = function(step){
        var current_step = _self.steps[step];
        if(!!current_step){
            var prevstep = current_step[0].relateSuperStep;
            var html = [];
            html.push('<div class="light"><img src="/app/workflow/flow/flowApi/img/talking.png"><span>处理指导及话术</span></div>')
            $.each(current_step,function(i,word){
                html.push('<div class="step">');
                //下一个关联步骤没有 鼠标形状默认 class="cursor0"
                html.push('<h5 class="js-next cursor',word.relateStep,'" data-curstep="',step,'" data-relateSuperStep="',word.relateSuperStep,'" data-relateStep="',word.relateStep,'">>>',word.problem,'</h5>');
                html.push('<dl class="talkway"><dt>客服：</dt>');
                html.push('<dd>',word.answer,'</dd>');
                html.push('</dl></div>');
            });
            if(prevstep !== -1){
                html.push('<div id="prev-word" class="prevstep" data-prevstep="',prevstep,'">上一步</div>')
            };
            _self.$stepdom.empty().append(html.join(''));
            _self.bindChangestep();            
        }

    };
    this.bindChangestep = function(){
        $('.js-next').bind('click',function(e){
            var el = $(this);
            var nextstep = el.attr('data-relateStep');
            _self.creatStep(nextstep);
        });
        $('#prev-word').bind('click',function(){
            var el = $(this);
            var prevstep = el.attr('data-prevstep');
            _self.creatStep(prevstep);
        });
    };
    this.bindevent = function(){
        $(document).delegate('.js-talking','click',function(e){
            var el = $(e.target);
            var param = {};
            var flowProblemId  = el.attr('data-proid');
            var flowConfigId  = el.attr('data-confid') == undefined ? el.closest('dt').attr('data-confid') :el.attr('data-confid');
            param.flowProblemId = flowProblemId;
            param.flowConfigId = flowConfigId;
            param.currentId = currentId;
            _self.load(Url,param);
        });      
    };
    _self.bindevent();
}
(function($){
    var smsReSendUrl = "/flowapi/smsReSend.json?t="+new Date().getTime()+"&currentId="+currentId;
    function sync(url,params,callback){
        $.ajax({
            url : url ,
            type : "get",
            data : params ,
            dataType : "JSON",
            success : function(d){
                if(d.success){
                    if(callback){
                        callback(d.data);
                    }
                }else{
                	alert(d.data);;
                }
            },
            error : function(d){
                alert("服务端出错");
            },
            complete : function(d){
            }

        });
    }
    function initTalk(){
        var talk = new talking();
    }
    function initTab(){
        $('#tab li a').bind('click',function(e){
            e.preventDefault();
            var $this = $(this);
            var eq = $this.attr('data-tab');
            $('#tab').find('.active').removeClass('active');
            $this.addClass('active');
            $('#tab').find('.js-showtab').hide();
            $('[data-tabshow='+eq+']').show();
        });
        $('#reSendsms').bind('click',function(e){
        	show(smsTemplate);
            $('.icon_close').click(function(event){
                closeHandler(event);
            });   
            $('#resend_cal').click(function(event){
                closeHandler(event);
            });         
            $('#resend_ok').click(function(event){
                var $error = $('.remsg-error');
                $error.empty();
                var param = {};
                var smsdom = $('#smsText');
                param.phoneNo = $.trim(smsdom.find('input').val());
                param.content = $.trim(smsdom.find('textarea').val());
                if(vali($error,param.phoneNo,param.content)){
                    param.content = encodeURI(param.content);
                    sync(smsReSendUrl,param,function(){
                        closeHandler(event);
                        alert("操作成功");
                    })                    
                }
            });   
            var vali = function vali(dom,phone,text){
                var error = [];
                var phonePattern = new RegExp("^1[3458][0-9]{9}$");
                var isphone = phonePattern.test(phone);
                var islength = text.length <= 200;
                if(!isphone){
                    error.push('请正确填写手机号');
                }
                if(!islength){
                    error.push('短信内容不能超过200字');
                }
                dom.append(error.join(' '));
                return isphone && islength;
            }
            function show(box) {
                $.qbox.show($.qbox($(box).css("display", "block")));
            }  
            var closeHandler = function(e){
            	$.qbox.close(e);
            };             
        });
        initTalk();
    }
    var smsurl = "/flowapi/smsReSend.json?t="+new Date().getTime()+"&currentId="+currentId;
    var smsTemplate = '<div class="layer_box" >\
                <div class="layer_dialog">\
                    <div class="title_lay" role="close"><span class="icon_close"></span>短信发送</div></td>\
                    <form><table class="remsg" id="smsText">\
                    <tr><td>电话号码：</td><td><input name=""></td>\
                    </tr>\
                    <tr>\
                    <td>短信内容：</td><td><textarea name="smstext"></textarea></td>\
                    </tr></table></form>\
                    <div class="remsg-error"></div>\
                    <div class="resendsms-btn"><button id="resend_ok">发送</button><button id="resend_cal">取消</button></div>\
                </div>\
             </div>';     
    initTab();
})(jQuery)