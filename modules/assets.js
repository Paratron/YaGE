/**
 * The YaGE assets module.
 * It is responsible for loading additional assets in the background and making them available without hassle.
 */
yage.assets = (function() {
    /**
     * Creates a new asset object.
     */
    function Asset(url, finish_callback){
        var asset =  {
            width: null,
            height: null,
            get_image_object: function(){
                return imgObj;
            }
        }

        var imgObj = document.createElement('img');
        imgObj.src = url;
        imgObj.addEventListener('load', function(){
            asset.width = imgObj.width;
            asset.height = imgObj.height;
            finish_callback();
        });

        return asset;
    }

    /**
     * This object keeps all loaded assets available.
     * The keys are the asset URLs, which makes it easy to request an asset again when it already has been created.
     */
    var asset_store = {};

    return {
        in_progress: 0,
        total: 0,

        /**
         * The GET function delivers different assets.
         * If they are not already available, they are loaded dynamically.
         * Request an image like so:
         *<code>
         * yage.assets.get({
         *     url: 'path/to/my/image.png',     //Pass a string, or an array of strings here.
         *     progress: function(percentage){} //Only available, when passing an array to 'url'
         *     finish: function(assetObject){}  //Will be called if all assets have been loaded. When multiple assets have been loaded, an array of asset objects will be returned.
         * });
         * </code>
         * @param prefs
         */
        get: function(prefs, xCallback) {
            var funcname = 'yage.asset.get';
            if(typeof prefs == 'undefined') return yage.utils.error(funcname, 'No parameters set.');
            if(typeof prefs == 'string' || prefs instanceof Array){
                prefs = {
                    url: prefs
                };
            }
            if(typeof xCallback == 'function'){
                prefs.finish = xCallback;
            }
            
            if(typeof prefs.url != 'string' && !(prefs.url instanceof Array)) return yage.utils.error(funcname, 'URL parameter must be of type string or array.');
            if(typeof prefs.url == 'string') prefs.url = [prefs.url];

            this.total = 0;

            var i,
                len = prefs.url.length,
                url,
                returning = [];

            for(i = 0;i < len;i+=1){
                url = prefs.url[i];
                if(typeof url != 'string') return yage.utils.error(funcname, 'Illegal url parameter given.');
                if(typeof asset_store[url] == 'undefined'){
                    this.in_progress++;
                    this.total++;
                    asset_store[url] = new Asset(url, function(){
                        yage.assets.in_progress -= 1;
                        if(typeof prefs.progress == 'function') prefs.progress(Math.round((this.total / 100) * (this.total - this.in_progress)));
                        if(yage.assets.in_progress <= 0){
                            yage.assets.in_progress = 0;
                            if(typeof prefs.finish == 'function'){
                                if(returning.length == 1){
                                    prefs.finish(returning[0]);
                                    return;
                                }
                                prefs.finish(returning);
                            }
                        }
                    });
                    returning.push(asset_store[url]);
                }
            }
        }
    }
}());