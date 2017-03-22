"use strict";

System.register(["lodash", "app/plugins/sdk", "./dashboard_list.css!"], function (_export, _context) {
    "use strict";

    var _, PanelCtrl, _createClass, DashboardListCtrl;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    function _possibleConstructorReturn(self, call) {
        if (!self) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }

        return call && (typeof call === "object" || typeof call === "function") ? call : self;
    }

    function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }

        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    }

    return {
        setters: [function (_lodash) {
            _ = _lodash.default;
        }, function (_appPluginsSdk) {
            PanelCtrl = _appPluginsSdk.PanelCtrl;
        }, function (_dashboard_listCss) {}],
        execute: function () {
            _createClass = function () {
                function defineProperties(target, props) {
                    for (var i = 0; i < props.length; i++) {
                        var descriptor = props[i];
                        descriptor.enumerable = descriptor.enumerable || false;
                        descriptor.configurable = true;
                        if ("value" in descriptor) descriptor.writable = true;
                        Object.defineProperty(target, descriptor.key, descriptor);
                    }
                }

                return function (Constructor, protoProps, staticProps) {
                    if (protoProps) defineProperties(Constructor.prototype, protoProps);
                    if (staticProps) defineProperties(Constructor, staticProps);
                    return Constructor;
                };
            }();

            _export("PanelCtrl", _export("DashboardListCtrl", DashboardListCtrl = function (_PanelCtrl) {
                _inherits(DashboardListCtrl, _PanelCtrl);

                /**
                 * DashboardList class constructor
                 * @param {IDashboardListScope} $scope Angular scope
                 * @param {ng.auto.IInjectorService} $injector Angluar injector service
                 * @param {ng.ILocationService} $location Angular location service
                 * @param {any} backendSrv Grafana backend callback
                 */
                function DashboardListCtrl($scope, $injector, $location, backendSrv) {
                    _classCallCheck(this, DashboardListCtrl);

                    var _this = _possibleConstructorReturn(this, (DashboardListCtrl.__proto__ || Object.getPrototypeOf(DashboardListCtrl)).call(this, $scope, $injector));

                    // Init variables
                    $scope.navigate = _this.navigate.bind(_this);
                    $scope.switchOrganisation = _this.switchOrganisation.bind(_this);
                    _this.backendSrv = backendSrv;
                    _this.dashboardList = [];
                    _this.organisationList = [];
                    _this.windowLocation = $location;
                    _this.currentDashboard = window.location.pathname.split("/").pop();
                    // Load list of dashboards
                    _this.loadDashboardList();
                    // Load organizations for current user
                    _this.loadOrganisations();
                    // Adding a mechanism for telling parent frame to navigate to new url
                    // Add listener for route changes: If route has target-parameter then
                    // tell parent window to navigate to given target
                    // e.g. setting following url-link in some Grafana dashboard: ?target=/logs
                    $scope.$on("$routeUpdate", function () {
                        if ($location.search().target) {
                            window.parent.location.href = $location.search().target;
                        }
                    });
                    return _this;
                }
                /**
                 * Load dashboard items
                 */


                _createClass(DashboardListCtrl, [{
                    key: "loadDashboardList",
                    value: function loadDashboardList() {
                        var _this2 = this;

                        // Fetch list of all dashboards from Grafana
                        this.backendSrv.search({}).then(function (result) {
                            _this2.dashboardList = result.map(function (item) {
                                return {
                                    url: "dashboard/" + item.uri,
                                    name: item.title
                                };
                            });
                            _this2.notifyContainerWindow();
                        });
                    }
                }, {
                    key: "loadOrganisations",
                    value: function loadOrganisations() {
                        var _this3 = this;

                        // Fetch list of organisations of current user from Grafana
                        this.backendSrv.get("api/user/orgs").then(function (result) {
                            _this3.organisationList = result.map(function (item) {
                                return {
                                    id: item.orgId,
                                    name: item.name
                                };
                            });
                        });
                    }
                }, {
                    key: "notifyContainerWindow",
                    value: function notifyContainerWindow(url) {
                        // Parse breadcrumb
                        var dashlist = [];
                        var uri = "dashboard/db/" + this.currentDashboard;
                        var obj = _.find(this.dashboardList, { url: uri });
                        dashlist.push({
                            url: uri,
                            name: obj.name
                        });
                        if (url) {
                            var obj2 = _.find(this.dashboardList, { url: url });
                            dashlist.push({
                                url: url,
                                name: obj2.name
                            });
                        }
                        // Send message to uppper window
                        var messageObj = {
                            dashboard: window.location.pathname.split("/").pop(),
                            breadcrumb: dashlist
                        };
                        window.top.postMessage(messageObj, "*");
                    }
                }, {
                    key: "navigate",
                    value: function navigate(url) {
                        this.windowLocation.path(url);
                        this.notifyContainerWindow(url);
                    }
                }, {
                    key: "switchOrganisation",
                    value: function switchOrganisation(id) {
                        var _this4 = this;

                        this.backendSrv.post("api/user/using/" + id).then(function (result) {
                            _this4.loadDashboardList();
                        });
                    }
                }]);

                return DashboardListCtrl;
            }(PanelCtrl)));

            DashboardListCtrl.templateUrl = "module.html";

            _export("DashboardListCtrl", DashboardListCtrl);

            _export("PanelCtrl", DashboardListCtrl);
        }
    };
});
//# sourceMappingURL=dashboard_list_ctrl.js.map
