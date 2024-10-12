import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test, vi } from 'vitest';
import DrawingCard from './DrawingCard';

const mockDrawing = {
  id: '1',
  title: 'Test Drawing',
  description: 'This is a test drawing',
  project: 'Test Project',
  category: 'Test Category',
  uploaded_date: '2024-03-15T12:00:00Z',
  file_url: 'https://example.com/test.jpg',
};

test('renders DrawingCard with correct information', () => {
  const onCloseMock = vi.fn();
  render(<DrawingCard drawing={mockDrawing} onClose={onCloseMock} />);

  expect(screen.getByText('Test Drawing')).toBeInTheDocument();
  expect(screen.getByText('This is a test drawing')).toBeInTheDocument();
  expect(screen.getByText(/Project: Test Project/i)).toBeInTheDocument();
  expect(screen.getByText(/Category: Test Category/i)).toBeInTheDocument();
  
  // Use a more flexible date check
  const dateRegex = /Uploaded: \d{1,2}\/\d{1,2}\/\d{4}/;
  expect(screen.getByText(dateRegex)).toBeInTheDocument();
  
  const fileLink = screen.getByText('View File');
  expect(fileLink).toHaveAttribute('href', 'https://example.com/test.jpg');
});

test('calls onClose when close button is clicked', async () => {
  const user = userEvent.setup();
  const onCloseMock = vi.fn();
  render(<DrawingCard drawing={mockDrawing} onClose={onCloseMock} />);

  const closeButton = screen.getByLabelText(/close/i);
  await user.click(closeButton);

  expect(onCloseMock).toHaveBeenCalledTimes(1);
});