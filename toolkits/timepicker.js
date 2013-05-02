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

//用法: <input class='inputs time' id='beginTime'>
// .tablelist .condition .time{
//                float:none;
//                vertical-align:top;
//                margin-left:10px;
//                width:40px;
//                position:relative;
//            }
//            /*时间选择控件*/
//            .time_picker li:hover{
//                background-color:#ddd;
//            }
//            .time_picker li{
//                float: left;
//                margin: 2px 10px;
//                width: 30px;
//                cursor: pointer;
//            }
//            .time_picker{
//                display:none;
//                position: absolute;
//                background-color: #FFF;
//                width: 250px;
//                right: 0;
//                border:1px solid #eee;
//            }
