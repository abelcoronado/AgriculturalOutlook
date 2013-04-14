'use strict';

angular.module('AgriculturalOutlookApp')
  .controller('MainCtrl', ['$scope','$http', function ($scope,$http) {
    $scope.selectCommodity = function(commodity){
        $scope.CommoditySelected=commodity;
    }
    $scope.agriculturalOutlookData={width:200,height:200};
    //$scope.oecdJsonService = "http://stats.oecd.org/SDMX-PROTO-JSON/data/HIGH_AGLINK_2012/..BALANCE+QP+QP__BME+QP__BMD+IM+QC+ST+EX+NT+SPECIFIC+AH+CI+CR+FE+FO+BF+OU+YLD+PRICES+XP+PP+RATIO+PC/OECD?startTime=2010&endTime=2010";
    $scope.dataSet = "HIGH_AGLINK_2012";
    $scope.dimensions = [];
    $scope.commodities = [];
    $scope.Commodities=[];
    $scope.CommoditySelected={id:"FL"};
    $scope.CountriesSelected={id:"MEX"};
    $scope.Countries = [];
    $scope.countries = [];
    $scope.countryColors = {MEX:"#159E0B",USA:"blue",COL:"red"};
    $scope.VariablesSelected=["QP","IM","QC","EX","ST","OU"];
    $scope.variables = [];
    $scope.Time = {startTime:2010,endTime:2021};
    $scope.YearSelected = 2010-1970;
    $scope.oecdJsonService = "http://stats.oecd.org/SDMX-PROTO-JSON/data/";
    $scope.proxy = "services/proxy.php?url=";
    $scope.dataStore = [];
    $scope.dataByCommodityYear = {};
    $scope.getServiceCall = function(){
    	return $scope.oecdJsonService+$scope.dataSet+"/"+$scope.Countries.join("+")+"."+$scope.Commodities.join("+")+"."+$scope.VariablesSelected.join("+")+"/OECD?startTime="+$scope.Time.startTime+"&endTime="+$scope.Time.endTime;
    }
    $scope.setAgriculturalOutlookData = function(){
    	$scope.getDataFromOECD();
    }
    $scope.getDataFromOECD = function(){
    	//console.log($scope.getServiceCall());
    	$http.get($scope.proxy+encodeURIComponent($scope.getServiceCall())).success(function(data){
    		$scope.saveData(data);
    	});

    }
    $scope.saveData = function(data){
        //sdmx = data;//TODO ELIMINAR ESTA VARIABLE GLOBAL [DEBUG]
    	//console.log(data);
        if($scope.dimensions.length==0){
            $scope.dimensions = data.structure.dimensions;  
            $scope.commodities = _.findWhere($scope.dimensions,{id:"COMMODITY"}).codes;
            //console.log($scope.commodities);
            $scope.countries = _.findWhere($scope.dimensions,{id:"COUNTRY"}).codes;
            $scope.variables = _.findWhere($scope.dimensions,{id:"VARIABLE"}).codes;
            //Time 40 => 2010 ; 51 => 2021
        }
        _.each(data.dataSets,function(ds){
            _.each(ds.data,function(value,key){
                var o = null;
                //o = _.findWhere($scope.dataStore,{ID:key});
                //if(!o){
                    var obj = {};
                    var codes=key.split(":");
                    obj.ID=key;
                    obj[$scope.dimensions[0].id]=$scope.countries[parseInt(codes[0])].id;
                    obj[$scope.dimensions[1].id]=$scope.commodities[parseInt(codes[1])].id;
                    obj[$scope.dimensions[2].id]=$scope.variables[parseInt(codes[2])].id;
                    obj[$scope.dimensions[3].id]=parseInt(codes[3])+1970;
                    obj.VALUE = value;
                    $scope.dataStore.push(obj);
                //}
            });
        });
        $scope.generateCharts();
        //sdmx = $scope.dimensions;
    }
    
    
    $scope.generateCharts = function(){
        
        var dataSelected = _.where($scope.dataStore,{COMMODITY:$scope.CommoditySelected.id,TIME_PERIOD: 2010});
        dataSelected = _.groupBy(dataSelected,function(obj){ return obj.COUNTRY; });
        var ix = 0;
        dataSelected = _.map(dataSelected,function(obj){
            ix++;
            var o = {COUNTRY:obj[0].COUNTRY,};
            o.id = ix;
            _.each($scope.VariablesSelected,function(variableName){
                o[variableName]=0.0;
            });
            _.each(obj,function(v){
                o[v.VARIABLE]=v.VALUE;
            });
            return o
        });
        
        var dimensionsSelected = _.map(dataSelected[0],function(value,key){
            var o = {};
            o.name = key;
            if(key=="COUNTRY"){
                o.type = String;
            }else{
                o.type = Number;
            }
            return o});
        //console.log($scope.countryColors);
        var AO={};
        var colorByCountry = function(country){
            var color = $scope.countryColors[country];
            if(color){
                return color;
            }else{
                return "yellow";
            }
        };
        AO.color = function(d){ return colorByCountry(d.COUNTRY);};
        AO.margin = {top: 30, right:40, bottom:20,left:200};
        AO.width  = 800;
        AO.height = 600;
        AO.dimensions = dimensionsSelected; 
        AO.datum = dataSelected;
        $scope.agriculturalOutlookData = AO;
        var column_keys = d3.keys(dataSelected[0]);
        var columns = column_keys.map(function(key,i) {
            return {
              id: key,
              name: key,
              field: key,
              sortable: true
            }
          });
        var CY = {};
        CY.columns = columns;
        console.log("COLUMNAS");
        console.log(CY);
        $scope.dataByCommodityYear = CY; 

        var options = {
           enableCellNavigation: true,
           enableColumnReorder: false,
           multiColumnSort: false
        };
        
        var dataView = new Slick.Data.DataView();
        var grid = new Slick.Grid("#grid", dataView, columns, options);
        //var pager = new Slick.Controls.Pager(dataView, grid, $("#pager"));
          dataView.onRowCountChanged.subscribe(function (e, args) {
            grid.updateRowCount();
            grid.render();
          });
          dataView.onRowsChanged.subscribe(function (e, args) {
            grid.invalidateRows(args.rows);
            grid.render();
          });

          sortcol = column_keys[0];
          var sortdir = 1;

                    
          // click header to sort grid column
          grid.onSort.subscribe(function (e, args) {
            sortdir = args.sortAsc ? 1 : -1;
            sortcol = args.sortCol.field;
            if ($.browser.msie && $.browser.version <= 8) {
              dataView.fastSort(sortcol, args.sortAsc);
            } else {
              dataView.sort(comparer, args.sortAsc);
            }
          });

          // highlight row in chart
          grid.onMouseEnter.subscribe(function(e,args) {
            var i = grid.getCellFromEvent(e).row;
            var d = parcoords.brushed() || dataSelected;
            parcoords.highlight([d[i]]);
          });
          grid.onMouseLeave.subscribe(function(e,args) {
            parcoords.unhighlight();
          });


          gridUpdate(dataSelected,dataView);
          

    }

    $scope.getDataFromOECD();
  }]);
var sortcol = null;
function gridUpdate (data,dataView) {
                console.log("ola k ase");
                console.log(dataView);
                console.log(data);
                dataView.beginUpdate();
                dataView.setItems(data);
                dataView.endUpdate();
            };

function comparer(a, b) {
            var x = a[sortcol], y = b[sortcol];
            return (x == y ? 0 : (x > y ? 1 : -1));
          };
