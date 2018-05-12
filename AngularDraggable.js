/*
 * Basic responsive mashup template
 * @owner Enter you name here (xxx)
 */
/*
 *    Fill in host and port for Qlik engine
 */
var prefix = window.location.pathname.substr( 0, window.location.pathname.toLowerCase().lastIndexOf( "/extensions" ) + 1 );
var config = {
	host: window.location.hostname,
	prefix: prefix,
	port: window.location.port,
	isSecure: window.location.protocol === "https:"
};
require.config( {
	baseUrl: ( config.isSecure ? "https://" : "http://" ) + config.host + (config.port ? ":" + config.port : "") + config.prefix + "resources"
} );


require( ["js/qlik",
'https://slimseun.com/js/vendor/angular-gridster/angular-gridster.min.js'], function ( qlik ) {
	
	
	
	var app = angular.module('mainApp', ['gridster']);

app.controller('mainCtrl', ['$scope', function ($scope) {
        
		$scope.standardItems = [
            {Id:1,size: {x: 2, y: 1}, position: [0, 0]},
            {Id:2,size: {x: 2, y: 2}, position: [0, 2]},
            {Id:3,size: {x: 1, y: 1}, position: [0, 4]},
            {Id:4,size: {x: 1, y: 1}, position: [0, 5]},
            {Id:5,size: {x: 2, y: 1}, position: [1, 0]}
            
        ];
		$scope.add=function(){
		var maxId=0;
		for (var i=0;i<$scope.standardItems.length;i++)
		{
			if ($scope.standardItems[i].Id>maxId)maxId=$scope.standardItems[i].Id;		
		
		}
		$scope.standardItems.push({Id:maxId+1,size:{x:2,y:2}})		
		}
		$scope.delete=function(item){
		$scope.standardItems.splice($scope.standardItems.indexOf(item),1);
	}
		var qlikapp=qlik.openApp('Consumer Sales.qvf', config);
	
		$scope.visualList=[];
		getVisuals();
		$scope.drawVisual=function(item)
		{
			
			qlikapp.getObject("visual"+item.Id,item.visualId).then(function(){qlik.resize();})
			qlik.resize(item.visualId);
		
		}
		function getVisuals()
		{
			
			/*qlikapp.getList( 'sheet', function ( reply ) {

				 reply.qAppObjectList.qItems.forEach( function ( value ) {

					  value.qData.cells.forEach( function ( object ) {

						   $scope.visualList.push(object);

				 });

			});
			});*/
			
			qlikapp.getList( 'masterobject', function(reply){
				var visualList=[];
				$.each(reply.qAppObjectList.qItems, function(key, value) {
					
					if (value.qData.visualization!=null)
					{
						visualList.push({'title':value.qMeta.title,'id':value.qInfo.qId});
					}
					
				});
				$scope.visualList=visualList;
			});		
		
		}
	
        $scope.gridsterOpts = {
            minRows: 2, // the minimum height of the grid, in rows
            maxRows: 100,
            columns: 6, // the width of the grid, in columns
            colWidth: 'auto', // can be an integer or 'auto'.  'auto' uses the pixel width of the element divided by 'columns'
            rowHeight: 'match', // can be an integer or 'match'.  Match uses the colWidth, giving you square widgets.
            margins: [10, 10], // the pixel distance between each widget
            defaultSizeX: 2, // the default width of a gridster item, if not specifed
            defaultSizeY: 1, // the default height of a gridster item, if not specified
            mobileBreakPoint: 600, // if the screen is not wider that this, remove the grid layout and stack the items
            resizable: {
                enabled: true,
                start: function (event, uiWidget, $element) {
                }, // optional callback fired when resize is started,
                resize: function (event, uiWidget, $element) {
                }, // optional callback fired when item is resized,
                stop: function (event, uiWidget, $element) {
                } // optional callback fired when item is finished resizing
            },
            draggable: {
                enabled: true, // whether dragging items is supported
                handle: '.ddd', // optional selector for resize handle
                start: function (event, uiWidget, $element) {
                }, // optional callback fired when drag is started,
                drag: function (event, uiWidget, $element) {
                }, // optional callback fired when item is moved,
                stop: function (event, uiWidget, $element) {
                } // optional callback fired when item is finished dragging
            }
        };
    }])
	
	
	
	
	angular.bootstrap( document, ['mainApp', "qlik-angular"] );
	
	qlik.setOnError( function ( error ) {
		$( '#popupText' ).append( error.message + "<br>" );
		$( '#popup' ).fadeIn( 1000 );
	} );
	$( "#closePopup" ).click( function () {
		$( '#popup' ).hide();
	} );


	

	//callbacks -- inserted here --
	//open apps -- inserted here --
	//get objects -- inserted here --
	//create cubes and lists -- inserted here --

} );
