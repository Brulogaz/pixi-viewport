'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Plugin = require('./plugin');

module.exports = function (_Plugin) {
    _inherits(Wheel, _Plugin);

    /**
     * @private
     * @param {Viewport} parent
     * @param {object} [options]
     * @param {number} [options.percent=0.1] percent to scroll with each spin
     * @param {boolean} [options.reverse] reverse the direction of the scroll
     * @param {PIXI.Point} [options.center] place this point at center during zoom instead of current mouse position
     *
     * @event wheel({wheel: {dx, dy, dz}, event, viewport})
     */
    function Wheel(parent, options) {
        _classCallCheck(this, Wheel);

        var _this = _possibleConstructorReturn(this, (Wheel.__proto__ || Object.getPrototypeOf(Wheel)).call(this, parent));

        options = options || {};
        _this.percent = options.percent || 0.1;
        _this.center = options.center;
        _this.reverse = options.reverse;
        return _this;
    }

    _createClass(Wheel, [{
        key: 'wheel',
        value: function wheel(e) {
            if (this.paused) {
                return;
            }

            var change = void 0;
            if (this.reverse) {
                change = e.deltaY > 0 ? 1 + this.percent : 1 - this.percent;
            } else {
                change = e.deltaY > 0 ? 1 - this.percent : 1 + this.percent;
            }
            var point = { x: e.clientX, y: e.clientY };
            var oldPoint = void 0;
            if (!this.center) {
                oldPoint = this.parent.toLocal(point);
            }
            this.parent.scale.x *= change;
            this.parent.scale.y *= change;
            var clamp = this.parent.plugins['clamp-zoom'];
            if (clamp) {
                clamp.clamp();
            }

            if (this.center) {
                this.parent.moveCenter(this.center);
            } else {
                var newPoint = this.parent.toGlobal(oldPoint);
                this.parent.x += point.x - newPoint.x;
                this.parent.y += point.y - newPoint.y;
            }
            this.parent.x = Math.round(this.parent.x * 10) / 10;
            this.parent.y = Math.round(this.parent.y * 10) / 10;
            e.preventDefault();
            this.parent.emit('wheel', { wheel: { dx: e.deltaX, dy: e.deltaY, dz: e.deltaZ }, event: e, viewport: this.parent });
        }
    }]);

    return Wheel;
}(Plugin);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy93aGVlbC5qcyJdLCJuYW1lcyI6WyJQbHVnaW4iLCJyZXF1aXJlIiwibW9kdWxlIiwiZXhwb3J0cyIsInBhcmVudCIsIm9wdGlvbnMiLCJwZXJjZW50IiwiY2VudGVyIiwicmV2ZXJzZSIsImUiLCJwYXVzZWQiLCJjaGFuZ2UiLCJkZWx0YVkiLCJwb2ludCIsIngiLCJjbGllbnRYIiwieSIsImNsaWVudFkiLCJvbGRQb2ludCIsInRvTG9jYWwiLCJzY2FsZSIsImNsYW1wIiwicGx1Z2lucyIsIm1vdmVDZW50ZXIiLCJuZXdQb2ludCIsInRvR2xvYmFsIiwiTWF0aCIsInJvdW5kIiwicHJldmVudERlZmF1bHQiLCJlbWl0Iiwid2hlZWwiLCJkeCIsImRlbHRhWCIsImR5IiwiZHoiLCJkZWx0YVoiLCJldmVudCIsInZpZXdwb3J0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsSUFBTUEsU0FBU0MsUUFBUSxVQUFSLENBQWY7O0FBRUFDLE9BQU9DLE9BQVA7QUFBQTs7QUFFSTs7Ozs7Ozs7OztBQVVBLG1CQUFZQyxNQUFaLEVBQW9CQyxPQUFwQixFQUNBO0FBQUE7O0FBQUEsa0hBQ1VELE1BRFY7O0FBRUlDLGtCQUFVQSxXQUFXLEVBQXJCO0FBQ0EsY0FBS0MsT0FBTCxHQUFlRCxRQUFRQyxPQUFSLElBQW1CLEdBQWxDO0FBQ0EsY0FBS0MsTUFBTCxHQUFjRixRQUFRRSxNQUF0QjtBQUNBLGNBQUtDLE9BQUwsR0FBZUgsUUFBUUcsT0FBdkI7QUFMSjtBQU1DOztBQW5CTDtBQUFBO0FBQUEsOEJBcUJVQyxDQXJCVixFQXNCSTtBQUNJLGdCQUFJLEtBQUtDLE1BQVQsRUFDQTtBQUNJO0FBQ0g7O0FBRUQsZ0JBQUlDLGVBQUo7QUFDQSxnQkFBSSxLQUFLSCxPQUFULEVBQ0E7QUFDSUcseUJBQVNGLEVBQUVHLE1BQUYsR0FBVyxDQUFYLEdBQWUsSUFBSSxLQUFLTixPQUF4QixHQUFrQyxJQUFJLEtBQUtBLE9BQXBEO0FBQ0gsYUFIRCxNQUtBO0FBQ0lLLHlCQUFTRixFQUFFRyxNQUFGLEdBQVcsQ0FBWCxHQUFlLElBQUksS0FBS04sT0FBeEIsR0FBa0MsSUFBSSxLQUFLQSxPQUFwRDtBQUNIO0FBQ0QsZ0JBQUlPLFFBQVEsRUFBRUMsR0FBR0wsRUFBRU0sT0FBUCxFQUFnQkMsR0FBR1AsRUFBRVEsT0FBckIsRUFBWjtBQUNBLGdCQUFJQyxpQkFBSjtBQUNBLGdCQUFJLENBQUMsS0FBS1gsTUFBVixFQUNBO0FBQ0lXLDJCQUFXLEtBQUtkLE1BQUwsQ0FBWWUsT0FBWixDQUFvQk4sS0FBcEIsQ0FBWDtBQUNIO0FBQ0QsaUJBQUtULE1BQUwsQ0FBWWdCLEtBQVosQ0FBa0JOLENBQWxCLElBQXVCSCxNQUF2QjtBQUNBLGlCQUFLUCxNQUFMLENBQVlnQixLQUFaLENBQWtCSixDQUFsQixJQUF1QkwsTUFBdkI7QUFDQSxnQkFBTVUsUUFBUSxLQUFLakIsTUFBTCxDQUFZa0IsT0FBWixDQUFvQixZQUFwQixDQUFkO0FBQ0EsZ0JBQUlELEtBQUosRUFDQTtBQUNJQSxzQkFBTUEsS0FBTjtBQUNIOztBQUVELGdCQUFJLEtBQUtkLE1BQVQsRUFDQTtBQUNJLHFCQUFLSCxNQUFMLENBQVltQixVQUFaLENBQXVCLEtBQUtoQixNQUE1QjtBQUNILGFBSEQsTUFLQTtBQUNJLG9CQUFNaUIsV0FBVyxLQUFLcEIsTUFBTCxDQUFZcUIsUUFBWixDQUFxQlAsUUFBckIsQ0FBakI7QUFDQSxxQkFBS2QsTUFBTCxDQUFZVSxDQUFaLElBQWlCRCxNQUFNQyxDQUFOLEdBQVVVLFNBQVNWLENBQXBDO0FBQ0EscUJBQUtWLE1BQUwsQ0FBWVksQ0FBWixJQUFpQkgsTUFBTUcsQ0FBTixHQUFVUSxTQUFTUixDQUFwQztBQUNIO0FBQ0QsaUJBQUtaLE1BQUwsQ0FBWVUsQ0FBWixHQUFnQlksS0FBS0MsS0FBTCxDQUFXLEtBQUt2QixNQUFMLENBQVlVLENBQVosR0FBYyxFQUF6QixJQUE2QixFQUE3QztBQUNBLGlCQUFLVixNQUFMLENBQVlZLENBQVosR0FBZ0JVLEtBQUtDLEtBQUwsQ0FBVyxLQUFLdkIsTUFBTCxDQUFZWSxDQUFaLEdBQWMsRUFBekIsSUFBNkIsRUFBN0M7QUFDQVAsY0FBRW1CLGNBQUY7QUFDQSxpQkFBS3hCLE1BQUwsQ0FBWXlCLElBQVosQ0FBaUIsT0FBakIsRUFBMEIsRUFBRUMsT0FBTyxFQUFFQyxJQUFJdEIsRUFBRXVCLE1BQVIsRUFBZ0JDLElBQUl4QixFQUFFRyxNQUF0QixFQUE4QnNCLElBQUl6QixFQUFFMEIsTUFBcEMsRUFBVCxFQUF1REMsT0FBTzNCLENBQTlELEVBQWlFNEIsVUFBVSxLQUFLakMsTUFBaEYsRUFBMUI7QUFDSDtBQWpFTDs7QUFBQTtBQUFBLEVBQXFDSixNQUFyQyIsImZpbGUiOiJ3aGVlbC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IFBsdWdpbiA9IHJlcXVpcmUoJy4vcGx1Z2luJylcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgV2hlZWwgZXh0ZW5kcyBQbHVnaW5cclxue1xyXG4gICAgLyoqXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICogQHBhcmFtIHtWaWV3cG9ydH0gcGFyZW50XHJcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gW29wdGlvbnNdXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMucGVyY2VudD0wLjFdIHBlcmNlbnQgdG8gc2Nyb2xsIHdpdGggZWFjaCBzcGluXHJcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLnJldmVyc2VdIHJldmVyc2UgdGhlIGRpcmVjdGlvbiBvZiB0aGUgc2Nyb2xsXHJcbiAgICAgKiBAcGFyYW0ge1BJWEkuUG9pbnR9IFtvcHRpb25zLmNlbnRlcl0gcGxhY2UgdGhpcyBwb2ludCBhdCBjZW50ZXIgZHVyaW5nIHpvb20gaW5zdGVhZCBvZiBjdXJyZW50IG1vdXNlIHBvc2l0aW9uXHJcbiAgICAgKlxyXG4gICAgICogQGV2ZW50IHdoZWVsKHt3aGVlbDoge2R4LCBkeSwgZHp9LCBldmVudCwgdmlld3BvcnR9KVxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcihwYXJlbnQsIG9wdGlvbnMpXHJcbiAgICB7XHJcbiAgICAgICAgc3VwZXIocGFyZW50KVxyXG4gICAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9XHJcbiAgICAgICAgdGhpcy5wZXJjZW50ID0gb3B0aW9ucy5wZXJjZW50IHx8IDAuMVxyXG4gICAgICAgIHRoaXMuY2VudGVyID0gb3B0aW9ucy5jZW50ZXJcclxuICAgICAgICB0aGlzLnJldmVyc2UgPSBvcHRpb25zLnJldmVyc2VcclxuICAgIH1cclxuXHJcbiAgICB3aGVlbChlKVxyXG4gICAge1xyXG4gICAgICAgIGlmICh0aGlzLnBhdXNlZClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGNoYW5nZVxyXG4gICAgICAgIGlmICh0aGlzLnJldmVyc2UpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjaGFuZ2UgPSBlLmRlbHRhWSA+IDAgPyAxICsgdGhpcy5wZXJjZW50IDogMSAtIHRoaXMucGVyY2VudFxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjaGFuZ2UgPSBlLmRlbHRhWSA+IDAgPyAxIC0gdGhpcy5wZXJjZW50IDogMSArIHRoaXMucGVyY2VudFxyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgcG9pbnQgPSB7IHg6IGUuY2xpZW50WCwgeTogZS5jbGllbnRZIH1cclxuICAgICAgICBsZXQgb2xkUG9pbnRcclxuICAgICAgICBpZiAoIXRoaXMuY2VudGVyKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgb2xkUG9pbnQgPSB0aGlzLnBhcmVudC50b0xvY2FsKHBvaW50KVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnBhcmVudC5zY2FsZS54ICo9IGNoYW5nZVxyXG4gICAgICAgIHRoaXMucGFyZW50LnNjYWxlLnkgKj0gY2hhbmdlXHJcbiAgICAgICAgY29uc3QgY2xhbXAgPSB0aGlzLnBhcmVudC5wbHVnaW5zWydjbGFtcC16b29tJ11cclxuICAgICAgICBpZiAoY2xhbXApXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjbGFtcC5jbGFtcCgpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5jZW50ZXIpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLnBhcmVudC5tb3ZlQ2VudGVyKHRoaXMuY2VudGVyKVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb25zdCBuZXdQb2ludCA9IHRoaXMucGFyZW50LnRvR2xvYmFsKG9sZFBvaW50KVxyXG4gICAgICAgICAgICB0aGlzLnBhcmVudC54ICs9IHBvaW50LnggLSBuZXdQb2ludC54XHJcbiAgICAgICAgICAgIHRoaXMucGFyZW50LnkgKz0gcG9pbnQueSAtIG5ld1BvaW50LnlcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5wYXJlbnQueCA9IE1hdGgucm91bmQodGhpcy5wYXJlbnQueCoxMCkvMTBcclxuICAgICAgICB0aGlzLnBhcmVudC55ID0gTWF0aC5yb3VuZCh0aGlzLnBhcmVudC55KjEwKS8xMFxyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxyXG4gICAgICAgIHRoaXMucGFyZW50LmVtaXQoJ3doZWVsJywgeyB3aGVlbDogeyBkeDogZS5kZWx0YVgsIGR5OiBlLmRlbHRhWSwgZHo6IGUuZGVsdGFaIH0sIGV2ZW50OiBlLCB2aWV3cG9ydDogdGhpcy5wYXJlbnR9KVxyXG4gICAgfVxyXG59Il19