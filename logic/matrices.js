//current objects matrices
var currentMatricesList = [];

function updateMatrices(){
     for(let i = 0; i < objectsList.length; i++)
    {
        let currentObject = objectsList[i];
        if(currentObject.hasChanged)
        {
            updateMatrix(currentObject, i);
        }
    }
}


// resetgame()
function initializeMatrices() { //forceUpdateMatrices()
    for(let i = 0; i < objectsList.length; i++)
    {
        let currentObject = objectsList[i];
        updateMatrix(currentObject, i);
    }
}


function updateMatrix(object, index) {
    currentMatricesList[index] = utils.MakeGenericWorld(
        object.position.x,
        0, // always zero for this project
        object.position.y,
        0, // always zero for this project
        0, // always zero for this project
        0, // always zero for this project
        object.scale.x,
        1, // always one for this project
        object.scale.y
    );
    object.hasChanged = false;
}