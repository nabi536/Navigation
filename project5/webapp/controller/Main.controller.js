sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], (Controller,MessageToast) => {
    "use strict";

    return Controller.extend("com.nabi.project5.project5.controller.Main", {
        Onclick: function () {
            var sName = this.byId("bye").getValue();

            if(!sName){
                MessageToast.show("please enter employee name");
                return;
            }
            MessageToast.show("thank u " + sName + " for entering your name");
        }

    });
});