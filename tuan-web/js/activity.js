$(function(){


	var slider=function(dom){
		this.dom=$(dom);
		this.init();
	}
	
	$.extend(slider.prototype,{
		init: function(){
			this.build();
			this.bindEvents();
		},
		
		build: function(){
			this.panels=this.dom.find('[item="panel"]');
			this.list=this.dom.find('[item="stage"] > li');
			this.length=this.list.length;
			
			var width=this.list.eq(0).outerWidth()+(parseInt(this.list.eq(0).css('margin-left'))||0)+(parseInt(this.list.eq(0).css('margin-right'))||0);
			
			this.control=new QNR.Tools.slider({
				dom: this.dom,
				measure: 3,
				length: this.length,
				autoMove: false,
				width: width,
				onmove: $.proxy(this.handleMove,this)
			});
		},
		
		handleMove: function(index){
			
			if(index>this.current){
				this.active(index);
			}
			
			if(index+2<this.current){
				this.active(index+2);
			}

		},
		
		active: function(index){
			this.current=index;
			
			this.list.removeClass('active').addClass('deactive');
			
			this.list.eq(this.current).removeClass('deactive').addClass('active');
			
			this.panels.hide();
			this.panels.eq(this.current).show();
		},
		
		bindEvents: function(){
			this.active(0);
			var self=this;
			
			this.list.bind('click',function(e){
				e.preventDefault();
				
				self.active($(this).index());
				
			});
		}
	});
	
	//这是一个示例
    $('.slider').each(function(){
        new slider(this);
    });
	
	
	//tabs
	$.fn.control=function(items,method){
		method=method||'click';
		var panels=$(items);
		
		var tabs=this;
		tabs.bind(method,function(){
			tabs.removeClass('active').addClass('deactive');
			$(this).removeClass('deactive').addClass('active');
			
			panels.hide().eq($(this).index()).show();
		});
		
		tabs.eq(0).trigger(method);
	};
	
	
	$('#temp-tabs li').control('#temp-panels [item="temp-panel"]');
	
	var panels=$('#ship-trip [item="stage"]');
	$('#ships li').control(panels);
	
	panels.each(function(){
		var parent=$(this);
		
		parent.find('.nav_ul li').control(parent.find('[item="panel"]'),'mouseenter');
	});
});
