;(function( $ ){
    
	$.fn.dropdownable = function( options ){
		var $newEl = $('<div class="dropdownable-container"><div class="dropdownable"><div class="current-value"></div><div class="arrow"></div></div><div class="options"></div></div>'),
			$newOpts = $('<ul>'),
			$opts = this.find('option'),
			currentOption = null;

		var defaults = {
			showFirst : true,
			onSelect : $.noop,
			slideDownSpeed : 300,
			onShowOptions : $.noop,
			onHideOptions : $.noop,
			onCreate : $.noop
		};

		options = $.extend( defaults, options );

		if( options.showFirst ){

			$newEl.find( '.current-value' )
				.text( $opts.filter( ':first' ).text() );
		}

		var tabIndex = options.tabindex || this.attr( 'tabindex' );

		if( typeof tabIndex !== 'undefined' ){
			$newEl.attr( 'tabindex', tabIndex );
		}

		$opts.each( function( i ){

			var $newItem;

			if( options.showFirst && i === 0 ){
				return;
			}

			$newItem = $( '<li data-value="' + this.value + '">' + this.text + '</li>' );

			$newItem.on( 'click', function(){

				$newEl.find( '.current-value' ).text( $newItem.text() );

				options.onSelect.call( $newItem );

				hideOptions();
			});

			options.onCreate.call( $newItem.get( 0 ), this );

			$newOpts.append( $newItem );
		});

		/*********
		* events
		*********/
		$newEl.find( '.dropdownable' ).on( 'click', function( e ){

			if( !$newEl.find( '.options' ).is( ':visible' ) ){
				showOptions();
			}
			else{
				hideOptions();
			}
		} );

		$( document ).on( 'click' , function( e ){

			if( !$newEl.find( $( e.target ) ).length && $newEl.find( '.options' ).is( ':visible' ) ){

				hideOptions();
			}
		});

		$newEl.on( 'focus' , function(){

			$(this).find( '.dropdownable' )
				.addClass( 'focus' )
				.end()
				.find( '.options' )
				.find( 'ul' )
				.addClass( 'options-focus' );
		});

		$newEl.on( 'keydown', function( e ){

			var opt;

			//keydown
			if( e.which && e.which === 40 ){
				handleKeyDown();
			}
			//keyup
			else if( e.which && e.which === 38 ){
				handleKeyUp();
			}
			//enter
			else if( e.which && e.which === 13 ){

				currentOption.trigger( 'click' );
			}

		} );

		$newEl.on( 'blur' , function(){
			var $this = $( this );

			$this.find( '.dropdownable' )
				.removeClass( 'focus' )
				.end()
				.find( '.options' )
				.find( 'ul' )
				.removeClass( 'options-focus' );

			if( $this.find( '.options' ).is( ':visible' ) ){

				hideOptions();
			}

			//clean up
			$this.find('.options').find('li').removeClass( 'hover' );
			currentOptionIndex = 0;

			$( window ).off( 'keypress' );
		});

		if( 'ontouchstart' in window ){

			$newEl.find('.dropdownable').on( 'ontouchstart', function(){
				console.log ( 'touch' );
			} );
		}

		/***************************
		* add elements to the DOM
		***************************/

		$newEl.find( '.options' ).append( $newOpts );

		/*********
		* resize
		*********/
		//create a clone to add to the DOM offscreen to get sizing
		$tempClone = $newEl.clone();

		$tempClone.css( { left : '-5000px', position : 'absolute' } )
			.attr( 'id', 'temp-clone-node' )
			.find('.options').css( { display : 'inline-block' } );

		$('body').append( $tempClone );

		$newEl.find('.dropdownable').css( { width : $tempClone.find( 'ul' ).width() - 8 } );

		$('#temp-clone-node').remove();

		//replace the original dropdown with our new, fabricated one
		this.replaceWith( $newEl );

		function showOptions(){

			$newEl.find( '.options' )
				.slideDown( options.slideDownSpeed, options.onShowOptions )
				.end()
				.find( '.dropdownable')
				.addClass( 'dropdownable-open' );
		}

		function hideOptions(){
			$newEl.find( '.options' ).slideUp( options.slideDownSpeed, function(){

				$( this ).parent()
					.find( '.dropdownable' )
					.removeClass( 'dropdownable-open' );

				options.onHideOptions.call( this );
			} );
		}

		function handleKeyDown(){
			//first key down press
			if( !currentOption ){
				currentOption = $newOpts.children( ':first' );
			}
			else{
				if( !currentOption.is( $newOpts.children( ':last' ) ) ){
					currentOption = currentOption.next();
				}
			}

			if( ! $( '.dropdownable' ).find( '.options' ).is( ':visible' ) ){
				showOptions();
			}

			currentOption.prev().removeClass( 'hover' );

			currentOption.addClass( 'hover' );
		}

		function handleKeyUp(){

			if( !currentOption.is( $newOpts.children( ':first' ) ) ){
				currentOption = currentOption.prev();
			}

			currentOption.next().removeClass( 'hover' );

			currentOption.addClass( 'hover' );
		}

		return this;
	};

}( window.jQuery ));
