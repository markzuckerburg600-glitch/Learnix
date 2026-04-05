"use client"

const Card = () => {
  return (
    <div className="parent">
      <div className="card">
        <div className="content-box">
          <span className="card-title">Start Now!</span>
          <p className="card-content">
            Create Flashcards, Study Guides and More!
          </p>
          <span className="see-more">View Demo</span>
        </div>
        <div className="date-box">
          <span className="month">Join</span>
          <span className="date">Today!</span>
        </div>
      </div>
    </div>
  );
};

export default Card;
