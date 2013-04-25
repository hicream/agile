(function($){
	function pager(){
		var _self = this;
        var reopenurl = "/flowapiupdate/flowActibityReopenTo.json?currentId="+currentId;
		this.init = function(){
			this.$tab = $('#tab_page');
			this.$grid = $('#grid');
            _self.bindevent();
		};
		this.bindevent = function(){
			$('#grid thead td[data-op=sort]').each(function(i,td){
				$(td).bind('click',function(e){
					var that = $(this);
					var index = that.index();
					var select = that.closest('table').find('.sorted');
					_self.changeimg(that);
                    sortable(select,index);
				});
			});	
			$('#tab_page li a').bind('click',function(e){
				e.preventDefault();
				var $this = $(this);
				var eq = $this.attr('data-num');
				_self.$tab.find('li a').removeClass('active');
				$this.addClass('active');
				_self.$grid.find('table').hide();
				$('table[data-index='+eq+']').show();
			});
			$('#remark').bind('click',function(e){
				_self.remark();
			});
            $('#reopen').bind('click',function(e){
                _self.reopen();
            });            
            $('#showTalk').bind('click',function(e){
                // 显示隐藏话术
                var visible = $('#tab').is(':visible');
                if(visible){
                    $('#tab').hide();
                }else{
                    $('#tab').show();
                }
            });
		};
        this.reopen = function(){
            $.getJSON(reopenurl,{flowConfigId:flowConfigId,flowId:flowId},function(data){
                if(!!data.data && data.success){
                    getflowid(data.data);
                }
            });
            function getflowid(flows){ 
                var template = '<div class="layer_box">\
                               <div class="layer_dialog">\
                               <div class="title_lay"><span class="icon_close"></span>重开工单</div>\
                               <div class="dele_tip">\
                               <dl><dt>转到节点：</dt><dd id="flows" class="flowids"><label><input type="radio" value="" name="flowActivityId">中台</label><label><input type="radio" value="" name="flowActivityId">中台</label><label><input type="radio" value="" name="flowActivityId">中台</label><label><input type="radio" value="" name="flowActivityId">中台</label><label><input type="radio" value="" name="flowActivityId">中台</label><label><input type="radio" value="" name="flowActivityId">中台</label><label><input type="radio" value="" name="flowActivityId">中台</label><label><input type="radio" value="" name="flowActivityId">中台</label><label><input type="radio" value="" name="flowActivityId">中台</label><label><input type="radio" value="" name="flowActivityId">中台</label><label><input type="radio" value="" name="flowActivityId">中台</label><label><input type="radio" value="" name="flowActivityId">中台</label><label><input type="radio" value="" name="flowActivityId">中台</label></dd></dl>\
                               <dl><dt>备注：</dt><dd><textarea name="reopenRemark"></textarea></dd></dl>\
                               <button id="okreopen">确定</button><button id="cancelreopen">取消</button></div>\
                               </div>\
                               </div>';  
                show(template);
                var html = [];
                $.each(flows,function(i,item){
                    html.push('<label><input type="radio" value="',item.flowActivityId,'" name="flowActivityId" col="5">',item.flowActivityName,'</label>');
                });
                $('#flows').empty().append(html.join(''));
                $('input[col=5]').eq(0).attr('checked',true);
                popevent();
                function popevent(){
                    $('#okreopen').bind('click',function(e){
                        var flowActivityId = $('input[col=5][checked]').val();
                        var remark = $('textarea[name=reopenRemark]').val();
                        reopenFlow(flowActivityId,remark);
                        close(e);
                    });
                    $('#cancelreopen').bind('click',function(e){
                        close(e);
                    });
                    $('.icon_close').click(function(e){
                        close(e);
                    });                
                }
                function show(box) {
                    $.qbox.show($.qbox($(box).css("display", "block")));
                }      
                function close(e){
                    $.qbox.close(e);
                }                  
            }
        };
		this.remark = function(){
            var template = '<div class="layer_box">\
                           <div class="layer_dialog">\
                           <div class="title_lay"><span class="icon_close"></span>添加备注</div>\
                           <div class="dele_tip">\
                           <dl><dt>备注：</dt><dd><textarea name="lastRemark"></textarea></dd></dl>\
                           <button id="okbtn">确定</button><button id="cancel">取消</button></div>\
                           </div>\
                           </div>';

            show(template);
            $('#okbtn').bind('click',function(e){
                var lastRemark = $('textarea[name=lastRemark]').val();
                updateFlowForZTRemark(flowId,userId,lastRemark);
                close(e);
            });
            $('#cancel').bind('click',function(e){
                close(e);
            });
            $('.icon_close').click(function(e){
                close(e);
            });
            function show(box) {
                $.qbox.show($.qbox($(box).css("display", "block")));
            }      
            function close(e){
                $.qbox.close(e);
            }      
		};
		this.changeimg = function(p){
            var num = p.find('img').attr('data-src');
            switch(num){
                case "0" : 
                        p.find('img').attr({'src':"/app/workflow/flow/flowApi/img/paixu-d.png",'data-src':"1"});
                        break;
                case "1" :
                        p.find('img').attr({'src':"/app/workflow/flow/flowApi/img/paixu-u.png",'data-src':"2"});
                        break;   
                case "2" :
                        p.find('img').attr({'src':"/app/workflow/flow/flowApi/img/paixu-d.png",'data-src':"1"});
                        break;  
            }                            
        };
	}
	var page = new pager();
	page.init();
})(jQuery)