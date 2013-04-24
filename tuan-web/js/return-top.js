$(function(){
	
	var dom=$('.pop_gotop');
	
	dom.find('.top').bind('click',function(e){
		e.preventDefault();
		$(window).scrollTop(0);
	});
	
	dom.find('.bottom').bind('click',function(e){
		e.preventDefault();
		$(window).scrollTop($(document.body).height());
	});
	
	var pl=$("#type-filter");
	var getTop=function(){
		var t=0;
		if(pl.length){
			t=pl.offset().top+pl.height();
		}
		
		if(!t){
			return 600;
		}
		
		return t;
	}
	
	var update=function(){
		var st=$(window).scrollTop();
		if(st>getTop()){
			dom.show();
		}else{
			dom.hide();
		}
	}
	
	if($.browser.msie&&$.browser.version<7){
	
		var Tool={
			path: function(){
			
				var s=[], basic=0;
				
				for( var i=0; i<30; i++){
					s[i]=basic+i*i;
					basic=s[i];
				}
				
				var getP=function(w){
					if(w<0){
						w=-w;
					}
					
					for( var i=s.length-1; i>0; i--){
						if(s[i]>=w&&w>s[i-1]){
							return w-s[i-1];
						}
					}
				}
				
				return getP;
			}()
		};
	
		dom.css({
			position: "absolute"
		});
		
		var addtop=$(window).height()-197;
		
		$(window).bind("resize",function(){
			addtop=$(window).height()-197;
			update();
		});
		
		
		var handler=false;
		
		update=function(){
			var st=$(window).scrollTop();
			if(st>getTop()){
				//dom.css("top",st+addtop+"px");
				goal=parseInt(st+addtop);
				clearTimeout(handler);
				handler=setTimeout(run,300);
				
				dom.show();
			}else{
				dom.hide();
			}
		}
		
		var goal=0;
		var run=function(){
			var top=parseInt(dom.css("top"))||0;
			if(top!=goal){
				var t=1;
				if(top>goal){
					t=-1;
				}
				
				var r=Tool.path(top-goal);
				dom.css("top",top+r*t+"px");
				
				setTimeout(run,30);
			}
		}
	}
	
	$(window).bind("scroll",update);
	update();
});