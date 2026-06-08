import type {IconType} from "react-icons";
import {MdOutlineSpaceDashboard} from "react-icons/md";
import {HiOutlineUserGroup} from "react-icons/hi2";
import {GrTrophy} from "react-icons/gr";

export interface RootPage {
  path: string;
  title: string;
  internal: boolean;
  inSidebar: boolean;
  icon: IconType;
  relativePaths: string[];
}

export const pageDashboard: RootPage = {
  path: "/dashboard",
  title: "Dashboard",
  internal: true,
  inSidebar: true,
  icon: MdOutlineSpaceDashboard,
  relativePaths: ["/dashboard"],
}

export const pageClubs: RootPage = {
  path: "/clubs",
  title: "Clubs",
  internal: true,
  inSidebar: true,
  icon: HiOutlineUserGroup,
  relativePaths: ["/clubs", "/club"],
}

export const pageTournaments: RootPage = {
  path: "/tournaments",
  title: "Tournaments",
  internal: true,
  inSidebar: true,
  icon: GrTrophy,
  relativePaths: ["/tournaments", "/tournament", "/round"],
}

export const rootPages: RootPage[] = [pageDashboard, pageClubs, pageTournaments];