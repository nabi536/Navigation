sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("com.nabi.project4.project4.controller.Nav2", {
      onNavigate2: function() {
             history.go(-2);
        }
    });
});