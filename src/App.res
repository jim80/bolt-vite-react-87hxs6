type drawing = {
  id: string,
  title: string,
  description: string,
  project: string,
  category: string,
  uploaded_date: string,
  file_url: string,
}

module DrawingList = {
  @react.component
  let make = (~drawings: array<drawing>, ~onDrawingClick) => {
    <ul className="space-y-4">
      {drawings->Belt.Array.map(drawing => {
        <li
          key={drawing.id}
          className="bg-white p-4 rounded-lg shadow-md cursor-pointer transition-all duration-300 hover:shadow-lg hover:bg-indigo-50"
          onClick={_ => onDrawingClick(drawing)}>
          <h3 className="text-lg font-semibold text-indigo-600"> {React.string(drawing.title)} </h3>
          <p className="text-gray-600 mt-2"> {React.string(drawing.description)} </p>
        </li>
      })->React.array}
    </ul>
  }
}

module DrawingCard = {
  @react.component
  let make = (~drawing: drawing) => {
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-indigo-600"> {React.string(drawing.title)} </h2>
      <p className="text-gray-600 mb-4"> {React.string(drawing.description)} </p>
      <div className="space-y-2">
        <div className="flex items-center">
          <span className="text-gray-700"> {React.string("Project: " ++ drawing.project)} </span>
        </div>
        <div className="flex items-center">
          <span className="text-gray-700"> {React.string("Category: " ++ drawing.category)} </span>
        </div>
        <div className="flex items-center">
          <span className="text-gray-700">
            {React.string("Uploaded: " ++ Js.Date.fromString(drawing.uploaded_date)->Js.Date.toLocaleDateString)}
          </span>
        </div>
        <div className="flex items-center">
          <a href={drawing.file_url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
            {React.string("View File")}
          </a>
        </div>
      </div>
    </div>
  }
}

module SearchForm = {
  @react.component
  let make = (~onSearch) => {
    let (searchTerm, setSearchTerm) = React.useState(_ => "")

    let handleSubmit = event => {
      ReactEvent.Form.preventDefault(event)
      onSearch(searchTerm)
    }

    let handleChange = event => {
      let newTerm = ReactEvent.Form.target(event)["value"]
      setSearchTerm(_ => newTerm)
      onSearch(newTerm)
    }

    <form onSubmit={handleSubmit} className="mb-8">
      <div className="relative">
        <input
          type_="text"
          placeholder="Search drawings..."
          value={searchTerm}
          onChange={handleChange}
          className="w-full p-3 pl-10 pr-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
    </form>
  }
}

@react.component
let make = () => {
  let (drawings, setDrawings) = React.useState(_ => [])
  let (filteredDrawings, setFilteredDrawings) = React.useState(_ => [])
  let (selectedDrawing, setSelectedDrawing) = React.useState(_ => None)

  React.useEffect0(() => {
    let fetchDrawings = async () => {
      let response = await Fetch.fetch("https://65ea11eec9bf92ae3d3b07d0.mockapi.io/api/v1/documents")
      let data = await Fetch.Response.json(response)
      setDrawings(_ => data)
      setFilteredDrawings(_ => data)
    }
    fetchDrawings()->ignore
    None
  })

  let handleDrawingClick = drawing => {
    setSelectedDrawing(_ => Some(drawing))
  }

  let handleSearch = term => {
    let filtered = drawings->Belt.Array.keep(drawing =>
      Js.String.toLowerCase(drawing.title)->Js.String.includes(Js.String.toLowerCase(term))
    )
    setFilteredDrawings(_ => filtered)
  }

  <div className="min-h-screen bg-gray-100 p-8">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center text-indigo-600"> {React.string("Drawing Gallery")} </h1>
      <SearchForm onSearch={handleSearch} />
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2">
          <DrawingList drawings={filteredDrawings} onDrawingClick={handleDrawingClick} />
        </div>
        <div className="w-full md:w-1/2">
          {switch selectedDrawing {
          | Some(drawing) => <DrawingCard drawing={drawing} />
          | None => React.null
          }}
        </div>
      </div>
    </div>
  </div>
}