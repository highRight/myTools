(function($){
	$.fn.TableControl = {
		defaultConfig:{
			//存放表格，每个表格里有每个字段以及字段属性
			tables:{
				/*"table1":[

				]*/
			}
		},
		//进行初始化，把表格参数等传入进行赋值和操作的赋值
		initData:function(obj){
			//读取参数并初始化参数
			if((Array.isArray(obj))&&(obj.length>0)){
				$.fn.TableControl.methods.getFieldNameByTableName(obj);
			}else if(typeof(obj)=="object"){
				this.defaultConfig.tables = obj;
			}
		},
		doPost:function(action,tableName){
			$.post(action,function(data){
				//循环遍历数据，处理每一行数据
				alert(data);
                for(var i=0;i<data.length;i++){
                    var rowData = data[i];
                    $.fn.TableControl.methods.dealWithRow(rowData,tableName);
                }
			});
		},
		//一些常用方法
		methods:{
			getFieldNameByTableName:function(tableNameArray){
				var tablesJson = {};
				for(var i=0;i<tableNameArray.length;i++){
					var fieldsArray = [];
					var tr = $("table[name='"+tableNameArray[i]+"'] [name]");
					for(var j=0;j<tr.length;j++){
						var fieldJson = {};
						var temp = $(tr[j]);
						var name = temp.attr("name");
						fieldJson['name'] = name;
						fieldsArray.push(fieldJson);
					}
					tablesJson[tableNameArray[i]]=fieldsArray;
				}
				$.fn.TableControl.defaultConfig.tables = tablesJson;
			},
			dealWithRow:function(rowData,tableName){
				//获取配置中对应的table字段配置：是json数组
				var TR = $("<tr/>");
				var fields = $.fn.TableControl.defaultConfig.tables[tableName];
				for(var j=0;j<fields.length;j++){
					//遍历每个字段：是json格式
					var field = fields[j];
					var name = field['name'];
					if(typeof(name)!="undefined"){
						//获取数据行中对应数据
						var fieldData = rowData[name];
						var TD = this.dealWithTD(field,fieldData);
						TR.append(TD);
					}
					else{
						var trClass = field['class'];
						if(typeof(trClass)!="undefined"){
							TR.attr("class",trClass);
						}
					}
				}
				var table = $("table[name='"+tableName+"']");
				table.append(TR);
			},
			dealWithTD:function(field,fieldData){
				var method = field['method'];
				var TD = $("<td/>");
				var isLayout = 0;
				for(var name in method){
					if(name=="layout"){
						var layout = method['layout'];
						TD = layout(fieldData);
						isLayout = 1;
					}
					else{
						eval("TD."+name+"(method['"+name+"']);");
					}
				}
				var tdClass = field['class'];
				if(typeof(tdClass)!="undefined"){
					TD.attr("class",tdClass);
				}
				if(isLayout==0){
					TD.text(fieldData);
				}
				return TD;
			}
		}
	};
})($);
