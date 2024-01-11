"use client";

import OnBoard from '@/components/OnBoard/index';
import HomePage from '@/components/HomePage/index';
import { connect } from '@/components/ConnectStore/connect';

function Home(props) {

  if (props?.user?.isLoggedIn) {
    return (
      <HomePage {...props} />
    );
  } else {
    return (
      <OnBoard  {...props} />
    );
  }
}

export default connect(Home);