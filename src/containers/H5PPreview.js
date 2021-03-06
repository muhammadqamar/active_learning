import React from "react";
import gifloader from "../images/276.gif";
import axios from "axios";
import { connect } from "react-redux";

import { withRouter } from "react-router-dom";

import { createResourceAction } from "./../actions/resource";

class H5PPreview extends React.Component {
  constructor(props) {
    super(props);
    this.h5pLib = props.resource.editor; //"H5P.Audio 1.4";
  }

  componentDidMount() {
    this.props.showltipreview
      ? this.loadResorceLti(this.props.resourceid)
      : this.loadResorce(this.props.resourceid);
  }

  loadResorce(resourceid) {
    if (resourceid == 0) return;
    const { token } = JSON.parse(localStorage.getItem("auth"));

    axios
      .post(
        global.config.laravelAPIUrl + "/h5p-resource-settings",
        { resourceid },
        { headers: { Authorization: "Bearer " + token } }
      )
      .then((response) => {
        this.resourceLoaded(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  loadResorceLti(resourceid) {
    if (resourceid == 0) return;

    axios
      .post(global.config.laravelAPIUrl + "/h5p-resource-settings-lti", {
        resourceid,
      })
      .then((response) => {
        this.resourceLoaded(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async resourceLoaded(response) {
    console.log(response);

    window.H5PIntegration = response.data.data.h5p.settings;

    var h5pWrapper = document.getElementById("curriki-h5p-wrapper");
    h5pWrapper.innerHTML = response.data.data.h5p.embed_code.trim();

    await Promise.all(
      response.data.data.h5p.settings.loadedCss.map((value) => {
        var link = document.createElement("link");
        link.href = value;
        link.type = "text/css";
        link.rel = "stylesheet";
        document.head.appendChild(link);
      })
    );

    var new_scripts = response.data.data.h5p.settings.core.scripts.concat(
      response.data.data.h5p.settings.loadedJs
    );
    new_scripts.map((value) => {
      var script = document.createElement("script");
      script.src = value;
      script.async = false;
      document.body.appendChild(script);
    });
  }

  componentWillReceiveProps(props) {
    if (this.props.resourceid != props.resourceid) {
      var h5pIFrame = document.getElementsByClassName("h5p-iframe");
      if (h5pIFrame.length) h5pIFrame[0].remove();
      this.props.showltipreview
        ? this.loadResorceLti(props.resourceid)
        : this.loadResorce(props.resourceid);
    }
  }

  render() {
    return (
      <div id="curriki-h5p-wrapper">
        <div className="loader_gif">
          <img src={gifloader} />
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  createResourceAction: (playlistid, editor, editorType) =>
    dispatch(createResourceAction(playlistid, editor, editorType)),
});

const mapStateToProps = (state) => {
  return {
    resource: state.resource,
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(H5PPreview)
);
