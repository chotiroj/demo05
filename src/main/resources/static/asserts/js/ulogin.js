	/**
	 * 
	 */
	$(function(){	
		login_obj={
				hasClass:function(elem, cls) {
					  cls = cls || '';
					  if (cls.replace(/\s/g, '').length == 0) return false; //当cls没有参数时，返回false
					  return new RegExp(' ' + cls + ' ').test(' ' + elem.className + ' ');
					},
					
					addClass:function(ele, cls) {
					  if (!login_obj.hasClass(ele, cls)) {
					    ele.className = ele.className == '' ? cls : ele.className + ' ' + cls;
					  }
					},
					 
					removeClass:function(ele, cls) {
					  if (login_obj.hasClass(ele, cls)) {
					    var newClass = ' ' + ele.className.replace(/[\t\r\n]/g, '') + ' ';
					    while (newClass.indexOf(' ' + cls + ' ') >= 0) {
					      newClass = newClass.replace(' ' + cls + ' ', ' ');
					    }
					    ele.className = newClass.replace(/^\s+|\s+$/g, '');
					  }
					},
	
				};
		
		
		
		document.querySelector('.login-button').onclick=function(){
			var username=$('input[name="username"]').val();
			var password=$('input[name="password"]').val();
			if(username==''||username=='undefined'){
				alert('请输入用户名！');
				return;
			}
			if(password==''||password=='undefined'){
				alert('请输入密码！');
				return;
			}
			login_obj.addClass(document.querySelector('.login-bg'),'active');
			login_obj.addClass(document.querySelector('.sk-rotating-plane'), 'active');
			document.querySelector('.login-bg').style.display='none';
			$.ajax({
				url:'/user/login',
				data:{username:username,password:password},
                type:'post',
				dataType:'json',
				success:function(data){
					if(data.type == 'success'){
                        if(data.code==1){
                            //window.parent.location = '/mechandiserManege';
                            return;
                        }
						if(data.code==2){
                            window.parent.location = '/mechandiserManege';
                            return;
						}
						if(data.code==3){
                            window.parent.location = '/salespersonManege';
                            return;
						}
                        if(data.code==4){
                            window.parent.location = 'index';
                            return;
                        }
					}
					else{
						login_obj.removeClass(document.querySelector('.login-bg'),'active');
						login_obj.removeClass(document.querySelector('.sk-rotating-plane'), 'active');
						document.querySelector('.login-bg').style.display='block';
						alert(data.msg);
						}
					}
			});
		}
		
			
	
})