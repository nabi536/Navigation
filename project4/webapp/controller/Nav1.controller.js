sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("com.nabi.project4.project4.controller.Nav1", {
       onNavigate1: function() {
             this.getOwnerComponent().getRouter().navTo("Nav2");
        }
    });
});