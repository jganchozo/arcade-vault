"use client";

import { useRouter } from "next/navigation";

/** A <button> that navigates, so server pages keep the templates' button markup and metrics. */
export function NavButton({
  href,
  className,
  children,
}: {
  href: string;
  className: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  return (
    <button className={className} onClick={() => router.push(href)}>
      {children}
    </button>
  );
}
