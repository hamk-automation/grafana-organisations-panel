/// <reference path="../typings/common.d.ts" />
/// <reference path="../typings/index.d.ts" />

import _ from "lodash";
import { PanelCtrl } from "app/plugins/sdk";
import { impressions } from "app/features/dashboard/impression_store";
import config from "app/core/config";
import "./dashboard_list.css!";

export interface IDashboardListScope extends ng.IScope {
    navigate: (url: string) => void;
    switchOrganisation: (id: number) => void;
}

class DashboardListCtrl extends PanelCtrl {
    static templateUrl = "module.html";
    backendSrv: any;
    dashboardList: {
        url: string;
        name: string;
    }[];
    organisationList: {
        id: string;
        name: string;
    }[];
    currentDashboard: string;
    windowLocation: ng.ILocationService;
    panel: any;

    /**
     * DashboardList class constructor
     * @param {IDashboardListScope} $scope Angular scope
     * @param {ng.auto.IInjectorService} $injector Angluar injector service
     * @param {ng.ILocationService} $location Angular location service
     * @param {any} backendSrv Grafana backend callback
     */
    constructor($scope: IDashboardListScope, $injector: ng.auto.IInjectorService, $location: ng.ILocationService, backendSrv: any) {
        super($scope, $injector);
        // Init variables
        $scope.navigate = this.navigate.bind(this);
        $scope.switchOrganisation = this.switchOrganisation.bind(this);
        this.backendSrv = backendSrv;
        this.dashboardList = [];
        this.organisationList = [];
        this.windowLocation = $location;
        this.currentDashboard = window.location.pathname.split("/").pop();
        // Load list of dashboards
        this.loadDashboardList();
        // Load organizations for current user
        this.loadOrganisations();
        // Adding a mechanism for telling parent frame to navigate to new url
        // Add listener for route changes: If route has target-parameter then
        // tell parent window to navigate to given target
        // e.g. setting following url-link in some Grafana dashboard: ?target=/logs
        $scope.$on("$routeUpdate", () => {
            if ($location.search().target) {
                window.parent.location.href = $location.search().target;
            }
        });
    }

    /**
     * Load dashboard items
     */
    loadDashboardList() {
        // Fetch list of all dashboards from Grafana
        this.backendSrv.search({}).then((result: any) => {
            this.dashboardList = result.map((item: any) => {
                return {
                    url: "dashboard/" + item.uri,
                    name: item.title
                }
            });
            this.notifyContainerWindow();
        });
    }

    /**
     * Load dashboard items
     */
    loadOrganisations() {
        // Fetch list of organisations of current user from Grafana
        this.backendSrv.get("api/user/orgs").then((result: any) => {
            this.organisationList = result.map((item: any) => {
                return {
                    id: item.orgId,
                    name: item.name
                }
            });
        });
    }

    /**
     * Notify container window
     * @param {string} url optional
     */
    notifyContainerWindow(url?: string) {
        // Parse breadcrumb
        let dashlist: {
            url: string;
            name: string;
        }[] = [];
        let uri = "dashboard/db/" + this.currentDashboard;
        let obj: any = _.find(this.dashboardList, { url: uri });
        dashlist.push({
            url: uri,
            name: obj.name
        });
        if (url) {
          let obj2: any = _.find(this.dashboardList, { url: url });
          dashlist.push({
              url: url,
              name: obj2.name
          });
        }
        // Send message to uppper window
        const messageObj = {
            dashboard: window.location.pathname.split("/").pop(),
            breadcrumb: dashlist
        }
        window.top.postMessage(messageObj, "*");
    }

    /**
     * Navigate to given dashboard
     * @param {string} url
     */
    navigate(url: string) {
        this.windowLocation.path(url);
        this.notifyContainerWindow(url);
    }

    /**
     * Switch organisation of current user
     * @param {number} id
     */
    switchOrganisation(id: number) {
        this.backendSrv.post("api/user/using/" + id).then((result: any) => {
            this.loadDashboardList();
        });
    }

}

export { DashboardListCtrl, DashboardListCtrl as PanelCtrl }
