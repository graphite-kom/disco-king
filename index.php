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
		
		
		<script src="<?= 'data:text/javascript;base64,' . base64_encode(file_get_contents('./js/disco-king-logger-0.0.1a.js')) ; ?>"></script>
		<script src="<?= 'data:text/javascript;base64,' . base64_encode(file_get_contents('./js/disco-king-tool-box-kit-0.0.1a.js')) ; ?>"></script>
		<script src="<?= 'data:text/javascript;base64,' . base64_encode(file_get_contents('./js/disco-king-0.0.1a.js')) ; ?>"></script>

	</head>
	<body>
		<template id="img">
			<img class="media_element" />
		</template>
		<template id="img">
			<video class="media_element">
				<source type="video/mp4" preload="auto">
			</video>
		</template>
	</body>
</html>