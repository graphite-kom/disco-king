<?php

	// $nim 		= (!empty($_GET["nim"])) 		? 	$_GET["nim"]		:	""	;
	// $caisse_num	= (!empty($_GET["caisse_num"])) ? 	$_GET["caisse_num"]	:	"0"	;	
	// $famille 	= (!empty($_GET["famille"]))	? 	$_GET["famille"]	:	""	;
	// $code 		= (!empty($_GET["code"])) 		? 	$_GET["code"]		:	""	;
	// $date 		= (!empty($_GET["date"])) 		? 	$_GET["date"]		:	""	;
	// $heure 		= (!empty($_GET["heure"])) 		? 	$_GET["heure"]		:	""	;

?>
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
			var ip_address		= '<?= $_SERVER["REMOTE_ADDR"]; ?>';
		</script>

		<link rel="stylesheet" type="text/css" href="<?= 'data:text/css;base64,' . base64_encode(file_get_contents('./css/styles.css')) ; ?>">		
		
		<script src="<?= 'data:text/javascript;base64,' . base64_encode(file_get_contents('./js/disco-king-0.0.1b.js')) ; ?>"></script>

		<template id="img">
			<div>
				<img/>
			</div>
		</template>

		<template id="video">
			<div>
				<video>
					<source type="video/mp4" preload="auto">
				</video>
			</div>
		</template>

	</head>
	<body>
		<script>

			(function () {

				// DiscoKingPlayerParams should contain :
				// --------------------------------------
				// 
				// Options for rendering :
				// - - - - - - - - - - - - 
				// target 			: document.querySelector('body'),
				// target_height 	: Number 		(integer / example : 1024 for 1024 pixels)
				// target_width 	: Number 		(integer / example : 668 for 668 pixels)
				// reSize			: Boolean		(true or false depending on whether or not player should resize proportionally to container)
				// 
				// Options for ODP querying :
				// - - - - - - - - - - - - - 
				// xml_ressource 	: "http://10.10.2.13/Disco-King/disco-king-0.0.1b/data/data.php",
				// nim 				: String		(example : '8888888')
				// machine_id 		: Number		(integer / example : 1)	
				// date 			: date			(format should be 'YYYY-MM-DD' / example : '2015-01-01')
				// hour 			: time			(format should be 'HH-MM-SS' / example : '12:00:00')
				// 
				// Options for PUSH campaign querying :
				// - - - - - - - - - - - - - - - - - - 
				// code 			: code			(example : 'XXXXXXX')
				// family 			: famille		(example : 'XXXXXXX')
				
				var DiscoKingPlayerParams = {
					target 			: 'body',
					target_height 	: 1024,
					target_width 	: 668,
					reSize			: true,
					xml_ressource 	: "http://10.10.2.13/Disco-King/disco-king-0.0.1b/data/data.php",
					nim 			: nim,
					machine_id 		: caisse_num,
					date 			: date,
					hour 			: heure,
					code 			: code,
					family 			: famille
				};
	
				var Player = new DiscoKing(DiscoKingPlayerParams);	
			
			})(nim, caisse_num, code, famille, date, heure);

		</script>
	</body>
</html>