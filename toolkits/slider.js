if(typeof QNR=="undefined"){
	var QNR={};
}

if(typeof QNR.Tools=="undefined"){
	QNR.Tools={};
}

QNR.Tools.slider=function(){
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


	var slider=function(arg){
		this.config=$.extend({
			dom: "#slider",
			timeout: 5000,
			width: 480,
			measure: 1,
			autoMove: true,
			onmove: function(index){
				console.log(index);
			}
		},arg);
		
		this.init();
	}
	
	$.extend(slider.prototype,{
		init: function(){
			this.dom=$(this.config.dom);
			
			this.prevDom=this.dom.find('[item="prev"]');
			this.nextDom=this.dom.find('[item="next"]');
			this.stage=this.dom.find('[item="stage"]');
			this.bindEvents();
			
			this.reset();
		},
		
		reset: function(arg){
			$.extend(this.config,arg);
			this.current=0;
			this.nowx=0;
			this.left(0);
			
			this.prevDom.addClass("noprev").css("visibility","hidden");
			if(!this.config.length||this.config.length<=this.config.measure){
				this.nextDom.addClass("nonext").css("visibility","hidden");
			}else{
				this.nextDom.removeClass("nonext").css("visibility","visible");
				this.stop();
				this.stage.width(this.config.length*this.config.width+1);
				
				if(this.config.autoMove){
					this.start();
				}
			}
		},
		
		start: function(){
		
			this.stop();
		
			this.locked=false;
		
			this.timeoutHandler=setTimeout($.proxy(function(){
			
				if(this.locked){
					return;
				}
			
				this.timeoutHandler=false;
				this.moveTo((this.current+1)%this.config.length);
			},this),this.config.timeout);
		},
		
		stop: function(){
			if(this.timeoutHandler){
				clearTimeout(this.timeoutHandler);
				this.timeoutHandler=false;
			}
			
			this.locked=true;
		},
		
		target: false,
		
		moveTo: function(tar){
		
			if((tar==this.current&&!this.timeoutHandler)||tar>this.config.length-this.config.measure){
				return;
			}
			
			if(!tar){
				this.prevDom.addClass("noprev").css("visibility","hidden");
			}else{
				this.prevDom.removeClass("noprev").css("visibility","visible");
			}
			
			if(tar+this.config.measure>=this.config.length){
				this.nextDom.addClass("nonext").css("visibility","hidden");
			}else{
				this.nextDom.removeClass("nonext").css("visibility","visible");
			}
			
			if(this.timeoutHandler){
				clearTimeout(this.timeoutHandler);
				this.timeoutHandler=false;
			}
			
			this.target=tar;
			
			if(!this.moveHandler){
				this.moveHandler=setInterval($.proxy(function(){
					this.move();
				},this),50);
			}
		},
		
		next: function(){
		
			var target=this.target===false?this.current:this.target;
			if(target+this.config.measure>=this.config.length){
				return;
			}
			
			if(!target){
				this.prevDom.removeClass("noprev").css("visibility","visible");
			}
			
			if(target+1+this.config.measure==this.config.length){
				this.nextDom.addClass("nonext").css("visibility","hidden");
			}
			
			this.moveTo(target+1);
		},
		
		prev: function(){
			var target=this.target===false?this.current:this.target;
			if(target==0){
				return;
			}
			
			if(target==1){
				this.prevDom.addClass("noprev").css("visibility","hidden");
			}
			
			if(target+this.config.measure==this.config.length){
				this.nextDom.removeClass("nonext").css("visibility","visible");
			}
			
			this.moveTo(target-1);
		},
		
		move: function(){
	
			var targetx=-this.target*this.config.width;
			
			if(targetx==this.nowx){
				clearInterval(this.moveHandler);
				this.moveHandler=false;
				this.current=this.target;
				this.target=false;
				
				if(!this.locked&&this.config.autoMove){
					this.start();
				}
				
				this.config.onmove(this.current);
				
				return;
			}
			
			//var _w=parseInt((targetx-nowx)/parseInt((targetx-nowx)/50));
			var _w=Tool.path(targetx-this.nowx);
			
			if((this.nowx-targetx)>0){
				this.nowx-=_w;
			}else{
				this.nowx+=_w;
			}
			
			this.left(this.nowx);
		},
		
		left: function(left){
			var position=this.stage.css("position");
			if(position=="relative"||position=="absolute"){
				this.stage.css("left",left+"px");
			}else{
				this.stage.css("margin-left",left+"px");
			}
		},
		
		bindEvents: function(){
			this.prevDom.bind("click",$.proxy(this.prev,this));
			this.nextDom.bind("click",$.proxy(this.next,this));
		}
	});
	
	return slider;
}();


QNR.Tools.switcher=function(){
	var sw=function(arg){
		
	};
	
	$.extend(sw.prototype,{
		init: function(){
		},
		
		build: function(){
		}
	});
}();