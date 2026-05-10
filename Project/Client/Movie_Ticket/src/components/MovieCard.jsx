// MovieCard.jsx
import React from "react";
import { Card, Typography, Rate, Tag, Space } from "antd";
import { PlayCircleOutlined, StarFilled } from "@ant-design/icons";
import "./MovieCard.css";

const { Title, Text } = Typography;

function MovieCard({ title, posterUrl, rating, genre, language, onClick }) {
  return (
    <Card
      hoverable
      className="movie-card"
      onClick={onClick}
      cover={
        <div className="movie-poster-container">
          <img
            src={posterUrl}
            alt={title}
            className="movie-poster"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x450?text=No+Image';
            }}
          />
          <div className="movie-overlay">
            <PlayCircleOutlined className="play-icon" />
          </div>
        </div>
      }
    >
      <div className="movie-card-content">
        <Title level={5} className="movie-title">
          {title}
        </Title>

        <div className="movie-rating">
          <StarFilled className="star-icon" />
          <Text strong className="rating-text">
            {rating ? `${rating}/10` : "N/A"}
          </Text>
        </div>

        <Space size={[8, 8]} wrap className="movie-tags">
          <Tag color="blue" className="movie-tag">{genre}</Tag>
          <Tag className="movie-tag">{language}</Tag>
        </Space>
      </div>
    </Card>
  );
}

export default MovieCard;