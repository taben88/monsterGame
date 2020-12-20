var time = 0;

class monsterField {
    constructor(no) {
        this.no = no
        this.occupant = ""
    }
    //Returns True if the field is empty. Used for the populate method.
    isEmpty(field = this) {
        return !field.occupant
    }
    //Sets the fields occupant to empty and the corresponding html img tags src to empty. Used to destroy monsters.
    setEmpty() {
        this.occupant = ""
        document.getElementById(this.no).setAttribute("src", "");
    }
};

class itemField {
    constructor() {
        this.occupant = ""
    }
    //Returns True if the field is empty. Used for the populate method.
    isEmpty() {
        return !this.occupant
    }
    //Checks if the fields occupant is a sock item through its name property and calls the shuffle() function on the ItemArea if yes.
    //Also increments time by 1. If time is higer than 2 calls populate on monsterArea.
    //Otherwise checks if the occupant item's name is the same as any of the monters' item propety present in the monsterArea. If yes destroys those monsters by calling setEmpty on their fields.
    //Otherwise increments time by 1. If time is higer than 2 calls populate on monsterArea.
    //Finally calls checkWin method of function of monsterArea.
    onClick() {
        //Check itemSocks
        if (this.occupant.name == "itemSocks") {
            itemArea.shuffle()
            time++
            if (time > 2) {
                time = 0
                monsterArea.populate()
            }
        }
        //Check for match with monster item property
        else if (monsterArea.checkItem(this.occupant.name)) {
            for (i of monsterArea.monsterFields) {
                if (i.occupant.item == this.occupant.name) {
                    i.setEmpty();
                }
            }
        }
        //No itemSock no match increment time
        else {
            time++
            if (time > 2) {
                time = 0
                monsterArea.populate()
            }
        };
        monsterArea.checkWin();
    }
};

//Creates an array of monster items. Each item has an img and item property to populate gamefields.
const monsters = [
    monEye = { img: "monEye.png", item: "itemDinosaur" },
    monLegs = { img: "monLegs.png", item: "itemDoll" },
    monMouth = { img: "monMouth.png", item: "itemRobot" },
    monWing = { img: "monWing.png", item: "itemTeddy" }
];

//Creates an array of items. Each item has an img property to populate gamefields.
const items = [
    { name: "itemDinosaur", img: "itemDinosaur.png" },
    { name: "itemDoll", img: "itemDoll.png" },
    { name: "itemRobot", img: "itemRobot.png" },
    { name: "itemTeddy", img: "itemTeddy.png" },
    { name: "itemSocks", img: "itemSocks.png" },
    { name: "itemSocks", img: "itemSocks.png" }
];

//Creates an object, that holds an array of four named monsterField objects and a function to populate the next empty field.
const monsterArea = {
    monsterFields: [
        new monsterField("mon1"),
        new monsterField("mon2"),
        new monsterField("mon3"),
        new monsterField("mon4")
    ],

    populate() {
        //Starts checking each field to see, if there is any empty. If all fields are full player loses the game.
        //When first empty field found sets its occupant as random monster from list of monsters.
        //It also sets the corresponding image's src property to that of the monster's.
        let monsterFields = this.monsterFields;
        for (let i = 0; i < (monsterFields.length) + 1; i++) {
            if (i == 4) {
                console.log("Vesztettél!");
                document.getElementById("victory").style.zIndex = 2;
                break;
            }
            else if (monsterFields[i].isEmpty()) {
                let no = monsterFields[i].no;
                monsterFields[i].occupant = monsters[Math.floor(Math.random() * 4)];
                let occupant = monsterFields[i].occupant;
                document.getElementById(no).setAttribute("src", `assets/${occupant.img}`);
                break;
            };
        };

    },
    //Checks each monsterField's occupant's item property against a itemName. On first match returns with True. Else returns with False.
    checkItem(itemName) {
        let monsterFields = this.monsterFields;
        for (i of monsterFields) {
            if (i.occupant.item == itemName) {
                return true
            };
        };
        return false
    },

    //Checks if each monsterField is empty, if yes, displays win message
    checkWin() {
        let monsterFields = this.monsterFields;
        if (monsterFields.every(monsterField.prototype.isEmpty)) {
            console.log("Victory");
            document.getElementById("victory").style.zIndex = 2;
        };
    }
};

//Creates an object, that holds an array of six named itemField objects and a function to populate the fields and shuffle them.
const itemArea = {
    itemFields: [
        new itemField(),
        new itemField(),
        new itemField(),
        new itemField(),
        new itemField(),
        new itemField()
    ],

    //Shuffles the above fields, by iterating through them, selecting another random field at a time, mixing their content.
    //Also refreshes source attribute of corresponding image fields after shuffle. 
    shuffle() {
        //Shuffle items
        let itemFields = this.itemFields
        for (let i = itemFields.length - 1; i > -1; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [itemFields[i], itemFields[j]] = [itemFields[j], itemFields[i]];
        };
        //Refresh images
        for (let i = 0; i < itemFields.length; i++) {
            let occupant = itemFields[i].occupant;
            document.getElementById(`item${i}`).setAttribute("src", `assets/${occupant.img}`);
            console.log(document.getElementById(`item${i}`).src);
        }
    },

    //Populates the fields with items, from an array of items, then shuffles them. Should only be used to initialize the itemfields.
    populate() {
        let itemFields = this.itemFields
        for (let i = 0; i < items.length; i++) {
            itemFields[i].occupant = items[i];
            let occupant = itemFields[i].occupant;
            document.getElementById(`item${i}`).setAttribute("src", `assets/${occupant.img}`);
        };
        this.shuffle();
        for (let i = 0; i < items.length; i++) {
            reveal(document.getElementById(`item${i}`));
        };
    },
};


//Makes the clicked item's image visible for a short period of time.
function reveal(element){
    element.style.visibility = "visible";
    function hide(){
        element.style.visibility = "hidden";
    };
    setTimeout(hide, 500);
}

//Starts/resets the game
function newGame(){
    time = 0;
    for (const i of monsterArea.monsterFields) {
        i.setEmpty();
    };
    monsterArea.populate();
    itemArea.populate();
    document.getElementById("victory").style.zIndex = -2;
};

newGame();