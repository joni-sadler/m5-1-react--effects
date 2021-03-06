import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Item from "./Item";
import useKeyDown from "./useKeyDown";
import useDocumentTitle from "./useDocumentTitle";
import useInterval from "./../hooks/use-interval.hook";

import cookieSrc from "../cookie.svg";


const Game = () => {
  const [numCookies, setNumCookies] = useState(100)
  const [purchasedItems, setPurchasedItems] = useState({cursor: 0, grandma: 0,farm: 0, MegaCursor: 0})

  const items = [
    { id: "cursor", name: "Cursor", cost: (10 + (purchasedItems.cursor ** 2)), value: 1 },
    { id: "grandma", name: "Grandma", cost: (100 + (purchasedItems.grandma ** 2)), value: 10 },
    { id: "farm", name: "Farm", cost: (1000 + (purchasedItems.farm ** 2)), value: 80 },
    { id: "MegaCursor", name: "MegaCursor", cost: (25 + (purchasedItems.MegaCursor ** 2)), value: 0}
  ];


  const handleClick = (selectedItem) => {
    if (numCookies < selectedItem.cost) {
      window.alert("You can't afford this!")
    } else {
      setNumCookies(numCookies - selectedItem.cost);
      let currentPurchasedItems = purchasedItems;
      currentPurchasedItems[selectedItem.id] += 1;
      setPurchasedItems(currentPurchasedItems);
    }
  };

  const handleMegaClick = () => {
    setNumCookies(numCookies + (5 * purchasedItems.MegaCursor));
  };

  useKeyDown(32, (purchasedItems.MegaCursor === 0 ? handleClick : handleMegaClick));
  useDocumentTitle(`${numCookies} cookies – Cookie Clicker Workshop`, 'Cookie Clicker Workshop');

  const calculateCookiesPerTick = (purchasedItems) => {
    let totalValue = 0;
    items.forEach((item) => {
      totalValue += (purchasedItems[item.id] * item.value)
    })
    return totalValue;
  }  

  useEffect(() => {
    document.title = `${numCookies} cookies`;
  }, [numCookies]);

  useInterval(() => {
    const numOfGeneratedCookies = calculateCookiesPerTick(purchasedItems);
    setNumCookies(numCookies + numOfGeneratedCookies);
  }, 1000);

  let focusOnMount;

  return (
    <Wrapper>
      <GameArea>
        <Indicator>
          <Total>{numCookies} cookies</Total>
          <strong>{calculateCookiesPerTick(purchasedItems)}</strong> cookies per second
        </Indicator>
          <Button onClick={() => (purchasedItems.MegaCursor === 0 ? setNumCookies(numCookies + 1) : setNumCookies((numCookies + (5 * purchasedItems.MegaCursor))))}>
          <Cookie src={cookieSrc} />
        </Button>
      </GameArea>

      <ItemArea>
        <SectionTitle>Items:</SectionTitle>
        {items.map((item, index) => {
          if (index === 0) {
            focusOnMount = true;
          } else {
            focusOnMount = false;
          };
          return (
          <Button onClick={() => handleClick(item)}>
            <Item 
              name={item.name} 
              cost={item.cost} 
              value={item.value} 
              count={purchasedItems[item.id]} 
              index={index}
              id={item.id}
              focusOnMount={focusOnMount}>{item.name}</Item>
            </Button>
          )
        })}        
      </ItemArea>
      <HomeLink to="/">Return home</HomeLink>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  height: 100vh;
`;
const GameArea = styled.div`
  flex: 1;
  display: grid;
  place-items: center;
`;
const Button = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
`;

const Cookie = styled.img`
  width: 200px;
`;

const ItemArea = styled.div`
  height: 100%;
  padding-right: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const SectionTitle = styled.h3`
  text-align: center;
  font-size: 32px;
  color: yellow;
`;

const Indicator = styled.div`
  position: absolute;
  width: 250px;
  top: 0;
  left: 0;
  right: 0;
  margin: auto;
  text-align: center;
`;

const Total = styled.h3`
  font-size: 28px;
  color: lime;
`;

const HomeLink = styled(Link)`
  position: absolute;
  top: 15px;
  left: 15px;
  color: #666;
`;

export default Game;
