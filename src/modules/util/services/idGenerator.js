/**
 * Created by Maximilian on 09.07.2015.
 */

bsUtilModule.service('bsUtil.idGenerator', [function () {

    const CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    /**
     * create random id with a specific length
     * @param {Number=} charLength
     * @returns {string}
     */
    this.createID = (charLength = 16) => {
        var uid = '';
        for (var i = 0; i < charLength; i++) {
            uid += CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length));
        }

        return uid;
    }
}]);