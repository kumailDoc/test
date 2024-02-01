/*===========================*/
/*====== EntriesList ========*/
/*===========================*/

class ParticipantList {
    constructor() {
        this.Entries = [];
    }
    
    addEntry(entry) {
        function addDeleteButton(newEntryElement) {
            let button = document.createElement("img");
            button.src = "../Assets/images/delete.png";
            button.className = "el-delete";
            button.setAttribute('onclick', "deleteEntry(this.parentNode)");
            button.setAttribute("alt", "delete entry button");
            newEntryElement.appendChild(button);
        }

        // Create newEntry
        let newEntry = document.createElement("div");
        newEntry.className = "el-row";

        // Add name to newEntry
        let newEntryName = document.createElement("div");
        newEntryName.innerText = entry.Name;
        newEntryName.className = "el-name verdana-gray";
        newEntry.appendChild(newEntryName);

        // Add delete button to newEntry
        addDeleteButton(newEntry);

        // Add newEntryElement to EntryListElement
        _E_List_Element.appendChild(newEntry);
        this.Entries.push(entry);
    }

    removeEntry(entryElement) {
        for (let i = 0; i < this.Entries.length; i++){
            if (this.Entries[i].Name == entryElement.firstElementChild.innerText){
                this.Entries.splice(i, 1);
                break;
            }
        }
        entryElement.remove();
    }
}
