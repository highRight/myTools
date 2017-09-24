(function($){
	$.fn.FormControl={
		/*保存表单字段名name、字段对应的表达式或函数、验证失败函数、unique是否为空(action,处理函数)
			1.加载json数据
			2.
		*/
		defaultConfig:{
			forms:{}	
				/*{
				  		"form1":[{status:1},{	
				  			name:"name",
							regex:function(text){
								alert(text);
							},
							error:"error"
						}]
					}*/
		},
		/*加载用户输入的数据*/
		initData:function(json){
			this.defaultConfig.forms=json;
			for(var i in json){//遍历所有的表单
				var formName = i;
				var form = json[i];
				var formStatus={status:1};
				form.push(formStatus);
				for(var fieldNum=0;fieldNum<form.length-1;fieldNum++){//遍历字段数组
					var fields = form[fieldNum];
					if(this.method.isSubmit(fields)){
						this.method.doOnClickSubmit(i,fields);
					}else if(this.method.isUnique(fields)){
						this.method.doOnBlurUnique(i,fields);
					}else{
						this.method.doOnBlurNotUnique(i,fields);
					}
				}
			}
		},
		/*加载默认方法*/
		method:{
			/*判断是否为提交表单按钮*/
			isSubmit:function(json){
				if(typeof(json)=="object"){
					var submit = json['submit'];
					if(typeof(submit)!="undefined"){
						return true;
					}
					else{
						return false;
					}
				}
			},
			/*判断是否为unique字段*/
			isUnique:function(json){
				if(typeof(json)=="object"){
					var uniqueField = json['unique'];
					if((typeof(uniqueField)!="undefined") && (typeof(uniqueField)=="object")){
						return true;
					}
					else{
						return false;
					}
				}
			},
			/*为submit添加事件：先遍历执行该表单的所有字段的校验，再进行判断是否有用户自定义方法*/
			doOnClickSubmit:function(formName,json){
				var name = json['submit'];
				var doSomething = json['doSomething'];
				var button = $("form[name='"+formName+"'] ["+name+"]");
				button.click(function(){
					var form = $.fn.FormControl.defaultConfig.forms[formName];
					$.fn.FormControl.defaultConfig.forms[formName][form.length-1]['status']=1;
					for(var fieldNum=0;fieldNum<form.length-1;fieldNum++){//遍历字段数组
						var fields = form[fieldNum];
						if($.fn.FormControl.method.isSubmit(fields)){
						}else{
							var fieldName = fields['name'];
							$("form[name='"+formName+"'] [name='"+fieldName+"']").blur();
						}
					}
					if($.fn.FormControl.defaultConfig.forms[formName][form.length-1]['status']==0){
						return;
					}
					else{
						if(typeof(doSomething)=="function"){
							var status = doSomething();
							if(!status){
								return;
							}else{
								$("form[name='"+formName+"']").submit();
							}
						}
					}
				});
			},
			//为非Unique控件添加事件
			doOnBlurNotUnique:function(formName,json){
				if(typeof(json)=="object"){
					var name = json['name'];
					var regex = json['regex'];
					var error = json['error'];
					var field = $("form[name='"+formName+"'] [name='"+name+"']");
					field.blur(function(){
						var text = $(this).val();
						if(typeof(regex)!="undefined"){
							if(typeof(regex)=="function"){
								if(!regex(text)){
									isValidate = 0;
								}
							}
							else if(typeof(regex)=="object"){
								var patt =new RegExp(regex);
								if(!patt.test(text)){
									isValidate = 0;
								}
							}
							if(isValidate==0){
								var form = $.fn.FormControl.defaultConfig.forms[formName];
									form[form.length-1]['status'] = 0;
									if(typeof(error)=="function"){
										error();
									}
									return;
							}
						}
					});
				}
			},
			//为Unique控件添加事件
			doOnBlurUnique:function(formName,json){
				if(typeof(json)=="object"){
					var name = json['name'];
					var regex = json['regex'];
					var error = json['error'];
					var unique = json['unique'];
					var field = $("form[name='"+formName+"'] [name='"+name+"']");
					var isValidate = 1;
					field.blur(function(){
						var text = $(this).val();
						if(typeof(regex)!="undefined"){
							if(typeof(regex)=="function"){
								if(!regex(text)){
									isValidate = 0;
								}
							}
							else if(typeof(regex)=="object"){
								var patt =new RegExp(regex);
								if(!patt.test(text)){
									isValidate = 0;
								}
							}
							if(isValidate==0){
								var form = $.fn.FormControl.defaultConfig.forms[formName];
									form[form.length-1]['status'] = 0;
									if(typeof(error)=="function"){
										error();
									}
									return;
							}
						}
						var action = unique['action'];
						var method = unique['method'];
						$.post(action,method);
					});
				}
			}
		}
	};
})($);
$(document).ready(function(){
	$.fn.FormControl.initData(
				  	{
				  		form1:[{	
				  			name:"name",
							regex:/^\d$/,
							error:function(){
								alert("自定义验证函数返回错误");
							}
						},{submit:"hehe",doSomething:function(){
							alert("doSomething");
							return true;
						}},{
							name:"idcard",
							regex:/^\d$/,
							error:function(){
								alert("自定义验证函数返回错误");
							},
							unique:{
								action:"",
								method:function(data){
									alert(data);
								}
							}
						}]
					});
});
