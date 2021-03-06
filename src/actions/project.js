import axios from "axios";
import {
  SHOW_CREATE_PROJECT_MODAL,
  SHOW_CREATE_PROJECT_SUBMENU,
  CREATE_PROJECT,
  LOAD_MY_PROJECTS,
  LOAD_PROJECT,
  DELETE_PROJECT,
  PAGE_LOADING,
  PAGE_LOADING_COMPLETE,
  UPDATE_PROJECT,
  UPLOAD_PROJECT_THUMBNAIL,
  SHARE_PROJECT,
  PROJECT_THUMBNAIL_PROGRESS,
  SHOW_USER_SUB_MENU,
  CLOSE_MENU,
  SHOW_LMS,
} from "../constants/actionTypes";
import { editResource } from "./resource";
import loaderimg from "../images/loader.svg";
// Publishes the project in LEARN
export const shareProject = (project) => ({
  type: SHARE_PROJECT,
  project: project,
});

// Publishes the project in LEARN
export const shareProjectAction = (projectId) => {
  return async (dispatch) => {
    const { token } = JSON.parse(localStorage.getItem("auth"));
    const response = axios
      .post(
        "/api/shareproject",
        {
          projectId,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .then((response) => {
        if (response.data.status == "error" || response.status != 200) {
          console.log("Error: " + response.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

// Loads a specific project
export const loadProject = (project) => ({
  type: LOAD_PROJECT,
  project: project,
});

//gets the data of project based on project id from the server
// populates the data to the edit form
export const loadProjectAction = (projectId) => {
  return async (dispatch) => {
    const { token } = JSON.parse(localStorage.getItem("auth"));
    const response = await axios.post(
      "/api/loadproject",
      {
        projectId,
      },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    if (response.data.status == "success")
      dispatch(loadProject(response.data.data.project));
  };
};

//when user clicks on header plus button it opens dropdown menu

export const showCreateProjectSubmenu = () => ({
  type: SHOW_CREATE_PROJECT_SUBMENU,
});

export const showUserSubMenu = () => ({
  type: SHOW_USER_SUB_MENU,
});

export const closeMenu = () => ({
  type: CLOSE_MENU,
});

export const closeMenuAction = () => {
  return async (dispatch) => {
    try {
      dispatch(closeMenu());
    } catch (e) {
      throw new Error(e);
    }
  };
};

export const showCreateProjectSubmenuAction = () => {
  return async (dispatch) => {
    try {
      dispatch(showCreateProjectSubmenu());
    } catch (e) {
      throw new Error(e);
    }
  };
};

export const showUserSubMenuAction = () => {
  return async (dispatch) => {
    try {
      dispatch(showUserSubMenu());
    } catch (e) {
      throw new Error(e);
    }
  };
};

// opens a project modal both for new

export const showCreateProjectModal = () => ({
  type: SHOW_CREATE_PROJECT_MODAL,
});

export const showCreateProjectModalAction = () => {
  return async (dispatch) => {
    try {
      dispatch(showCreateProjectModal());
    } catch (e) {
      throw new Error(e);
    }
  };
};

export const createProject = (projectdata) => ({
  type: CREATE_PROJECT,
  projectdata,
});

//This method sends two different request based on request parameter
//request parameter can be create / update
// if request = create it sends request to create a Project
//if request = update it sends request to udpate the resource

export const createUpdateProject = async (
  url,
  request,
  name,
  description,
  thumb_url
) => {
  try {
    const { token } = JSON.parse(localStorage.getItem("auth"));

    const data = {
      name,
      description,
      thumb_url,
    };
    const config = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    var response = {};
    if (request == "create") {
      response = await axios.post(url, data, config);
    } else if (request == "update") {
      response = await axios.put(url, data, config);
    }

    if (response.data.status == "success") {
      const projectdata = {
        _id: response.data.data._id,
        name: response.data.data.name,
        thumb_url: response.data.data.thumb_url,
        userid: response.data.data.userid,
      };
      return projectdata;
    }
  } catch (e) {
    throw new Error(e);
  }
};

//create project request
//@params, name, description, thumb_url is sent to the server
//upon success redux states appends the project to already created projects

export const createProjectAction = (name, description, thumb_url) => {
  return async (dispatch) => {
    try {
      const projectdata = await createUpdateProject(
        "/api/project",
        "create",
        name,
        description,
        thumb_url
      );
      dispatch(createProject(projectdata));
    } catch (e) {
      throw new Error(e);
    }
  };
};

export const updateProject = (projectdata) => ({
  type: UPDATE_PROJECT,
  projectdata,
});

//edit project data is sent to the server for updates

export const updateProjectAction = (
  projectid,
  name,
  description,
  thumb_url
) => {
  return async (dispatch) => {
    try {
      const projectdata = await createUpdateProject(
        "/api/project/" + projectid,
        "update",
        name,
        description,
        thumb_url
      );
      dispatch(updateProject(projectdata));
    } catch (e) {
      throw new Error(e);
    }
  };
};

//loadLMS

//load projects of current logged in user

//LMS action starts from here
export const LoadLMS = () => {
  return async (dispatch) => {
    try {
      const { token } = JSON.parse(localStorage.getItem("auth"));
      const response = await axios.get(
        global.config.laravelAPIUrl + "go/lms-manager/get-user-settings",

        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      dispatch(loadLMSdata(response.data.data));
      console.log("response", response);
    } catch (e) {
      throw new Error(e);
    }
  };
};

export const ShareLMS = (playlistId, LmsTokenId, lmsName, lmsUrl) => {
  const { token } = JSON.parse(localStorage.getItem("auth"));

  Swal.fire({
    title: `If this playlist is not available in your ${lmsName} LMS, we will add it to the course or name of the course.`,
    text: "Would you like to proceed?",

    showCancelButton: true,
    confirmButtonColor: "#5952c6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Continue",
  }).then((result) => {
    if (result.value) {
      Swal.fire({
        iconHtml: loaderimg,
        title: "Sharing....",

        showCancelButton: false,
        showConfirmButton: false,
        allowOutsideClick: false,
      });

      axios
        .post(
          global.config.laravelAPIUrl + `/go/${lmsName}/publish/playlist`,
          { setting_id: LmsTokenId, playlist_id: playlistId },
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        )
        .then((res) => {
          console.log(res);
          if (res.data.status == "success") {
            Swal.fire({
              icon: "success",
              title: "Shared!",
              confirmButtonColor: "#5952c6",
              html: `Your playlist has been submitted to <a target="_blank" href="${lmsUrl}"> ${lmsUrl}</a>`,
              //   text: `Yo'ur playlist has been submitted to ${lmsUrl}`,
            });
          }
        })
        .catch((e) => {
          Swal.fire({
            confirmButtonColor: "#5952c6",
            icon: "error",
            text: "Something went wrong, Kindly try again",
          });
        });
    }
  });
};

export const loadLMSdata = (lmsInfo) => ({
  type: SHOW_LMS,
  lmsInfo,
});

export const changeloader = (change) => {
  return {
    type: CHANGE_LOADING,
    change,
  };
};

//LMS action ENDS from here

export const loadMyProjects = (projects) => ({
  type: LOAD_MY_PROJECTS,
  projects,
});

//load projects of current logged in user

export const loadMyProjectsAction = () => {
  return async (dispatch) => {
    try {
      dispatch({
        type: PAGE_LOADING,
      });
      const { token } = JSON.parse(localStorage.getItem("auth"));
      const response = await axios.post(
        global.config.laravelAPIUrl + "/myprojects",
        {},
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      if (response.data.status == "success") {
        let projects = [];
        projects = response.data.data.projects;

        dispatch(loadMyProjects(projects));
        dispatch({
          type: PAGE_LOADING_COMPLETE,
        });
      }
    } catch (e) {
      dispatch({
        type: PAGE_LOADING_COMPLETE,
      });
      throw new Error(e);
    }
  };
};

export const deleteProject = (projectid) => ({
  type: DELETE_PROJECT,
  projectid,
});

//deletes project
export const deleteProjectAction = (projectid) => {
  return async (dispatch) => {
    try {
      const response = await axios.delete(`/api/project/${projectid}`, {
        projectid,
      });

      if (response.data.status == "success") {
        dispatch(deleteProject(projectid));
      }
    } catch (e) {
      throw new Error(e);
    }
  };
};

export const uploadProjectThumbnail = (thumb_url) => ({
  type: UPLOAD_PROJECT_THUMBNAIL,
  thumb_url,
});

export const projectThumbnailProgress = (progress) => ({
  type: PROJECT_THUMBNAIL_PROGRESS,
  progress,
});

//uploads project thumbnail
export const uploadProjectThumbnailAction = (formData) => {
  return async (dispatch) => {
    try {
      const config = {
        headers: {
          "content-type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          dispatch(
            projectThumbnailProgress(
              "Uploaded progress: " +
                Math.round((progressEvent.loaded / progressEvent.total) * 100) +
                "%"
            )
          );
        },
      };
      return axios
        .post(
          global.config.laravelAPIUrl + "/post-upload-image",
          formData,
          config
        )
        .then((response) => {
          dispatch(uploadProjectThumbnail(response.data.data.guid));
        });
    } catch (e) {
      throw new Error(e);
    }
  };
};
