import React from 'react';
import { render, screen } from '@testing-library/react';
import {Form} from './form';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import userEvent from '@testing-library/user-event';

const mockedStore = configureStore({
    reducer: {
        mapData: () => ({
            locations: [],
            polygons: [],
            filters: {
                status: "All",
            },
            showTopbar: true,
        }),
    },
});



test('submit is enabled when all fields are filled', async () => {
    render(<Provider store={mockedStore}><Form/></Provider>);
  const linkElement = screen.getByText(/Add Location/i);
  expect(linkElement).toBeInTheDocument();
  expect(linkElement).toBeDisabled();
  const nameInput = screen.getByLabelText(/Location Name/i);
  await userEvent.type(nameInput, "New York");
    expect(nameInput).toBeInTheDocument();
    const latitudeInput = screen.getByLabelText(/Latitude/i);
    await userEvent.type(latitudeInput, "40.7128");
    expect(latitudeInput).toHaveValue(40.7128);
    const longitudeInput = screen.getByLabelText(/Longitude/i);
    await userEvent.type(longitudeInput, "-74.006");
    expect(longitudeInput).toHaveValue(-74.006);
    expect(linkElement).toBeEnabled();
});

test('submit is disabled when name is empty', async () => {
    render(<Provider store={mockedStore}><Form/></Provider>);
  const linkElement = screen.getByText(/Add Location/i);
  expect(linkElement).toBeInTheDocument();
  expect(linkElement).toBeDisabled();
  const nameInput = screen.getByLabelText('Location Name');
    expect(nameInput).toBeInTheDocument();
    const latitudeInput = screen.getByLabelText(/Latitude/i);
    await userEvent.type(latitudeInput, "40.7128");
    expect(latitudeInput).toHaveValue(40.7128);
    const longitudeInput = screen.getByLabelText(/Longitude/i);
    await userEvent.type(longitudeInput, "-74.006");
    expect(longitudeInput).toHaveValue(-74.006);
    expect(linkElement).toBeDisabled();
}

);

test('submit is disabled when latitude is invalid', async () => {
    render(<Provider store={mockedStore}><Form/></Provider>);
  const linkElement = screen.getByText(/Add Location/i);
  expect(linkElement).toBeInTheDocument();
  expect(linkElement).toBeDisabled();
  const nameInput = screen.getByLabelText(/Location Name/i);
  await userEvent.type(nameInput, "New York");
    expect(nameInput).toBeInTheDocument();
    const latitudeInput = screen.getByLabelText(/Latitude/i);
    await userEvent.type(latitudeInput, '44444444444444');
    expect(latitudeInput).toHaveValue(44444444444444);
    const longitudeInput = screen.getByLabelText(/Longitude/i);
    await userEvent.type(longitudeInput, "-74.006");
    expect(longitudeInput).toHaveValue(-74.006);
    expect(linkElement).toBeDisabled();
    const errorMessage = screen.getByText(/Invalid Latitude/i);
    expect(errorMessage).toBeInTheDocument();
});


test('submit is disabled when longitude is invalid', async () => {
    render(<Provider store={mockedStore}><Form/></Provider>);
  const linkElement = screen.getByText(/Add Location/i);
  expect(linkElement).toBeInTheDocument();
  expect(linkElement).toBeDisabled();
  const nameInput = screen.getByLabelText(/Location Name/i);
  await userEvent.type(nameInput, "New York");
    expect(nameInput).toBeInTheDocument();
    const latitudeInput = screen.getByLabelText(/Latitude/i);
    await userEvent.type(latitudeInput, '40.7128');
    expect(latitudeInput).toHaveValue(40.7128);
    const longitudeInput = screen.getByLabelText(/Longitude/i);
    await userEvent.type(longitudeInput, "-360");
    expect(longitudeInput).toHaveValue(-360);
    expect(linkElement).toBeDisabled();
    const errorMessage = screen.getByText(/Invalid Longitude/i);
    expect(errorMessage).toBeInTheDocument();
});

