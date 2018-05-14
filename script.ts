import { MendixSdkClient, OnlineWorkingCopy, Project, Revision, Branch, loadAsPromise } from "mendixplatformsdk";
import { ModelSdkClient, IModel, projects, domainmodels, microflows, pages, navigation, texts, security, IStructure, menus } from "mendixmodelsdk";


import when = require('when');
import { _isComputed } from "mobx/lib/api/iscomputed";
import fs = require("fs");
import fw = require("./FileWriter");
/*
 * PROJECT TO ANALYZE CONFIG
 */
const username = 'jason.bartlett@erieinsurance.com';
const apikey = 'eadcc953-0f6b-4ee1-af63-9140175ca9a9';
const client = new MendixSdkClient(username, apikey);
const projectId = "a6127060-1a19-4565-a2da-0aed7bb051b3";
const projectName = "QAS System";
const revNo = -1; // -1 for latest
const branchName = ""//"Sprint11_QAS_PC_Integration"; // null for mainline


//Config Check paramters
const maxEntitiesPerModule=20;
const maxParametersPerMicroflow=3;
const maxMicroflowActivities=10;

var fileLocation = "./QualityCheck.txt";
var fW =  new fw.FileWriter(fileLocation);


var totalNumberPages = 0;
var totalNumberMicroflows = 0;
var totalNumberEntities = 0;

/*
 * PROJECT TO ANALYZE
 */
const project = new Project(client, projectId, projectName);

client.platform().createOnlineWorkingCopy(project, new Revision(revNo, new Branch(project, branchName)))
    .then(workingCopy => {

        workingCopy.model().allDomainModels().forEach(domainModel => {
            var modelName=getModule(domainModel).name
      
            console.log(getModule(domainModel).name);
            fW.appendLine(getModule(domainModel).name);
            totalNumberEntities += domainModel.entities.length;
            console.log(`Total Entities: ${domainModel.entities.length}`);
            fW.appendLine(`Total Entities: ${domainModel.entities.length}`);
            var microflows = workingCopy.model().allMicroflows().filter(microflow => {
                return getModule(microflow).name === getModule(domainModel).name;
            });
            
            var loadedMfs = loadAllMicroflows(microflows).then(flow=>{
               flow.forEach(mf=>{
                   var micrObj = getMicroflowObjects(mf);
                  // console.log(`Total Activities in ${modelName}.${mf.name}: ${micrObj.length}`);
                   fW.appendLine(`Total Activities in ${modelName}.${mf.name}: ${micrObj.length}`);
               })
            });

            totalNumberMicroflows += microflows.length;
            console.log(`Total Microflows: ${microflows.length}`);
            fW.appendLine(`Total Microflows: ${microflows.length}`);
            return;
        });
        console.log(`==========================Total Stats==========================`);
        fW.appendLine(`==========================Total Stats==========================`);
        console.log(`Total Microflows: ${totalNumberMicroflows}`);
        fW.appendLine(`Total Microflows: ${totalNumberMicroflows}`);
        console.log(`Total Entities: ${totalNumberEntities}`);
        fW.appendLine(`Total Entities: ${totalNumberEntities}`);
        return;
    })
    .done(
        () => {



        },
        error => {
            console.log("Something went wrong:");
            console.dir(error);
        }
    );
export function getModule(element: IStructure): projects.Module {
    let current = element.unit;
    while (current) {
        if (current instanceof projects.Module) {
            return current;
        }
        current = current.container;
    }
    return current;
    
}
export function loadAllMicroflows(microflows: microflows.IMicroflow[]): when.Promise<microflows.Microflow[]> {
    return when.all<microflows.Microflow[]>(microflows.map(loadMicroflow));
}
export function loadMicroflow(microflow: microflows.IMicroflow): when.Promise<microflows.Microflow> {
    return when.promise<microflows.Microflow>((resolve, reject) => {
        if (microflow) {
            microflow.load(mf => {
                if (mf) {
                    resolve(mf);
                } else {
                    reject(`Failed to load microflow: ${microflow.qualifiedName}`);
                }
            });
        } else {
            reject(`'microflow' is undefined`);
        }
    });
}
export function getMicroflowObjects(microflow: microflows.Microflow): Array<microflows.Activity> {
    var activities: Array<microflows.Activity> = [];
    microflow.objectCollection.objects.forEach((microflowObject) => {
        activities.push(microflowObject);
    })
    return activities;
}
function writeToFile(indent: number, sequence:number, currentMf:microflows.Microflow, type:string, actionName:string, callsActionModule:string, callsActionName:string ) {
    var msg = indent + "," + (currentMf!=null? currentMf.name :"") + "," + (currentMf!=null? currentMf.name :"") + "," + sequence + "," +  type + "," + actionName + "," + callsActionModule + "," + callsActionName;

        console.log(msg);
        fW.appendLine( msg );
  }