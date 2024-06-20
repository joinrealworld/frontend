"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import OnBoard from '@/components/OnBoard/index';
import connect from '@/components/ConnectStore/connect';
import { apiURL } from '@/constant/global';

function Home(props) {

  const router = useRouter();

  const handleTabClose = async () => {
    if (props?.user?.isLoggedIn) {
      const response = await fetch(apiURL + 'api/v1/channel/fetch/users', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + props.user.authToken
        }
      });
      const rsp = await response.json();
      if (response.status >= 200 && response.status < 300) {
      }
    }
  };
  useUnload(handleTabClose);

  useEffect(() => {
    if (props?.user?.isLoggedIn) {
      router.replace('/chat'); // navigate to chat
    }
  }, []);

  if (!props?.user?.isLoggedIn) {
    return (
      <OnBoard  {...props} />
    );
  }
  return null;
}

const useUnload = (callback) => {
  useEffect(() => {
    const handleUnload = (event) => {
      callback();
      event.returnValue = ''; // Necessary for some browsers to trigger the dialog
    };

    window.addEventListener('beforeunload', handleUnload);
    window.addEventListener('unload', callback); // Ensuring it works across browsers

    return () => {
      window.removeEventListener('beforeunload', handleUnload);
      window.removeEventListener('unload', callback);
    };
  }, [callback]);
};

export default connect(Home);