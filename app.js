/**
 * Created by Agrawal_ni on 2/7/2017.
 */

var toDoListApp = {};
var to_do_list = [];

toDoListApp.config = {
    targetElem : "toDoListTasks",
    defaultElements : 3
};

toDoListApp.displayList = function(config){
    var targetDiv = document.getElementsByClassName(config.targetElem)[0];
    targetDiv.innerHTML = "";
    document.getElementById("newTask").value = "";
    var loopIterationLength = (config.defaultElements < to_do_list.length) ? config.defaultElements : to_do_list.length;
    for(let i=0; i<loopIterationLength; i++){
        let listRow = document.createElement("div");
        listRow.className = "toDoListTask";

        let taskColumn = document.createElement("div");
        taskColumn.className = "task";
        taskColumn.textContent = to_do_list[i].task;
        listRow.appendChild(taskColumn);

        let addedOnColumn = document.createElement("div");
        addedOnColumn.className = "date";
        addedOnColumn.textContent = to_do_list[i].addedOn;
        listRow.appendChild(addedOnColumn);

        let completedOnColumn = document.createElement("div");
        completedOnColumn.className = "date";
        completedOnColumn.textContent = to_do_list[i].completedOn;
        listRow.appendChild(completedOnColumn);

        let isCompleted = document.createElement("div");
        isCompleted.className = "date";
        var checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox["checked"] = to_do_list[i].completedOn?true:false;
        checkbox.id = i;
        checkbox.addEventListener('click', toDoListApp.isCompleted, false);
        isCompleted.appendChild(checkbox);
        listRow.appendChild(isCompleted);

        targetDiv.appendChild(listRow);
    }
};


toDoListApp.loadMoreTasks = function(){
    toDoListApp.config.defaultElements += 3;
    toDoListApp.displayList(toDoListApp.config);
    toDoListApp.checkToDisplayLoadMoreButton();
};

toDoListApp.addTask = function(){
    document.getElementById("error").innerHTML = "";
    var task = document.getElementById("newTask").value;
    if(task == ""){
        toDoListApp.showError("Please enter some data and try again","error");
    }
    toDoListApp.makeApiCall("/addTask","POST",task).then(function(data){
        to_do_list = JSON.parse(data);
        toDoListApp.displayList(toDoListApp.config);
        toDoListApp.checkToDisplayLoadMoreButton();
    },function(error){
        toDoListApp.showError("Error is  " + error,"error");
    });

};

toDoListApp.checkToDisplayLoadMoreButton = function(){
    if(toDoListApp.config.defaultElements >= to_do_list.length){
        document.getElementById("loadMoreTasks").style.display = "none";
    }else{
        document.getElementById("loadMoreTasks").style.display = "block";
    }
};

toDoListApp.isCompleted = function(event){
   let index = parseInt(event.srcElement.id);
    toDoListApp.makeApiCall("/taskComplete","POST",index).then(function(data){
        to_do_list = data;
        toDoListApp.displayList(toDoListApp.config);
        toDoListApp.checkToDisplayLoadMoreButton();
    },function(error){
        toDoListApp.showError("Error is  " + error,"globalError");
    })
};


toDoListApp.makeApiCall = function(url,method,data){
    var prom = new Promise(resolve, reject);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            resolve(this.response);
        }else{
            reject(this.error);
        }
    };
    xhttp.open(method, url, true);
    if(method == "POST"){
        xhttp.send(data);
    }else{
        xhttp.send();
    }
    return prom;
};

toDoListApp.makeApiCall("/getTasks","Get").then(function(data){
    to_do_list = data;
    toDoListApp.displayList(toDoListApp.config);
    toDoListApp.checkToDisplayLoadMoreButton();
},function(error){
    toDoListApp.showError("Error is  " + error,"globalError");
});

toDoListApp.showError = function(err,element){
    document.getElementById(element).textContent = err;
};
