yage.utils = (function(){
    if(yage.debugmode){
        return {
            error: function(funcname, message){
                if(typeof message != 'undefined'){
                    return console.error(funcname+': ', message);
                }
                return console.error(funcname);
            },
            log: function(funcname, message){
                if(typeof message != 'undefined'){
                    return console.log(funcname+': ', message);
                }
                return console.log(funcname);
            }
        }
    }

    return {
        error: function(){},
        log: function(){}
    }
}());