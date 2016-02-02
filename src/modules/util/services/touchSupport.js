/**
 * Created by Maximilian on 11.07.2015.
 */

bsUtilModule.service("bsUtil.touchSupport", [function() {

    /**
     * is touch supported
     * @returns {Boolean}
     */
    this.isTouchSupported = () => {
        return (('ontouchstart' in window)
        || (navigator.MaxTouchPoints > 0)
        || (navigator.msMaxTouchPoints > 0));
    }
}]);