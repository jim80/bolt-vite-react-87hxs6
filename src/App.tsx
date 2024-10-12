import React, { useState, useEffect } from 'react';
import DrawingList from './components/DrawingList';
import DrawingCard from './components/DrawingCard';
import SearchForm from './components/SearchForm';

interface Drawing {
  id: string;
  title: string;
  description: string;
  project: string;
  category: string;
  uploaded_date: string;
  file_url: string;
}

function App() {
  const [drawings, setDrawings] = useState<Drawing[]>([]);
  const [filteredDrawings, setFilteredDrawings] = useState<Drawing[]>([]);
  const [selectedDrawing, setSelectedDrawing] = useState<Drawing | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetch('https://65ea11eec9bf92ae3d3b07d0.mockapi.io/api/v1/documents')
      .then(response => response.json())
      .then(data => {
        setDrawings(data);
        setFilteredDrawings(data);
      })
      .catch(error => console.error('Error fetching drawings:', error));
  }, []);

  useEffect(() => {
    const filtered = drawings.filter(drawing =>
      drawing.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDrawings(filtered);
  }, [searchTerm, drawings]);

  const handleDrawingClick = (drawing: Drawing) => {
    setSelectedDrawing(drawing);
    setIsModalOpen(true);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-indigo-600">Drawing Gallery</h1>
        <SearchForm onSearch={handleSearch} />
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/2">
            <DrawingList drawings={filteredDrawings} onDrawingClick={handleDrawingClick} />
          </div>
          <div className="hidden md:block w-full md:w-1/2">
            {selectedDrawing && <DrawingCard drawing={selectedDrawing} onClose={() => {}} />}
          </div>
        </div>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 md:hidden">
            <div className="bg-white rounded-lg w-full max-w-md">
              {selectedDrawing && <DrawingCard drawing={selectedDrawing} onClose={closeModal} />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;