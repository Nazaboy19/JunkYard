var linkFunc, move, move_action, resize_bottom, resize_bottom_action, resize_top, resize_top_action, slot_height, slots_per_hour, updateTimeLabel;
angular.module('rmWeeklySchedule', []).directive('rmWeeklySchedule', [
  function() {
    return {
      restrict: 'E',
      template: '<div class="rmws-hour-labels"></div>\
               <div class="rmws-days">\
                   <div class="rmws-day"></div>\
                   <div class="rmws-day"></div>\
                   <div class="rmws-day"></div>\
                   <div class="rmws-day"></div>\
                   <div class="rmws-day"></div>\
                   <div class="rmws-day"></div>\
                   <div class="rmws-day"></div>\
               </day>',
      link: linkFunc
    };
  }
]);
slot_height = null;
slots_per_hour = null;
move_action = {
  e: null,
  el: null,
  cursor_offset: null
};
resize_bottom_action = {
  e: null,
  el: null
};
resize_top_action = {
  e: null,
  el: null,
  start_offset_bottom: null,
  start_height: null
};
resize_top = function(e) {
  var end, offset, start;
  e.preventDefault();
  start = resize_top_action.e.pageY - resize_top_action.el.parent().offset().top;
  end = e.pageY - resize_top_action.el.parent().offset().top;
  if (end >= resize_top_action.start_offset_bottom - resize_top_action.el.parent().offset().top) {
    return;
  }
  offset = Math.floor(end / slot_height) * slot_height;
  console.log(resize_top_action.start_height, offset);
  resize_top_action.el.css({
    height: resize_top_action.start_offset_bottom - offset - 50,
    top: Math.abs(offset)
  });
  return updateTimeLabel(resize_top_action.el);
};
resize_bottom = function(e) {
  var end, height, offset, start;
  e.preventDefault();
  start = resize_bottom_action.e.pageY;
  end = e.pageY;
  if (end <= resize_bottom_action.el.offset().top) {
    return;
  }
  offset = end - resize_bottom_action.el.offset().top;
  height = Math.ceil(offset / slot_height) * slot_height - 1;
  console.log(start, end, height);
  resize_bottom_action.el.css({
    height: Math.abs(height)
  });
  return updateTimeLabel(resize_bottom_action.el);
};
move = function(e) {
  var end, offset;
  if (move_action.el && move_action.el !== $(e.toElement) && !$(e.toElement).hasClass('rmws-event')) {
    e.preventDefault();
    move_action.el.appendTo($(e.toElement).parent());
  }
  end = e.pageY - move_action.el.parent().offset().top - move_action.cursor_offset;
  offset = Math.floor(end / slot_height) * slot_height;
  move_action.el.css({
    top: offset > 0 ? offset : 0
  });
  return updateTimeLabel(move_action.el);
};
updateTimeLabel = function(el) {
  var end_hour, end_minutes, hour, hours, minutes;
  hours = el.position().top / (slot_height * slots_per_hour);
  hour = Math.floor(hours);
  minutes = Math.round(60 * (hours - hour));
  minutes = minutes > 9 ? minutes : '0' + minutes;
  hours = (el.position().top + el.outerHeight() + 1) / (slot_height * slots_per_hour);
  end_hour = Math.floor(hours);
  end_minutes = Math.round(60 * (hours - end_hour));
  end_minutes = end_minutes > 9 ? end_minutes : '0' + end_minutes;
  if (!el.find('.rmws-time').length) {
    el.prepend($('<div></div>', {
      "class": 'rmws-time'
    }));
  }
  return el.find('.rmws-time').text("" + hour + ":" + minutes + "—" + end_hour + ":" + end_minutes);
};
linkFunc = function(scope, element, attrs) {
  var $hour_labels, i, mousedown;
  slots_per_hour = 60 / attrs.interval;
  $hour_labels = $('.rmws-hour-labels');
  for (i = 0; i <= 23; i++) {
    $hour_labels.append($('<div></div>', {
      "class": 'rmws-hour-label',
      text: i + ':00'
    }));
  }
  $('.rmws-day').each(function(i) {
    var $day, $slots, dow, _ref;
    $day = $(this);
    switch (i) {
      case 0:
        dow = 'Monday';
        break;
      case 1:
        dow = 'Tuesday';
        break;
      case 2:
        dow = 'Wednesday';
        break;
      case 3:
        dow = 'Thursday';
        break;
      case 4:
        dow = 'Friday';
        break;
      case 5:
        dow = 'Saturday';
        break;
      case 6:
        dow = 'Sunday';
    }
    $day.append($('<div></div>', {
      "class": 'rmws-day-label',
      text: dow
    }));
    $slots = $('<div></div>', {
      "class": 'rmws-slots'
    });
    for (i = 1, _ref = 24 * slots_per_hour; 1 <= _ref ? i <= _ref : i >= _ref; 1 <= _ref ? i++ : i--) {
      $slots.append($('<div></div>', {
        "class": 'rmws-slot'
      }));
    }
    return $day.append($slots);
  });
  slot_height = $('.rmws-slot').outerHeight();
  $(".rmws-hour-label").height(slot_height * slots_per_hour);
  $(".rmws-slot:nth-child(" + slots_per_hour + "n)").css('border-bottom', '1px solid #d0d0d0');
  mousedown = {
    e: null,
    el: null
  };
  $('.rmws-slots').on('mousedown', function(e) {
    if ($(e.toElement).hasClass('rmws-event')) {
      return;
    }
    return mousedown.e = e;
  });
  $('.rmws-slots').on('mousemove', function(e) {
    var distance, height, offset;
    if (mousedown.el || move_action.el || resize_top_action.el || resize_bottom_action.el) {
      e.preventDefault();
    }
    if (resize_bottom_action.e) {
      resize_bottom(e);
      return;
    }
    if (resize_top_action.e) {
      resize_top(e);
      return;
    }
    if (move_action.e) {
      move(e);
      return;
    }
    if (!mousedown.e) {
      return;
    }
    e.preventDefault();
    if (!mousedown.el) {
      mousedown.el = $('<div></div>', {
        "class": 'rmws-event',
        text: '80’s'
      });
      updateTimeLabel(mousedown.el);
      mousedown.el.append($('<div></div>', {
        "class": 'rmws-close'
      }));
      mousedown.el.append($('<div></div>', {
        "class": 'rmws-handle rmws-handle-top'
      }));
      mousedown.el.append($('<div></div>', {
        "class": 'rmws-handle rmws-handle-bottom'
      }));
      mousedown.el.appendTo($(mousedown.e.target).parent());
    }
    if ($(e.toElement).hasClass('rmws-event') && e.toElement !== mousedown.el[0]) {
      return;
    }
    distance = e.pageY - mousedown.e.pageY;
    if (distance < 0) {
      offset = Math.ceil((mousedown.e.pageY - $(this).offset().top + 1) / slot_height) * slot_height + 2;
      height = Math.floor(distance / slot_height) * slot_height + 1;
    } else {
      offset = Math.floor((mousedown.e.pageY - $(this).offset().top + 1) / slot_height) * slot_height;
      height = Math.ceil(distance / slot_height) * slot_height - 1;
    }
    if (height <= 0) {
      offset += height - 3;
    }
    mousedown.el.css({
      top: offset,
      height: Math.abs(height)
    });
    return updateTimeLabel(mousedown.el);
  });
  $('body').on('mouseup', function() {
    var _ref, _ref2, _ref3;
    if (((_ref = mousedown.el) != null ? _ref.height() : void 0) === 0) {
      mousedown.el.remove();
    }
    if ((_ref2 = resize_bottom_action.el) != null) {
      _ref2.css('cursor', 'default');
    }
    if ((_ref3 = resize_top_action.el) != null) {
      _ref3.css('cursor', 'default');
    }
    mousedown.e = null;
    mousedown.el = null;
    move_action.e = null;
    move_action.el = null;
    resize_bottom_action.e = null;
    resize_bottom_action.e = null;
    resize_top_action.e = null;
    return resize_top_action.e = null;
  });
  $('.rmws-days').on('mousedown', '.rmws-event', function(e) {
    console.log('move');
    move_action.e = e;
    move_action.el = $(this);
    return move_action.cursor_offset = e.pageY - move_action.el.offset().top;
  });
  $('.rmws-days').on('mouseup', '.rmws-event', function(e) {
    move_action.e = null;
    return move_action.el = null;
  });
  $('.rmws-days').on('mousedown', '.rmws-handle-bottom', function(e) {
    e.stopPropagation();
    resize_bottom_action.e = e;
    resize_bottom_action.el = $(this).parent();
    return resize_bottom_action.el.css('cursor', 'row-resize');
  });
  $('.rmws-days').on('mousedown', '.rmws-handle-top', function(e) {
    e.stopPropagation();
    resize_top_action.e = e;
    resize_top_action.el = $(this).parent();
    resize_top_action.el.css('cursor', 'row-resize');
    resize_top_action.start_offset_bottom = $(this).parent().offset().top + $(this).parent().height();
    return resize_top_action.start_height = $(this).parent().height();
  });
  return $('.rmws-days').on('click', '.rmws-close', function(e) {
    return $(this).parent().remove();
  });
};