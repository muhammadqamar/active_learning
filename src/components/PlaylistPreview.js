import React, { Suspense } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";
import { loadPlaylistAction } from "../actions/playlist";
import ActivityPreviewCard from "./ActivityPreviewCard";
import ActivityPreviewCarddropdown from "./ActivityPreviewCardDropdown";
import gifloader from "../images/276.gif";
import projecticon from "../images/project_icon.svg";
const H5PPreview = React.lazy(() => import("../containers/H5PPreview"));
import "./PlayListPreview.css";
import { previewResource } from "../actions/resource";
import { LoadHP } from "./../actions/playlist";
import axios from "axios";
import Unauthorized from "./unauthorized";
export class PlaylistPreview extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      resourceid: this.props.resourceid,
      resourcetitle: "",
      //  loading: "loading.ddd..",
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);

    this.props.loadPlaylistAction(this.props.playlistid);
    const checkvalifresourcer = async () => {
      const { token } = JSON.parse(localStorage.getItem("auth"));
      this.props.loading &&
        axios
          .post(
            global.config.laravelAPIUrl + "/h5p-resource-settings",
            { resourceid: this.props.resourceid },
            { headers: { Authorization: "Bearer " + token } }
          )
          .then((response) => {
            if (response.data.status == "success") {
              this.props.LoadHP(null);
            } else {
              this.props.LoadHP(response.data.status);
            }
          })
          .catch((error) => {
            console.log(error);
          });
    };
    checkvalifresourcer();
  }

  handleSelect = (resourceid) => {
    if (resourceid) {
      this.setState({ resourceid: resourceid });
    }
  };

  render() {
    if (!this.props.playlist.selectedPlaylist)
      return (
        <div className="alert alert-info" role="alert">
          Loading...
        </div>
      );

    const { resourceid } = this.state;
    const playlist = this.props.playlist.selectedPlaylist;
    console.log(playlist);
    var activities;
    var activities1;

    if (playlist.activities.length == 0) {
      activities = (
        <div className="col-md-12">
          <div className="alert alert-info" role="alert">
            No activities defined for this playlist.
          </div>
        </div>
      );
      activities1 = (
        <div className="col-md-12">
          <div className="alert alert-info" role="alert">
            No activities defined for this playlist.
          </div>
        </div>
      );
    } else {
      activities = playlist.activities.map((activity) => (
        <ActivityPreviewCard
          activity={activity}
          key={activity._id}
          handleSelect={this.handleSelect}
          playlist={this.props.playlistid}
        />
      ));
      console.log(activities);
      activities1 = playlist.activities.map((activity) => (
        <ActivityPreviewCarddropdown
          activity={activity}
          key={activity._id}
          handleSelect={this.handleSelect}
          playlist={this.props.playlistid}
        />
      ));
      console.log(activities1);

      if (resourceid == 0) this.state.resourceid = playlist.activities[0]._id;
    }

    const currentActivity = playlist.activities.filter(
      (f) => f._id == resourceid
    )[0];

    const previousResource =
      playlist.activities.indexOf(currentActivity) >= 1
        ? playlist.activities[playlist.activities.indexOf(currentActivity) - 1]
        : null;
    const nextResource =
      playlist.activities.indexOf(currentActivity) !=
      playlist.activities.length - 1
        ? playlist.activities[playlist.activities.indexOf(currentActivity) + 1]
        : null;

    let previousLink = null;
    let previousLink1 = null;
    if (previousResource) {
      previousLink = (
        <a
          to="#"
          className="slide-control prev"
          onClick={() => this.handleSelect(previousResource._id)}
        >
          <i className="fa fa-arrow-left" aria-hidden="true"></i>
          <span> previous Activity</span>
        </a>
      );

      previousLink1 = (
        <Link
          // onClick={() => {
          //   this.handleSelect(previousResource._id);
          //   try {
          //     document.getElementById(
          //       "curriki-h5p-wrapper"
          //     ).innerHTML = ` <div class="loader_gif">
          //       <img src='${gifloader}' alt="" />
          //     </div>`;
          //   } catch (e) {}
          // }}
          to={
            this.props.playlistid &&
            "/playlist/preview/" +
              this.props.playlistid +
              "/resource/" +
              previousResource._id
          }
        >
          {" "}
          <i class="fa fa-chevron-left" aria-hidden="true"></i>
        </Link>
      );
    } else {
      previousLink = (
        <a to="#" className="slide-control prev disabled-link">
          <i className="fa fa-chevron-left" aria-hidden="true"></i>
          <span> previous Activity</span>
        </a>
      );
      previousLink1 = (
        <a>
          {" "}
          <i class="fa fa-chevron-left" aria-hidden="true"></i>
        </a>
      );
    }

    let nextLink = null;
    let nextLink1 = null;
    if (nextResource) {
      nextLink = (
        <a
          className="slide-control next"
          onClick={() => this.handleSelect(nextResource._id)}
        >
          <i className="fa fa-arrow-right" aria-hidden="true"></i>
          <span> Next Activity</span>
          {/* <div className="hover-control-caption pointer-cursor">
            <div
              style={{
                backgroundImage:
                  "url(" +
                  global.config.laravelAPIUrl +
                  nextResource.thumb_url +
                  ")",
              }}
              className="imginhover"
            />
            <span>{nextResource.title}</span>
          </div> */}
        </a>
      );
      nextLink1 = (
        <Link
          // onClick={() => {
          //   this.handleSelect(nextResource._id);
          //   try {
          //     document.getElementById(
          //       "curriki-h5p-wrapper"
          //     ).innerHTML = ` <div class="loader_gif">
          //       <img src='${gifloader}' alt="" />
          //     </div>`;
          //   } catch (e) {}
          // }}

          to={
            this.props.playlistid &&
            "/playlist/preview/" +
              this.props.playlistid +
              "/resource/" +
              nextResource._id
          }
        >
          <i class="fa  fa-chevron-right" aria-hidden="true"></i>
        </Link>
      );
    } else {
      nextLink = (
        <a to="#" className="slide-control next disabled-link">
          <i className="fa fa-arrow-right" aria-hidden="true"></i>
          <span> Next Activity</span>
          {/* <div className="hover-control-caption pointer-cursor">
            <img alt="thumb01"></img>
            <span></span>
          </div> */}
        </a>
      );
      nextLink1 = (
        <a>
          <i class="fa fa-chevron-right" aria-hidden="true"></i>
        </a>
      );
    }
    //  alert(this.props.loading);
    return (
      <>
        {!!this.props.loading ? (
          <div className="loadingphfdata">
            {this.props.loading == "loading..." ? (
              <Unauthorized text={this.props.loading} />
            ) : (
              <Unauthorized
                text={"You are unauthorized to access this!"}
                showbutton={true}
              />
            )}
          </div>
        ) : (
          <section className="main-page-content preview">
            <div className="container-flex-upper">
              <Link
                to={
                  "/project/preview2/" +
                  this.props.playlist.selectedPlaylist.project._id
                }
              >
                <div className="project-title">
                  <img src={projecticon} alt="" />
                  Project : {playlist.project.name}
                </div>
              </Link>

              <Link
                to={
                  "/project/" + this.props.playlist.selectedPlaylist.project._id
                }
              >
                {" "}
                <i className="fa fa-times" />
              </Link>
            </div>
            <div className="flex-container ">
              <div className="activity-bg left-vdo">
                <div className="flex-container-preview">
                  <div className="act-top-hader">
                    <div className="heading-wrapper">
                      <div className="main-heading">
                        {/* <span>You are Watching:</span> */}

                        {playlist.activities && playlist.activities.length
                          ? playlist.activities.filter(
                              (a) => a._id == resourceid
                            ).length > 0
                            ? playlist.activities.filter(
                                (a) => a._id == resourceid
                              )[0].title
                            : ""
                          : ""}
                      </div>
                      {/* <div className="sub-heading">
                  <span>From the playlist:</span>
                  {playlist ? playlist.title : ""}
                </div> */}
                    </div>
                  </div>
                  <div className="right-control vd-controls">
                    <div className="sliderbtn">
                      {previousLink1}
                      {nextLink1}
                    </div>

                    {/* <div className="dropdown">
                  <button
                    className="btn "
                    type="button"
                    id="dropdownMenuButton"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <i className="fa fa-ellipsis-v" aria-hidden="true"></i>
                  </button>
                  <div
                    className="dropdown-menu"
                    aria-labelledby="dropdownMenuButton"
                  >
                    {/* {nextLink}
                    {previousLink} }
                    <Link
                      to={
                        "/project/preview2/" +
                        this.props.playlist.selectedPlaylist.project._id
                      }
                      className="slide-control"
                    >
                      <i className="fa fa-share" aria-hidden="true"></i>
                      Back to Project
                    </Link>
                    <Link
                      to={
                        "/project/" +
                        this.props.playlist.selectedPlaylist.project._id
                      }
                      className="slide-control"
                    >
                      <i
                        className="fa fa-times-circle-o"
                        aria-hidden="true"
                      ></i>
                      Exit
                    </Link>
                  </div>
                </div> */}
                  </div>
                </div>
                <div className="main-item-wrapper">
                  <div className="item-container">
                    {/* <img src="/images/video-thumbnail.jpg" alt="video-thumbnail" className=""></img> */}
                    <Suspense fallback={<div>Loading</div>}>
                      <H5PPreview {...this.state} resourceid={resourceid} />
                    </Suspense>
                    {/* <div className="item-caption-bottom">
                  <p>
                    {playlist.activities && playlist.activities.length
                      ? playlist.activities.filter((a) => a._id == resourceid)
                          .length > 0
                        ? playlist.activities.filter(
                            (a) => a._id == resourceid
                          )[0].title
                        : ""
                      : ""}
                  </p>
                </div> */}
                  </div>
                </div>
              </div>
              <div className="right-sidegolf-info">
                <div className="back-header">
                  <div>
                    {" "}
                    <Link className="gobackbuttonpreview" to="/">
                      <i className="fa fa-undo" aria-hidden="true"></i>Back to
                      Projects
                    </Link>
                  </div>
                  <div className="dropdown">
                    <button
                      className="btn "
                      type="button"
                      id="dropdownMenuButton"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      <i className="fa fa-ellipsis-v" aria-hidden="true"></i>
                    </button>
                    <div
                      className="dropdown-menu"
                      aria-labelledby="dropdownMenuButton"
                    >
                      <ul className="">{activities1}</ul>
                    </div>
                  </div>

                  {/* <Link
                to={
                  "/project/preview2/" +
                  this.props.playlist.selectedPlaylist.project._id
                }
                className="link"
              >
                <img src="/images/right-arrow.png" className="back-arrow"></img>
                Back to {this.props.playlist.selectedPlaylist.project.name}
              </Link> */}
                </div>

                {/* <button
              className=""
              type="button"
              data-toggle="collapse"
              data-target="#collapseExample"
              aria-expanded="false"
              aria-controls="collapseExample"
            >
              <div className="sub-heading">
                <div className="line">
                  <span>From the playlist:</span>
                  {playlist ? playlist.title : ""}
                </div>
                <div>
                  <i className="fa fa-angle-up" aria-hidden="true"></i>
                </div>
              </div>
            </button> */}

                <div className="scrollDiv long">
                  <div className="watcher">
                    You are watching from <span>{playlist.title} </span>
                  </div>
                  <ul className="sliderscrollauto">{activities}</ul>
                </div>
              </div>
            </div>
          </section>
        )}
      </>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  loadPlaylistAction: (playlistid) => dispatch(loadPlaylistAction(playlistid)),
  LoadHP: (show) => dispatch(LoadHP(show)),
});

const mapStateToProps = (state) => {
  return {
    playlist: state.playlist,
    loading: state.playlist.loadingPH5,
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(PlaylistPreview)
);
