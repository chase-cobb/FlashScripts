// Copyright (c) 2024 Chase Cobb. All rights reserved.
//
// This work is licensed under the terms of the MIT license.  
// For a copy, see <https://opensource.org/licenses/MIT>.

exportSelectionAsSpriteSheets();

function exportSelectionAsSpriteSheets(){
    var documentObject = fl.getDocumentDOM();

    // Get an array of the currently selected objects
    var selectedobjects = documentObject.selection;
    
    if(!documentObject.pathURI){
        fl.trace("This document must be saved before selection can be exported!!");
        return;
    }

    // set the current working directory and export path
    var workingDirectory = documentObject.pathURI.replace(documentObject.name, "");
    var exportPath = workingDirectory + "export/";
    
    fl.outputPanel.clear();
    fl.trace("Creating export directory : " + exportPath);
    FLfile.createFolder(exportPath);

    for(var i = 0; i < selectedobjects.length; ++i){
        var selectionName = selectedobjects[i].libraryItem.name;
        var selectionInstanceType = selectedobjects[i].instanceType;
    
        fl.trace("Selection[" + i + "] : " + selectionName + " : instance type : " + selectionInstanceType + "\n");
    
        // only write out symbol instance objects
        if(selectionInstanceType == "symbol"){

            // Strip out everything except the symbol name
            // in the instance that there is a path to this object in the name
            // for example : _Assets/_Characters/Player/Player_GrabFail
            var symbolNameSplit = selectionName.split("/");

            // In the case that there was a successful split, we want to use the
            // last string in the split array. If the split didn't need to happen,
            // because there were no "/" in the symbol name, it will just
            // be an array of 1, and this should still work fine
            var symbolName = symbolNameSplit[symbolNameSplit.length -1];
    
            // Export
            var exporter = new SpriteSheetExporter;//fl.spriteSheetExporter;
            exporter.beginExport();
            exporter.addSymbol(selectedobjects[i].libraryItem);
            exporter.layoutFormat = "Starling";
            exporter.algorithm = "maxRects";
            exporter.allowTrimming = false;
            exporter.canStackDuplicateFrames = true;
            exporter.exportSpriteSheet(exportPath + symbolName, {format:"png", bitDepth:32, backgroundColor:"#00000000"});
        }
    }
}
