sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("com.nabi.project1.project1.controller.Nav1", {
         onNavBack: function() {
            history.go(-1);
    
        }
    });
});