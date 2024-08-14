import Header from '@/components/landing-page/header';
import React from 'react'

interface LayoutProps{
    children:React.ReactNode;  // The child components to render within the layout.  The layout should be flexible enough to accommodate any number of child components.  For example, a layout might have a header, main content area, and footer.  The layout should also be able to change based on the user's preferences, such as dark mode.  The layout should also be able to handle different screen sizes, such as mobile, tablet, and desktop.  The layout should also be able to handle different screen orientations, such as portrait and landscape.  The layout should also be able to handle different screen resolutions, such as high-resolution and low-resolution.  The layout should also be able to handle different screen densities, such as high-density and low-density.  The layout should also be able to handle different screen orientations, such as portrait and landscape.  The layout should also be able to handle different screen resolutions
}

const HomePageLayout = ({children}:LayoutProps) => {
  return (
    <main>
      <Header />
      {children}
    </main>
  )
}

export default HomePageLayout