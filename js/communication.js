(function($,owner){
	owner.get=function(params,successFun,errorFun){
		if(!params){
			return;
		}
		params.type="GET";
		setparams(params);
		communication(params,successFun,errorFun);
	};
	owner.post=function(params,successFun,errorFun){
		if(!params){
			return;
		}
		params.type="POST";
		setparams(params);
		
		communication(params,successFun,errorFun);
	};
	function setparams(params){
		params.data=params.data||{};
		params.dataType=params.dataType||'json';
	}
	function communication(params,successFun,errorFun){
		$.ajax({
			url:params.controller,
			type:params.type,
			dataType:params.dataType,
			data:params.data,
			success:function(result){
				successFun&&successFun(result);
			},
			error:function(){
				errorFun&&errorFun();
			}
		})
	}
}(jQuery,window.communication={}))
