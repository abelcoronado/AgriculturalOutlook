'use strict';

angular.module('AgriculturalOutlookApp')
  .controller('MainCtrl', ['$scope','$http', function ($scope,$http) {
    $scope.agriculturalOutlookData={width:200,height:200};
    //$scope.oecdJsonService = "http://stats.oecd.org/SDMX-PROTO-JSON/data/HIGH_AGLINK_2012/..BALANCE+QP+QP__BME+QP__BMD+IM+QC+ST+EX+NT+SPECIFIC+AH+CI+CR+FE+FO+BF+OU+YLD+PRICES+XP+PP+RATIO+PC/OECD?startTime=2010&endTime=2010";
    $scope.dataSet = "HIGH_AGLINK_2012";
    $scope.dimensions = [];
    $scope.commodities = [];
    $scope.Commodities=[];
    $scope.CommoditySelected={id:"WT"};
    $scope.CountriesSelected={id:"MEX"};
    $scope.Countries = [];
    $scope.countries = [];
    $scope.VariablesSelected=["QP","IM","QC","EX","ST","OU"];
    $scope.variables = [];
    $scope.Time = {startTime:2010,endTime:2021};
    $scope.YearSelected = 2010-1970;
    $scope.oecdJsonService = "http://stats.oecd.org/SDMX-PROTO-JSON/data/";
    $scope.proxy = "services/proxy.php?url=";
    $scope.dataStore = [];
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
    	console.log(data);
        if($scope.dimensions.length==0){
            $scope.dimensions = data.structure.dimensions;  
            $scope.commodities = _.findWhere($scope.dimensions,{id:"COMMODITY"}).codes;
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
        sdmx = $scope;
        var dataSelected = _.where($scope.dataStore,{COMMODITY:"SU",TIME_PERIOD: 2010});
        console.log(_.groupBy(dataSelected,function(obj){ return obj.COUNTRY; }));
        
        $scope.agriculturalOutlookData={};
        $scope.agriculturalOutlookData.margin = {top: 30, right:40, bottom:20,left:200};
        $scope.agriculturalOutlookData.width  = 560;
        $scope.agriculturalOutlookData.height = 300;
        $scope.agriculturalOutlookData.dimensions = [{name:"name",type:String},{name:"Dimension 1",type:Number},{name:"Dimension 2",type:Number},{name:"Dimension 3",type:Number}];
        $scope.agriculturalOutlookData.datum = [];
        $scope.agriculturalOutlookData.datum.push({"Dimension 1":1,"Dimension 2":1,"Dimension 3":1,"name":"p 1"});
        $scope.agriculturalOutlookData.datum.push({"Dimension 1":2,"Dimension 2":2,"Dimension 3":13,"name":"p 2"});
        $scope.agriculturalOutlookData.datum.push({"Dimension 1":3,"Dimension 2":4,"Dimension 3":19,"name":"p 3"});
        $scope.agriculturalOutlookData.datum.push({"Dimension 1":4,"Dimension 2":3,"Dimension 3":2,"name":"p 4"});
        $scope.agriculturalOutlookData.datum.push({"Dimension 1":5,"Dimension 2":3,"Dimension 3":80,"name":"p 5"});
    
    }

    $scope.getDataFromOECD();
  }]);
