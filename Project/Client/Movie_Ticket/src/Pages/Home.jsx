import React from "react";
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import { getAllMovies } from "../calls/movieCalls";
import MovieCard from "../components/MovieCard";
import { useNavigate } from "react-router-dom";
import { Typography, Row, Col, Spin, Empty } from "antd";
import "./Home.css";

const { Title } = Typography;

function Home() {
  const [movies, setMovies] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const movies = await getAllMovies();
        setMovies(movies.data);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="home-page">
      <Navbar />
      <div className="home-container">
        <div className="home-header">
          <Title level={1} className="home-title">Now Showing</Title>
          <p className="home-subtitle">Discover your next favorite movie</p>
        </div>

        {loading ? (
          <div className="loading-container">
            <Spin size="large" />
          </div>
        ) : movies && movies.length > 0 ? (
          <Row gutter={[24, 24]} className="movies-grid">
            {movies.map((movieObj, index) => (
              <Col xs={24} sm={12} md={8} lg={6} xl={6} key={index}>
                <MovieCard
                  title={movieObj.title}
                  posterUrl={movieObj.posterPath}
                  language={movieObj.language}
                  rating={movieObj.ratings}
                  genre={movieObj.genre}
                  onClick={() => navigate(`/singleMovie/${movieObj._id}`)}
                />
              </Col>
            ))}
          </Row>
        ) : (
          <Empty
            description="No movies available"
            style={{ margin: "60px 0" }}
          />
        )}
      </div>
    </div>
  );
}

export default Home;