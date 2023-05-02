import React, { useState, useContext } from "react";
import "./LocationCard.css";
import { BsArrowRightCircle, BsArrowLeftCircle } from "react-icons/bs";
import { AppContext } from "../../../../AppContext";
import { useNavigate } from 'react-router-dom';

const Card = (props) => {

	const locationId = props.locationId;
	const name = props.name;
	const description = props.description;
	const images = props.images;
	const price = props.price;

	const navigate = useNavigate();

	const {context, setContext} = useContext(AppContext);

	const [currentImage, setCurrentImage] = useState(0);

	const handleClick = (direction) => {
		if (direction === "left")
			setCurrentImage(currentImage === 0 ? images.length - 1 : currentImage - 1);
		else
		if (direction === "right")
			 setCurrentImage(currentImage === images.length - 1 ? 0 : currentImage + 1);
	}

	const handleKnowMoreClick = () => {
		console.log("In handle know more click function");
		setContext( {...context, locationId: locationId, isSearchClicked: false});
		navigate(`/locations/${locationId}`);
	}

	const handleEditClick = (event) => {
		console.log("In handle edit click function");
		event.preventDefault();
		props.setEditLocationId(locationId);
		props.setInEditableMode(true);
	}

	return (<>
	<div className="cards">
		{!props.inEditableMode && (
			<div className="location-card">

				<div className="image-section">
					<img src={'http://localhost:4000' + images[currentImage].urls} alt={images[currentImage].imageType} />
					{images.length > 1 && (
						<div className="arrow-buttons">
							<div className="arrow-left">
								<BsArrowLeftCircle onClick={() => handleClick("left")} />
							</div>
							<div className="arrow-right">
								<BsArrowRightCircle onClick={() => handleClick("right")} />
							</div>
						</div>
					)}
				</div>

				<div className="name-section">
					<p>Name = {name}</p>
				</div>

				<div className="description-section">
					<p>Desc = {description}</p>
				</div>

				<div className="price-section">
					<h4>Price = {price}</h4>
				</div>

				<div className="button-section">
					<button onClick={() => handleKnowMoreClick()}> Know More </button>
					{context.isUserAdmin === true && (
						<div className="button-section">
							<button onClick={(event) => handleEditClick(event)}> Edit </button>
						</div>
					)}
				</div>
			</div>
		)}
		</div>
	</>);
};

export default Card;
