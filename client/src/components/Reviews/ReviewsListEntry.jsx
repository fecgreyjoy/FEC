import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import PhotosModal from './PhotosModal.jsx';
import formattedDate from '../../HelperFunctions/formattedDate.js';
import {FaCheckCircle, FaTimesCircle, FaExclamationCircle} from 'react-icons/fa';
import StarRating from '../Stars/StarRating.jsx';

const ReviewEntry = styled.div`
border-bottom: solid grey 1px;
padding: 20px;
display: flex-column;
align-items: space-between;
height: auto;
`;

const ReviewTitle = styled.div`
  font-weight: 800;
  padding: 15px 0 15px 0;
`;

const Thumbnail = styled.img`
  width: 40px;
  height: 40px;
  padding: 15px 0 15px 0;
`;

const Button = styled.button`
background: inherit;
color: grey;
font-size: .75em;
margin: 15px 0 15px 0;
padding: 0.25em 1em;
border: 2px solid grey;
border-radius: 3px;
`;


const ReviewsListEntry = ({review, theme}) => {

  const [over250, setOver250] = useState(review.body.length > 250);
  const [showModal, setShowModal] = useState(false);
  const [isScrollable, setIsScrollable] = useState(true);
  const [photoClicked, setPhotoClicked] = useState(true);
  const [helpful, setHelpful] = useState(false);
  const [notHelpful, setNotHelpful] = useState(false);
  const [reported, setReported] = useState(false);

  const togglePhotoClicked = (photo) => {
    photo.clicked = photoClicked;
    setPhotoClicked(!photoClicked);
  };

  const toggleShowMore = () => {
    setOver250(!over250);

  };

  const togglePhoto = (img) => {
    setShowModal(!showModal);
    setIsScrollable(!isScrollable);
    isScrollable ? document.body.style.overflow = 'hidden' : document.body.style.overflow = 'scroll';
  };

  const clickHelpful = () => {
    if (!helpful) {
      setHelpful(!helpful);
      //axios put request
      axios.put('/reviews/:review_id/helpful', {'review_id': review.review_id})
        .then((res) => {
          console.log('successfully put question helpful');
          //maybe get req, but dont want to refresh page or allow to mark helpful again
        })
        .catch((err) => {
          console.log('error putting question helpful: ', err);
        });
    }
  };

  const clickReported = () => {
    setReported(true);
    axios.put('/reviews/:review_id/report', {'review_id': review.review_id})
      .then((res) => {
        console.log('successfully put question helpful');
      })
      .catch((err) => {
        console.log('error putting question helpful: ', err);
      });
  };


  let noNum = Math.floor(Math.random() * 10);


  return (
    <ReviewEntry>
      <div className="rev-star-date">
        <div className="static-stars" data-testid="rev-summary">
          <StarRating rating={review.rating}/>
        </div>
        <small><div>{review.reviewer_name}, {formattedDate(review.date)}</div></small>
      </div>
      {review.summary.length > 60 ?
        <>
          <ReviewTitle>{review.summary.substring(0, 60)}...</ReviewTitle>
          <div>...{review.summary.substring(60, review.summary.length)}</div>
        </> : <ReviewTitle>{review.summary}</ReviewTitle>}
      <div>
        {over250 ?
          <div>
            {review.body.substring(0, 250)}... <div>
              <Button onClick={() => (toggleShowMore())}>Show More</Button>
            </div>
          </div> : review.body}
      </div>
      <div>
        {review.photos.length > 0 ?
          <div data-testid="photo-thumb"className="thumbnails-container">
            {review.photos.map((photo, i) => (
              <div className="thumbnail" key={i}>
                <Thumbnail src={photo.url} onClick={() => { togglePhoto(photo.url); togglePhotoClicked(photo); }} ></Thumbnail>
                {showModal ?
                  <PhotosModal toggle={togglePhoto}
                    visible={showModal}
                    photo={photo}
                    togglePhotoClicked={togglePhotoClicked}
                    theme={theme}/>
                  : null}
              </div>
            ))}
          </div>
          : null}
      </div>
      <div>
        {review.recommend ?
          <div className="rev-rec"><FaCheckCircle style={{color: '#367c2b'}}/> I recommend this product</div> : null}
      </div>
      <div>
        {review.response ?
          <div>
            <h3>Response from seller:</h3>
            <div>{review.response}</div>
          </div>
          : null}
      </div>
      {helpful && !reported && <small><span>Was this review helpful? <span style={{color: '#367c2b'}}>Yes <FaCheckCircle style={{color: '#367c2b'}}/></span></span></small>}
      {notHelpful && !reported && <small><span>Was this review helpful? <span style={{color: '#C81D11'}}>No <FaTimesCircle style={{color: '#C81D11'}} /> </span><a onClick={() => clickReported()}>Report</a></span></small>}
      {(!helpful && !notHelpful && !reported) && <small><span>Was this review helpful? <a onClick={() => clickHelpful()}>Yes</a> {`(${review.helpfulness})`} | <a onClick={() => setNotHelpful(true)}>No</a> ({noNum}) | <a onClick={() => clickReported()}>Report</a></span></small>}
      {reported && <small><span style={{color: '#E8B90E'}}>Reported <FaExclamationCircle style={{color: '#E8B90E'}}/></span></small>}
    </ReviewEntry>
  );
};

export default ReviewsListEntry;