"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import OnBoard from '@/components/OnBoard/index';
import connect from '@/components/ConnectStore/connect';

function Home(props) {

  const router = useRouter();
  console.log("props: ", props);

  useEffect(() => {
    if (props?.user?.isLoggedIn) {
      router.replace('/courses?tab=1'); // navigate to categories tab
    }
  }, []);

  if (!props?.user?.isLoggedIn) {
    return (
      <OnBoard  {...props} />
    );
  }
  return null;
}

export default connect(Home);