'use strict';
/*
 * Author: Wender Lima
 * Github: https://github.com/wender/angular-slide-wrapper
 * */
function SlideWrapperDirective($compile, $interval) {
  return {
    restrict: 'E',
    link: function (scope, el, attr) {
        // Top level variables definition
        var html = '';
        var uls = el[0].querySelectorAll('ul');
        var items = uls[0].querySelectorAll('li');
        var cssBullets = 'bullets';
        var auto = attr.auto || true;
        var bullet = attr.bullet || true;
        var arrows = attr.arrows || true;
        var hover = false;
        var interval = null;
        var touchPosition = {
          initialX: null,
          currentX: null,
          initialMargin: null,
          diff: null
        };

        // Scope definitions
        scope.current = 0;
        scope.total = items.length || 0;
        scope.width = el[0].clientWidth || 0;
        scope.bulletWidth = null;
        scope.showArrows = true;


        // Actions
        function setMargin(n){
          uls[0].style.marginLeft = (n?'-'+(scope.width*n):n)+'px';
        };

        scope.goTo = function (i, apply) {
          if(scope.current !== i){
            scope.current = i;
            if(apply){
              scope.$apply();
            }
          }else{
            setMargin(i);
          }
        };
        scope.prev = function (apply) {
          var apply = apply || false;
          scope.goTo(scope.current > 0 ? scope.current - 1 : (apply?scope.current:scope.total - 1), apply);
        };
        scope.next = function (apply) {
          var apply = apply || false;
          scope.goTo(scope.current < (scope.total - 1) ? scope.current + 1 : (apply?scope.current:0), apply);
        };
        scope.$watch('current',function(n){
          setMargin(n);
        });

        // Auto slide
        function startInterval(){
          interval = $interval(function(){
            if(!hover){
              scope.next();
            }
          },5000);
        };

        if(auto){

          el[0].addEventListener('mouseenter',function(){
            hover = true;
          }, false);
          el[0].addEventListener('touchstart',function(e){
            hover = true;
            angular.element(uls[0]).addClass('touch');
            touchPosition.initialX = e.changedTouches[0].pageX;
            touchPosition.initialMargin = parseInt(angular.element(uls[0]).css('margin-left').replace('px',''));
            $interval.cancel(interval);
          }, false);
          el[0].addEventListener('mouseleave',function(){
            hover = false;
          }, false);
          el[0].addEventListener('touchend',function(){
            hover = false;
            angular.element(uls[0]).removeClass('touch');
            if(touchPosition.diff !== null){
              if(touchPosition.diff > 0){
                scope.prev(true);
              }else{
                scope.next(true);
              }
              scope.showArrows = false;
            }
            startInterval();
          }, false);
          startInterval();
        }

        // Touch events
        el[0].addEventListener('touchmove',function(e){
          e.preventDefault();
          touchPosition.currentX = e.changedTouches[0].pageX;
          touchPosition.diff = parseInt(touchPosition.currentX - touchPosition.initialX);
          var newMargin = touchPosition.initialMargin + touchPosition.diff;
          uls[0].style.marginLeft = newMargin + 'px';
        }, true);


        // DOM manipulation

        angular.element(uls[0]).addClass('slide');
        uls[0].style.width = (scope.width * items.length) + 'px';
        for (var a in items) {
          if (typeof items[a] === 'object') {
            items[a].style.width = scope.width + 'px';
          }
        }

        if(arrows){
          html += '<span class="arrow left" ng-click="prev()" ng-show="showArrows && current>0"><i class="fa fa-chevron-left"></i></span><span class="arrow right" ng-click="next()" ng-show="showArrows && current<(total-1)"><i class="fa fa-chevron-right"></i></span>';
        }

        if(bullet){
          if (uls.length === 1) {
            html += '<ul class="'+cssBullets+'" ng-style="bulletWidth">';
            for (var a in items) {
              if (typeof items[a] === 'object') {
                html += '<li ng-class="{\'active\':current=='+a+'}" class="item_' + a + '" ng-click="goTo(' + a + ')"></li>';
              }
            }
          } else {
            cssBullets = 'custom';
            html += '<ul class="'+cssBullets+'" ng-style="bulletWidth">';
            var customBullets = uls[1].querySelectorAll('li');
            for (var a in items) {
              if (typeof items[a] === 'object') {
                html += '<li ng-class="{\'active\':current=='+a+'}" class="item_' + a + '" ng-click="goTo(' + a + ')">'+customBullets[a].innerHTML+'</li>';
              }
            }
          }  
        }
        
        html += '</ul>';

        // Remove custom bullet, will be replaced by the new one
        if(uls[1]){
          uls[1].remove();
        }

        // Compile html to angular's scope
        var linkFn = $compile(html);
        var content = linkFn(scope);
        el.append(content);

        // Setting bullets width based on new elements
        scope.bulletWidth = {'width':el[0].querySelectorAll('ul.'+cssBullets)[0].clientWidth+'px','margin-left':'calc(50% - '+(el[0].querySelectorAll('ul.'+cssBullets)[0].clientWidth/2)+'px)'};

    }
  };
}

angular.module('slideWrapper',[])
  .directive('slideWrapper', ['$compile', '$interval', SlideWrapperDirective]);

