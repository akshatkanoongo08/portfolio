import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import "./PortfolioTwo.css";

const API_URL = 'http://localhost:5000'; // Match your backend URL

const PortfolioTwo = () => {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("*");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch projects and categories in parallel
      const [projectsRes, categoriesRes] = await Promise.all([
        api.get('/projects'),
        api.get('/categories')
      ]);

      setProjects(projectsRes.data);
      setCategories(categoriesRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load projects. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryCount = (categoryId) => {
    if (!categoryId) return 0;
    return projects.filter(project => 
      project.categories && 
      Array.isArray(project.categories) && 
      project.categories.some(cat => cat && cat._id === categoryId)
    ).length;
  };

  const filteredProjects = activeCategory === "*" 
    ? projects 
    : projects.filter(project => 
        project.categories && 
        Array.isArray(project.categories) && 
        project.categories.some(cat => cat && cat._id === activeCategory)
      );

  if (loading) {
    return <div className="section-padding">Loading...</div>;
  }

  if (error) {
    return <div className="section-padding text-danger">{error}</div>;
  }

  return (
    <section className="section-padding">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <ul className="portfolio-filter list-inline">
              <li
                className={activeCategory === "*" ? "list-inline-item current" : "list-inline-item"}
                onClick={() => setActiveCategory("*")}
              >
                All
                <span className="filter-count">({projects.length})</span>
              </li>
              {categories && categories.map((category) => (
                <li
                  key={category._id}
                  className={
                    activeCategory === category._id
                      ? "list-inline-item current"
                      : "list-inline-item"
                  }
                  onClick={() => setActiveCategory(category._id)}
                >
                  {category.label}
                  <span className="filter-count">
                    ({getCategoryCount(category._id)})
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="portfolio-items row">
          {filteredProjects && filteredProjects.map((item) => (
            <div
              key={item._id}
              className="col-lg-4 col-md-6 grid-item"
            >
              <div className="portfolio-item">
                <Link to={`/portfolio/${item._id}`} className="portfolio-image">
                <img
  src={
    item.image && item.image.url
      ? item.image.url.startsWith('http')
        ? item.image.url
        : `${API_URL}${item.image.url}`
      : '/img/placeholder.jpg'
  }
  alt={item.title}
  onError={e => {
    e.target.onerror = null;
    e.target.src = '/img/placeholder.jpg';
  }}
/>
                </Link>
                <div className="portfolio-content">
                  <h3 className="portfolio-title">
                    <Link to={`/portfolio/${item._id}`}>{item.title}</Link>
                  </h3>
                  <div className="portfolio-categories">
                    {item.categories && item.categories.map((cat, index) => (
                      <span key={cat._id}>
                        {cat.label}
                        {index < item.categories.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortfolioTwo;
