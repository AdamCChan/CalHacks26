"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const pathname = usePathname();

  const iconClass = (path: string) =>
    pathname === path ? "icon active" : "icon";

  const addCapsulePath = "/addcapsule";
  const dashboardPath = "/landing"; // change to dashboard later
  const userPath = "/user";
  const friendsPath = "/friends";
  const settingsPath = "/settings";

  const assetsFolderPath = "/assets";

  return (
    <footer className="footer">
      <Link href={addCapsulePath}>
        <Image
          src={assetsFolderPath + "/add capsule.png"}
          alt=""
          width={28}
          height={28}
          className={iconClass(addCapsulePath)}
        />
      </Link>

      <Link href={dashboardPath}>
        <Image
          src={assetsFolderPath + "/capsule search.png"}
          alt=""
          width={28}
          height={28}
          className={iconClass(dashboardPath)}
        />
      </Link>

      <Link href={userPath}>
        <Image
          src={assetsFolderPath + "/user.png"}
          alt=""
          width={28}
          height={28}
          className={iconClass(userPath)}
        />
      </Link>
      
      <Link href={friendsPath}>
        <Image
          src={assetsFolderPath + "/social network.png"}
          alt=""
          width={28}
          height={28}
          className={iconClass(friendsPath)}
        />
      </Link>
      
      <Link href={settingsPath}>
        <Image
          src={assetsFolderPath + "/settings.png"}
          alt=""
          width={28}
          height={28}
          className={iconClass(settingsPath)}
        />
      </Link>
      
    </footer>
  );
}
