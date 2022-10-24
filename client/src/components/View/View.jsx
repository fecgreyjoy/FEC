import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Description from './Description.jsx';
import ProductImage from './ProductImage.jsx';
import ProductName from './ProductName.jsx';
import SelectedStyle from './SelectedStyle.jsx';
import ItemSelection from './ItemSelection.jsx';
import { StyleView } from './Styled/StyleView.styled.jsx';
// import {Button} from './Styled/Form.styled.jsx';


const View = ({ productId, currentProduct, metaData }) => {
  //Establish pieces of state for View and StyleSelector
  const [otherStyles, setOtherStyles] = useState([]);
  const [displayedStyle, setDisplayedStyle] = useState({});
  const [cartContents, setCartContents] = useState([]);

  // Get methods for StyleSelector
  const getOtherStyles = (productId) => {
    const endPoint = `/products/:product_id/styles`;
    axios.get(endPoint, {
      params: {
        "id": productId
      }
    })
      .then(results => {
        let stylesArray = results.data.results;
        setOtherStyles(stylesArray);
        setDisplayedStyle(stylesArray[0]);
      })
      .catch(err => {
        console.log('Here is an error in getOtherStyles ->', err);
      });
  };

  //Add to Cart: adds a product to the cart or updates the existing style
  const addToCart = (cartAddition) => {
    let foundItemInCart = false;

    let newCartArray = cartContents.map((cartItemObj, index) => {
      let modifiedCartObj = {};
      Object.assign(modifiedCartObj, cartItemObj);
      if (cartItemObj.product_id === cartAddition.product_id
        && cartItemObj.style_id === cartAddition.style_id
        && cartItemObj.sku === cartAddition.sku) {
        modifiedCartObj.quantity = cartItemObj.quantity - cartAddition.selectedQty;
        foundItemInCart = true;
      }
      return modifiedCartObj;
    });
    if (!foundItemInCart) {
      let newQty = cartAddition.quantity - cartAddition.selectedQty;
      cartAddition.quantity = newQty;
      newCartArray.push(cartAddition);
    }
    console.log(newCartArray, "here is the updated cart from View");
    setCartContents(newCartArray);
  };

  //useEffect: updates on render
  useEffect(() => {
    getOtherStyles(productId);

  }, []);

  //eventhandler to change DisplayedStyle
  const changeDisplayedStyle = (index) => {
    setDisplayedStyle(otherStyles[index]);
  };

  return (
    <div className="view-main">
      <ProductImage otherStyles={otherStyles} currentDisplayedStyle={displayedStyle} />
      <Description productInfo={currentProduct} />
      <StyleView>

        <ProductName productInfo={currentProduct} currentDisplayedStyle={displayedStyle} metaData={metaData}/>

        {otherStyles.length > 0 && <SelectedStyle otherStyles={otherStyles} productId={productId} changeDisplayedStyle={changeDisplayedStyle} currentDisplayedStyle={displayedStyle} />}

        <ItemSelection currentDisplayedStyle={displayedStyle} productId={productId} addToCart={addToCart} cartContents={cartContents} />

      </StyleView>



    </div>
  );
};

export default View;