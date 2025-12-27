sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("com.nabi.project2.project2.controller.Main", {
        onInit: function() {
            var oData = {
                name: "Nabi",
                Subscribed: true,
                country: "IN",
                gender: 0

            };

            var oModel = new sap.ui.model.json.JSONModel(oData);
            this.getView().setModel(oModel);
        }
    });
});