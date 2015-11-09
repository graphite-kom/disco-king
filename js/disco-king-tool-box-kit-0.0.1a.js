	
	// disco-king-tool-box-kit-0.0.1a

	function ToolBoxKit () {
		this.logger = new Logger ();
	}

	// getType + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - 

	ToolBoxKit.prototype.getType = function (variable) {
		
		var toClass = {}.toString;

		var extractType = function (object_var) {
			var to_string_class = toClass.call(object_var)
			return to_string_class.split('[object ')[1].split(']')[0];
		};		

		var type = extractType(variable);
		
		if(type == 'String'){
			try{			
				var parsed_variable = JSON.parse(variable);
				if(extractType(parsed_variable) == 'Array' || extractType(parsed_variable) == 'Object' ){
					type = 'JSON';
				}
			}catch(err){
				// Nothing (rien du tout) ...
			}
		}

		// console.log(variable);
		// console.log('variable : ' + variable + ' with type : ' + type);		
		// console.log('// + - + - + - + - + - + - + - + - + - + - + - + - + - + - ');

		return type;
	};

	// Cookie functions - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - 

	ToolBoxKit.prototype.setCookie = function (cookie_name, cookie_value, days) {
		var d = new Date();
		d.setTime(d.getTime() + (days*24*60*60*1000));
		var expires = 'expires='+d.toUTCString();
		document.cookie = cookie_name + '=' + cookie_value + '; ' + expires;
	};

	ToolBoxKit.prototype.getCookie = function (cookie_name) {
		var name = cookie_name + '=';
		var ca = document.cookie.split(';');
		for(var i=0; i<ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1);
			if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
		}
		return '';
	};


	// checkHTTPStatus - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - 

	ToolBoxKit.prototype.checkHTTPStatus = function (response_object) {
		var response_code_prefix = response_object.status.toString().substring(0, 1);
		if(response_code_prefix == '4' || response_code_prefix == '5'){
			// example : 404 or 500
			throw new AjaxComponentException('Could not get ressource : ' + response_object.status + ' ' + response_object.statusText + ' | url : ' + response_object.responseURL);
		}
	};


	// checkContentType - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - 

	ToolBoxKit.prototype.checkContentType = function (response_object, check_mode) {

		var allowed_media_content_types	= ['image/jpeg', 'video/mp4', 'application/x-shockwave-flash'];
		
		switch(check_mode){
			
			case 'media' :
				var content_type = response_object.getResponseHeader('content-type');
				if(allowed_media_content_types.indexOf(content_type) == -1){
					throw new AjaxComponentException('File type ' + content_type + ' is not allowed');
				}
				return content_type;
				break;

			// TODO : checkContentType for xml, plain-text and json
			case 'data' :

				break;

		}

		/*var response_code_prefix = response_object.status.toString().substring(0, 1);
		if(response_code_prefix == '4' || response_code_prefix == '5'){
			// example : 404 or 500
			throw new AjaxComponentException('Could not get ressource : ' + response_object.status + ' ' + response_object.statusText + ' | url : ' + response_object.responseURL);
		}*/
	};


	// ajaxParametersFormat - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - 

	ToolBoxKit.prototype.ajaxParametersFormat = function (AjaxObject) {

		// async, url, method, parameters, responseType

		var AjaxParameters 					= {};

		var params_array 					= [];

		var allowed_methods_array 			= ['GET', 'POST', 'HEAD', 'OPTIONS'];

		var allowed_response_type_array 	= ['', 'arraybuffer', 'blob', 'document', 'json', 'text'];

		//

		if(this.getType(AjaxObject) !== 'Object') throw new AjaxComponentException('Ajax Object is not in a well formed literal Object');

		if(this.getType(AjaxObject.async) !== 'Boolean') throw new AjaxComponentException('URL is not in a well formed literal String Object');

		if(this.getType(AjaxObject.url) !== 'String') throw new AjaxComponentException('URL is not in a well formed literal String Object');

		if(this.getType(AjaxObject.method) !== 'String' || allowed_methods_array.indexOf(AjaxObject.method) == -1) throw new AjaxComponentException('Method is incorrect');

		if(this.getType(AjaxObject.parameters) !== 'Object' && this.getType(AjaxObject.parameters) !== 'Undefined') throw new AjaxComponentException('Parameters are not in a well formed literal Object');

		if(this.getType(AjaxObject.responseType) !== 'String' || allowed_response_type_array.indexOf(AjaxObject.responseType) == -1) throw new AjaxComponentException('responseType is incorrect');

		// 

		for (i in AjaxObject.parameters) {

			switch(this.getType(AjaxObject.parameters[i])){

				case 'String':
					params_array.push(i + '=' + AjaxObject.parameters[i]);
					break;

				case 'JSON':
					params_array.push(i + '=' + encodeURIComponent( AjaxObject.parameters[i]) );
					break;

				case 'Number':
					params_array.push(i + '=' + AjaxObject.parameters[i]);
					break;

				case 'Array':
					params_array.push(i + '=' + encodeURIComponent( JSON.stringify( AjaxObject.parameters[i] ) ) );
					break;

				case 'Object':
					params_array.push(i + '=' + encodeURIComponent( JSON.stringify( AjaxObject.parameters[i] ) ) );
					break;
			}

		}

		// 

		AjaxParameters.async		= AjaxObject.async;

		AjaxParameters.responseType	= AjaxObject.responseType;

		if(params_array.length > 0){
			AjaxParameters.url 		= (AjaxObject.method == 'GET') ? AjaxObject.url + '?' + params_array.join('&') : AjaxObject.url ;
		}else{
			AjaxParameters.url 		= AjaxObject.url;
		}

		AjaxParameters.method 		= AjaxObject.method ;

		AjaxParameters.parameters 	= (AjaxObject.method == 'POST') ? params_array.join('&') : '' ;
		
		return AjaxParameters;

	};

	// makeAjax - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - 

	ToolBoxKit.prototype.makeAjax = function (AjaxObject, CallBack) {

			// async, url, method, parameters, responseType

			var user		= '';

			var password 	= '';

			var logger 		= this.logger;

			var self 		= this;

			if (window.XMLHttpRequest) {

				try{

					var AjaxParameters = this.ajaxParametersFormat(AjaxObject);
					
					// + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + -

					var xhr = new XMLHttpRequest();
				
					xhr.open(AjaxParameters.method, AjaxParameters.url, AjaxParameters.async, user, password);
					
					xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

					xhr.responseType = AjaxParameters.responseType;
					
					xhr.onreadystatechange = function (event) {

						if (this.readyState == this.DONE) {

							/*var response_object = {
								status			: this.status,
								content_type	: this.getResponseHeader('content-type')
							};*/

							var response_object = this;

							if (self.getType(CallBack) == 'Function') {
								return CallBack(response_object);	
							}else{
								try{
									self.checkHTTPStatus(response_object);
									return response_object.response;
								}catch(err){
									logger.logError(err.name, err.message);
								}								
							}



							
							
							/*if(this.status == 200){
								var response_object = {
									content_type	: this.getResponseHeader('content-type');
								};

								return CallBack(response_object);

							}else{
								console.log(self.getType(this.status));
								// throw new AjaxComponentException('responseType is incorrect');
								// throw new AjaxComponentException('Could not get ressource : response code is ' + this.status);
							}	*/					

						}
						
					}

					/*xhr.onload = function (event) {

						switch(AjaxParameters.responseType){

							case 'text':
								var text 				= console.log(xhr.response);
								// var objectURL 		= URL.createObjectURL(blob);
								// theImage.src 		= objectURL;
								break;

							case 'arraybuffer':
								// var theImage 		= document.querySelector('img');
								// var blob 			= new Blob([xhr.response], {type: "image/jpeg"});
								// var objectURL 		= URL.createObjectURL(blob);
								// theImage.src 		= objectURL;

								// 
								var response_object = this;

								if (self.getType(CallBack) == 'Function') {
									return CallBack(response_object);	
								}
								
								break;							

						}

					};*/
					
					xhr.send(AjaxParameters.parameters);

				}catch(err){

					logger.logError(err.name, err.message);

				}
				

				// var params = 'nim='+nim+'&caisse_num='+caisse_num+'&player_error_log='+encodeURIComponent(player_error_log);

				//
				
				/*

				var xhr = new XMLHttpRequest();
				
				// xhr.open('POST','http://10.10.2.13/anim_stat_janvier_2015/cors-support-report.php', false);

				xhr.open('POST','http://www.bimediatv.com/screen/core/xmlspit/player_error_logger.php', false);
				
				xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
				
				xhr.onreadystatechange=function(){
					
					// 0: request not initialized 
					// 1: server connection established
					// 2: request received 
					// 3: processing request 
					// 4: request finished and response is ready			
					
					if (xhr.readyState==4 && xhr.status==200){
						
						var xhrResponse = xhr.responseText;
		
						// console.log(xhrResponse);
					
					}
					
				}
				
				xhr.send(params);

				*/
			
			}

		};

		// fetchFile - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - 

		ToolBoxKit.prototype.fetchFile = function (fetchObject) {

			// async, url, method, parameters, responseType

			var self 					= this;

			var logger 					= this.logger;

			var target 					= document.getElementById(fetchObject.target);

			var HeadAjaxObject = {
				async			: true ,
				url				: fetchObject.file ,
				method			: 'GET' ,
				responseType	: 'arraybuffer'
			};

			this.makeAjax(HeadAjaxObject, function (response_object) {

				try{

					self.checkHTTPStatus(response_object);

					var content_type 	=  self.checkContentType(response_object, 'media');

					var blob 			= new Blob([response_object.response], { type : content_type });	

					var objectURL 		= URL.createObjectURL(blob);

					var child 			= document.createElement('IMG');

					child.src 			= objectURL;

					target.appendChild(child);

				}catch(err){

					logger.logError(err.name, err.message);
				
				}

			});

			/*

			var GetAjaxObject = {
				async			: true ,
				url				: HeadAjaxObject.url ,
				method			: 'GET' ,
				responseType	: 'arraybuffer'
			}

			this.makeAjax(GetAjaxObject, function (response_object) {

				// var theImage 		= document.querySelector('img');
				// var blob 			= new Blob([xhr.response], {type: "image/jpeg"});
				// var objectURL 		= URL.createObjectURL(blob);
				// theImage.src 		= objectURL;

				// console.log(target);

				console.log('Trace this');

			});*/		
			

			/*AjaxObject = {
				async			: true ,
				url				: fetchObject.file ,
				method			: 'GET' ,
				responseType	: 'arraybuffer' 
			};

			var element 		= document.querySelector(fetchObject.target);*/

			// this.makeAjax(AjaxObject);

		};










