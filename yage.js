/**
 *  YaGE - Yet another Game Engine
 *  @author: Christian Engel <hello@wearekiss.com>
 *  @version: 1 08.01.2012
 */
yage = {
    /**
     * When debugmode is true, messages are passed to console.log and browsercache is always invalidated.
     * Set this to false when you are releasing your app!
     */
    debugmode: false,

    /**
     * YaGE stores the URL to its core folder here.
     * This is needed for module and dependency loading.
     */
    corefolder: '',

    /**
     * Call this right at the beginning of your application.
     * It will try and find out the basic settings needed for your app automatically.
     */
    init: function(prefs){
        //Okay, lets find out our core folder url.
        var script_tags = document.getElementsByTagName('script'),
            i,
            len,
            stag,
            labinit;

        if(typeof prefs == 'undefined') prefs = {};

        var options = {
            callback: prefs.callback || function(){}
        };

        len = script_tags.length;
        for(i = 0;i < len;i+=1){
            stag = script_tags[i];
            if(stag.src.search(/yage\.js$/) != -1){
                var path_parts = stag.src.split('/');
                path_parts.pop();
                this.corefolder = path_parts.join('/')+'/';
            }
        }

        //This function will be called if lab.js is available.
        labinit = function(){
            $LAB.setOptions({
                BasePath: yage.corefolder,
                CacheBust: yage.debugmode
            })
            .script('modules/utils.js')
            .script('modules/assets.js')
            .wait(options.callback);
        }

        //Make sure LAB.js is available.
        if(typeof $LAB == 'undefined'){
            var script = document.createElement('script');
            script.src = this.corefolder+'dependencies/LAB.min.js';
            script.addEventListener('load', labinit);
            document.body.appendChild(script);
        } else {
            labinit();
        }
    }
}