/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'stores/SizeStore',
    './StatusBar.react'
  ],
  function (React, Backbone, SizeStore, StatusBar) {

    return React.createClass({

      propTypes: {
        identity: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        providers: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        instances: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        volumes: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      getProviderInstances: function(instances, provider){
        return instances.filter(function(instance){
          return instance.get('identity').provider === provider.id;
        });
      },

      getProviderVolumes: function(volumes, provider){
         return volumes.filter(function(volume){
          return volume.get('identity').provider === provider.id;
        });
      },

      calculateCpuUsage: function(instances, quota, sizes){
        var maxCpuCount = quota.cpu;

        var currentCpuCount = instances.reduce(function(memo, instance){
          var size = sizes.findWhere({alias: instance.get('size_alias')});
          return memo + size.get('cpu');
        }.bind(this), 0);

        var messageText = "You are using " + currentCpuCount + " of " + maxCpuCount + " allotted CPUs";

        return (
          <li>
            <StatusBar value={currentCpuCount}
                       maxValue={maxCpuCount}
            />
            {messageText}
          </li>
        );
      },

      calculateMemoryUsage: function(instances, quota, sizes){
        var maxMemory = quota.mem;

        var currentMemory = instances.reduce(function(memo, instance){
          var size = sizes.findWhere({alias: instance.get('size_alias')});
          return memo + size.get('mem');
        }.bind(this), 0);

        var messageText = "You are using " + currentMemory + " of " + maxMemory + " allotted GBs of Memory";

        return (
          <li>
            <StatusBar value={currentMemory}
                       maxValue={maxMemory}
            />
            {messageText}
          </li>
        );
      },

      calculateStorageUsage: function(volumes, quota){
        var maxStorage = quota.storage;

        var currentStorage = volumes.reduce(function(memo, volume){
          return memo + volume.get('size')
        }.bind(this), 0);

        var messageText = "You are using " + currentStorage + " of " + maxStorage + " allotted GBs of Storage";

        return (
          <li>
            <StatusBar value={currentStorage}
                       maxValue={maxStorage}
            />
            {messageText}
          </li>
        );
      },

      calculateStorageCountUsage: function(volumes, quota){
        var maxStorageCount = quota.storage_count;

        var currentStorageCount = volumes.reduce(function(memo, volume){
          return memo + 1;
        }.bind(this), 0);

        var messageText = "You are using " + currentStorageCount + " of " + maxStorageCount + " Storage Volumes";

        return (
          <li>
            <StatusBar value={currentStorageCount}
                       maxValue={maxStorageCount}
            />
            {messageText}
          </li>
        );
      },

      render: function () {
        var identity = this.props.identity;
        var provider = this.props.providers.get(identity.get('provider_id'));
        var quota = identity.get('quota');
        var sizes = SizeStore.getAllFor(provider.id, identity.id);

        if(sizes){

          var providerInstances = this.getProviderInstances(this.props.instances, provider);
          var providerVolumes = this.getProviderInstances(this.props.volumes, provider);

          var cpuUsage = this.calculateCpuUsage(providerInstances, quota, sizes);
          var memoryUsage = this.calculateMemoryUsage(providerInstances, quota, sizes);
          var storageUsage = this.calculateStorageUsage(providerVolumes, quota);
          var storageCountUsage = this.calculateStorageCountUsage(providerVolumes, quota);

          return (
            <div>
              <h4>{provider.get('name')}</h4>
              <ul>
                <li>{providerInstances.length + " Instances"}</li>

                {cpuUsage}
                {memoryUsage}

                <li>{providerVolumes.length + " Volumes"}</li>
                {storageUsage}
                {storageCountUsage}
              </ul>
            </div>
          );
        }

        return (
          <div className="loading"></div>
        );
      }

    });

  });
