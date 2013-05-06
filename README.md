#dropdownable
============

Dropdownable is a tab-able and event-able jQuery dropdown UI replacement plugin with a lot of programitic hooks that make them very versitile.

###hooks
onSelect - runs whenever a option is selected.  `this` points to element selected
onCreate - runs for each option that is created. `this` points to the new element created, and gets passed a reference to the current `option` as an argument
onShowOptions - runs when the options are shown. `this` points to the options container.
onHideOptions - runs when the options are hidden. `this` points to the options container.

##Using
The most basic usage is to call dropdownable on a select box like so:

    $('#dropdownable').dropdownable( );
    
However, things get a bit more interesting with options: 

```javascript
   $('#dropdownable').dropdownable( {
        onShowOptions : function (){ $(this).style( { 'background-color' : 'red'} ) }, //runs when options are shown
        onHideOptions : function (){ }, //runs when options are hidden
        onSelect : function(){ console.log( $(this).data( 'value' ) ); }, //runs whenever an option is selected
        tabIndex : 2,
        onCreate : function( option ){ 
            var $this = $( this );

            $this.html(
                '<a href="' + $( option ).data( 'url' ) + '" target="_blank">' + $this.text() + '</a>'
            )
        }
    } );
```
