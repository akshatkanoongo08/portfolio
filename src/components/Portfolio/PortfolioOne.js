import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const API_URL = 'http://localhost:5000'; // Match your backend URL

const PortfolioOne = () => {
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get("/projects?limit=4");
        // Ensure we have an array of items
        const items = Array.isArray(response.data) ? response.data : [];
        setPortfolioItems(items);
      } catch (err) {
        console.error("Error fetching portfolio data:", err);
        setError("Failed to load projects");
        setPortfolioItems([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return <div className="section-padding">Loading...</div>;
  }

  if (error) {
    return <div className="section-padding text-danger">{error}</div>;
  }

  // Ensure portfolioItems is always an array
  const items = Array.isArray(portfolioItems) ? portfolioItems : [];

  return (
    <div className="row">
      <div className="stack-wrapper">
        {items.map((item) => (
          <div className="stack-item" key={item._id}>
            <div className="card portfolio-item layout-2 scale has-shadow">
              <div className="image-holder">
                <Link className="card-thumb" to={`/portfolio/${item._id}`}>
                  <img 
                    src={item.image ? `${API_URL}${item.image}` : '/img/placeholder.jpg'}
                    alt={item.title || 'Project'}
                    onError={(e) => {
                      e.target.onerror = null; // Prevent infinite loop
                      e.target.src = '/img/placeholder.jpg'; // Fallback image
                    }}
                  />
                </Link>
              </div>
              <div className="card-content p-2">
                <div className="heading">
                  <h4 className="title mt-2 mt-md-3 mb-3">{item.title || 'Untitled Project'}</h4>
                  <div className="show-project">
                    <div className="card-terms">
                      {item.categories && Array.isArray(item.categories) && item.categories.map((category) => (
                        <span key={category._id} className="terms badge">
                          {category.name}
                        </span>
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
  );
};

export default PortfolioOne;
