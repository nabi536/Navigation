sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/Text",
    "sap/m/VBox"
], function (Controller, Text, VBox) {
    "use strict";

    return Controller.extend("com.mock.integration.mockodataintegration.controller.Main", {

        onInit: function () {
            console.log("Mock OData Integration App Loaded");
        },

        onSend: function () {

            var oInput = this.byId("searchInput");
            var sValue = oInput.getValue().trim();
            var oMessageContainer = this.byId("messageContainer");

            oMessageContainer.removeAllItems();

            if (!sValue) {
                oMessageContainer.addItem(
                    new Text({ text: "Error: Input cannot be empty." })
                        .addStyleClass("errorText")
                );
                return;
            }

            /* ---------- USER INPUT ---------- */
            oMessageContainer.addItem(
                new VBox({
                    items: [
                        new Text({ text: "User Input" }).addStyleClass("sectionTitle"),
                        new Text({ text: sValue }).addStyleClass("sectionContent")
                    ]
                })
            );

            var sCorrected = sValue;
            var aErrors = [];

            /* ---------- BASIC GRAMMAR RULES ---------- */

            // Capitalize "i"
            if (/\bi\b/.test(sCorrected)) {
                aErrors.push("Pronoun 'I' must be capitalized");
                sCorrected = sCorrected.replace(/\bi\b/g, "I");
            }

            // I is → I am
            if (/\bI is\b/i.test(sCorrected)) {
                aErrors.push("Incorrect verb usage: 'I is'");
                sCorrected = sCorrected.replace(/\bI is\b/gi, "I am");
            }

            // He are → He is
            if (/\bHe are\b/i.test(sCorrected)) {
                aErrors.push("Incorrect verb usage: 'He are'");
                sCorrected = sCorrected.replace(/\bHe are\b/gi, "He is");
            }

            // She are → She is
            if (/\bShe are\b/i.test(sCorrected)) {
                aErrors.push("Incorrect verb usage: 'She are'");
                sCorrected = sCorrected.replace(/\bShe are\b/gi, "She is");
            }

            /* ---------- EXISTING RULES ---------- */

            // Extra spaces
            if (/\s{2,}/.test(sCorrected)) {
                aErrors.push("Extra spaces found");
                sCorrected = sCorrected.replace(/\s{2,}/g, " ");
            }

            // Unsupported symbols
            if (/[^a-zA-Z0-9 .,!?]/.test(sCorrected)) {
                aErrors.push("Unsupported symbols found");
                sCorrected = sCorrected.replace(/[^a-zA-Z0-9 .,!?]/g, "");
            }

            // Capitalize first letter
            sCorrected = sCorrected.charAt(0).toUpperCase() + sCorrected.slice(1);

            /* ---------- ERROR SECTION ---------- */
            oMessageContainer.addItem(
                new Text({ text: "Error Detected" })
                    .addStyleClass("sectionTitle spacingTop")
            );

            if (aErrors.length > 0) {
                oMessageContainer.addItem(
                    new Text({
                        text: aErrors.join(", ")
                    }).addStyleClass("errorText")
                );
            } else {
                oMessageContainer.addItem(
                    new Text({
                        text: "No text errors detected."
                    }).addStyleClass("successText")
                );
            }

            /* ---------- CORRECTED OUTPUT ---------- */
            oMessageContainer.addItem(
                new Text({ text: "Corrected Output" })
                    .addStyleClass("sectionTitle spacingTop")
            );

            oMessageContainer.addItem(
                new Text({ text: sCorrected })
                    .addStyleClass("successText")
            );

            oInput.setValue("");
        }
    });
});
