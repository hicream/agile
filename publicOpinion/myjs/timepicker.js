$.fn.timePicker = function(){
    var str = '<div class="time_picker"><ul>', len = -1, me=$(this);
    while(len++<24){
        str += '<li>' + len + ':00</li>';
    }
    str += '</ul></div>';
    var picker = $(str);
    me.after(picker);
    me.click(function(){
        picker.toggle();
    });
    picker.click(function(e){
        if(e.srcElement.nodeName === 'LI'){
            picker.toggle();
            me.val($(e.srcElement).text());
        }

    });


}
