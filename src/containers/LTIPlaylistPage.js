import React from "react";
import { connect } from "react-redux";

import { withRouter } from 'react-router-dom';



export class LTIPlaylistPage extends React.Component {
  constructor(props) {
    super(props);
  }
 

  componentDidMount() {
    //scroll to top
    window.scrollTo(0, 0);
  }

  
  render() {
    return (
      <h1>Playlist 1</h1>
    );
  }
}

const mapDispatchToProps = dispatch => ({
});

const mapStateToProps = (state) => {
  return {
    
  };
}




export default withRouter(connect(mapStateToProps,
  mapDispatchToProps)(LTIPlaylistPage))