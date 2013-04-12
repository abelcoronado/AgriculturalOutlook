'use strict';

angular.module('AgriculturalOutlookApp')
  .directive('parallelCoordinatesChart', function () {
    return {
      restrict: 'E',
      scope : { 
      	val:'='
      },
      link: function postLink(scope, element, attrs) {
        var chart = parallelCoordinatesCharts();
            if(attrs.height){
              chart.height(+attrs.height);  
            };
            if(attrs.width){
              chart.width(+attrs.width);
            };
            if(attrs.margin){
              chart.margin(attrs.margin);
            }
        scope.$watch('val',function(newVal,oldVal){
            if(!newVal){
              return;
            }
            if(newVal.height){
              chart.height(+newVal.height);
            }
            if(newVal.width){
              chart.width(+newVal.width);
            }
            if(newVal.margin){
              chart.margin(newVal.margin);
            }
            if(newVal.dimensions){
              chart.dimensions(newVal.dimensions); 
            }
            d3.select("#chart")
              .datum(newVal.datum)
              .call(chart);
        });
      }
    };
  });
