function getPrpblem(url,params,container){
    var _self = this;
    this.url = url;
    this.params = params;
    this.$container = $(container);
    this.load = function(_url,_param,callback){
        $.ajax({
            url : _url ,
            type : "get",
            data : _param ,
            dataType : "JSON",
            success : function(d){
                if(d.success){
                    if(!!callback){
                        callback(d);
                    }else{
                        _self.dealdata(d.data.flowProblemList);                            
                    }
                }else{
                }
            }
        });
    };
    this.dealdata = function(d){
        if(!!d && d.length>0){
            _self.resetId(d);
            _self.creatDom(d);
        }
    };
    this.resetId = function(d){
        _self.flowConfigId = d.flowConfigId;
        _self.flowConfigId = d.flowProblemId;
    }
    this.creatDom = function(d){
        var html = [];
        html.push('<li>');
        $.each(d,function(i,config){
            html.push('<p class="p js-p js-talking" data-proid="',config.flowProblemId,'" data-confid="',config.flowConfigId,'">',config.flowProblemName,'</p>');
        });   
        html.push('</li>');         
        _self.$container.append(html.join(''));
        _self.bindevents(_self.$container.find('li:last'));
    };
    this.bindevents = function(dom){
        dom.find('.js-p').bind('click',function(e,callback){
            var el =  $(e.target);        
            var next_param = _self.getParam(el);
            el.siblings().removeClass('onselect');
            el.addClass('onselect');
            el.closest('li').nextAll().remove();
            _self.dealnext(next_param);       
        });
    };
    this.getParam = function(el){
       return {
                flowProblemId : el.attr('data-proid'),
                flowConfigId : el.attr('data-confid')
             };
    };
    this.dealnext = function(param){
        _self.load(_self.url,param,function(d){
            var flowProblemList = d.data.flowProblemList;
            if(flowProblemList.length>0){
                 var html = ['<div class="next"></div>'];
                _self.$container.append(html.join(''));   
                _self.dealdata(flowProblemList);                 
            }
        });
    };
    _self.load(_self.url,_self.params);
};