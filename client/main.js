import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';


Meteor.startup(function(){
  var mouseX = window.innerWidth / 2;
  var mouseY = window.innerHeight / 2;
  var $shine = $('.shine')

  var helpers = {
    getViewportDimensions: function() {
      var w=window,d=document,e=d.documentElement,g=d.getElementsByTagName('body')[0],x=w.innerWidth||e.clientWidth||g.clientWidth,y=w.innerHeight||e.clientHeight||g.clientHeight;
      return { width : x, height : y }
    },
    isElementInViewport: function(el, offset) {
      var offset = offset || 0;
      var rect = el.getBoundingClientRect();
      return (
        (rect.top - helpers.getViewportDimensions().height) <= offset &&
        (rect.left - helpers.getViewportDimensions().width) <= offset &&
        rect.bottom >= -offset &&
        rect.right >= -offset
      );
    }
  }

  $(document).on('mousemove', function(e) {
    getMouseCoordonates(e);
    console.log(mouseX, mouseY)
  });

  var getMouseCoordonates = function(e) {
    mouseX = e.pageX;
    mouseY = e.pageY;
  };



  var rotateCard = function(cardEl) {
    //shine
    w = $(window).width(), //window width
    h = $(window).height(); //window height
    dy = mouseY - h / 2, //@h/2 = center of poster
    dx = mouseX - w / 2, //@w/2 = center of poster
    theta = Math.atan2(dy, dx), //angle between cursor and center of poster in RAD
    angle = theta * 180 / Math.PI - 90 //convert rad in degrees
    if (angle < 0) {
      angle = angle + 360;
    }
    $shine.css('background', 'linear-gradient(' + angle + 'deg, rgba(255,255,255,' + 0.20 + ') 0%,rgba(255,255,255,0) 80%)');
    // $shine.css('background', 'linear-gradient(' + angle + 'deg, rgba(255,255,255,' + mouseY / h + ') 0%,rgba(255,255,255,0) 80%)');


    var photoEl = cardEl.querySelector('.photo');
    var shadowEl = cardEl.querySelector('.photo-shadow');
    var angle = 40;
    var shadowStrength = 20;
    var bodyRect = document.body.getBoundingClientRect();
    var cardRect = cardEl.getBoundingClientRect();
    var offsetTop = cardRect.top - bodyRect.top;
    var offsetLeft = cardRect.left - bodyRect.left;
    var screenW = window.innerWidth;
    var screenH = window.innerHeight;
    var degX = screenW / angle;
    var degY = screenH / angle;
    var shadX = screenW / shadowStrength;
    var shadY = screenH / shadowStrength;
    var rx = -( (mouseY - (offsetTop + cardEl.offsetHeight / 2) ) / degY );
    var ry = ( (mouseX - (offsetLeft + cardEl.offsetHeight / 2) ) / degX );
    var sx = -( (mouseX - (offsetLeft + cardEl.offsetHeight / 2) ) / shadX );
    var sy = -( (mouseY - (offsetTop + cardEl.offsetHeight / 2) ) / shadY );
    var transform = 'rotateX(' + rx + 'deg) rotateY(' + ry + 'deg)';
    var shadow = 'translateX(' + sx + 'px) translateY(' + sy + 'px) translateZ(-1rem) scale(.9)';
    if (cardEl.classList.contains('card-05')) transform = 'rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) rotateZ(180deg)';
    cardEl.style.transform = transform;
    shadowEl.style.transform = shadow;
  };

  var rotateCards = function() {
    var cardsEls = document.querySelectorAll('.movable');
    for (var i = 0; i < cardsEls.length; i++) {
      if (helpers.isElementInViewport(cardsEls[i])) {
        rotateCard(cardsEls[i]);
      }
    }
  }

  var tick = function() {
    // getScrolledMousePosition();
    rotateCards();
    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);

})