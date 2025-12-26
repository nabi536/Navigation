sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("com.nabi.project1.project1.controller.Main", {
        onNavigate: function() {
            this.getOwnerComponent().getRouter().navTo("Nav1");
        }
    });
});