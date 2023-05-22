import { useState } from 'react';
import { User } from 'src/models/user';
import { useShortenAddressOrEnsName } from 'src/utils/Web3Utils';

export default function UserProfile(): User {
  
  const { shortenAddressOrEnsName } = useShortenAddressOrEnsName();
  const shortenedAddressOrName = shortenAddressOrEnsName();
  const [cover, setCover] = useState('/static/images/placeholders/covers/5.jpg');

  const user: User = {
    name: shortenedAddressOrName,
    coverImg: cover,
    avatar: '/static/images/avatars/4.jpg',
    description: "Description Profile",
    jobTitle: 'Web Developer',
    location: 'Barcelona, Spain',
    social: '465',
  };

  return user;
}
