/*===========================*/
/*======== Bracket ==========*/
/*===========================*/
//  <div id="bracket">
//      <div id="be-row-ROW" class="be-row">
//          <div></div>
//          <div id="be-NAME" class="be">
//              <div class="be-btn">
//                  <img src="./img/revert.png">
//              </div>
//              <div class="be-name">NAME</div>
//              <div class="be-btn">
//                  <img src="./img/advance.png">
//              </div>
//          </div>
//      </div>
//  </div>


class Bracket {
    constructor(entries) {
        this.RawEntries = createArray(entries);
        
        // calculate bracket dimensions
        let nearestP2 = 2**(Math.ceil(Math.log2(entries.length)))
        this.Height = 2*nearestP2 - 1;
        this.Depth = Math.log2(nearestP2) + 1;

        // make a filled list of Entries with BYEs
        let participants = createArray(entries);

        for (let i = participants.length; i < nearestP2; i++) {
            participants.push(new Entry(BY));
        }
        // swap entries to set bys by default
        for (let i = 1; i < nearestP2/2; i+=2) {
            let swap = participants[i];
            participants[i] = participants[nearestP2-i];
            participants[nearestP2-i] = swap;
        }
        // add in TBDs to Entries
        for (let i = 1; i < participants.length; i++) {
            if (i % 2 == 1) {
                participants.splice(i, 0, new Entry(TBD));
            }
        }
        this.Participants = participants;

        // fill initial bracket
        this.makeBracket();
    }

    makeBracket() {
        // make be-rows and insert Entries
        for (let i = 0; i < this.Height; i++) {
            let entry = this.Participants[i];
            
            // bracket row
            let bracketRow = document.createElement("div");
            bracketRow.id = ID_BE_ROW + i;
            bracketRow.className = CLASS_BE_ROW;
            bracketRow.style.width = 100 + "%";

            // bracket entry
            let bracketEntry = document.createElement("div");
            bracketEntry.id = ID_BE + entry.Name;
            bracketEntry.className = CLASS_BE;
            bracketEntry.style.width = 100 / this.Depth + "%";

            //      revert arrow
            let revert = document.createElement("div");
            revert.className = CLASS_BE_BTN;
            revert.style.visibility = "hidden";
            revert.setAttribute('onclick', "revertRowEntry(this.parentNode.parentNode)");

            let revertImg = document.createElement("img");
            revertImg.src = IMG_REVERT;
            revert.appendChild(revertImg);

            //      entry name
            let entryName = document.createElement("div");
            entryName.className = CLASS_BE_NAME + " " + CLASS_VERDANA_GRAY;
            entryName.innerText = entry.Name; 
            bracketEntry.appendChild(entryName);
            
            //      advance arrow
            let advance = document.createElement("div");
            advance.className = CLASS_BE_BTN;
            advance.style.visibility = "hidden";
            advance.setAttribute('onclick', "advanceRowEntry(this.parentNode.parentNode)");

            let advanceImg = document.createElement("img");
            advanceImg.src = IMG_ADVANCE;
            advance.appendChild(advanceImg);

            // APPEND ELEMENTS
            bracketEntry.appendChild(revert);
            bracketEntry.appendChild(entryName);
            bracketEntry.appendChild(advance);
            bracketRow.appendChild(bracketEntry);
            _B_Element.appendChild(bracketRow);
            _B_Row_Elements.push(bracketRow);
        }

        //offset entries to make the bracket shape using oddly indexed powers of 2. 
        //This is hard to understand and harder to explain but the math works so yay!

        for(let i = 2; i < this.Participants.length; i *= 2) {
            for (let ei = i; ei < this.Participants.length; ei+=i) {
                let spacerE = document.createElement("div");
                spacerE.style.width = 100 / this.Depth + "%";                
                
                _B_Row_Elements[ei-1].prepend(spacerE);
            }
        }

        // advance any entries that have BYs first round. also adds advance arrows to entries
        // Check all even indexes if they are BYs
        for (let i = 0; i < this.Participants.length; i+=4) {
            if (this.Participants[i].Name == BY) {
                // advance this.entries[i+2].Name
                let winnerName = this.Participants[i+2].Name;
                
                let winnerE = _B_Row_Elements[i+1].lastChild;
                winnerE.id = ID_BE + winnerName;
                winnerE.lastChild.style.visibility = "visible";

                let winnerNameE = winnerE.childNodes[1];
                winnerNameE.innerText = winnerName;
            }
            else if (this.Participants[i+2].Name == BY) {
                // advance this.entries[i].Name
                let winnerName = this.Participants[i].Name;
                
                let winnerE = _B_Row_Elements[i+1].lastChild;
                winnerE.id = ID_BE + winnerName;
                winnerE.lastChild.style.visibility = "visible";

                let winnerNameE = winnerE.childNodes[1];
                winnerNameE.innerText = winnerName;
            }
            else {
                _B_Row_Elements[i].lastChild.lastChild.style.visibility = "visible";
                _B_Row_Elements[i+2].lastChild.lastChild.style.visibility = "visible";
            }
        }
    }

    hideArrowsFrom(entryElement) {
        let vis = "hidden";
        entryElement.firstChild.style.visibility = vis;
        entryElement.lastChild.style.visibility = vis;
    }

    showArrowsFor(entryElement) {
        // Don't show arrows for TBDs
        if (entryElement.childNodes[1].innerText != TBD) {
            let vis = "visible";
            let currentSpace = entryElement.parentNode.childNodes.length - 1;

            // first round entries dont need revert arrow
            if (0 < currentSpace) {
                entryElement.firstChild.style.visibility = vis;
            }
            // winner doesn't need advance arrow 
            if (currentSpace < this.Depth - 1) {
                entryElement.lastChild.style.visibility = vis;
            }
            // check if this entry had first round bye
            if (currentSpace == 1) {
                let thisRowIndex = parseInt(entryElement.parentNode.id.split(ID_BE_ROW)[1]);
                let prevMatchupTopRow = document.getElementById(ID_BE_ROW + (thisRowIndex-1));
                let prevMatchupBotRow = document.getElementById(ID_BE_ROW + (thisRowIndex+1));
                if (prevMatchupTopRow.lastChild.childNodes[1].innerText == BY || prevMatchupBotRow.lastChild.childNodes[1].innerText == BY) {
                    entryElement.firstChild.style.visibility = "hidden";
                }
            }
        }
    }

    advanceRowEntry(currentBracketRow) {
        let bracketIndexSplit = currentBracketRow.id.split("-");
        let thisIndex = parseInt(bracketIndexSplit[bracketIndexSplit.length-1]);

        let thisSpacing = currentBracketRow.childElementCount - 1;
        let matchupSize = 2**(thisSpacing);

        let topIndex = thisIndex - matchupSize;
        let topRow = document.getElementById(ID_BE_ROW + topIndex);

        let botIndex = thisIndex + matchupSize;
        let botRow = document.getElementById(ID_BE_ROW + botIndex);

        let matchupWinnerRow = null;
        let matchupLoserRow = null;

        // Matchup out of bracket bounds (below)  OR  winner is the top row
        if (_B_Row_Elements.length - 1 < botIndex || (topRow != null && topRow.childElementCount - 1 == thisSpacing + 1)) {
            matchupWinnerRow = topRow;
            matchupLoserRow = document.getElementById(ID_BE_ROW + (topIndex - matchupSize));
        }
        // Matchup out of bracket bounds (over)  OR  winner is the bottom row
        else if (topIndex < 0 || (botRow != null && botRow.childElementCount - 1 == thisSpacing + 1)) {
            matchupWinnerRow = botRow;
            matchupLoserRow = document.getElementById(ID_BE_ROW + (botIndex + matchupSize));
        }
        else {
            let msg = "issue advancing: " + winnerName;
            console.log(msg);
            alert(msg);
        }

        // Set winner
        let winnerName = currentBracketRow.lastChild.childNodes[1].innerText;
        matchupWinnerRow.lastChild.id = ID_BE + winnerName;
        matchupWinnerRow.lastChild.childNodes[1].innerText = winnerName;
        this.showArrowsFor(matchupWinnerRow.lastChild);
        
        // Remove advance/revert arrows from the advanced entry and the matchup loser
        this.hideArrowsFrom(currentBracketRow.lastChild);
        if (matchupLoserRow != null) {
            this.hideArrowsFrom(matchupLoserRow.lastChild);
        }
    }

    revertRowEntry(thisBracketRow) {
        let bracketIndexSplit = thisBracketRow.id.split("-");
        let thisIndex = parseInt(bracketIndexSplit[bracketIndexSplit.length-1]);

        let thisSpacing = thisBracketRow.childElementCount - 1;
        let prevMatchupSize = 2**(thisSpacing - 1);

        // reset the reverting element to TBD
        thisBracketRow.lastChild.childNodes[1].innerText = TBD;
        thisBracketRow.lastChild.id = ID_BE + TBD;
        this.hideArrowsFrom(thisBracketRow.lastChild);

        // go back and add arrows to the previous matchup
        // need to check if they can have revert arrows
        let prevMatchupTopRowIndex = thisIndex - prevMatchupSize;
        let prevMatchupTopRow = document.getElementById(ID_BE_ROW + prevMatchupTopRowIndex);
        let prevMatchupBotRowIndex = thisIndex + prevMatchupSize;
        let prevMatchupBotRow = document.getElementById(ID_BE_ROW + prevMatchupBotRowIndex);

        // show arrows for the previous matchup
        this.showArrowsFor(prevMatchupTopRow.lastChild);
        this.showArrowsFor(prevMatchupBotRow.lastChild);
    }
}
