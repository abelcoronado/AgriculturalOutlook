'use strict';

describe('Directive: parallelCoordinatesDirective', function () {
  beforeEach(module('AgriculturalOutlookApp'));

  var element;

  it('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<parallel-coordinates-directive></parallel-coordinates-directive>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the parallelCoordinatesDirective directive');
  }));
});
