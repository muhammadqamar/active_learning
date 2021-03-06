import React from "react";
import { Link } from "react-router-dom";
import ProjectPreviewModal from "./ProjectPreviewModal";
import "./ProjectCard.scss";
import logo from "../images/logo.svg";
const ProjectCard = (props) => (
  <div className="col-md-3 check">
    <div className="program-tile">
      <div className="program-thumb">
        <Link to={"/project/" + props.project._id}>
          {props.project.thumb_url ? (
            <div
              className="project-thumb"
              style={{
                backgroundImage:
                  "url(" +
                  global.config.laravelAPIUrl +
                  props.project.thumb_url +
                  ")",
              }}
            ></div>
          ) : null}
        </Link>
      </div>
      <div className="program-content">
        <div>
          <div className="row">
            <div className="col-md-10">
              <h3 className="program-title">
                <Link to={"/project/" + props.project._id}>
                  {props.project.name}
                </Link>
              </h3>
            </div>
            <div className="col-md-2">
              <div className="dropdown pull-right check">
                <button
                  className="btn project-dropdown-btn"
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
                  <Link
                    className="dropdown-item"
                    to={"/project/preview2/" + props.project._id}
                  >
                    <i className="fa fa-eye" aria-hidden="true"></i> Preview
                  </Link>
                  <Link
                    className="dropdown-item"
                    to={"/project/create/" + props.project._id}
                  >
                    <i className="fa fa-pencil" aria-hidden="true"></i> Edit
                  </Link>
                  <a
                    className="dropdown-item"
                    onClick={(e) => {
                      Swal.fire({
                        title: "STAY TUNED!",
                        text: "COMING SOON",
                        imageUrl: logo,
                        imageWidth: 400,
                        imageHeight: 200,
                        imageAlt: "Custom image",
                      });
                    }}
                  >
                    <i className="fa fa-share" aria-hidden="true"></i> Send To
                  </a>
                  {/*<a
									className="dropdown-item"
									href="#"
									onClick={(e) => {
										e.preventDefault();
										window.open(
											"/api/download/project/" +
												props.project._id
										);
									}}
								>
									<i
										className="fa fa-cloud-download"
										aria-hidden="true"
									></i>{" "}
									Executable
								</a> */}
                  <a
                    className="dropdown-item"
                    onClick={() =>
                      props.showDeletePopupAction(
                        props.project._id,
                        props.project.name,
                        "Project"
                      )
                    }
                  >
                    <i className="fa fa-times-circle-o" aria-hidden="true"></i>{" "}
                    Delete
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="lessons-duration">
            <div className="row">
              <div className="col-md-12">
                <p>
                  {props.project.description &&
                  props.project.description.length > 130
                    ? props.project.description.substring(0, 130) + " ..."
                    : props.project.description}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="buttonbottom">
          <Link to={"/project/preview2/" + props.project._id}>
            <i className="fa fa-eye" aria-hidden="true"></i> Preview
          </Link>
          <Link to={"/project/" + props.project._id}>
            <i className="fa fa-cubes" aria-hidden="true"></i> Build
          </Link>

          <Link to={"/project/create/" + props.project._id}>
            <i className="fa fa-pencil" aria-hidden="true"></i> Edit
          </Link>
        </div>
      </div>
    </div>
    {props.showPreview ? (
      <ProjectPreviewModal key={props.project._id} project={props.project} />
    ) : (
      ""
    )}
  </div>
);

export default ProjectCard;
