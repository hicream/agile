    function orderpage(d,container){
        var _self = this;
        this.dataArray = d;
        this.orderlen = _self.MAX = d.length;
        this.$container = container;
        this.page = _self.MIN =0;
        this.orderNo = container.text();
        this.orderId = container.closest('tr').attr('data-orderid');
        this.ordertype = container.closest('tr').find('.ordertype ').text();
        this.init = function(){
            var html = [];
            html.push('<div class="td_flow"><div class="flow flow_order">');
            html.push('<div class="ota"><span class="right yellow" data-page="0"><span class="prev"></span>乘机人<span class="page">',_self.page+1,'</span>/',_self.orderlen,'<span class="next"></span><span class="closefloat"></span></span><span class="otaname">订单</span><a href="javaScript:"  onclick=showOrderDetail(\''+_self.orderNo+"\',\'"+_self.ordertype+"\',\'"+_self.orderId+'\'); class="orderno">',_self.orderNo,'</a><a class="js-lock lock" data-lock="unlock">锁定</a></div>');
            html.push('<table>');   
            html.push('</table>');
            if(_self.ordertype =="国内机票"){
                html.push('<div class="btn"><button class="return_tic" data-act="tk">申请退票</button><button class="change_tic" data-act="gq">申请改签</button><button class="re_mesg">重发出票短信</button></div>');  
            }else if(_self.ordertype =="国际机票"){
                html.push('<div class="btn"><button class="re_mesg">重新发出短信</button></div>');  
            }          
            html.push('</div></div>'); 
            if(_self.$container.find('.td_flow').length>0){
                _self.$container.find('.td_flow').remove();
            } 
            _self.$container.append(html.join(''));  
            _self.$container.find('.flow').show();                   
            _self.dealpage(_self.page);
            _self.bindevent();
        };
        this.dealpage = function(page){
            _self.pushdetail(_self.dataArray[page]);
        };
        this.pushdetail = function(list){
            var html = [];
            html.push('<tr><td class="keyname">航班号：</td><td colspan="3">',list.flightNum,'</td></tr>');
            html.push('<tr><td class="keyname">起飞时间：</td><td>',list.departureTime,'</td><td class="keyname">乘机人：</td><td class="pids" data-phoneNo="',list.phoneNo,'" data-content="',list.resendSmsContent,'" data-pids="',list.passangeId,'">',list.passangeName,'</td></tr>');
            html.push('<tr><td class="keyname">乘客类型：</td><td>',list.passangeType,'</td><td class="keyname">人数</td><td>',list.passangeNum,'</td></tr>');
            html.push('<tr><td class="keyname">票面价：</td><td>',list.printPrice,'</td><td class="keyname">优惠价：</td><td>',list.realPrice,'</td></tr>');
            if(_self.ordertype =="国内机票"){
                html.push('<tr><td class="keyname">机建：</td><td>',list.printPrice,'</td><td class="keyname">燃油：</td><td>',list.realPrice,'</td></tr>');
            }else{
                html.push('<tr><td class="keyname">税费：</td><td colspan="3">',list.fuelTax,'</td></tr>');
            }
            html.push('<tr><td class="keyname">保险总价：</td><td>',list.insurance,'</td><td class="keyname">保险份数：</td><td>',list.insuranceCount,'</td></tr>');
            html.push('<tr><td class="keyname">订单总价：</td><td>',list.allprices,'</td><td class="keyname">计算公式：</td><td>',list.formula,'</td></tr>');
            if(_self.ordertype =="国内机票"){
                html.push('<tr><td class="keyname">退改签原因：</td><td colspan="3"><textarea class="reason"></textarea></td></tr>');
            }
            container.find('.flow table').empty().append(html.join(''));
            _self.setSms(list);
        };
        this.setSms = function(data){
            var sms = container.find('.re_mesg');
            var ifsms = !data.avaiSendSms;
            if(!!sms){
                sms.attr('disabled',ifsms);
                sms.css('cursor','default');
            }
        };
        this.bindevent = function(){
            $(_self.$container).delegate('.prev','click',function(e) {
                var el = $(e.target).parent();
                var _page = parseInt(el.attr('data-page'));
                var newpage = _page-1;
                if(_page==_self.MIN){
                    return;
                }
                _self.pushdetail(_self.dataArray[newpage]);
                el.attr('data-page',newpage);
                el.find('.page').text(_page);
            });
            $(_self.$container).delegate('.next','click',function(e) {
                var el = $(e.target).parent();
                var _page = parseInt(el.attr('data-page'));
                var newpage = _page+1;
                if(_page==_self.MAX-1){
                    return;
                }   
                el.attr('data-page',newpage);
                _self.pushdetail(_self.dataArray[newpage]);
                el.find('.page').text(newpage+1);             
            });   
            $(document).delegate('.js-lock','click',function(e){
                var locked = $(this).attr('data-lock');
                if(locked=='locked') return;
                $(this).css({'color':'#ccc','cursor':'default'});
                $(this).attr('data-lock','locked');
                $(document).undelegate('.js-float','mouseleave');
            }).delegate('.closefloat','click',function(){
                var flow = $(this).closest('.flow');
                flow.find('.js-lock').css({'color':'green','cursor':'pointer'}).attr('data-lock','unlock');
                $(document).delegate('.js-float','mouseleave',function(e){
                    $(this).find('.flow').hide();
                    clearTimeout(window.timer_num);           
                });
                flow.hide();               
            });;
        };
        _self.init();
    }