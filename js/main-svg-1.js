	
	// Main.js

	// var progressHandler = function (e) {

	// 	var video = e.target;

	// 	if( video.duration ) {
	// 		var percent = (video.buffered.end(0)/video.duration) * 100;
	// 		console.log( percent );
	// 		if( percent >= 100 ) {
	// 			console.log("loaded!");
	// 		}
	// 		video.currentTime++;
	// 	}else{
	// 		console.log("No data");
	// 	}

	// }

	// function eventWindowLoaded() {
	// 	var videoElement = document.getElementById("thevideo");
	// 	videoElement.addEventListener('progress',updateLoadingStatus,false);
	// 	videoElement.addEventListener('canplaythrough',playVideo,false);
	// }

	// // 

	// function updateLoadingStatus() {
	// 	var loadingStatus = document.getElementById("loadingStatus");
	// 	var videoElement = document.getElementById("thevideo");
	// 	var percentLoaded = parseInt(((videoElement.buffered.end(0) / videoElement.duration) * 100));
	// 	document.getElementById("loadingStatus").innerHTML =   percentLoaded + '%';
	// }

	// //

	function urlExists(url, callback) {
		var http = new XMLHttpRequest();
		http.open('HEAD', url);
		http.onreadystatechange = function() {
			if (this.readyState == this.DONE) {
				console.log(this);
				console.log(this.getResponseHeader('content-type'));
				callback(this.status != 404, null);
			}
		};
		http.send();
	}

	function playVideo (video) {
		video.play();
	}
	
	// 

	(function() {

		var video = document.getElementById("vid");

		urlExists("http://git-player.bmtv/test-medias/club-med.mp4", function (exists, mime_type) {

			console.log("Callback !");

		});
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


		fetch('http://10.10.2.13/Disco-King/disco-king/data/data.php?nim=8888888')
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
		});
		*/

	})();