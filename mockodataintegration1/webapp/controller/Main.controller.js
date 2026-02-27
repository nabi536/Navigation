sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/export/Spreadsheet",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function (Controller, JSONModel, Filter, FilterOperator, Spreadsheet, MessageToast, MessageBox) {
    "use strict";

    return Controller.extend("com.mock.integration.mockodataintegration1.controller.Main", {

        onInit: function () {

            this.getView().setModel(new JSONModel({ records: [] }), "historyModel");

            this.getView().setModel(new JSONModel({
                data: [
                    { status: "Success", count: 0 },
                    { status: "Error", count: 0 }
                ]
            }), "chartModel");
        },

        onProcess: function () {

            var sValue = this.byId("searchInput").getValue().trim();
            var sType = this.byId("validationTypeSelect").getSelectedKey();

            var oResultCard = this.byId("resultCard");
            var oUserInputText = this.byId("userInputText");
            var oErrorText = this.byId("errorText");
            var oCorrectedText = this.byId("correctedText");

            oResultCard.setVisible(true);

            if (!sValue) {
                oUserInputText.setText("-");
                oErrorText.setText("Error: Input cannot be empty.");
                oCorrectedText.setText("-");
                return;
            }

            oUserInputText.setText(sValue);

            var sCorrected = sValue;
            var aErrors = [];
            var aImprovements = [];

           
            if (sType === "TEXT") {

                var sOriginal = sCorrected;

                if (/\s{2,}/.test(sCorrected)) {
                    aErrors.push("Extra spaces found");
                    sCorrected = sCorrected.replace(/\s{2,}/g, " ");
                }

                if (/[^a-zA-Z0-9 .,!?]/.test(sCorrected)) {
                    aErrors.push("Unsupported symbols found");
                    sCorrected = sCorrected.replace(/[^a-zA-Z0-9 .,!?]/g, "");
                }

                var aWords = sCorrected.toLowerCase().split(" ");
                if (aWords.length > 0) {
                    aWords[0] = aWords[0].charAt(0).toUpperCase() + aWords[0].slice(1);
                }
                sCorrected = aWords.join(" ");

                var aOriginalWords = sOriginal.split(" ");
                var aCorrectedWords = sCorrected.split(" ");

                aOriginalWords.forEach(function (word, index) {
                    if (aCorrectedWords[index] && word !== aCorrectedWords[index]) {
                        aImprovements.push('"' + word + '" → "' + aCorrectedWords[index] + '"');
                    }
                });

                if (/\bI is\b/i.test(sCorrected)) {
                    aErrors.push("Incorrect verb usage: 'I is'");
                    sCorrected = sCorrected.replace(/\bI is\b/gi, "I am");
                }

                if (/\bHe are\b/i.test(sCorrected)) {
                    aErrors.push("Incorrect verb usage: 'He are'");
                    sCorrected = sCorrected.replace(/\bHe are\b/gi, "He is");
                }

                if (/\bShe are\b/i.test(sCorrected)) {
                    aErrors.push("Incorrect verb usage: 'She are'");
                    sCorrected = sCorrected.replace(/\bShe are\b/gi, "She is");
                }

                if (!/[.!?]$/.test(sCorrected)) {
                    sCorrected += ".";
                    aImprovements.push("Sentence-ending punctuation added");
                }
            }

            
            if (sType === "JSON") {
                try {
                    JSON.parse(sValue);
                } catch (e) {
                    aErrors.push("Invalid JSON format");
                    sCorrected = "Fix JSON syntax";
                }
            }

           
            if (sType === "SQL") {
                if (!/;$/g.test(sCorrected)) {
                    aErrors.push("SQL statement missing semicolon");
                    sCorrected += ";";
                }
            }

            
            if (sType === "CODE") {

                if (/return\s+.+[^;]\s*$/m.test(sCorrected)) {
                    aErrors.push("Syntax error: Missing semicolon");
                    sCorrected = sCorrected.replace(/return\s+(.+)/g, "return $1;");
                }

                var open = (sCorrected.match(/{/g) || []).length;
                var close = (sCorrected.match(/}/g) || []).length;

                if (open !== close) {
                    aErrors.push("Syntax error: Unbalanced curly braces");
                    sCorrected += "\n}";
                }

                if (/\/\s*0/.test(sCorrected)) {
                    aErrors.push("Possible runtime risk: division by zero");
                }

                if (/if\s*\(\s*\w+\s*=\s*\d+\s*\)/.test(sCorrected)) {
                    aErrors.push("Logical warning: assignment used instead of comparison");
                }
            }

           
            //  ANY change OR improvement OR error = ERROR
            var bIsModified =
                aErrors.length > 0 ||
                aImprovements.length > 0 ||
                sValue !== sCorrected;

            /* ================= RESULT MESSAGE ================= */
            if (aErrors.length > 0) {
                oErrorText.setText(aErrors.join(" | "));
            } else if (aImprovements.length > 0) {
                oErrorText.setText(
                    "No grammar errors found. Improvements applied:\n" +
                    aImprovements.join(", ")
                );
            } else {
                oErrorText.setText("No errors detected.");
            }

            oCorrectedText.setText(sCorrected);

            this._addHistoryRecord(
                sValue,
                sType,
                oErrorText.getText(),
                sCorrected,
                bIsModified
            );

            this._updateChart();
            this.byId("searchInput").setValue("");
        },

        _addHistoryRecord: function (input, type, error, corrected, bIsModified) {

            var oModel = this.getView().getModel("historyModel");
            var aData = oModel.getProperty("/records");

            var sStatus = bIsModified ? "Error" : "Success";

            aData.push({
                input: input,
                type: type,
                status: sStatus,
                state: sStatus === "Success" ? "Success" : "Error",
                error: error,
                corrected: corrected
            });

            oModel.setProperty("/records", aData);
        },

        _updateChart: function () {

            var aRecords = this.getView().getModel("historyModel").getProperty("/records");
            var iSuccess = 0;
            var iError = 0;

            aRecords.forEach(function (r) {
                r.status === "Success" ? iSuccess++ : iError++;
            });

            this.getView().getModel("chartModel").setProperty("/data", [
                { status: "Success", count: iSuccess },
                { status: "Error", count: iError }
            ]);
        },

        onDeleteRecord: function (oEvent) {

            var oItem = oEvent.getSource().getParent();
            var oPath = oItem.getBindingContext("historyModel").getPath();
            var that = this;

            MessageBox.confirm("Delete this record?", {
                onClose: function (sAction) {
                    if (sAction === MessageBox.Action.OK) {
                        var oModel = that.getView().getModel("historyModel");
                        var aData = oModel.getProperty("/records");
                        aData.splice(parseInt(oPath.split("/")[2], 10), 1);
                        oModel.setProperty("/records", aData);
                        that._updateChart();
                    }
                }
            });
        },

        onHistorySearch: function (oEvent) {

            var sQuery = oEvent.getParameter("newValue");
            var oBinding = this.byId("historyTable").getBinding("items");

            if (!sQuery) {
                oBinding.filter([]);
                return;
            }

            oBinding.filter(new Filter({
                filters: [
                    new Filter("input", FilterOperator.Contains, sQuery),
                    new Filter("type", FilterOperator.Contains, sQuery),
                    new Filter("status", FilterOperator.Contains, sQuery)
                ],
                and: false
            }));
        },

        onResetAnalytics: function () {

            this.getView().getModel("chartModel").setProperty("/data", [
                { status: "Success", count: 0 },
                { status: "Error", count: 0 }
            ]);

            MessageToast.show("Analytics reset successfully.");
        },

        onExportExcel: function () {

            var aData = this.getView().getModel("historyModel").getProperty("/records");

            if (!aData.length) {
                MessageToast.show("No data to export.");
                return;
            }

            new Spreadsheet({
                workbook: {
                    columns: [
                        { label: "Input", property: "input" },
                        { label: "Type", property: "type" },
                        { label: "Status", property: "status" },
                        { label: "Error", property: "error" },
                        { label: "Corrected", property: "corrected" }
                    ]
                },
                dataSource: aData,
                fileName: "Validation_History.xlsx"
            }).build();
        }
    });
});
