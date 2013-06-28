;(function( $ ){

	$.fn.dropdownable = function( options ){
		var defaultTabIndex = 9999; //default to high number

		this.each( setupDropdownable );

		function setupDropdownable(){
			var $this = $(this),
				$newEl = $('<div class="dropdownable-container"><div class="dropdownable clearfix"><div class="current-value"></div><div class="arrow"></div></div><div class="options"></div></div>'),
				$newOpts = $('<ul>'), //this will hold our new line items for the replaced content
				$opts = $this.find('option'),
				currentOption = null,
				respondToKeydown = true;

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

			$newEl.attr( 'tabindex', options.tabindex || $this.attr( 'tabindex' ) || defaultTabIndex++ );

			$opts.each( createNewElements );

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
			})
			.on( 'keydown', function( e ){
				var keyEvents = {
					40 : handleKeyDown,
					38 : handleKeyUp,
					13 : handleEnterKey
				};

				if( respondToKeydown && e.which in keyEvents){

					keyEvents[ e.which ]();

					respondToKeydown = false;

					e.preventDefault();
					e.stopPropagation();
				}
			} )
			.on( 'keyup', function( e ){

				respondToKeydown = true;

			} )
			.on( 'blur' , function(){
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

			$tempClone.css( { left : '000px', position : 'absolute' } )
				.attr( 'id', 'temp-clone-node' )
				.find('.options').css( { display : 'block', position : 'relative' } );

			$tempClone.wrap('<div class="dropdownable-container">');

			$('body').append( $tempClone );

			$newEl.find('.dropdownable').css( { width : $tempClone.find( 'ul' ).width() - 8 } );
			console.log( $tempClone.find( 'ul' ) );
			//$tempContainer.remove();

			//replace the original dropdown with our new one
			$this.replaceWith( $newEl );

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

				console.log( currentOption );

				currentOption
					.prev()
					.removeClass( 'hover' )
					.end()
					.addClass( 'hover' );
			}

			function handleKeyUp(){

				if( !currentOption.is( $newOpts.children( ':first' ) ) ){
					currentOption = currentOption.prev();
				}

				currentOption.next()
					.removeClass( 'hover' )
					.end()
					.addClass( 'hover' );
			}

			function handleEnterKey(){
				currentOption.trigger( 'click' );
			}

			function createNewElements( i ){
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
			}
		}

		return this;
	};

}( window.jQuery ));
