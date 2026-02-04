import { Link } from "react-router-dom"

const Sidebar = () => {
  return (
    <div className="bg-yellow-200 flex flex-col p-4 gap-4">
      <Link to="/">Home</Link>
      <Link to="/students">Students</Link>
    </div>
  )
}

export default Sidebar