/*global define */

define(
  [
    'marionette',
    'components/Root.react',
    'react',
    'components/applications/list/ApplicationListView.react',
    'components/applications/favorites/Favorites.react',
    'components/applications/detail/ApplicationDetail.react',
    'components/applications/search/SearchResults.react',
    'models/Application',
    'rsvp',
    'context'
  ],
  function (Marionette, Root, React, ApplicationListView, ApplicationFavorites, ApplicationDetail, SearchResults, Application, RSVP, context) {
    'use strict';

    var Router = Marionette.AppRouter.extend({
      appRoutes: {
        '': 'showImages',
        'images': 'showImages',
        'images/:id': 'showAppDetail',
        'images/search/:query': 'showApplicationSearchResults',
        '*path': 'defaultRoute'
      }
    });

    var Controller = Marionette.Controller.extend({

      render: function (content, route) {
        var app = Root({
          session: context.session,
          profile: context.profile,
          content: content,
          route: route || Backbone.history.getFragment()
        });
        React.renderComponent(app, document.getElementById('application'));
      },

      //
      // Route handlers
      //

      defaultRoute: function () {
        Backbone.history.navigate('', {trigger: true});
      },

      showImages: function () {
        this.render(ApplicationListView(), ["images"]);
      },

      showAppFavorites: function () {
        var content = ApplicationFavorites();
        this.render(content);
      },

      showAppAuthored: function () {
        var content = ApplicationFavorites();
        this.render(content);
      },

      showAppDetail: function (appId) {
        var content = ApplicationDetail({
          applicationId: appId
        });
        this.render(content, ["images"]);
      },

      showApplicationSearchResults: function (query) {
        var content = SearchResults({query: query});
        this.render(content, ["images", "search"]);
      }

    });

    return {
      start: function () {
        var controller = new Controller();
        var router = new Router({
          controller: controller
        });
      }
    }

  });
