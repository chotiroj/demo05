$.extend($.fn.textbox.methods,{
    addClearBtn:function (jq,iconCls) {
        var opts=jq.textbox('options');
        opts.icons=opts.icons||[];
        opts.icons.unshift({
            iconCls:iconCls,
            handler:function (e) {
                $(e.data.target).textbox('clear').textbox('textbox').focus();
                $(this).css('visibility','hidden');
            }
        });
        return jq.each(function () {
            var t=$(this);
            t.textbox();
            if(!t.textbox('getText')){
                t.textbox('getIcon',0).css('visibility','hidden');
            }
            t.textbox('textbox').bind('keyup',function () {
                var icon=t.textbox('getIcon',0);
                if($(this).val()){
                    icon.css('visibility','visible');
                }
                else {
                    icon.css('visibility','hidden');
                }
            });
        });
    }
});