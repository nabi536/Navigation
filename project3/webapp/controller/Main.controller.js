sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("com.nabi.project3.project3.controller.Main", {
        onNavigate1: function() {
             this.getOwnerComponent().getRouter().navTo("Nav1");
        }
    });
});