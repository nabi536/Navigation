sap.ui.define([
    "sap/ui/core/UIComponent",
    "com/mock/integration/mockodataintegration/model/models"
], (UIComponent, models) => {
    "use strict";

    return UIComponent.extend("com.mock.integration.mockodataintegration.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        init() {
    UIComponent.prototype.init.apply(this, arguments);

    this.setModel(models.createDeviceModel(), "device");

    sap.ui.require([
        "com/mock/integration/mockodataintegration/localService/mockserver"
    ], function (mockserver) {
        mockserver.init();
    });

    this.getRouter().initialize();
}

    });
});