(function($,owner){
	owner.get=function(options,successFun,errorFun){
		if(!options){
			return;
		}
		options.type="GET";
		setoptions(options);
		communication(options,successFun,errorFun);
	};
	owner.post=function(options,successFun,errorFun){
		if(!options){
			return;
		}
		options.type="POST";
		setoptions(options);
		
		communication(options,successFun,errorFun);
	};
	function setoptions(options){
		options.data=options.data||{};
		options.dataType=options.dataType||'json';
	}
	function communication(options,successFun,errorFun){
		$.ajax({
			url:options.controller,
			type:options.type,
			dataType:options.dataType,
			data:options.data,
			success:function(result){
				successFun&&successFun(result);
			},
			error:function(){
				errorFun&&errorFun();
			}
		})
	}
}(jQuery,window.communication={}))
