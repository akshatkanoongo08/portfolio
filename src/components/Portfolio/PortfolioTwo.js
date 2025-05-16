import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const API_URL = `${process.env.REACT_APP_API_URL}`;


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
      const [projectsRes, categoriesRes] = await Promise.all([
        api.get("/projects"),
        api.get("/categories"),
      ]);
      setProjects(projectsRes.data);
      setCategories(categoriesRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load projects. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const getCategoryCount = (categoryId) => {
    if (!categoryId) return projects.length;
    return projects.filter(
      (project) =>
        project.categories &&
        Array.isArray(project.categories) &&
        project.categories.some((cat) => cat && cat._id === categoryId)
    ).length;
  };

  // Move filteredProjects to the outer scope
  const filteredProjects = activeCategory === "*"
    ? projects
    : projects.filter((project) =>
        project.categories &&
        Array.isArray(project.categories) &&
        project.categories.some((cat) => cat && cat._id === activeCategory)
      );

  if (loading) {
    return <div className="works explore-area pt-0">Loading...</div>;
  }

  if (error) {
    return <div className="works explore-area pt-0 text-danger">{error}</div>;
  }

  return (
    <section className="works explore-area portfolio-filter pt-0">
      <div className="container p-0">
        <div className="row justify-content-center text-center">
          <div className="col-12">
            <div
              className="btn-group filter-menu"
              role="group"
              aria-label="Basic radio toggle button group"
            >
              <div className="input-item d-flex">
                <div className="content">
                  <input
                    type="radio"
                    className="btn-check filter-btn"
                    name="shuffle-filter"
                    id="all"
                    value="*"
                    checked={activeCategory === "*"}
                    onChange={() => setActiveCategory("*")}
                  />
                  <label className="btn" htmlFor="all">
                    All
                  </label>
                </div>
                <span className="count">
                  {projects.length.toString().padStart(2, "0")}
                </span>
              </div>
              {categories.map((category) => (
                <div key={category._id} className="input-item d-flex">
                  <div className="content">
                    <input
                      type="radio"
                      className="btn-check filter-btn"
                      name="shuffle-filter"
                      id={category._id}
                      value={category._id}
                      checked={activeCategory === category._id}
                      onChange={() => setActiveCategory(category._id)}
                    />
                    <label className="btn" htmlFor={category._id}>
                      {category.label}
                    </label>
                  </div>
                  <span className="count">
                    {getCategoryCount(category._id).toString().padStart(2, "0")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="row filter-items items inner">
          {filteredProjects.map((item) => (
            <div
              key={item._id}
              className="col-12 col-lg-4 item filter-item"
              data-groups={JSON.stringify(item.categories.map((cat) => cat._id))}
            >
              <div className="card portfolio-item layout-2 scale has-shadow">
                <div className="image-holder">
                  <Link to={`/portfolio/${item._id}`} className="card-thumb">
                    <img
                      src={
                        item.image && item.image.url
                          ? item.image.url.startsWith("http")
                            ? item.image.url
                            : `${API_URL}${item.image.url}`
                          : "/img/placeholder.jpg"
                      }
                      alt={item.title}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/img/placeholder.jpg";
                      }}
                    />
                  </Link>
                </div>
                <div className="card-content p-2">
                  <div className="heading">
                    <h4 className="title mt-2 mt-md-3 mb-3">
                      <Link to={`/portfolio/${item._id}`}>{item.title}</Link>
                    </h4>
                    <div className="show-project">
                      <div className="card-terms">
                        {item.categories.map((cat) => (
                          <Link
                            key={cat._id}
                            className="terms badge"
                            to="/portfolio"
                          >
                            {cat.label}
                          </Link>
                        ))}
                      </div>
                      <div className="project-link">
                        <Link to={`/portfolio/${item._id}`}>Show Project</Link>
                      </div>
                    </div>
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