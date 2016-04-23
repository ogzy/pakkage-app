(function (angular) {
    'use strict';
    
    
    // Use existing module otherwise create a new one
    var module;
    try {
        module = angular.module('coUtils');
    } catch (e) {
        module = angular.module('coUtils', []);
    }
    

    // Reference code:
    // https://github.com/nostalgiaz/bootstrap-switch
    // https://github.com/cgarvis/angular-toggle-switch

    var toggle = ['$scope', '$timeout', function ($scope, $timeout) {
            $scope.toggle = function toggle() {
                if (!$scope.disabled) {
                    if ($scope.model === $scope.trueValue) {
                        $scope.model = $scope.falseValue;
                    } else {
                        $scope.model = $scope.trueValue;
                    }
                }
                $timeout($scope.onChange);
            };
        }];

    module
    .directive('toggleSwitch', function () {
        return {
            restrict: 'EA',
            scope: {
                model: '=?',
                disabled: '=?',
                onLabel: '=?',
                offLabel: '=?',
                trueValue: '=?',
                falseValue: '=?',
                knobLabel: '=?',
                onChange: '&'
            },
            template:
                '<div ng-click="toggle()" ng-class="{ disabled: disabled }">' +
                    '<div class="switch-animate" ng-class="{coActive: model === trueValue}">' +
                        '<span class="switch-left">{{onLabel}}</span>' +
                        '<span class="knob">{{knobLabel}}</span>' +
                        '<span class="switch-right">{{offLabel}}</span>' +
                    '</div>' +
                    '<span class="switch-min">{{largeText}}</span>' +
                '</div>',
            controller: toggle,
            link: function(scope, $element) {
                scope.onLabel = scope.onLabel || "On";
                scope.offLabel = scope.offLabel || "Off";
                scope.knobLabel = scope.knobLabel || "\u00a0";
                scope.trueValue = scope.trueValue || true;
                scope.falseValue = scope.falseValue || false;

                // Add class to outer element (no replace)
                $element.addClass('co-toggle');

                var longest = [
                        scope.onLabel, scope.knobLabel, scope.offLabel
                    ].sort(function (a, b) { return b.length - a.length; })[0];

                scope.largeText = longest + longest + 'buffer';
            }
        };
    })

    .directive('iosToggle', function () {
        return {
            template: '<div ng-click="toggle()" ng-class="{coActive: model === trueValue, disabled: disabled}"></div>',
            restrict: 'EA',
            controller: toggle,
            scope: {
                model: '=?',
                disabled: '=?',
                trueValue: '=?',
                falseValue: '=?',
                onChange: '&'
            },
            link: function (scope, $element) {
                scope.trueValue = scope.trueValue || true;
                scope.falseValue = scope.falseValue || false;

                // Add class to outer element (no replace)
                $element.addClass('ios-toggle');
            }
        };
    })

    // Requires the images to be defined in CSS
    .directive('imageToggle', function () {
        return {
            template: 
                '<div ng-click="toggle()" ' +
                    'ng-class="{trueImg: model === trueValue, disabled: disabled}"' +
                '></div>',
            restrict: 'EA',
            controller: toggle,
            scope: {
                model: '=?',
                disabled: '=?',
                trueValue: '=?',
                falseValue: '=?',
                onChange: '&'
            },
            link: function (scope, $element) {
                scope.trueValue = scope.trueValue || true;
                scope.falseValue = scope.falseValue || false;

                // Add class to outer element (no replace)
                $element.addClass('image-toggle');
            }
        };
    });

}(this.angular));
