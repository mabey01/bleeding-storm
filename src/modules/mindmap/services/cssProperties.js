/**
 * Created by Maximilian on 09.07.2015.
 */

bsMindmapModule.service("bsMap.cssProperties", [function() {

    const properties = {
        'transform' : ['webkitTransform', 'MozTransform', 'msTransform']
    };

    this.getVendorProperty = (element, property)=> {
        if (property in properties) {
            let vendorProperties = properties[property];
            return vendorProperties.reduce((previousProp, currentProp) => {
                if (currentProp in element.style) return currentProp;
                else return previousProp
            }, property);
        }

        return null;
    }
}]);