import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getSingleMovie } from "../calls/movieCalls";
import Navbar from "../components/Navbar";
import moment from "moment";
import {
  Card,
  Row,
  Col,
  Image,
  Typography,
  Rate,
  Tag,
  Button,
  Input,
  Divider,
  Space,
  Empty,
  Spin
} from "antd";
import { CalendarOutlined, ClockCircleOutlined, GlobalOutlined, StarFilled } from "@ant-design/icons";
import { getAllTheatresAndShows } from "../calls/showCalls";
import "./SingleMovie.css";

const { Title, Text, Paragraph } = Typography;

export default function SingleMovie() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [date, setDate] = useState(moment().format("YYYY-MM-DD"));
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleDate = (e) => {
    setDate(moment(e.target.value).format("YYYY-MM-DD"));
    navigate(`/singleMovie/${id}?date=${e.target.value}`);
  };

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        const res = await getSingleMovie(id);
        setMovie(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchMovie();
  }, [id]);

  const getAllShowsWithTheatres = async () => {
    try {
      const res = await getAllTheatresAndShows({ movie: id, date });
      setTheatres(res.shows);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllShowsWithTheatres();
  }, [date, id]);

  if (loading) {
    return (
      <div className="single-movie-page">
        <Navbar />
        <div className="loading-container">
          <Spin size="large" />
        </div>
      </div>
    );
  }

  return (
    <div className="single-movie-page">
      <Navbar />
      <div className="single-movie-container">
        {movie && (
          <Card className="movie-detail-card">
            <Row gutter={[32, 32]}>
              <Col xs={24} sm={8} md={6}>
                <div className="poster-wrapper">
                  <Image
                    src={movie.posterPath}
                    alt={movie.title}
                    className="movie-poster-large"
                    fallback="https://via.placeholder.com/300x450?text=No+Image"
                  />
                </div>
              </Col>

              <Col xs={24} sm={16} md={18}>
                <div className="movie-info">
                  <Title level={1} className="movie-title-large">
                    {movie.title}
                  </Title>

                  <Space size="middle" wrap className="movie-meta">
                    {movie.ratings !== undefined && (
                      <div className="rating-badge">
                        <StarFilled className="star-icon" />
                        <Text strong>{movie.ratings}/10</Text>
                      </div>
                    )}
                    {movie.language && (
                      <Tag icon={<GlobalOutlined />} className="meta-tag">
                        {movie.language}
                      </Tag>
                    )}
                    {movie.releaseDate && (
                      <Tag icon={<CalendarOutlined />} className="meta-tag">
                        {moment(movie.releaseDate).format("MMM DD, YYYY")}
                      </Tag>
                    )}
                  </Space>

                  {movie.genre && (
                    <div className="genre-section">
                      {(Array.isArray(movie.genre)
                        ? movie.genre
                        : movie.genre.toString().split(",")
                      ).map((g) => (
                        <Tag key={g} color="blue" className="genre-tag">
                          {g.toString().trim()}
                        </Tag>
                      ))}
                    </div>
                  )}

                  {movie.description && (
                    <Paragraph className="movie-description">
                      {movie.description}
                    </Paragraph>
                  )}

                  <Divider />

                  <div className="date-selector-section">
                    <Text strong className="date-label">
                      <CalendarOutlined /> Select Date
                    </Text>
                    <Input
                      type="date"
                      value={date}
                      onChange={handleDate}
                      className="date-input"
                      min={moment().format("YYYY-MM-DD")}
                    />
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
        )}

        {theatres.length > 0 ? (
          <div className="theatres-section">
            <Title level={2} className="section-title">
              Available Theatres & Shows
            </Title>
            {theatres.map((theatre) => (
              <Card key={theatre._id} className="theatre-card" hoverable>
                <Row gutter={[24, 16]}>
                  <Col xs={24} lg={8}>
                    <div className="theatre-info">
                      <Title level={4} className="theatre-name">
                        {theatre.name}
                      </Title>
                      <Text type="secondary" className="theatre-address">
                        {theatre.address}
                      </Text>
                    </div>
                  </Col>
                  <Col xs={24} lg={16}>
                    <div className="shows-container">
                      <Text strong className="shows-label">
                        <ClockCircleOutlined /> Show Times
                      </Text>
                      <ul className="show-ul">
                        {theatre.shows
                          .sort(
                            (a, b) =>
                              moment(a.time, "HH:mm") - moment(b.time, "HH:mm")
                          )
                          .map((singleShow) => (
                            <li
                              key={singleShow._id}
                              onClick={() =>
                                navigate(`/bookshow/${singleShow._id}`)
                              }
                            >
                              {moment(singleShow.time, "HH:mm").format(
                                "hh:mm A"
                              )}
                            </li>
                          ))}
                      </ul>
                    </div>
                  </Col>
                </Row>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="no-shows-card">
            <Empty
              description={
                <Text type="secondary">
                  No shows available for the selected date
                </Text>
              }
            />
          </Card>
        )}
      </div>
    </div>
  );
}