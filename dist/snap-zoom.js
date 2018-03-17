'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Plugin = require('./plugin');
var Ease = require('pixi-ease');
var exists = require('exists');

module.exports = function (_Plugin) {
    _inherits(SnapZoom, _Plugin);

    /**
     * @private
     * @param {Viewport} parent
     * @param {object} [options]
     * @param {number} [options.width] the desired width to snap (to maintain aspect ratio, choose only width or height)
     * @param {number} [options.height] the desired height to snap (to maintain aspect ratio, choose only width or height)
     * @param {number} [options.time=1000]
     * @param {string|function} [options.ease=easeInOutSine] ease function or name (see http://easings.net/ for supported names)
     * @param {boolean} [options.removeOnComplete=true] removes this plugin after fitting is complete
     * @param {PIXI.Point} [options.center] place this point at center during zoom instead of center of the viewport
     * @param {boolean} [options.interrupt=true] pause snapping with any user input on the viewport
     *
     * @event snap-zoom-start(Viewport) emitted each time a fit animation starts
     * @event snap-zoom-end(Viewport) emitted each time fit reaches its target
     */
    function SnapZoom(parent, options) {
        _classCallCheck(this, SnapZoom);

        var _this = _possibleConstructorReturn(this, (SnapZoom.__proto__ || Object.getPrototypeOf(SnapZoom)).call(this, parent));

        options = options || {};
        _this.width = options.width;
        _this.height = options.height;
        if (_this.width > 0) {
            _this.x_scale = parent._screenWidth / _this.width;
        }
        if (_this.height > 0) {
            _this.y_scale = parent._screenHeight / _this.height;
        }
        _this.xIndependent = exists(_this.x_scale);
        _this.yIndependent = exists(_this.y_scale);
        _this.x_scale = _this.xIndependent ? _this.x_scale : _this.y_scale;
        _this.y_scale = _this.yIndependent ? _this.y_scale : _this.x_scale;

        _this.time = exists(options.time) ? options.time : 1000;
        _this.ease = options.ease || 'easeInOutSine';
        _this.center = options.center;
        _this.stopOnResize = options.stopOnResize;
        _this.removeOnComplete = exists(options.removeOnComplete) ? options.removeOnComplete : true;
        _this.interrupt = exists(options.interrupt) ? options.interrupt : true;

        if (_this.time == 0) {
            parent.container.scale.x = _this.x_scale;
            parent.container.scale.y = _this.y_scale;
            if (_this.removeOnComplete) {
                _this.parent.removePlugin('snap-zoom');
            }
        }
        _this.x_scale = Math.round(_this.x_scale * 10) / 10;
        _this.y_scale = Math.round(_this.y_scale * 10) / 10;
        return _this;
    }

    _createClass(SnapZoom, [{
        key: 'resize',
        value: function resize() {
            this.snapping = null;

            if (this.width > 0) {
                this.x_scale = this.parent._screenWidth / this.width;
            }
            if (this.height > 0) {
                this.y_scale = this.parent._screenHeight / this.height;
            }
            this.x_scale = this.xIndependent ? this.x_scale : this.y_scale;
            this.y_scale = this.yIndependent ? this.y_scale : this.x_scale;

            this.x_scale = Math.round(this.x_scale * 10) / 10;
            this.y_scale = Math.round(this.y_scale * 10) / 10;
        }
    }, {
        key: 'reset',
        value: function reset() {
            this.snapping = null;
        }
    }, {
        key: 'down',
        value: function down() {
            this.snapping = null;
        }
    }, {
        key: 'update',
        value: function update(elapsed) {
            if (this.paused) {
                return;
            }

            if (this.interrupt && this.parent.countDownPointers() !== 0) {
                return;
            }

            var oldCenter = void 0;
            if (!this.center) {
                oldCenter = this.parent.center;
            }
            if (!this.snapping) {
                if (this.parent.scale.x !== this.x_scale || this.parent.scale.y !== this.y_scale) {
                    this.snapping = new Ease.to(this.parent.scale, { x: this.x_scale, y: this.y_scale }, this.time, { ease: this.ease });
                    this.parent.emit('snap-zoom-start', this.parent);
                }
            } else if (this.snapping) {
                if (this.snapping.update(elapsed)) {
                    if (this.removeOnComplete) {
                        this.parent.removePlugin('snap-zoom');
                    }
                    this.parent.emit('snap-zoom-end', this.parent);
                    this.snapping = null;
                }
                var clamp = this.parent.plugins['clamp-zoom'];
                if (clamp) {
                    clamp.clamp();
                }
                if (!this.center) {
                    this.parent.moveCenter(oldCenter);
                } else {
                    this.parent.moveCenter(this.center);
                }
            }
        }
    }, {
        key: 'resume',
        value: function resume() {
            this.snapping = null;
            _get(SnapZoom.prototype.__proto__ || Object.getPrototypeOf(SnapZoom.prototype), 'resume', this).call(this);
        }
    }]);

    return SnapZoom;
}(Plugin);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zbmFwLXpvb20uanMiXSwibmFtZXMiOlsiUGx1Z2luIiwicmVxdWlyZSIsIkVhc2UiLCJleGlzdHMiLCJtb2R1bGUiLCJleHBvcnRzIiwicGFyZW50Iiwib3B0aW9ucyIsIndpZHRoIiwiaGVpZ2h0IiwieF9zY2FsZSIsIl9zY3JlZW5XaWR0aCIsInlfc2NhbGUiLCJfc2NyZWVuSGVpZ2h0IiwieEluZGVwZW5kZW50IiwieUluZGVwZW5kZW50IiwidGltZSIsImVhc2UiLCJjZW50ZXIiLCJzdG9wT25SZXNpemUiLCJyZW1vdmVPbkNvbXBsZXRlIiwiaW50ZXJydXB0IiwiY29udGFpbmVyIiwic2NhbGUiLCJ4IiwieSIsInJlbW92ZVBsdWdpbiIsIk1hdGgiLCJyb3VuZCIsInNuYXBwaW5nIiwiZWxhcHNlZCIsInBhdXNlZCIsImNvdW50RG93blBvaW50ZXJzIiwib2xkQ2VudGVyIiwidG8iLCJlbWl0IiwidXBkYXRlIiwiY2xhbXAiLCJwbHVnaW5zIiwibW92ZUNlbnRlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsSUFBTUEsU0FBU0MsUUFBUSxVQUFSLENBQWY7QUFDQSxJQUFNQyxPQUFPRCxRQUFRLFdBQVIsQ0FBYjtBQUNBLElBQU1FLFNBQVNGLFFBQVEsUUFBUixDQUFmOztBQUVBRyxPQUFPQyxPQUFQO0FBQUE7O0FBRUk7Ozs7Ozs7Ozs7Ozs7OztBQWVBLHNCQUFZQyxNQUFaLEVBQW9CQyxPQUFwQixFQUNBO0FBQUE7O0FBQUEsd0hBQ1VELE1BRFY7O0FBRUlDLGtCQUFVQSxXQUFXLEVBQXJCO0FBQ0EsY0FBS0MsS0FBTCxHQUFhRCxRQUFRQyxLQUFyQjtBQUNBLGNBQUtDLE1BQUwsR0FBY0YsUUFBUUUsTUFBdEI7QUFDQSxZQUFJLE1BQUtELEtBQUwsR0FBYSxDQUFqQixFQUNBO0FBQ0ksa0JBQUtFLE9BQUwsR0FBZUosT0FBT0ssWUFBUCxHQUFzQixNQUFLSCxLQUExQztBQUNIO0FBQ0QsWUFBSSxNQUFLQyxNQUFMLEdB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RCxLQUFKLEVBQ0E7QUFDSUEsMEJBQU1BLEtBQU47QUFDSDtBQUNELG9CQUFJLENBQUMsS0FBS25CLE1BQVYsRUFDQTtBQUNJLHlCQUFLWixNQUFMLENBQVlpQyxVQUFaLENBQXVCTixTQUF2QjtBQUNILGlCQUhELE1BS0E7QUFDSSx5QkFBSzNCLE1BQUwsQ0FBWWlDLFVBQVosQ0FBdUIsS0FBS3JCLE1BQTVCO0FBQ0g7QUFDSjtBQUNKO0FBdklMO0FBQUE7QUFBQSxpQ0EwSUk7QUFDSSxpQkFBS1csUUFBTCxHQUFnQixJQUFoQjtBQUNBO0FBQ0g7QUE3SUw7O0FBQUE7QUFBQSxFQUF3QzdCLE1BQXhDIiwiZmlsZSI6InNuYXAtem9vbS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IFBsdWdpbiA9IHJlcXVpcmUoJy4vcGx1Z2luJylcclxuY29uc3QgRWFzZSA9IHJlcXVpcmUoJ3BpeGktZWFzZScpXHJcbmNvbnN0IGV4aXN0cyA9IHJlcXVpcmUoJ2V4aXN0cycpXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFNuYXBab29tIGV4dGVuZHMgUGx1Z2luXHJcbntcclxuICAgIC8qKlxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqIEBwYXJhbSB7Vmlld3BvcnR9IHBhcmVudFxyXG4gICAgICogQHBhcmFtIHtvYmplY3R9IFtvcHRpb25zXVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLndpZHRoXSB0aGUgZGVzaXJlZCB3aWR0aCB0byBzbmFwICh0byBtYWludGFpbiBhc3BlY3QgcmF0aW8sIGNob29zZSBvbmx5IHdpZHRoIG9yIGhlaWdodClcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy5oZWlnaHRdIHRoZSBkZXNpcmVkIGhlaWdodCB0byBzbmFwICh0byBtYWludGFpbiBhc3BlY3QgcmF0aW8sIGNob29zZSBvbmx5IHdpZHRoIG9yIGhlaWdodClcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy50aW1lPTEwMDBdXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ3xmdW5jdGlvbn0gW29wdGlvbnMuZWFzZT1lYXNlSW5PdXRTaW5lXSBlYXNlIGZ1bmN0aW9uIG9yIG5hbWUgKHNlZSBodHRwOi8vZWFzaW5ncy5uZXQvIGZvciBzdXBwb3J0ZWQgbmFtZXMpXHJcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLnJlbW92ZU9uQ29tcGxldGU9dHJ1ZV0gcmVtb3ZlcyB0aGlzIHBsdWdpbiBhZnRlciBmaXR0aW5nIGlzIGNvbXBsZXRlXHJcbiAgICAgKiBAcGFyYW0ge1BJWEkuUG9pbnR9IFtvcHRpb25zLmNlbnRlcl0gcGxhY2UgdGhpcyBwb2ludCBhdCBjZW50ZXIgZHVyaW5nIHpvb20gaW5zdGVhZCBvZiBjZW50ZXIgb2YgdGhlIHZpZXdwb3J0XHJcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLmludGVycnVwdD10cnVlXSBwYXVzZSBzbmFwcGluZyB3aXRoIGFueSB1c2VyIGlucHV0IG9uIHRoZSB2aWV3cG9ydFxyXG4gICAgICpcclxuICAgICAqIEBldmVudCBzbmFwLXpvb20tc3RhcnQoVmlld3BvcnQpIGVtaXR0ZWQgZWFjaCB0aW1lIGEgZml0IGFuaW1hdGlvbiBzdGFydHNcclxuICAgICAqIEBldmVudCBzbmFwLXpvb20tZW5kKFZpZXdwb3J0KSBlbWl0dGVkIGVhY2ggdGltZSBmaXQgcmVhY2hlcyBpdHMgdGFyZ2V0XHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKHBhcmVudCwgb3B0aW9ucylcclxuICAgIHtcclxuICAgICAgICBzdXBlcihwYXJlbnQpXHJcbiAgICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge31cclxuICAgICAgICB0aGlzLndpZHRoID0gb3B0aW9ucy53aWR0aFxyXG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gb3B0aW9ucy5oZWlnaHRcclxuICAgICAgICBpZiAodGhpcy53aWR0aCA+IDApXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLnhfc2NhbGUgPSBwYXJlbnQuX3NjcmVlbldpZHRoIC8gdGhpcy53aWR0aFxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5oZWlnaHQgPiAwKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy55X3NjYWxlID0gcGFyZW50Ll9zY3JlZW5IZWlnaHQgLyB0aGlzLmhlaWdodFxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnhJbmRlcGVuZGVudCA9IGV4aXN0cyh0aGlzLnhfc2NhbGUpXHJcbiAgICAgICAgdGhpcy55SW5kZXBlbmRlbnQgPSBleGlzdHModGhpcy55X3NjYWxlKVxyXG4gICAgICAgIHRoaXMueF9zY2FsZSA9IHRoaXMueEluZGVwZW5kZW50ID8gdGhpcy54X3NjYWxlIDogdGhpcy55X3NjYWxlXHJcbiAgICAgICAgdGhpcy55X3NjYWxlID0gdGhpcy55SW5kZXBlbmRlbnQgPyB0aGlzLnlfc2NhbGUgOiB0aGlzLnhfc2NhbGVcclxuXHJcbiAgICAgICAgdGhpcy50aW1lID0gZXhpc3RzKG9wdGlvbnMudGltZSkgPyBvcHRpb25zLnRpbWUgOiAxMDAwXHJcbiAgICAgICAgdGhpcy5lYXNlID0gb3B0aW9ucy5lYXNlIHx8ICdlYXNlSW5PdXRTaW5lJ1xyXG4gICAgICAgIHRoaXMuY2VudGVyID0gb3B0aW9ucy5jZW50ZXJcclxuICAgICAgICB0aGlzLnN0b3BPblJlc2l6ZSA9IG9wdGlvbnMuc3RvcE9uUmVzaXplXHJcbiAgICAgICAgdGhpcy5yZW1vdmVPbkNvbXBsZXRlID0gZXhpc3RzKG9wdGlvbnMucmVtb3ZlT25Db21wbGV0ZSkgPyBvcHRpb25zLnJlbW92ZU9uQ29tcGxldGUgOiB0cnVlXHJcbiAgICAgICAgdGhpcy5pbnRlcnJ1cHQgPSBleGlzdHMob3B0aW9ucy5pbnRlcnJ1cHQpID8gb3B0aW9ucy5pbnRlcnJ1cHQgOiB0cnVlXHJcblxyXG4gICAgICAgIGlmICh0aGlzLnRpbWUgPT0gMClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHBhcmVudC5jb250YWluZXIuc2NhbGUueCA9IHRoaXMueF9zY2FsZVxyXG4gICAgICAgICAgICBwYXJlbnQuY29udGFpbmVyLnNjYWxlLnkgPSB0aGlzLnlfc2NhbGVcclxuICAgICAgICAgICAgaWYgKHRoaXMucmVtb3ZlT25Db21wbGV0ZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wYXJlbnQucmVtb3ZlUGx1Z2luKCdzbmFwLXpvb20nKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMueF9zY2FsZSA9IE1hdGgucm91bmQodGhpcy54X3NjYWxlKjEwKS8xMFxyXG4gICAgICAgIHRoaXMueV9zY2FsZSA9IE1hdGgucm91bmQodGhpcy55X3NjYWxlKjEwKS8xMFxyXG4gICAgfVxyXG5cclxuICAgIHJlc2l6ZSgpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5zbmFwcGluZyA9IG51bGxcclxuXHJcbiAgICAgICAgaWYgKHRoaXMud2lkdGggPiAwKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy54X3NjYWxlID0gdGhpcy5wYXJlbnQuX3NjcmVlbldpZHRoIC8gdGhpcy53aWR0aFxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5oZWlnaHQgPiAwKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy55X3NjYWxlID0gdGhpcy5wYXJlbnQuX3NjcmVlbkhlaWdodCAvIHRoaXMuaGVpZ2h0XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMueF9zY2FsZSA9IHRoaXMueEluZGVwZW5kZW50ID8gdGhpcy54X3NjYWxlIDogdGhpcy55X3NjYWxlXHJcbiAgICAgICAgdGhpcy55X3NjYWxlID0gdGhpcy55SW5kZXBlbmRlbnQgPyB0aGlzLnlfc2NhbGUgOiB0aGlzLnhfc2NhbGVcclxuXHJcbiAgICAgICAgdGhpcy54X3NjYWxlID0gTWF0aC5yb3VuZCh0aGlzLnhfc2NhbGUqMTApLzEwXHJcbiAgICAgICAgdGhpcy55X3NjYWxlID0gTWF0aC5yb3VuZCh0aGlzLnlfc2NhbGUqMTApLzEwXHJcbiAgICB9XHJcblxyXG4gICAgcmVzZXQoKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuc25hcHBpbmcgPSBudWxsXHJcbiAgICB9XHJcblxyXG4gICAgZG93bigpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5zbmFwcGluZyA9IG51bGxcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUoZWxhcHNlZClcclxuICAgIHtcclxuICAgICAgICBpZiAodGhpcy5wYXVzZWQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmludGVycnVwdCAmJiB0aGlzLnBhcmVudC5jb3VudERvd25Qb2ludGVycygpICE9PSAwKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgb2xkQ2VudGVyXHJcbiAgICAgICAgaWYgKCF0aGlzLmNlbnRlcilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIG9sZENlbnRlciA9IHRoaXMucGFyZW50LmNlbnRlclxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIXRoaXMuc25hcHBpbmcpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5wYXJlbnQuc2NhbGUueCAhPT0gdGhpcy54X3NjYWxlIHx8IHRoaXMucGFyZW50LnNjYWxlLnkgIT09IHRoaXMueV9zY2FsZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zbmFwcGluZyA9IG5ldyBFYXNlLnRvKHRoaXMucGFyZW50LnNjYWxlLCB7IHg6IHRoaXMueF9zY2FsZSwgeTogdGhpcy55X3NjYWxlIH0sIHRoaXMudGltZSwgeyBlYXNlOiB0aGlzLmVhc2UgfSlcclxuICAgICAgICAgICAgICAgIHRoaXMucGFyZW50LmVtaXQoJ3NuYXAtem9vbS1zdGFydCcsIHRoaXMucGFyZW50KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHRoaXMuc25hcHBpbmcpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zbmFwcGluZy51cGRhdGUoZWxhcHNlZCkpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnJlbW92ZU9uQ29tcGxldGUpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXJlbnQucmVtb3ZlUGx1Z2luKCdzbmFwLXpvb20nKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5wYXJlbnQuZW1pdCgnc25hcC16b29tLWVuZCcsIHRoaXMucGFyZW50KVxyXG4gICAgICAgICAgICAgICAgdGhpcy5zbmFwcGluZyA9IG51bGxcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBjbGFtcCA9IHRoaXMucGFyZW50LnBsdWdpbnNbJ2NsYW1wLXpvb20nXVxyXG4gICAgICAgICAgICBpZiAoY2xhbXApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNsYW1wLmNsYW1wKClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoIXRoaXMuY2VudGVyKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBhcmVudC5tb3ZlQ2VudGVyKG9sZENlbnRlcilcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucGFyZW50Lm1vdmVDZW50ZXIodGhpcy5jZW50ZXIpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmVzdW1lKClcclxuICAgIHtcclxuICAgICAgICB0aGlzLnNuYXBwaW5nID0gbnVsbFxyXG4gICAgICAgIHN1cGVyLnJlc3VtZSgpXHJcbiAgICB9XHJcbn0iXX0=