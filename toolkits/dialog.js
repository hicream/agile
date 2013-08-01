/**
 *	QNR.dialog & QNR.htmlDialog
 *
 *
 *
 *
 *
 *
 **/
if(typeof QNR=="undefined"){ var QNR={}; }
(function(){

	var _eve=$("<div></div>");

	QNR.dialog=function(args){
	
		if(typeof args=="string"){
			args={message:"string"};
		}
	
		this.config=$.extend({
			mask: false,
			buttons: [{
					name: "确定",
					event: "ok"
				}],
			title: false,
			message: "",
			closeButton: true,
			className: "",
			template: ''
		},args);
		
		this.init();
		
		this.render();
		
		this.bindEvents();
	};
	
	var hidemask=function(){};
	
	var mask=function(){
		var _m=$("<div></div>");
		_m.hide().appendTo(document.body);
		_m.css({'position':'absolute', 'z-index':'3000', 'opacity':0.5, 'top':0, 'left':0, 'width':"100%", 'background':'#CCC'});
		
		mask=function(){
			var height = $(window).height()>$(document.body).height()?$(window).height():$(document.body).height() + 'px';
			console.log($(document.body).height());
			var width = $(window).width() + 'px';
			_m.css({'height':height}).show();
		};
		
		hidemask=function(){
			_m.hide();
		}
		
		mask();
	}
	
	
	QNR.htmlDialog=function(str,args){
		this.config=$.extend({
			mask: true
		},args);
		
		this.init(str);
	}
	
	var _common={
		remove: function(){
			this.dom.remove();
		},
		
		xy: function(left,top){
			if(typeof left=="object"){
				var top=left.top;
				left=left.left;
			}
			
			this.dom.css("left",left+"px");
			this.dom.css("top", top+"px" );
		},
		
		append: function(){
			this.body.append(this.dom);
			
			this.append=function(){
				this.dom.show();
			}
			
			this.append();
			
			_eve.bind("dialog-show",$.proxy(function(e,data){
				
				if(this!=data){
					this.dom.hide();
				}
				
			},this));
		},
		
		show: function(){
			
			if(this.config.mask){
				mask();
			}
			
			var self=this;
			
			this.xy(-10000,-10000);
			this.append();
			
			setTimeout(function(){
				self.update();
			},1);
			
			_eve.trigger("dialog-show",[this]);
		},
		
		update: function(){
			var _h=parseInt(this.dom.css("height"));
			var _w=parseInt(this.dom.css("width"));
			
			var cdh = document.documentElement.clientHeight;
			var cbh = document.body.clientHeight;
			
			var _ch=cdh>cbh&&cbh>0?cbh:(cbh>cdh&&cdh>0?cdh:(cbh||cdh));
			
			//var _bw = $(window).width();
			
			var st=(document.body.scrollTop||document.documentElement.scrollTop);
			
			var t=parseInt((_ch-_h)/2)+st;
			var l="50%";
			//parseInt((_bw-_w)/2);
			
			if(t<0){
				t=0;
			}else{
				t=t+"px";
			}
			
			this.dom.css({'left':l,'top':t,'margin-left':-parseInt(_w/2)+"px"});
		},
		
		hide: function(){
			this.dom.hide();
			
			if(this.config.mask){
				hidemask();
			}
		},
		
		trigger: function(eve,v){
			this.eve.trigger(eve,v);
			return this;
		},
		
		bind: function(eve,func){
			this.eve.bind(eve,func);
			return this;
		}
	};
	
	$.extend(QNR.htmlDialog.prototype,_common, {
		init: function(str){
			this.body=$(document.body);
			this.eve=$('<div></div>');
			
			this.dom=$(str);
			
			this.dom.css({"position":"absolute","z-index":3001,"overflow":"hidden"});
			
			this.bindEvents();
		},
		
		bindEvents: function(){
			var self=this;
			this.dom.find("[js-dialog-action]").bind("click",function(){
				var v=$(this);
				
				var act=v.attr("js-dialog-action");
				
				self.trigger(act);
			});
		}
	});
	
	$.extend(QNR.dialog.prototype,_common,{
		init: function(){
			this.body=$(document.body);
			this.eve=$('<div></div>');
			
			if(this.buttons instanceof Array){
				for( var i=0, bitem; i<this.buttons.length; i++){
					bitem=this.buttons[i];
					
					if(!bitem.name){
						bitem.name="确定";
					}
					
					if(!bitem.event){
						bitem.event="button"+i;
					}
				}
			}else if(typeof this.buttons == "object"){
				var bs=[];
				
				for( var method in this.buttons ){
					bs.push({name:this.buttons[method],event:method});
				}
				
				this.buttons=bs;
			}
		},
		
		render: function(){
		},
		
		bindEvents: function(){
		}
	});
})();
/**
    this.banklistdlg = new QNR.htmlDialog(_html);
    this.banklistdlg.show();
 */
