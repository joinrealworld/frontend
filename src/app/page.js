"use client";

import OnBoard from '@/components/OnBoard/index';
import connect from '@/components/ConnectStore/connect';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

function Home(props) {

  const router = useRouter();
  console.log("props: ", props);

  useEffect(() => {
    if (props?.user?.isLoggedIn) {
      router.replace('/courses');
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