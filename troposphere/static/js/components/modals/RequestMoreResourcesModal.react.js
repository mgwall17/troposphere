/** @jsx React.DOM */

define(
  [
    'react',
    'components/mixins/BootstrapModalMixin.react'
  ],
  function (React, BootstrapModalMixin) {

    return React.createClass({
      mixins: [BootstrapModalMixin],

      getInitialState: function () {
        return {
          resources: "",
          reason: ""
        };
      },

      isSubmittable: function(){
        var hasResources     = !!this.state.resources;
        var hasReason = !!this.state.reason;
        return hasResources && hasReason;
      },

      //
      // Internal Modal Callbacks
      // ------------------------
      //

      cancel: function(){
        this.hide();
      },

      confirm: function () {
        this.hide();
        this.props.onConfirm(this.state.resources, this.state.reason);
      },

      //
      // Custom Modal Callbacks
      // ----------------------
      //

      // todo: I don't think there's a reason to update state unless
      // there's a risk of the component being re-rendered by the parent.
      // Should probably verify this behavior, but for now, we play it safe.
      handleResourcesChange: function (e) {
        this.setState({resources: e.target.value});
      },

      handleReasonChange: function (e) {
        this.setState({reason: e.target.value});
      },

      //
      // Render
      // ------
      //

      renderBody: function(){
        return (
          <form role='form'>

            <div className='form-group'>
              <label htmlFor='project-name'>{"What resources would you like to request?"}</label>
              <textarea type='text'
                        className='form-control'
                        rows="7"
                        placeholder="E.g 4 CPUs and 8GB memory, running 4 cores for 1 week, an additional 5400 cpu hours, etc."
                        value={this.state.resources}
                        onChange={this.handleResourcesChange}
              />
            </div>

            <div className='form-group'>
              <label htmlFor='project-description'>{"How will you use the additional resources?"}</label>
              <textarea type='text'
                        className='form-control'
                        rows="7"
                        placeholder="E.g. To run a program or analysis, store larger output, etc."
                        value={this.state.reason}
                        onChange={this.handleReasonChange}
              />
            </div>
          </form>
        );
      },

      render: function () {

        return (
          <div className="modal fade">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  {this.renderCloseButton()}
                  <strong>Request Resources</strong>
                </div>
                <div className="modal-body">
                  {this.renderBody()}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-danger" onClick={this.cancel}>
                    Cancel
                  </button>
                  <button type="button" className="btn btn-primary" onClick={this.confirm} disabled={!this.isSubmittable()}>
                    Request Resources
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      }

    });

  });