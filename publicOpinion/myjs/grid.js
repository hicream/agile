	function grid(_config,$div){
        var config = {
            grid : null,
            event : {
                load : function(datas){
                     var url = config.url,type = config.type, data = config.data;
                     $.ajax({
                         url  : url,
                         data : datas ? datas : data,
                         dataType : 'json',
                         type : type,
                         success : function(d){                            
                                config.event.dealdata(d);
                                if(config.callback){
                                       config.callback();
                                }
                         },
                         error : function(){
                            if(config.callback){
                                   config.callback();
                            }                            
                            alert( 'error' );
                         }
                     })
                },
                loaded: function(data) {
                    return !!data;
                },
                dealdata : function(data){
                    if(config.event.loaded(data)){
                        config.view.creatgrid(config,data);
                    }
                },
                removedom : function(dom){
                    $(dom).remove();
                }            
            },
            view : {
                creatgrid: function(conf,data){
                    var datalist = data.allInfoList;
                    if(conf.grid){conf.event.removedom(conf.grid);};
                    conf.grid = null;
                    var html = [];
                    html.push('<thead><tr class="itemname">');
                    $.each(conf.cols,function(i,item){
                        html.push('<td class="chead"',conf.view.dealstyle(item.style),' id="',item.filed,'" sortcol="false">',item.describe,'</td>');
                    });
                    html.push('</tr></thead><tbody id="colbody">');  
                    $.each(datalist,function(i,item){
                        html.push('<tr>');
                        $.each(conf.cols,function(idx,val){                
                            html.push('<td class="col ',val.rowstyle,'" data-filed="',val.filed,'" data-sx="',item[val.filed],'">',item[val.filed],'</td>');
                        });
                        html.push('</tr>');
                    });  
                    html.push('</tbody>');               
                    conf.grid = $(html.join(""));
                    conf.view.creatdom(conf.grid); 
                },
                creatdom : function(html){
                    $div.html(html);
                },
                dealstyle : function(style){
                    if(!style) return " ";
                    var html = [' style="'];
                    for(var s in style) {
                        html.push(s, ':', style[s], ';');
                    }
                    html.push('"');
                    return html.join("");                
                }                
            }
        };
        $.extend(true, config, _config);
        this.load = function(datas){
            config.event.load(datas);
        };
        this.dealdata = function(data){
            config.event.dealdata(data);
        };
	}
