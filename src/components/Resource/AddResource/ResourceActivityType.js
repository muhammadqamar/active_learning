import React, { useEffect } from "react";
import { connect } from "react-redux";
import { fadeIn } from "react-animations";
import axios from "axios";
import styled, { keyframes } from "styled-components";

import { Field, reduxForm, formValueSelector } from "redux-form";

import {
  showSelectActivityAction,
  onChangeActivityTypeAction,
} from "./../../../actions/resource";

import "./AddResource.scss";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  withRouter,
} from "react-router-dom";
import AddResourceSidebar from "./AddResourceSidebar";

const fadeAnimation = keyframes`${fadeIn}`;

const FaceDiv = styled.div`
  animation: 1s ${fadeAnimation};
`;

// const activity_types = [
//   {
//     id:1,
//     title:'Interactive',
//     icon: '/images/course-presentation.png',
//     overlayIcon:'/images/course-presentation-overlay.png'
//   },
//   {
//     id:2,
//     title:'Multimedia',
//     icon: '/images/multimedia-icon.png',
//     overlayIcon:'/images/multimedia-icon-overlay.png'
//   },
//   {
//     id:3,
//     title:'Questions',
//     icon: '/images/question-icon.png',
//     overlayIcon:'/images/question-icon-overlay.png'
//   },
//   {
//     id:4,
//     title:'Social Media',
//     icon: '/images/share-icon.png',
//     overlayIcon:'/images/share-icon-overlay.png'
//   }
// ];

const onSubmit = async (values, dispatch, props) => {
  try {
    props.onChangeActivityTypeAction();
    let data = values.activityType;
    props.showSelectActivityAction(data);
  } catch (e) {
    console.log(e.message);
  }
};
const required = (value) => {
  return value ? undefined : "* Required";
};

const renderResourceActivityType = ({
  input,
  label,
  type,
  meta: { touched, error, warning },
}) => (
  <>
    <input {...input} type={type} />
    {touched &&
      ((error && <span className="validation-error">{error}</span>) ||
        (warning && <span>{warning}</span>))}
  </>
);

let ResourceActivityType = (props, showSelectActivityAction) => {
  const [activity_types, setActivityTypes] = React.useState([]);
  useEffect(() => {
    // get activity types
    const { token } = JSON.parse(localStorage.getItem("auth"));
    axios
      .get(global.config.laravelAPIUrl + "/api/activity-types", {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((response) => {
        setActivityTypes(response.data.data);
      });
  }, []);
  const { handleSubmit, load, pristine, reset, submitting } = props;
  const activity_typesContent = activity_types.map((activity, i) => (
    <div className="col-md-3" key={i}>
      <label className="activity-label">
        <Field
          name="activityType"
          component={renderResourceActivityType}
          type="radio"
          value={"" + activity._id}
          onChange={(id) => props.onChangeActivityTypeAction(activity._id)}
          validate={[required]}
        />

        <div className="activity-item">
          <div
            className="activity-img"
            style={{
              backgroundImage:
                "url(" + global.config.laravelAPIUrl + activity.image + ")",
            }}
          ></div>
          <div className="activity-content">
            <span>{activity.title}</span>
          </div>
        </div>
      </label>
    </div>
  ));

  return (
    <>
      <div className="row">
        <div className="col-md-3">
          <AddResourceSidebar {...props} />
        </div>
        <div className="col-md-9">
          <div className="resource-activity">
            <FaceDiv>
              <div className="row">
                <div className="col-md-12">
                  <h2 className="title">Pick Activity Type</h2>
                  <div className="activity-content">
                    <p>
                      Create memorable learning experiences from one of the
                      activity types below:
                    </p>
                  </div>
                </div>
              </div>

              <form
                className="row meta-form"
                onSubmit={handleSubmit}
                autoComplete="off"
              >
                {activity_typesContent}
                {/* <div className="col-md-12">
                  <button type="submit" className="add-resource-continue-btn">
                    Continue
                  </button>
                </div> */}
              </form>
            </FaceDiv>
          </div>
        </div>
      </div>
    </>
  );
};

ResourceActivityType = reduxForm({
  form: "activityTypeForm",
  enableReinitialize: true,
  onSubmit,
  onChange: (values, dispatch, props, previousValues) => {
    // props.onChangeActivityTypeAction(values.activityType);
    let data = values.activityType;
    props.showSelectActivityAction(data);
    // props.submit();
  },
})(ResourceActivityType);

const mapDispatchToProps = (dispatch) => ({
  showSelectActivityAction: (activityType) =>
    dispatch(showSelectActivityAction(activityType)),
  onChangeActivityTypeAction: (activityTypeId) =>
    dispatch(onChangeActivityTypeAction(activityTypeId)),
});

const mapStateToProps = (state) => {
  return {
    resource: state.resource,
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ResourceActivityType)
);
