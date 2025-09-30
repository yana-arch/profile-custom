import React from 'react';
import { ProfileData } from '../types';
import ScrollView from './profile/layouts/ScrollView';
import TabView from './profile/layouts/TabView';
import SlideView from './profile/layouts/SlideView';

interface ProfileProps {
  data: ProfileData;
}

const Profile: React.FC<ProfileProps> = React.memo(({ data }) => {
  switch (data.settings.layout) {
    case 'tab':
      return <TabView data={data} />;
    case 'slide':
      return <SlideView data={data} />;
    case 'scroll':
    default:
      return <ScrollView data={data} />;
  }
});

Profile.displayName = 'Profile';

export default Profile;
