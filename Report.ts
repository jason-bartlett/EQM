import { MendixSdkClient, OnlineWorkingCopy, Project, Revision, Branch, loadAsPromise } from "mendixplatformsdk";
import { ModelSdkClient, IModel, projects, domainmodels, microflows, pages, navigation, texts, security, IStructure, menus } from "mendixmodelsdk";


import when = require('when');
import { _isComputed } from "mobx/lib/api/iscomputed";


/*
 * PROJECT TO ANALYZE CONFIG
 */
const username = 'jason.bartlett@erieinsurance.com';
const apikey = 'eadcc953-0f6b-4ee1-af63-9140175ca9a9';
const client = new MendixSdkClient(username, apikey);
const projectId = "a3d0b545-94a3-47d8-a6ce-159692fe097c";
const projectName = "MendixQualityMonitoring";
const revNo = -1; // -1 for latest
const branchName = "" //"Sprint11_QAS_PC_Integration"; // null for mainline

var totalNumberPages = 0;
var totalNumberMicroflows = 0;
var totalNumberEntities = 0;

/*
 * PROJECT TO ANALYZE
 */
const project = new Project(client, projectId, projectName);

client.platform().createOnlineWorkingCopy(project, new Revision(revNo, new Branch(project, branchName)))
    .then(workingCopy => {

        const model = workingCopy.model();
        const reportModel = model.findModuleByQualifiedName("QualityReport.QualityReport");
        console.log(reportModel);
        workingCopy.model().allDomainModels().forEach(domainModel => {
            var modelName=getModule(domainModel).name
      
            console.log(getModule(domainModel).name);
           
            totalNumberEntities += domainModel.entities.length;
            console.log(`Total Entities: ${domainModel.entities.length}`);
           
            return;
        });

      
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
export function getMicroflowObjects(microflow: microflows.Microflow): Array<microflows.Activity> {
    var activities: Array<microflows.Activity> = [];
    microflow.objectCollection.objects.forEach((microflowObject) => {
        activities.push(microflowObject);
    })
    return activities;
}
