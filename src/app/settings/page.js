"use client";

import { useEffect } from 'react';

import './styles.css';
import SettingsMenu, { SettingsMenuOptions } from "@/components/SettingsMenu";
import connect from '@/components/ConnectStore/connect';
import { useRouter, usePathname } from 'next/navigation';

function Settings(props) {

  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    const navigateToAccount = () => {
      if (!props.user.isLoggedIn) {
        router.push('/login');
      } else {
        if (path == '/settings') {
          router.replace(SettingsMenuOptions[0].Route);
        }
      }
    }
    navigateToAccount();
  }, []);

  return (
    <div className='container-kab38c'>
      <SettingsMenu {...props} />
    </div>
  );
}

export default connect(Settings);
