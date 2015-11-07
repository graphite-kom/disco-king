	
	// disco-king-logger-kit-0.0.1a

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

	function Logger () {
		this.testvar = 'Aloha';
		this.error_log_array = [];		
	}
 
	// logError	+ - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - 

	Logger.prototype.logError = function (component_name, error_message) {
		var error_object = {
			date_time 		: new Date().getEffectiveDatetime(),
			component_name 	: component_name,
			ip_address		: ip_address,
			error_message 	: error_message
		};
		console.log(JSON.stringify(error_object));
		this.error_log_array.push(error_object);
	};
	
	// AjaxComponentException - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - 
	
	/*var AjaxComponentException = function (message) {
		this.name = "Ajax Component Exception";
		this.message = message;
	}*/

	function AjaxComponentException (message) {
		this.name = "Ajax Component Exception";
		this.message = message;
		return this;
	}