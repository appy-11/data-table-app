# Data Table App

A feature-rich data table application built with Next.js and JSON Server, providing an intuitive interface for managing user data with advanced features like sorting, filtering, pagination, and CRUD operations.


## Features

- **Advanced Data Table**
  - Server-side sorting on any column
  - Server-side filtering and search
  - Pagination with customizable items per page
  - Show/hide columns functionality
  
- **Complete CRUD Operations**
  - Create new users with form validation
  - View user details in a structured table
  - Update existing user information
  - Delete users with confirmation
  
- **Responsive Design**
  - Works on desktop and mobile devices
  - Clean and intuitive user interface

- **Optimized Performance**
  - Server-side data processing
  - Debounced search for better user experience
  - Efficient state management

## Tech Stack

- **Frontend**: Next.js, React, TailwindCSS
- **Backend**: JSON Server
- **State Management**: React Hooks
- **UI Components**: React Icons, React Modal
- **HTTP Client**: Axios

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/appy-11/data-table-app.git
   cd data-table-app
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `data` folder and set up your database:
   ```bash
   mkdir -p data
   cp db.json data/
   # or create a new db.json file in the data folder
   ```

### Running the Application

Run both the frontend and backend concurrently:
```bash
npm run dev:all
# or
yarn dev:all
```

Or run them separately:

```bash
# Run JSON Server (backend)
npm run server
# or
yarn server

# In another terminal, run Next.js (frontend)
npm run dev
# or
yarn dev
```

- Frontend will be available at: http://localhost:3000
- API will be available at: http://localhost:3001


## Project Structure

```
data-table-app/
│
├── data/
│   └── db.json            # JSON Server database file
│
├── src/
│   ├── app/
│   │   ├── page.js        # Main page component
│   │   ├── layout.js      # Main layout component
│   │   └── globals.css    # Global styles
│   │
│   ├── components/
│   │   ├── UserTable.js   # Main data table component
│   │   ├── UserModal.js   # Modal for adding/editing users
│   │   └── ColumnSelector.js # Component for toggling column   
│   │   └── Loader.js # Component for Loader
│   │
│   └── services/
│       └── api.js         # API service for CRUD operations
│
├── package.json           # Project dependencies and scripts
└── README.md              # Project documentation
```

## API Reference

### User Endpoints

| Method | URL | Description |
|--------|-----|-------------|
| GET | `/users` | Get all users with optional filtering, sorting, and pagination |
| GET | `/users/:id` | Get a specific user by ID |
| POST | `/users` | Create a new user |
| PUT | `/users/:id` | Update an existing user |
| DELETE | `/users/:id` | Delete a user |

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `_page` | number | Page number for pagination |
| `_limit` | number | Number of items per page |
| `_sort` | string | Field to sort by |
| `_order` | string | Sort order ('asc' or 'desc') |
| `q` | string | Search term across all fields |
| `[fieldName]` | string | Filter by specific field value |

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [JSON Server](https://github.com/typicode/json-server)
- [React Modal](https://github.com/reactjs/react-modal)
- [React Icons](https://react-icons.github.io/react-icons/)