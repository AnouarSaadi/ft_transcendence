import Link from "next/link";
import { FaUserEdit, FaUserFriends } from "react-icons/fa";
import { IoMdTime } from "react-icons/io";
import { GetStaticPaths, GetStaticProps } from "next";
import { ParsedUrlQuery } from "querystring";
import { User } from "../../state/actions/userActions";

interface Props {
  user: User;
}

const ProfileHeader: React.FC<Props> = ({ user }) => {
  const { firstName, lastName, picture } = user;
  return (
    <div className="flex flex-col md:flex-row items-center md:my-16 my-10">
      <div className="md:mx-8 mb-2 md:mb-0">
        <img
          src={picture}
          className="bg-gray-300 w-36 h-36 md:h-56 md:w-56 rounded-full"
        />
      </div>
      <div className="flex md:flex-col items-center md:items-start md:justify-center px-4 md:mr-48 mb-2 md:mb-0">
        <h1 className="text-xl md:text-3xl font-bold">
          {firstName} {lastName}
        </h1>
        <p className='text-gray-400 lowercase text-lg font-mono'>@{firstName[0] + lastName}</p>
        <span className="hidden md:flex text-gray-500 pt-4 mb-2 items-center">
          <FaUserFriends className="w-6 h-8 mr-2" />
          <p className="text-lg font-medium">555 friends</p>
        </span>
        <span className="hidden md:flex text-gray-500 items-center">
          <IoMdTime className="w-6 h-8 mr-2" />
          <p className="text-lg font-medium">Joined Junuary, 2022</p>
        </span>
      </div>
      <div className="flex md:items-start md:mt-10">
        <Link href="/profile/edit">
          <button className="hover:scale-110 transition duration-300 cursor-pointer flex items-center text-md md:text-lg md:mx-4 py-1 md:py-2 px-6 bg-yellow-400 text-gray-800 rounded-md">
            <FaUserEdit className="w-6 h-8 mr-2" />
            Edit Profile
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ProfileHeader;
