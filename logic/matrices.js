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
    currentMatricesList[index] = utils.MakeGenericWorld(object.position.x,0,object.position.y,0,0,0,object.scale.x,0.5,object.scale.y);
    object.hasChanged = false;
}