// Copyright (c) 2024 Chase Cobb. All rights reserved.
//
// This work is licensed under the terms of the MIT license.  
// For a copy, see <https://opensource.org/licenses/MIT>.

// This work is based on a code snippet at
// https://community.adobe.com/t5/animate-discussions/export-layers-to-pngs/m-p/13081967
// It seems to credit a Shane McCarntey for the original code, but I cannot find the
// source. If someone finds it, or knows who this person is I will make sure to update
// the source link accordingly.

exportLayersToPNG()

function exportLayersToPNG(){
    var documentObject = fl.getDocumentDOM();
    var layerArray = documentObject.getTimeline().layers;
    var exportFolder = fl.browseForFolderURL("Pick a folder to export your layers into.");
    var count = 0 ;
    var iterator;

    var exportDestination = exportFolder + "/" + documentObject.name + "_PNG";
    FLfile.createFolder(exportDestination);

    // If the user selected a directory to save to...
    if (exportFolder) {
        fl.outputPanel.clear();

        var originalTypes = new Array();
        
        // MARK EACH LAYER AS GUIDE (DIRTY)
        // This way we toggle the layers on one at a time to ensure
        // we only save one to each PNG
        for (iterator = 0; iterator < layerArray.length; ++iterator){
            originalTypes[iterator] = layerArray[iterator].layerType;
            layerArray[iterator].layerType = "guide";
        }

        // FOR EACH LAYER
        for (iterator = 0; iterator < layerArray.length; iterator++) {
            // Reassign layer type to cached type
            layerArray[iterator].layerType = originalTypes[iterator];
            if (layerArray[iterator].layerType == "normal" && layerArray[iterator].visible == true) {
                
                // Add a leading "0" for padding on counts in the 
                // single digits
                if (count < 10){
                    var paddedCount = "0" + count;
                } else {
                    var paddedCount = count;
                }

                // Export layer
                documentObject.exportPNG(exportDestination + "/" + paddedCount + "_" + documentObject.name + "_" + ".png", true);

                fl.trace("Exported: " + documentObject.name + ".png");

                count += 1;
            }
            // MARK EACH LAYER AS GUIDE AGAIN, TO NOT INTERFERE WITH OTHER LAYER EXPORTS(DIRTY)
            layerArray[iterator].layerType = "guide";
        };
        
        // REASSIGN EACH LAYER TYPE (CLEAN)
        // Make sure to set each layer back to its default type
        for (iterator = 0; iterator < layerArray.length; ++iterator){
            layerArray[iterator].layerType = originalTypes[iterator];
        }
    }
}
