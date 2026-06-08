import React from "react";
import {HEADER_HEIGHT} from "#/components/Header.tsx";

export default function InternalPage({ children }: { children: React.ReactNode }) {
  return (
    <div className="page column w-100vw max-w-[1440px] px-2 pt-4 pb-8 mx-auto" style={{ minHeight: `calc(100vh - ${HEADER_HEIGHT}px)`, marginTop: HEADER_HEIGHT }}>
      {children}
    </div>
  )
}