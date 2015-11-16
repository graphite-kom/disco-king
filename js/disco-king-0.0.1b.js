
	// getEffectiveDatetime + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - 

	Date.prototype.getEffectiveDatetime = function () {
		// var date_time_object = new Date();
		var paddThis = function (item) {
			return (typeof item[1] == undefined) ? "0" + item : item ;
		}
		return this.getFullYear() 
			+ "-" + paddThis(this.getMonth() + 1) 
			+ "-" + paddThis(this.getDate()) 
			+ " " + paddThis(this.getHours())
			+ ":" + paddThis(this.getMinutes())
			+ ":" + paddThis(this.getSeconds());
	};

	// Logger	+ - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - 
	
	var Logger = {
		error_log_array		: [],
		logError			: function (component_name, error_message) {
			var error_object = {
				date_time 		: new Date().getEffectiveDatetime(),
				component_name 	: component_name,
				ip_address		: ip_address,
				error_message 	: error_message
			};
			console.log(JSON.stringify(error_object));
			this.error_log_array.push(error_object);
		},
		logInfo				: function (component_name, info_message) {
			var info_object = {
				date_time 		: new Date().getEffectiveDatetime(),
				component_name 	: component_name,
				ip_address		: ip_address,
				info_message 	: info_message
			};
			console.log(JSON.stringify(info_object));
		},
		logInspect			: function (element) {
			console.log(element);
		}
	};

	var logError 	= function (component_name, error_message) {
		Logger.logError(component_name, error_message);
	};

	var logInfo 	= function (component_name, info_message) {
		Logger.logInfo(component_name, info_message);
	};

	var logInspect	= function (element) {
		Logger.logInspect(element);
	};

	// Exceptions - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - 
	
	var AjaxComponentException = function (message) {
		this.name = "Ajax Component Exception";
		this.message = message;
	}


	/////////////////////////////////////////////////////////////////////////////////////////////////////// 
	// ToolBoxKit
	// disco-king-tool-box-kit-0.0.1b 
	// Start 
	///////////////////////////////////////////////////////////////////////////////////////////////////////

	var ToolBoxKit = {
		// getType - Returns variable type - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - +  
		getType 				: function (variable) {
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
			return type;
		},
		// Cookie functions - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - 
		setCookie 				: function (cookie_name, cookie_value, days) {
			var d = new Date();
			d.setTime(d.getTime() + (days*24*60*60*1000));
			var expires = 'expires='+d.toUTCString();
			document.cookie = cookie_name + '=' + cookie_value + '; ' + expires;
		},
		getCookie			: function (cookie_name) {
			var name = cookie_name + '=';
			var ca = document.cookie.split(';');
			for(var i=0; i<ca.length; i++) {
				var c = ca[i];
				while (c.charAt(0)==' ') c = c.substring(1);
				if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
			}
			return '';
		},
		// getMediaName - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - 
		getMediaName			: function (media_url) {
			var media_url_parts 	= media_url.split('/');
			var file_name			= media_url_parts[media_url_parts.length - 1];		
			if(file_name.indexOf('?') > -1){
				file_name 			= file_name.split('file=');
				file_name 			= file_name[file_name.length - 1];
			}
			var media_name_parts 	= file_name.split('.');
			var media_name 			= media_name_parts[0];
			return media_name;				
		},
		// checkHTTPStatus - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + 
		checkHTTPStatus			: function (response_object, url) {
			var response_code_prefix = response_object.status.toString().substring(0, 1);			
			// example : 404 or 500
			if(response_code_prefix == '4' || response_code_prefix == '5'  || response_code_prefix == '0'){
				var log_url = (response_object.responseURL.length > 0) ? response_object.responseURL : url ;
				throw new AjaxComponentException('Could not get ressource | status : ' + response_object.status + ' ' + response_object.statusText + ' | url : ' + log_url);
			}
		},
		// checkContentType - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - 
		checkContentType		: function (response_object, check_mode) {
			var content_type = response_object.getResponseHeader('content-type');
			var allowed_media_content_types	= ['image/jpeg', 'video/mp4', 'application/x-shockwave-flash'];
			var allowed_data_content_types	= ['text/xml', 'application/xml', 'application/json', 'text/plain', 'text/html',];
			var array_to_switch; 
			switch(check_mode){				
				case 'media' :
					array_to_switch = allowed_media_content_types;
					break;
				case 'data' :
					array_to_switch = allowed_data_content_types;
					break;
			}
			if(array_to_switch.indexOf(content_type) == -1){
				throw new AjaxComponentException('File type ' + content_type + ' is not allowed');
			}
			return content_type;
		}, 
		// ajaxParametersFormat - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - 
		ajaxParametersFormat	: function (AjaxObject) {

			// async, url, method, parameters, responseType
			var AjaxParameters 					= {};
			var params_array 					= [];
			var allowed_methods_array 			= ['GET', 'POST', 'HEAD', 'OPTIONS'];
			var allowed_response_type_array 	= ['', 'arraybuffer', 'blob', 'document', 'json', 'text'];

			//

			if(this.getType(AjaxObject) !== 'Object') throw new AjaxComponentException('Ajax Object is not in a well formed literal Object');
			if(this.getType(AjaxObject.async) !== 'Boolean') throw new AjaxComponentException('Async is not in a Boolean');
			if(this.getType(AjaxObject.url) !== 'String') throw new AjaxComponentException('URL ' + AjaxObject.url + ' is not in a well formed literal String Object');
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

			//

			return AjaxParameters;
		},
		// makeAjax - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - 
		makeAjax			: function (AjaxObject, CallBack){

			// AjaxObject should contain all of the following :
			// ------------------------------------------------
			// - async 			(Boolean - whether xhr is asynchronous or synchronous), 
			// - url 			(String - http://www.domain.tld/...), 
			// - method 		(can be 'GET', 'POST', 'HEAD' or 'OPTIONS' methods), 
			// - parameters 	(must be Object - nested Objects and Array will be converted to JSON - JSON will be sent as such) , 
			// - responseType 	(can be any of the following : '', 'arraybuffer', 'blob', 'document', 'json', 'text' according to Living Standard specifications 
			// 						-- > see https://xhr.spec.whatwg.org/ for more infomation on responseType)

			var user		= '';

			var password 	= '';

			var logger 		= Logger;

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

							var XhrResponseObject = this;

							try{

								self.checkHTTPStatus(XhrResponseObject, AjaxParameters.url);

								if (self.getType(CallBack) == 'Function') {
									return CallBack(XhrResponseObject);	
								}else{
									return XhrResponseObject.response;								
								}

							}catch(err){

								logger.logError(err.name, err.message);
								
								if (self.getType(CallBack) == 'Function') {
									return CallBack(null);	
								}else{
									return null;								
								}
							
							}

						}
						
					}
					
					xhr.send(AjaxParameters.parameters);

				}catch(err){

					logger.logError(err.name, err.message);

				}
						
			}

		},
		// fetchFile - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - 
		fetchFile			: function (fetchObject, CallBack) {

			// async, url, method, parameters, responseType

			// fetchObject should contain all of the following :
			// ------------------------------------------------
			// - file 			(Object 'pubObject')
			// 					-- > pubObject must contain the following :
			// 								-- > url			: 	String (example : 'http://www.domain.tld/myMedia.jpg')

			var self 					= this;

			var logger 					= Logger;

			//

			var GetAjaxObject = {
				async			: true ,
				url				: fetchObject.file.url ,
				method			: 'GET' ,
				responseType	: 'arraybuffer'
			};

			this.makeAjax(GetAjaxObject, function (XhrResponseObject) {

				if(!!XhrResponseObject) {

					var content_type 				= self.checkContentType(XhrResponseObject, 'media');

					var blob 						= new Blob([XhrResponseObject.response], { type : content_type });	

					var objectURL 					= URL.createObjectURL(blob);

					// 

					fetchObject.file.content_type 	= content_type;

					fetchObject.file.objectURL 		= objectURL;

				}else{

					fetchObject.file				= null;

				}

				return CallBack(fetchObject.file);	

			});

		}

	};

	/////////////////////////////////////////////////////////////////////////////////////////////////////// 
	// End
	// ToolBoxKit
	///////////////////////////////////////////////////////////////////////////////////////////////////////


	/////////////////////////////////////////////////////////////////////////////////////////////////////// 
	// DiscoKingPlayer
	// Start 
	///////////////////////////////////////////////////////////////////////////////////////////////////////	

	var DiscoKingPlayer = function (DiscoKingPlayerParams) {

		this.DiscoKingPlayerParams 	= DiscoKingPlayerParams;

		this.pubs 						= [];

		this.playListIndex 				= 0;

		// 

		this.reSize	= DiscoKingPlayerParams.reSize;
		this.target = document.querySelector(DiscoKingPlayerParams.target);
		this.target.style.position	= 'relative';

		if(!!this.reSize){
			if(DiscoKingPlayerParams.target == 'body'){
				// if(typeof window.innerWidth != 'undefined'){
				// Determin what resolution height is for Most Browsers
				// the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
				this.playerHeight = window.innerHeight;
				this.playerWidth = (this.playerHeight*DiscoKingPlayerParams.target_height)/DiscoKingPlayerParams.target_width;
				// }
			}else{
				// TODO : Action to take place if reSize in enable and target is a div element
			}
		}else{
			// TODO : Action to take place if reSize in disabled and target is a body or a div element
		}

	};

	DiscoKingPlayer.prototype.listPlaylist = function () {
		return this.pubs;
	};

	DiscoKingPlayer.prototype.countPlaylist = function () {
		return this.pubs.length;
	};

	// 

	DiscoKingPlayer.prototype.toTarget = function (PlayListItem, template_type) {

		var self = this;

		return new Promise(function (resolve, reject) {
			
			var SetUpObject = {
				template				: function () {
					return document.querySelector('#' + template_type);
				},
				container				: function () {
					return this.template().content.querySelector('div');
				},
				media 					: function () {
					return this.template().content.querySelector(template_type);
				}
			};

			resolve(SetUpObject);

		}).then(function (SetUpObject) {

			var FixedObject = {
				media 					: SetUpObject.media(),
				container 				: SetUpObject.container(),
				template 				: SetUpObject.template(),
				objectURL 				: PlayListItem.objectURL,
				stage_name 				: PlayListItem.stage_name
			};

			return FixedObject;

		}).then(function (FixedObject) {

			FixedObject.media.src 					= FixedObject.objectURL;
			FixedObject.media.style.height 			= self.playerHeight + 'px';
			FixedObject.media.style.width 			= self.playerWidth + 'px';
			FixedObject.container.style.height 		= self.playerHeight + 'px';
			FixedObject.container.style.width 		= self.playerWidth + 'px';
			FixedObject.container.style.position 	= 'absolute';
			FixedObject.container.style.margin 		= 'inherit';
			FixedObject.container.style.left 		= '-4000px';
			FixedObject.container.setAttribute('id', FixedObject.stage_name);

			// PlayListItem.media 						= FixedObject.media;

			var clone = document.importNode(FixedObject.template.content, true);

			self.target.appendChild(clone);

			PlayListItem.DomElement					= document.querySelector('#' + FixedObject.stage_name);

			return PlayListItem;

		}).then(function (PlayListItem) {			

			PlayListItem.setOnStage		= function () {
				this.DomElement.style.margin 	= 'auto';
				this.DomElement.style.position 	= 'static';
			};

			PlayListItem.setOffStage		= function () {
				this.DomElement.style.margin 	= 'inherit';
				this.DomElement.style.position 	= 'absolute';
			};

			PlayListItem.play 			= function () {

				self.playListIndex++;

				PlayListItemObject = this;

				this.setOnStage();

				switch(PlayListItem.content_type) {

					case 'image/jpeg':
						setTimeout(function(){
							PlayListItemObject.setOffStage();
							self.playNext();									
						},parseInt(PlayListItemObject.duration) * 1000);
						break;

					case 'video/mp4' :
						// logInspect(PlayListItemObject.media);
						// PlayListItemObject.media.play();
						video = PlayListItem.DomElement.querySelector('video');
						video.play();
						video.onended = function (evt) {
							PlayListItemObject.setOffStage();
							self.playNext();
						};
						break;

				}

			};

			return PlayListItem;

		}).then(function (PlayListItem) {
			
			self.pubs.push(PlayListItem);

			return PlayListItem;

		})/*.then(function () {
			
			logInspect('// + - + - + - + - + - + - + - + - + - + - + - + - ');

			logInspect(PlayListItem);

		})*/;
	
	};

	// 

	DiscoKingPlayer.prototype.addToPlaylist = function (PlayListItem) {

		var self = this;

		var template_type;

		switch(PlayListItem.content_type) {

			case 'image/jpeg':
				template_type = 'img';
				break;

			case 'video/mp4' :
				template_type = 'video';
				break;

		}

		this.toTarget(PlayListItem, template_type);

		// switch(PlayListItem.content_type){

		// 	case 'image/jpeg':

		// 		return new Promise(function (resolve, reject) {
					
		// 			var SetUpObject = {
		// 				template				: function () {
		// 					return document.querySelector('#img');
		// 				},
		// 				container				: function () {
		// 					return this.template().content.querySelector('div');
		// 				},
		// 				img 					: function () {
		// 					return this.template().content.querySelector('img');
		// 				}
		// 			};

		// 			resolve(SetUpObject);

		// 		}).then(function (SetUpObject) {

		// 			var FixedObject = {
		// 				img 					: SetUpObject.img(),
		// 				container 				: SetUpObject.container(),
		// 				template 				: SetUpObject.template(),
		// 				objectURL 				: PlayListItem.objectURL,
		// 				stage_name 				: PlayListItem.stage_name
		// 			};

		// 			return FixedObject;

		// 		}).then(function (FixedObject) {

		// 			FixedObject.img.src 					= FixedObject.objectURL;
		// 			FixedObject.img.style.height 			= self.playerHeight + 'px';
		// 			FixedObject.img.style.width 			= self.playerWidth + 'px';
		// 			FixedObject.container.style.height 		= self.playerHeight + 'px';
		// 			FixedObject.container.style.width 		= self.playerWidth + 'px';
		// 			FixedObject.container.style.position 	= 'absolute';
		// 			FixedObject.container.style.margin 		= 'inherit';
		// 			FixedObject.container.style.left 		= '-4000px';
		// 			FixedObject.container.setAttribute('id', FixedObject.stage_name);

		// 			var clone = document.importNode(FixedObject.template.content, true);

		// 			self.target.appendChild(clone);

		// 			PlayListItem.DomElement					= document.querySelector('#' + FixedObject.stage_name);

		// 			return PlayListItem;

		// 		}).then(function (PlayListItem) {			

		// 			PlayListItem.setOnStage		= function () {
		// 				this.DomElement.style.margin 	= 'auto';
		// 				this.DomElement.style.position 	= 'static';
		// 			};

		// 			PlayListItem.setOffStage		= function () {
		// 				this.DomElement.style.margin 	= 'inherit';
		// 				this.DomElement.style.position 	= 'absolute';
		// 			};

		// 			PlayListItem.play 			= function () {

		// 				PlayListItemObject = this;

		// 				this.setOnStage();
						
		// 				setTimeout(function(){
		// 					PlayListItemObject.setOffStage();
		// 					self.playListIndex++;
		// 					self.playNext();									
		// 				},parseInt(PlayListItemObject.duration) * 1000);			
		// 			};

		// 			return PlayListItem;

		// 		}).then(function (PlayListItem) {
					
		// 			self.pubs.push(PlayListItem);

		// 			return PlayListItem;

		// 		})/*.then(function () {
					
		// 			logInspect('// + - + - + - + - + - + - + - + - + - + - + - + - ');

		// 			logInspect(PlayListItem);

		// 		})*/;

		// 		break;

		// 	case 'video/mp4':
		// 		var template 			= document.querySelector('#video');
		// 		var container			= template.content.querySelector('div');
		// 		var video 				= template.content.querySelector('video');
		// 		video.src 				= PlayListItem.objectURL;
		// 		video.style.height 		= playerHeight + 'px';
		// 		video.style.width 		= playerWidth + 'px';
		// 		container.style.height 	= playerHeight + 'px';
		// 		container.style.width 	= playerWidth + 'px';
		// 		container.style.position 	= 'absolute';
		// 		container.style.left 	= '-4000px';
		// 		container.setAttribute('id', PlayListItem.name);
		// 		var clone = document.importNode(template.content, true);
		// 		this.target.appendChild(clone);
		// 		break;
		// }

	};

	DiscoKingPlayer.prototype.playNext = function () {
	
		if(this.playListIndex == this.countPlaylist()){
			this.playListIndex = 0;
		}

		this.listPlaylist()[this.playListIndex].play();
	
	};




	/////////////////////////////////////////////////////////////////////////////////////////////////////// 
	// End
	// DiscoKingPlayer
	///////////////////////////////////////////////////////////////////////////////////////////////////////


	/////////////////////////////////////////////////////////////////////////////////////////////////////// 
	// DiscoKingLoader
	// Start 
	///////////////////////////////////////////////////////////////////////////////////////////////////////	

	
	var DiscoKingLoader = function (DiscoKingPlayerParams, DiscoKingPlayer, CallBack) {

		this.DiscoKingPlayerParams 		= DiscoKingPlayerParams;

		this.DiscoKingPlayer 			= DiscoKingPlayer;

		this.OdpXmlResponse 			= {};

		this.loadCounter 				= 0;

		this.item_index 				= 0;

		this.DiscoKingLoaderReturns		= CallBack;

		// 

		this.PrimitivePubArray 	= {
			primitivePubs			: [],
			addToPrimitivePubArray	: function (pub_object) {
				this.primitivePubs.push(pub_object);
			},
			listPrimitivePubs		: function () {
				return this.primitivePubs;
			},
			countPrimitivePubs		: function () {
				return this.primitivePubs.length;
			}
		};

		this.MediaBasket = {
			medias 				: [],
			media_names_list 	: [],
			addToMediaBasket	: function (media_object) {
				if(!!media_object){
					this.medias.push(media_object);
					this.media_names_list.push(media_object.name);
				}				
			},
			listMedias			: function () {
				return this.medias;
			},
			countMedias			: function () {
				return this.medias.length;
			},
			mediaNamesList		:function () {
				return this.media_names_list;
			},
			isMediaInBasket		: function (media_object) {
				try{
					var media_name = media_object.name;	
					return this.media_names_list.indexOf(media_name) > -1;
				}catch(err){
					logError('MediaBasket', err.message);
				}				
			},
			getMediaIndex		: function (media_object) {
				var media_name = media_object.name;	
				return this.media_names_list.indexOf(media_name);
			}
		};

		// 

		/*this.PlayList = {
			pubs 				: [],
			playListIndex		: 0,
			addToPlaylist		: function (PlayListItem) {
				if(!!PlayListItem){
					switch(PlayListItem.content_type){
						case 'image/jpeg':
							var template 				= document.querySelector('#img');
							var container				= template.content.querySelector('div');
							var img 					= template.content.querySelector('img');
							var stage_name				= PlayListItem.name + '-' + i.toString();
							img.src 					= PlayListItem.objectURL;
							img.style.height 			= playerHeight + 'px';
							img.style.width 			= playerWidth + 'px';
							container.style.height 		= playerHeight + 'px';
							container.style.width 		= playerWidth + 'px';
							container.style.position 	= 'absolute';
							container.style.margin 		= 'inherit';
							container.style.left 		= '-4000px';
							container.setAttribute('id', stage_name);
							var clone = document.importNode(template.content, true);
							// 
							this.target.appendChild(clone);
							// 

							// logInspect(stage_name);

							// PlayListItem.DomElement		= document.querySelector('#' + PlayListItem.name + '-' + i.toString());

							PlayListItem.setOnStage		= function () {
								// logInspect(this);
								// this.DomElement.style.margin 	= 'auto';
								// this.DomElement.style.position 	= 'static';
							};

							PlayListItem.setOffStage		= function () {
								// this.DomElement.style.margin 	= 'inherit';
								// this.DomElement.style.position 	= 'absolute';
							};

							PlayListItem.play 			= function () {

								logInspect(i);

								var CurrentItem = this;

								CurrentItem.DomElement = document.querySelector('#' + CurrentItem.name + '-' + i.toString());

								// logInspect(CurrentItem.DomElement);

								CurrentItem.setOnStage();
								
								setTimeout(function(){
									CurrentItem.setOffStage();
									self.playListIndex++;
									self.playNext();									
								},parseInt(CurrentItem.duration) * 1000);

							};
							break;

						case 'video/mp4':
							// var template 			= document.querySelector('#video');
							// var container			= template.content.querySelector('div');
							// var video 				= template.content.querySelector('video');
							// video.src 				= PlayListItem.objectURL;
							// video.style.height 		= playerHeight + 'px';
							// video.style.width 		= playerWidth + 'px';
							// container.style.height 	= playerHeight + 'px';
							// container.style.width 	= playerWidth + 'px';
							// container.style.position 	= 'absolute';
							// container.style.left 	= '-4000px';
							// container.setAttribute('id', PlayListItem.name);
							// var clone = document.importNode(template.content, true);
							// this.target.appendChild(clone);
							break;
					}
					this.pubs.push(PlayListItem);
				}				
			},
			listPlaylist		: function () {
				return this.pubs;
			},
			countPlaylist		: function () {
				return this.pubs.length;
			},
			toTarget			: function (CallBack) {
				
				var self = this;

				var return_value = false;

				try{

					this.reSize	= DiscoKingPlayerParams.reSize;
					this.target = document.querySelector(DiscoKingPlayerParams.target);
					this.target.style.position	= 'relative';

					if(!!this.reSize){
						if(DiscoKingPlayerParams.target == 'body'){
							// if(typeof window.innerWidth != 'undefined'){
							// Determin what resolution height is for Most Browsers
							// the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
							var playerHeight = window.innerHeight;
							var playerWidth = (playerHeight*DiscoKingPlayerParams.target_height)/DiscoKingPlayerParams.target_width;
							// }
						}else{
							// TODO : Action to take place if reSize in enable and target is a div element
						}
					}else{
						// TODO : Action to take place if reSize in disabled and target is a body or a div element
					}					

					// 

					for(var i in this.listPlaylist()){
						var PlayListItem = this.listPlaylist()[i];
						switch(PlayListItem.content_type){
							case 'image/jpeg':
								var template 				= document.querySelector('#img');
								var container				= template.content.querySelector('div');
								var img 					= template.content.querySelector('img');
								var stage_name				= PlayListItem.name + '-' + i.toString();
								img.src 					= PlayListItem.objectURL;
								img.style.height 			= playerHeight + 'px';
								img.style.width 			= playerWidth + 'px';
								container.style.height 		= playerHeight + 'px';
								container.style.width 		= playerWidth + 'px';
								container.style.position 	= 'absolute';
								container.style.margin 		= 'inherit';
								container.style.left 		= '-4000px';
								container.setAttribute('id', stage_name);
								var clone = document.importNode(template.content, true);
								// 
								this.target.appendChild(clone);
								// 

								// logInspect(stage_name);

								// PlayListItem.DomElement		= document.querySelector('#' + PlayListItem.name + '-' + i.toString());

								PlayListItem.setOnStage		= function () {
									// logInspect(this);
									// this.DomElement.style.margin 	= 'auto';
									// this.DomElement.style.position 	= 'static';
								};

								PlayListItem.setOffStage		= function () {
									// this.DomElement.style.margin 	= 'inherit';
									// this.DomElement.style.position 	= 'absolute';
								};

								PlayListItem.play 			= function () {

									logInspect(i);

									var CurrentItem = this;

									CurrentItem.DomElement = document.querySelector('#' + CurrentItem.name + '-' + i.toString());

									// logInspect(CurrentItem.DomElement);

									CurrentItem.setOnStage();
									
									setTimeout(function(){
										CurrentItem.setOffStage();
										self.playListIndex++;
										self.playNext();									
									},parseInt(CurrentItem.duration) * 1000);

								};
								break;

							case 'video/mp4':
								var template 			= document.querySelector('#video');
								var container			= template.content.querySelector('div');
								var video 				= template.content.querySelector('video');
								video.src 				= PlayListItem.objectURL;
								video.style.height 		= playerHeight + 'px';
								video.style.width 		= playerWidth + 'px';
								container.style.height 	= playerHeight + 'px';
								container.style.width 	= playerWidth + 'px';
								container.style.position 	= 'absolute';
								container.style.left 	= '-4000px';
								container.setAttribute('id', PlayListItem.name);
								var clone = document.importNode(template.content, true);
								this.target.appendChild(clone);
								break;
						}
					}
					return_value = true;
				}catch(err){
					logError('toTarget', err.message);
				}

				CallBack(return_value);

			},playNext			: function () {

				this.listPlaylist()[this.playListIndex].play();

			}
		};*/

	};



	// getPubArrayFromXML - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - 
	
	DiscoKingLoader.prototype.getPubArrayFromXML = function (XhrResponseObject, CallBack) {
		try{
			var content_type =  ToolBoxKit.checkContentType(XhrResponseObject, 'data');			
			if(content_type !== 'text/xml' && content_type !== 'application/xml') throw new AjaxComponentException('Raw Data Pub Array must be xml');
			var xml_response 	= XhrResponseObject.response;
			var parser			= new DOMParser();
			var loop			= parser.parseFromString(xml_response, content_type);
			var xml_pubs		= loop.getElementsByTagName("pub");	
			for(var i in xml_pubs){
				if(xml_pubs[i].nodeName === "pub"){					
					
					var xml_pub_item = xml_pubs[i];
					var pub_item = {
						url				: 	xml_pub_item.textContent,
						id				: 	xml_pub_item.getAttribute("id"),
						name 			: 	ToolBoxKit.getMediaName(xml_pub_item.textContent),
						init			: 	xml_pub_item.getAttribute("init"),
						log_diffusion	: 	xml_pub_item.getAttribute("log_diffusion"),
						reseau			: 	xml_pub_item.getAttribute("reseau"),
						duration		: 	xml_pub_item.getAttribute("duration")
					};		
					this.PrimitivePubArray.addToPrimitivePubArray(pub_item);
				}
			}			
			return CallBack();
		}catch(err){
			logError("getPubArrayFromXML", err.message);
			// TODO : load emergency loop 
		}		
	};

	// getMediaItem - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - 

	DiscoKingLoader.prototype.getMediaItem = function (primitive_pub_item, CallBack) {
		var self = this;
		try{
			if(!self.MediaBasket.isMediaInBasket(primitive_pub_item)){
				return ToolBoxKit.fetchFile({ file : primitive_pub_item }, function (pub_item_with_media) {
					self.MediaBasket.addToMediaBasket(pub_item_with_media);
					CallBack(pub_item_with_media);				
				});
			}else{
				CallBack(self.MediaBasket.medias[self.MediaBasket.getMediaIndex(primitive_pub_item)]);
			}
		}catch(err){
			logError('getMediaItem', err.message)
		}
	};

	// buildLoop - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - 

	DiscoKingLoader.prototype.buildLoop = function () {

		var self = this;

		try{

			var primitive_pub_item = self.PrimitivePubArray.listPrimitivePubs()[self.loadCounter];

			self.getMediaItem(primitive_pub_item, function (pub_item_with_media) {

				// 
				if(!!pub_item_with_media){

					var stage_name = pub_item_with_media.name + '-' + self.item_index;

					var NewLoopItem = {
						index 				: self.item_index,
						stage_name 			: stage_name,
						content_type 		: pub_item_with_media.content_type,
						duration 			: pub_item_with_media.duration,
						id 					: pub_item_with_media.id,
						init 				: pub_item_with_media.init,
						log_diffusion 		: pub_item_with_media.log_diffusion,
						name 				: pub_item_with_media.name,
						objectURL 			: pub_item_with_media.objectURL,
						reseau 				: pub_item_with_media.reseau,
						url 				: pub_item_with_media.url
					};

					//

					self.DiscoKingPlayer.addToPlaylist(NewLoopItem);

					self.item_index++;

				}				

				self.loadCounter++;

				if(self.loadCounter < self.PrimitivePubArray.countPrimitivePubs()){

					self.buildLoop();

				}else{
					return self.DiscoKingLoaderReturns(self.DiscoKingPlayer);
				}
				
			});

		}catch(err){

			logError("buildLoop", err.message);

			// TODO : Action in case of problem
		}
	};


	// loadLoop - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - 

	DiscoKingLoader.prototype.loadLoop = function () {

		var self = this;

		// DiscoKingPlayerParams should contain :
		// --------------------------------------
		// 
		// Options for rendering :
		// - - - - - - - - - - - - 
		// target 			: document.querySelector('body'),
		// target_height 	: Number 		(integer / example : 1024 for 1024 pixels)
		// target_width 	: Number 		(integer / example : 668 for 668 pixels)
		// 
		// Options for ODP querying :
		// - - - - - - - - - - - - - 
		// xml_ressource 	: "http://10.10.2.13/Disco-King/disco-king/data/data.php",
		// nim 				: String		(example : '8888888')
		// machine_id 		: Number		(integer / example : 1)	
		// date 			: date			(format should be 'YYYY-MM-DD' / example : '2015-01-01')
		// hour 			: time			(format should be 'HH-MM-SS' / example : '12:00:00')
		// 
		// Options for PUSH campaign querying :
		// - - - - - - - - - - - - - - - - - - 
		// code 			: code			(example : 'XXXXXXX')
		// family 			: famille		(example : 'XXXXXXX')

		ToolBoxKit.makeAjax({
			async			: true,
			url 			: this.DiscoKingPlayerParams.xml_ressource,
			method 			: 'GET',
			responseType	: '',
			parameters 	: {
					nim				: this.DiscoKingPlayerParams.nim,
					caisse_num 		: this.DiscoKingPlayerParams.machine_id,
					code 			: this.DiscoKingPlayerParams.code, 
					famille	 		: this.DiscoKingPlayerParams.family, 
					date			: this.DiscoKingPlayerParams.date, 
					heure			: this.DiscoKingPlayerParams.hour
				}
			}, function (XhrResponseObject) {
				self.getPubArrayFromXML(XhrResponseObject, function () {
					self.buildLoop();
				});
			}
		);
	};

	/////////////////////////////////////////////////////////////////////////////////////////////////////// 
	// End 
	// DiscoKingLoader
	///////////////////////////////////////////////////////////////////////////////////////////////////////	


	/////////////////////////////////////////////////////////////////////////////////////////////////////// 
	// DiscoKing
	// disco-king-0.0.1b 
	// Start 
	///////////////////////////////////////////////////////////////////////////////////////////////////////	

	var DiscoKing = function (DiscoKingPlayerParams) {

		this.DiscoKingPlayer = new DiscoKingPlayer(DiscoKingPlayerParams);

		this.DiscoKingLoader = new DiscoKingLoader(DiscoKingPlayerParams, this.DiscoKingPlayer, function (DiscoKingPlayer) {

			// logInspect(DiscoKingPlayer);

			/*return new Promise(function (resolve, reject) {
				var result = false;
				PlayList.toTarget(function (success) {
					result = success;
					resolve(result);
				});
			}).then(function (success) {
				logInspect(PlayList.listPlaylist());
				PlayList.playNext();
			});*/

			DiscoKingPlayer.playNext();

		}).loadLoop();

	}

	/////////////////////////////////////////////////////////////////////////////////////////////////////// 
	// End
	// DiscoKing
	///////////////////////////////////////////////////////////////////////////////////////////////////////




