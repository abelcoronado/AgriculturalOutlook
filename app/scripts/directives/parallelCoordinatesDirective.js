'use strict';

var AOAppModule = angular.module('AgriculturalOutlookApp');
  AOAppModule.directive('parallelCoordinatesChart', function () {
    return {
      restrict: 'E',
      scope : { 
      	val:'='
      },
      link: function postLink(scope, element, attrs) {
        parcoords = d3.parcoords()("#principal");
        scope.$watch('val',function(newVal,oldVal){
            if(newVal==oldVal){
              return;
            }
            if(newVal==null){
              return;
            }

            if(parcoords.dimensions().length>0){
              parcoords.clear("foreground");
              parcoords.clear("shadows");
              parcoords.clear("marks");
              parcoords.removeAxes();
              //parcoords.clear("extents");
              //parcoords.clear("highlight");  
            }
            //console.log(newVal.datum);
            parcoords = d3.parcoords()("#principal");
            parcoords.data(newVal.datum)
                            .color(newVal.color)
                            .alpha(1)
                            .mode("queue")
                            .margin({
                              top: 36,
                              left: 130,
                              right: 10,
                              bottom: 16
                            })
                            .render()
                            .shadows()
                            .brushable()
                            .reorderable();
                            
                            
        });
      }
    };
  });