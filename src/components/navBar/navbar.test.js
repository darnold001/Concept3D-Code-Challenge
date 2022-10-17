import React from 'react';
import { render, screen } from '@testing-library/react';
import Navbar from  './navbar';
import {Provider} from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
  reducer: {
    mapData: () => ({
      showTopbar: false,
    }),
  },
});

test('renders navbar', () => {

  render(<Provider store={store}><Navbar/></Provider>);
  const linkElement = screen.getByText(/Concept3D Map Challenge/i);
  expect(linkElement).toBeInTheDocument();
});

test('renders toggle button', () => {
  render(<Provider store={store}><Navbar/></Provider>);
  const linkElement = screen.getByText(/Show add location form/i);
  expect(linkElement).toBeInTheDocument();
});


test('button text updates', () => {
  const store = configureStore({
    reducer: {
      mapData: () => ({
        showTopbar: true,
      }),
    },
  });
  render(<Provider store={store}><Navbar/></Provider>);
  const linkElement =  screen.getByText(/Hide add location form/i);
  expect(linkElement).toBeInTheDocument();
});
