/**
 * Created by Maximilian on 11.07.2015.
 */

bsUtilModule.service("bsUtil.touchSupport", [function() {

    this.isTouchSupported = () => {
        return (('ontouchstart' in window)
        || (navigator.MaxTouchPoints > 0)
        || (navigator.msMaxTouchPoints > 0));
    }
}]);