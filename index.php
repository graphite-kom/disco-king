<html>
	<head>
		<meta charset="utf-8">
		<title>Disco King</title>

		<script>
			var nim 			= '8888888';
			var caisse_num 		= 1;
			var code			= '';
			var famille			= '';
			var date			= '';
			var heure			= '';
			var ip_address		= '<?= $_SERVER["SERVER_ADDR"]; ?>';

		</script>

		<link rel="stylesheet" type="text/css" href="<?= 'data:text/css;base64,' . base64_encode(file_get_contents('./css/styles.css')) ; ?>">
		
		<!-- <script src="https://code.createjs.com/easeljs-0.8.1.min.js"></script> -->
		<!-- <script src="https://code.createjs.com/createjs-2015.05.21.min.js"></script> -->
		<!-- <script src="https://code.createjs.com/preloadjs-0.6.1.min.js"></script> -->
		<!-- <script src="https://code.createjs.com/preloadjs-0.6.1.min.js"></script> -->
		
		
		<script src="<?= 'data:text/javascript;base64,' . base64_encode(file_get_contents('./js/disco-king-logger-0.0.1a.js')) ; ?>"></script>
		<script src="<?= 'data:text/javascript;base64,' . base64_encode(file_get_contents('./js/disco-king-tool-box-kit-0.0.1a.js')) ; ?>"></script>
		<script src="<?= 'data:text/javascript;base64,' . base64_encode(file_get_contents('./js/disco-king-0.0.1a.js')) ; ?>"></script>

	</head>
	<body>
		<div>

			<?php /* <img src="data:image/jpeg;base64,<?= base64_encode(file_get_contents('http://www.bimediatv.com/screen/core/xmlspit/API-Component-Dev/beach_sun_nature-HD.jpg')) ; ?>"/> */ ?>
			
			<img src="http://www.bimediatv.com/screen/core/xmlspit/API-Component-Dev/beach_sun_nature-HD.jpg"/>

			<div id="divTarget"></div>

			<video width="1024" height="668" controls>
				<source  type="video/mp4" src="http://www.bimediatv.com/screen/core/xmlspit/API-Component-Dev/club-med.mp4">
				<?php /* <!-- <source  type="video/mp4" src="<?= 'data:video/mp4;base64,' . base64_encode(file_get_contents('http://10.10.2.13/git-player/test-medias/club-med.mp4')) ; ?>"> --> */ ?>
				<?php /* <source  type="video/mp4" src="<?= 'data:video/mp4;base64,' . base64_encode(file_get_contents('http://git-player.bmtv/test-medias/club-med.mp4')) ; ?>"> --> */ ?>
				<?php /* <!-- <source src="<?= 'data:video/mp4;base64,' . base64_encode(file_get_contents('http://www.bimediatv.com/screen/core/xmlspit/API-Component-Dev/club-med.mp4')) ; ?>" type="video/mp4" preload="auto"> --> */ ?>
			</video>
		<div>
		<div id="loadingStatus">0%</div>
		<div id="response"></div>
		
		<script>

			/*new ToolBoxKit().makeAjax({
				async			: true,
				url 			: 'http://www.bimediatv.com/screen/core/xmlspit/disco-king/ajax-processing.php',
				method 			: 'GET',
				responseType	: 'arraybuffer',
				parameters 	: {
					type			: 'video/mp4',
					name 			: 'ANIM_RFM_MUSIC_LIVE_MONTPELv3.mp4',
					nim				: '8888888',
					caisse_num 		: 1,
					array_data		: [ { one : 'blah' }, { two : 'blah blah' }, { three : 'blah blah blah' } ],
					object_data		: {
						four 	: 'blah',
						five 	: 'blah blah',
						six 	: 'blah blah blah blah'
					},
					json_data		: '[{"one":"blah"},{"two":"blah blah"},{"three":"blah blah blah"}]'
				}
			});*/

			// var async			= true ;
			// var url				= fetchObject.url ;
			// var method			= 'GET' ;
			// var responseType		= 'arraybuffer' ;
			// var parameters.file	= fetchObject.file ;

			new ToolBoxKit().fetchFile({
				file 	: 'http://www.bimediatv.com/screen/core/xmlspit/disco-king/ajax-processing.php?file=elvis-2.jpg',
				target	: 'divTarget'
			});

		</script>
	</body>
</html>