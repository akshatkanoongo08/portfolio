import React from "react";
import { Routes, Route } from "react-router-dom";

// Importing all the themes
import ThemeOne from "../themes/theme-one";
import Portfolio from "../themes/portfolio";
import PortfolioSingle from "../themes/portfolio-single";
import About from "../themes/about";
import Blog from "../themes/blog";
import BlogSingle from "../themes/blog-single";
import Contact from "../themes/contact";
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import ProjectsManager from '../components/Dashboard/ProjectsManager';
import CategoriesManager from '../components/Dashboard/CategoriesManager';
import Login from '../components/Dashboard/Login';

const MyRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ThemeOne />} />
      <Route path="/portfolio" element={<Portfolio />} />
      <Route path="/portfolio/:id" element={<PortfolioSingle />} />
      <Route path="/about" element={<About />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog-single" element={<BlogSingle />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route path="projects" element={<ProjectsManager />} />
        <Route path="categories" element={<CategoriesManager />} />
      </Route>
    </Routes>
  );
};

export default MyRoutes;
