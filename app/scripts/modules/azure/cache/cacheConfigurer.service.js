'use strict';

const angular = require('angular');

import {
  AccountService,
  INSTANCE_TYPE_SERVICE,
  LOAD_BALANCER_READ_SERVICE,
  SUBNET_READ_SERVICE,
} from '@spinnaker/core';

module.exports = angular
  .module('spinnaker.azure.cache.initializer', [LOAD_BALANCER_READ_SERVICE, INSTANCE_TYPE_SERVICE, SUBNET_READ_SERVICE])
  .factory('azureCacheConfigurer', function($q, instanceTypeService, subnetReader, keyPairsReader, loadBalancerReader) {
    let config = Object.create(null);

    config.credentials = {
      initializers: [() => AccountService.getCredentialsKeyedByAccount('azure')],
    };

    config.instanceTypes = {
      initializers: [() => instanceTypeService.getAllTypesByRegion('azure')],
    };

    config.loadBalancers = {
      initializers: [() => loadBalancerReader.listLoadBalancers('azure')],
    };

    config.subnets = {
      version: 2,
      initializers: [() => subnetReader.listSubnets()],
    };

    config.keyPairs = {
      initializers: [() => keyPairsReader.listKeyPairs()],
    };

    return config;
  });
