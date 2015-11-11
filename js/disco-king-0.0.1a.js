	
	// Main.js

	// "use strict"
	
	//


	var PrimitivePubBasket = {
		pubs 				: [],
		addToPubBasket		: function (pub_object) {
			this.pubs.push(pub_object);
		},
		listPubs			: function () {
			return this.pubs;
		},
		countPubs			: function () {
			return this.pubs.length;
		}
	};


	// 

	var MediaBasket = {
		medias 				: [],
		addToMediaBasket	: function (media_object) {
			this.medias.push(media_object);
		},
		listMedias			: function () {
			return this.medias;
		},
		countMedias			: function () {
			return this.medias.length;
		}
	};

	// 

	var PlayList = {
		pubs 				: [],
		addToPubBasket		: function (pub_object) {
			this.pubs.push(pub_object);
		},
		listPubs			: function () {
			return this.pubs;
		},
		countPubs			: function () {
			return this.pubs.length;
		}
	};

	

	(function() {

		/*fetch('http://10.10.2.13/Disco-King/disco-king/data/data.php?nim=8888888')
		.then( function (response) {
			return response.text();			
		})
		.then( function (text) {
			var load_array 		= [];
			var xml_string 		= text;
			var parser			= new DOMParser();
			var loop			= parser.parseFromString(xml_string, "text/xml");
			var xml_pub_array	= loop.getElementsByTagName("pub");
			// console.log(xml_pub_array);
			for(i in xml_pub_array){						
				// console.log(xml_pub_array[i]);
				if(xml_pub_array[i].nodeName === "pub"){
					var pub_item = {
						url				: 	xml_pub_array[i].innerHTML,
						id				: 	xml_pub_array[i].getAttribute("id"),
						init			: 	xml_pub_array[i].getAttribute("init"),
						log_diffusion	: 	xml_pub_array[i].getAttribute("log_diffusion"),
						reseau			: 	xml_pub_array[i].getAttribute("reseau"),
						duration		: 	xml_pub_array[i].getAttribute("duration"),
						mime_type		: 	xml_pub_array[i].getAttribute("mime_type")
					};
					load_array.push(pub_item);
				}
			}
			return load_array
		})
		.then( function (load_array) {
			// console.log(JSON.stringify(load_array));
			// var preload = new createjs.LoadQueue();
			// preload.addEventListener("fileload", handleFileComplete);
			// for (i in load_array) {
			// 	preload.loadFile(load_array[i].url);
			// }			
		});*/

		toolBoxKit = new ToolBoxKit();

		// 

		toolBoxKit.makeAjax({
				async			: true,
				url 			: 'http://10.10.2.13/Disco-King/disco-king/data/data.php',
				method 			: 'GET',
				responseType	: '',
				parameters 	: {
					nim				: '8888888',
					caisse_num 		: 1,
					code 			: '', 
					famille 		: '', 
					date			: '', 
					heure			: ''
				}
			}, function (response_object) {

				// TODO : verifiy response_object is OK

				var xml_response 	= response_object.response;
				var parser			= new DOMParser();
				var loop			= parser.parseFromString(xml_response, "text/xml");
				var xml_pub_array	= loop.getElementsByTagName("pub");
				
				for(var i in xml_pub_array){

					if(xml_pub_array[i].nodeName === "pub"){

						var xml_pub_item = xml_pub_array[i];

						var pub_item = {
							url				: 	xml_pub_item.textContent,
							id				: 	xml_pub_item.getAttribute("id"),
							name 			: 	toolBoxKit.getMediaName(xml_pub_item.textContent),
							init			: 	xml_pub_item.getAttribute("init"),
							log_diffusion	: 	xml_pub_item.getAttribute("log_diffusion"),
							reseau			: 	xml_pub_item.getAttribute("reseau"),
							duration		: 	xml_pub_item.getAttribute("duration")
						};

						PrimitivePubBasket.addToPubBasket(pub_item);
						
					}

				}

				// 

				// console.log(PrimitivePubBasket.listPubs());

				// console.log(PrimitivePubBasket.countPubs());

				//  

				for(var x = 0 ; x < PrimitivePubBasket.countPubs() ; x++){

					var load_counter = 0;

					var pubObject = PrimitivePubBasket.listPubs()[x];

					// 

					toolBoxKit.fetchFile({ file : pubObject }, function (return_object) {

						/*if(!!return_object){

							pub_item.content_type = return_object.content_type;

							pub_item.objectURL 	= return_object.objectURL;

							// console.log(pub_item);

							// MediaBasket.checkIfLoaded(pub_item);

							// MediaBasket.addToMediaBasket(pub_item);

						}*/

						load_counter++;

						// if(load_counter == PrimitivePubBasket.countPubs()){

						// 	console.log(MediaBasket.listMedias());

						// 	console.log(MediaBasket.countMedias());

						// }

					});

				}



				/*toolBoxKit.fetchFile({ file : xml_pub_item.textContent }, function (return_object) {

					// console.log(!!return_object);

					if(!!return_object){

						var pub_item = {
							url				: 	xml_pub_item.textContent,
							id				: 	xml_pub_item.getAttribute("id"),
							name 			: 	toolBoxKit.getMediaName(xml_pub_item.textContent),
							init			: 	xml_pub_item.getAttribute("init"),
							log_diffusion	: 	xml_pub_item.getAttribute("log_diffusion"),
							reseau			: 	xml_pub_item.getAttribute("reseau"),
							duration		: 	xml_pub_item.getAttribute("duration"),
							content_type 	: 	return_object.content_type,
							objectURL 		: 	return_object.objectURL
						};

					}

					MediaBasket.addToMediaBasket(pub_item);

				});*/


			});



		// + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - 
		// checkMediaRessource

		/*var checkMediaRessource = function (url, callback) {
			// + - + - + - + - + - + - + - + - 
			var checkMediaStatus = function (status_code) {
				var status_code_prefix = status_code.toString().substring(0, 1);
				return status_code_prefix != '4' && status_code_prefix != '5'; 
			};
			// + - + - + - + - + - + - + - + - 
			var http = new XMLHttpRequest();
			http.open('HEAD', url);
			http.onreadystatechange = function() {
				if (this.readyState == this.DONE) {
					// console.log(this);
					callback(checkMediaStatus(this.status), this.getResponseHeader('content-type'));
				}
			};
			// + - + - + - + - + - + - + - + - 
			http.send();
			// + - + - + - + - + - + - + - + - 
		}

		var video = document.getElementById("vid");

		function playVideo (video) {
			video.play();
		}*/

		/*
		checkMediaRessource("http://git-player.bmtv/test-medias/club-med.mp4", function (ressource_is_available, mime_type) {
			if(ressource_is_available){
				// switch(mime_type){
				// 	case 'video/mp4':

				// 		break;
				// }
			}
		});
		*/
		

		/*
		var checkReadyState = setInterval(function(){

			if (video.readyState == 0) {

				console.log("readyState : " + video.readyState);

			}else{

				console.log("readyState : " + video.readyState);

				clearInterval(checkReadyState);

				video.addEventListener("progress", progressHandler);

			}

		},50);


		var progressHandler = function (event) {

			console.log(this.duration);

			var loadedPercentage = (this.buffered.end(0) / this.duration * 100);
			// console.log(loadedPercentage + " %");
			document.getElementById('loadingStatus').innerHTML = loadedPercentage + " %";
			// suggestion: don't use this, use what's below
			
			// console.log(parseFloat(this.duration));
			// console.log(parseFloat(video.duration));

			if(loadedPercentage == 100){

				this.removeEventListener("progress", progressHandler);

				playVideo(this);

			}

		}

		// var handleFileComplete = function (event) {
		// 	document.getElementById("response").appendChild(event.result);
		// }

		
		*/

	})(nim, caisse_num, code, famille, date, heure);

	// $nim 		= (!empty($_GET["nim"])) 		? 	$_GET["nim"]		:	""	;	
	// $famille 	= (!empty($_GET["famille"]))	? 	$_GET["famille"]	:	""	;
	// $code 		= (!empty($_GET["code"])) 		? 	$_GET["code"]		:	""	;
	// $date 		= (!empty($_GET["date"])) 		? 	$_GET["date"]		:	""	;
	// $heure 		= (!empty($_GET["heure"])) 		? 	$_GET["heure"]		:	""	;
	// $caisse_num	= (!empty($_GET["caisse_num"])) ? 	$_GET["caisse_num"]	:	"0"	;

