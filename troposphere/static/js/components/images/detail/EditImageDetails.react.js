define(function (require) {

  var React = require('react/addons'),
    HeaderView = require('./header/HeaderView.react'),
    EditTagsView = require('./tags/EditTagsView.react'),
    ImageLaunchCard = require('./launch/ImageLaunchCard.react'),
    EditNameView = require('./name/EditNameView.react'),
    EditDescriptionView = require('./description/EditDescriptionView.react'),
    InteractiveDateField = require('components/common/InteractiveDateField.react'),
    CreatedView = require('./created/CreatedView.react'),
    EditRemovedView = require('./removed/EditRemovedView.react'),
    AuthorView = require('./author/AuthorView.react'),
    actions = require('actions'),
    globals = require('globals'),
    moment = require('moment'),
    momentTZ = require('moment-timezone'),
    stores = require('stores');

  return React.createClass({

    propTypes: {
      image: React.PropTypes.instanceOf(Backbone.Model).isRequired,
      providers: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
      identities: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
      tags: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
      onSave: React.PropTypes.func.isRequired,
      onCancel: React.PropTypes.func.isRequired
    },

    getInitialState: function(){
      var image = this.props.image;

      var imageTags = stores.TagStore.getImageTags(image);
      return {
        name: image.get('name'),
        description: image.get('description'),
        endDate: image.get('end_date').tz(globals.TZ_REGION).format("M/DD/YYYY hh:mm a z"),
        tags: imageTags
      }
    },

    handleSave: function () {
      var updatedAttributes = {
        name: this.state.name,
        description: this.state.description,
        end_date: this.state.endDate,
        tags: this.state.tags
      };

      this.props.onSave(updatedAttributes);
    },

    handleEndDateChange: function (value) {
      var endDate = value;
      this.setState({endDate: endDate});
    },

    handleNameChange: function (e) {
      var name = e.target.value;
      this.setState({name: name});
    },

    handleDescriptionChange: function (e) {
      var description = e.target.value;
      this.setState({description: description});
    },

    onTagAdded: function(tag){
      tags = this.state.tags
      tags.add(tag)
      this.setState({tags: tags});
    },

    onTagRemoved: function(tag){
      tags = this.state.tags
      tags.remove(tag)
      this.setState({tags: tags});
    },

    render: function () {
      var image = this.props.image,
          providers = this.props.providers,
          identities = this.props.identities,
          allTags = this.props.tags,
          imageTags = this.state.tags;

      // Since providers requires authentication, we can't display which providers
      // the image is available on on the public page

      return (
        <div>
          <div>
            <EditNameView
              image={image}
              value={this.state.name}
              onChange={this.handleNameChange}
            />
            <CreatedView image={image}/>
            <InteractiveDateField
              value={this.state.endDate}
              onChange={this.handleEndDateChange}
              />
            <AuthorView image={image}/>
            <EditDescriptionView
              titleClassName="title col-md-2"
              formClassName="form-group col-md-10"
              className="image-info-segment row"
              title="Description:"
              image={image}
              value={this.state.description}
              onChange={this.handleDescriptionChange}
                />
            <EditTagsView
              image={image}
              tags={allTags}
              value={imageTags}
              onTagAdded={this.onTagAdded}
              onTagRemoved={this.onTagRemoved}
            />
          </div>
          <div className="edit-link-row clearfix">
            <a className="btn btn-primary btn-sm pull-right" onClick={this.handleSave}>Save</a>
            <a className="btn btn-default btn-sm pull-right" style={{marginRight:'20px'}} onClick={this.props.onCancel}>Cancel</a>
          </div>
        </div>
      );
    }

  });

});
