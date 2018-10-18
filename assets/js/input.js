(function($){
	
	
	/**
	*  initialize_field
	*
	*  This function will initialize the $field.
	*
	*  @date	30/11/17
	*  @since	5.6.5
	*
	*  @param	n/a
	*  @return	n/a
	*/
	
	function initialize_field( $field ) {
		console.log( $field );
		
		//$field.doStuff();
		//Initialize the timer
		console.log( 'Initializing the timer');
		$('.timer').countimer({
			autoStart : false
		});
		
	}
	
	
	if( typeof acf.add_action !== 'undefined' ) {
	
		/*
		*  ready & append (ACF5)
		*
		*  These two events are called when a field element is ready for initizliation.
		*  - ready: on page load similar to $(document).ready()
		*  - append: on new DOM elements appended via repeater field or other AJAX calls
		*
		*  @param	n/a
		*  @return	n/a
		*/
		
		acf.add_action('ready_field/type=timer', initialize_field);
		acf.add_action('append_field/type=timer', initialize_field);
		
		
	} else {
		
		/*
		*  acf/setup_fields (ACF4)
		*
		*  These single event is called when a field element is ready for initizliation.
		*
		*  @param	event		an event object. This can be ignored
		*  @param	element		An element which contains the new HTML
		*  @return	n/a
		*/
		
		$(document).on('acf/setup_fields', function(e, postbox){
			
			// find all relevant fields
			$(postbox).find('.field[data-field_type="timer"]').each(function(){
				
				// initialize
				initialize_field( $(this) );
				
			});
		
		});
	
	}
	
	
	
	$( document ).on( 'click', 'a.btn-start', function(){

		///Start the timer
		console.log( 'starting the timer');
		var start = $('.timer').countimer('start').current();
		console.log( start );
		
		//Get the current date and time, then set the date to that value
		var today = new Date();
		var date = today.toJSON().slice(0,10).replace(/-/g,'-');
		var now = moment(today).format('HH:mm:ss');
		
		//Find the field
		var $acf_field = $(this).closest('.acf-field');
		
		//Find the hidden input and update it to include the start time
		$acf_field.find('input[type="hidden"]').attr( 'data-start', date+' '+now );
				
	});	
	
	// pause the timer
	$( document ).on( 'click', 'a.btn-stop', function(){
		console.log( 'stop button!');
		var elapsed = $('.timer').countimer('stop').current();
		console.log( elapsed );
		
		//Get the current date and time, then set the date to that value
		var today = new Date();
		var date = today.toJSON().slice(0,10).replace(/-/g,'-');
		var now = moment(today).format('HH:mm:ss');
		
		console.log( date );
		console.log( now );
		
		//Find the field
		var $acf_field = $(this).closest('.acf-field');
		
		//Find the hidden input and update it to include the stop time
		$acf_field.find('input[type="hidden"]').attr( 'data-stop', date+' '+now );
		
		//Find the hidden input and update it to include the elapsed time
		var elapsed_time = elapsed.displayedMode.formatted;
		console.log( elapsed_time );
		$acf_field.find('input[type="hidden"]').attr( 'data-elapsed-time', elapsed_time );
		
		//Calculate the value of the hours in a decimal format
		var seconds = elapsed.original.seconds;
		var minutes = elapsed.original.minutes;
		var hours 	= elapsed.original.hours;
		
		//Round up the seconds to the nearest minute
		if( seconds >= 45 ){
			minutes = minutes + 1;
		}
		
		//Round up the minutes to the nearest hour if there are more than 60
		if( minutes >= 60 ){
			hours = hours + 1;
			minutes = minutes - 60;
		}
		
		//Calculate the decimal fraction based on the remainder
		var decimal_minutes = (minutes/60).toFixed(2);
		
		//get the value
		var value = hours+decimal_minutes;
		
		//Update the value of the hidden input
		$acf_field.find( 'input[type="hidden"]' ).val( value )
		
	});			

})(jQuery);
