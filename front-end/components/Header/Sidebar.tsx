import { FaTimes } from "react-icons/fa";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators } from "../../state";
import { State } from "../../state/reducers";

const Sidebar = () => {
  const dispatch = useDispatch();
  const { closeSidebar } = bindActionCreators(actionCreators, dispatch);
  const { isSidebarOpen } = useSelector((state: State) => state.headerReducer);

  return (
    <aside
      className={`px-2 h-screen py-4 w-full bg-black bg-opacity-75 text-yellow-400 ${
        isSidebarOpen ? "show-sidebar sidebar" : "sidebar"
      }`}
    >
      <div className="text-2xl ml-4 mt-4 font-bold text-yellow-500">
        <h1>LOGO</h1>
      </div>
      <button
        type="button"
        className="absolute text-white right-3 top-3"
        onClick={closeSidebar}
      >
        <FaTimes size="3rem" />
      </button>
      <ul className="flex flex-col mt-10">
        <li>
          <Link href="/dashboard">
            <button
              className="rounded-lg text-left w-full hover:text-yellow-400 hover:bg-gray-600 transition duration-300 cursor-pointer text-2xl font-medium mx-2 py-4 px-2"
              onClick={closeSidebar}
              type="button"
            >
              Dashboard
            </button>
          </Link>
        </li>
        <li>
          <Link href="/">
            <button
              className="rounded-lg text-left w-full hover:text-yellow-400 hover:bg-gray-600 transition duration-300 cursor-pointer text-2xl font-medium mx-2 py-4 px-2"
              onClick={closeSidebar}
              type="button"
            >
              Home
            </button>
          </Link>
        </li>
        <li>
          <Link href="/channels">
            <button
              className="rounded-lg text-left w-full hover:text-yellow-400 hover:bg-gray-600 transition duration-300 cursor-pointer text-2xl font-medium mx-2 py-4 px-2"
              onClick={closeSidebar}
              type="button"
            >
              Channels
            </button>
          </Link>
        </li>
        <li>
          <Link href="/game">
            <button
              className="rounded-lg text-left w-full hover:text-yellow-400 hover:bg-gray-600 transition duration-300 cursor-pointer text-2xl font-medium mx-2 py-4 px-2"
              onClick={closeSidebar}
              type="button"
            >
              Game
            </button>
          </Link>
        </li>
        <li>
          <Link href="/about">
            <button
              className="rounded-lg text-left w-full hover:text-yellow-400 hover:bg-gray-600 transition duration-300 cursor-pointer text-2xl font-medium mx-2 py-4 px-2"
              onClick={closeSidebar}
              type="button"
            >
              about
            </button>
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;