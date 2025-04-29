import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const API_URL = "http://localhost:5000";

const PortfolioOne = () => {
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get("/projects?limit=4");
        const items = Array.isArray(response.data) ? response.data : [];
        console.log('Fetched projects:', items);
        setPortfolioItems(items);
      } catch (err) {
        console.error("Error fetching portfolio data:", err);
        setError("Failed to load projects");
        setPortfolioItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return <div className="works explore-area pt-0">Loading...</div>;
  }

  if (error) {
    return <div className="works explore-area pt-0 text-danger">{error}</div>;
  }

  // Show only featured projects
  const featuredItems = Array.isArray(portfolioItems)
    ? portfolioItems.filter((item) => item.featured === true)
    : [];

  return (
    <div className="row">
      <div className="stack-wrapper">
        {featuredItems.map((item) => (
          <div className="stack-item" key={item._id}>
            <div className="card portfolio-item layout-2 scale has-shadow">
              <div className="image-holder">
                <Link className="card-thumb" to={`/portfolio/${item._id}`}>
                  <img
                    src={
                      item.image && item.image.url
                        ? item.image.url.startsWith("http")
                          ? item.image.url
                          : `${API_URL}${item.image.url}`
                        : "/img/placeholder.jpg"
                    }
                    alt={item.title || "Project"}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/img/placeholder.jpg";
                    }}
                  />
                </Link>
                <div className="card-overlay">
                  <div className="heading">
                    <h4 className="title mt-2 mt-md-3 mb-3">
                      {item.title || "Untitled Project"}
                    </h4>
                    <div className="show-project">
                      <div className="card-terms">
                        {item.categories &&
                          Array.isArray(item.categories) &&
                          item.categories.map((category) => (
                            <Link
                              key={category._id}
                              className="terms badge outlined"
                              to="/portfolio"
                            >
                              {category.name}
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default PortfolioOne;