'use strict';

let angular = require('angular');
import { StageConstants } from 'core/pipeline/config/stages/stageConstants';
import { AccountService } from 'core/account/AccountService';

module.exports = angular
  .module('spinnaker.oraclebmcs.pipeline.stage.disableAsgStage', [
    require('core/application/modal/platformHealthOverride.directive.js').name,
  ])
  .config(function(pipelineConfigProvider) {
    pipelineConfigProvider.registerStage({
      provides: 'disableServerGroup',
      cloudProvider: 'oraclebmcs',
      templateUrl: require('./disableAsgStage.html'),
      executionStepLabelUrl: require('./disableAsgStepLabel.html'),
      validators: [
        {
          type: 'targetImpedance',
          message:
            'This pipeline will attempt to disable a server group without deploying a new version into the same cluster.',
        },
        { type: 'requiredField', fieldName: 'cluster' },
        { type: 'requiredField', fieldName: 'target' },
        { type: 'requiredField', fieldName: 'regions' },
        { type: 'requiredField', fieldName: 'credentials', fieldLabel: 'account' },
      ],
    });
  })
  .controller('oraclebmcsDisableAsgStageCtrl', function($scope) {
    let stage = $scope.stage;

    let provider = 'oraclebmcs';

    $scope.state = {
      accounts: false,
      regionsLoaded: false,
    };

    AccountService.listAccounts(provider).then(function(accounts) {
      $scope.accounts = accounts;
      $scope.state.accounts = true;
    });

    $scope.targets = StageConstants.TARGET_LIST;

    stage.regions = stage.regions || [];
    stage.cloudProvider = provider;

    if (!stage.credentials && $scope.application.defaultCredentials.oraclebmcs) {
      stage.credentials = $scope.application.defaultCredentials.oraclebmcs;
    }
    if (!stage.regions.length && $scope.application.defaultRegions.gce) {
      stage.regions.push($scope.application.defaultRegions.oraclebmcs);
    }

    if (!stage.target) {
      stage.target = $scope.targets[0].val;
    }
  });
