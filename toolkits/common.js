/**
* 删除左右两端的空格
*/
String.prototype.trim=function(){
     return this.replace(/(^\s*)(\s*$)/g, ”);
}
/**
* 删除左边的空格
*/
String.prototype.ltrim=function(){
     return this.replace(/(^\s*)/g,”);
}
/**
* 删除右边的空格
*/
String.prototype.rtrim=function(){
     return this.replace(/(\s*$)/g,”);
}
/**
 * 返回一个中文字符转换为2个字符的真正长度；
 */
String.prototype.realLength(){
    var allLen = this.length,
        strEN,
        enLen = (strEN = this.match(/[ -~]/g)) ? strEN.length : 0;
        return (allLen * 2 - enLen);
}
