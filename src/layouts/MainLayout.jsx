import React from 'react';
import { Outlet } from 'react-router-dom';
import ScrollToTop from '../shared/ScrollToTop';
import Navbar from '../shared/Navbar';
import FooterPage from '../shared/FooterPage';

export default function MainLayout() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main className="pt-[4.25rem] md:pt-[4.75rem]">
        <Outlet />
      </main>
      <FooterPage />
    </>
  );
}
