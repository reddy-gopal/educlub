import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiBook, FiUser, FiSettings, FiPlus, FiTrash, FiEdit, FiUsers, FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";

const HomeAdmin = () => {
  const [clubs, setClubs] = useState([]);
  const [newClubName, setNewClubName] = useState("");
  const [newClubDescription, setNewClubDescription] = useState("");
  const [newClubAdvisor, setNewClubAdvisor] = useState("");
  const [editingClubId, setEditingClubId] = useState(null);
  const [listMembers, setListMembers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const accessToken = localStorage.getItem("access_token");

  const fetchClubs = async (page) => {
    if (!accessToken) {
      navigate("/");
      return;
    }

    try {
      const response = await fetch(`https://gopal123.pythonanywhere.com/clubs/?page=${page}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        navigate("/");
        return;
      }

      
const data = await response.json();
setClubs(Array.isArray(data.results) ? data.results : (Array.isArray(data) ? data : []));
setTotalPages(Math.ceil((data.count || (Array.isArray(data) ? data.length : 0)) / 4));

    } catch (error) {
      console.error("Error fetching clubs:", error);
      navigate("/");
    }
  };

  useEffect(() => {
    fetchClubs(currentPage);
  }, [currentPage, navigate, accessToken]);

  const handleCreateClub = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://gopal123.pythonanywhere.com/clubs/create/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newClubName,
          description: newClubDescription,
          advisor_name: newClubAdvisor,
        }),
      });

      if (response.ok) {
        fetchClubs(currentPage); 
        alert("Club created successfully!");
        clearForm();
      } else {
        alert("Failed to create club.");
      }
    } catch (error) {
      console.error("Error creating club:", error);
    }
  };

  const handleEditClub = async (e) => {
    e.preventDefault();
    if (!editingClubId) return;

    try {
      const response = await fetch(`https://gopal123.pythonanywhere.com/clubs/${editingClubId}/edit/`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newClubName,
          description: newClubDescription,
          advisor_name: newClubAdvisor,
        }),
      });

      if (response.ok) {
        const updatedClub = await response.json();
        setClubs((prev) => prev.map((club) => (club.id === updatedClub.id ? updatedClub : club)));
        alert("Club updated successfully!");
        clearForm();
        setEditingClubId(null);
      } else {
        alert("Failed to update club.");
      }
    } catch (error) {
      console.error("Error editing club:", error);
    }
  };

  const handleDeleteClub = async (clubId) => {
    if (!window.confirm("Are you sure you want to delete this club?")) return;

    try {
      const response = await fetch(`https://gopal123.pythonanywhere.com/http://127.0.0.1:8000/clubs/${clubId}/delete/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        // After deleting, fetch the current page again
        fetchClubs(currentPage);
        alert("Club deleted successfully!");
      } else {
        alert("Failed to delete club.");
      }
    } catch (error) {
      console.error("Error deleting club:", error);
    }
  };

  const list_members = async (clubId) => {
    try {
      const response = await fetch(`https://gopal123.pythonanywhere.com/clubs/${clubId}/members/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const members = await response.json();
        setListMembers(members);
      } else {
        alert("Failed to fetch club members.");
      }
    } catch (error) {
      console.error("Error fetching club members:", error);
    }
  };

  const handleEditClick = (club) => {
    setNewClubName(club.name);
    setNewClubDescription(club.description);
    setNewClubAdvisor(club.advisor_name);
    setEditingClubId(club.id);
  };

  const clearForm = () => {
    setNewClubName("");
    setNewClubDescription("");
    setNewClubAdvisor("");
    setEditingClubId(null);
  };
  
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("is_admin");
    navigate("/");
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 w-screen">
      {/* Navbar */}
       <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden">
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-2 rounded-lg">
              <FiBook className="text-2xl text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
              EduClub Admin
            </h1>
          </div>
          <div className="flex space-x-4">
            <button className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 p-2 rounded-full transition">
              <FiSettings className="text-xl" />
            </button>
            <button className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 p-2 rounded-full transition">
              <FiUser className="text-xl" />
            </button>
            <button
              onClick={handleLogout}
              className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-4 py-2 rounded-full font-medium transition-all shadow-md"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Club Form - Centered vertically */}
          <div className="lg:w-1/3 flex items-center justify-center">
            <div className="bg-white border border-indigo-100 rounded-2xl shadow-lg w-full max-w-md p-6 hover:shadow-xl transition">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-indigo-700 flex items-center">
                  <FiPlus className="mr-2" />
                  {editingClubId ? "Edit Club" : "Create New Club"}
                </h2>
                {editingClubId && (
                  <button 
                    onClick={clearForm}
                    className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition"
                  >
                    <FiX className="text-gray-600" />
                  </button>
                )}
              </div>
              
              <form onSubmit={editingClubId ? handleEditClub : handleCreateClub} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Club Name</label>
                  <input
                    type="text"
                    value={newClubName}
                    onChange={(e) => setNewClubName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    required
                    placeholder="Enter club name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={newClubDescription}
                    onChange={(e) => setNewClubDescription(e.target.value)}
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                    placeholder="Describe the club's purpose and activities"
                    required
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Advisor</label>
                  <input
                    type="text"
                    value={newClubAdvisor}
                    onChange={(e) => setNewClubAdvisor(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                    placeholder="Enter advisor's name"
                  />
                </div>
                <div className="pt-2">
                  <button
                    type="submit"
                    className={`w-full py-3.5 rounded-xl font-bold text-white transition-all shadow-md hover:shadow-lg ${
                      editingClubId 
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                        : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                    }`}
                  >
                    {editingClubId ? "Update Club" : "Create Club"}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Club List */}
          <div className="lg:w-2/3 w-full">
            <div className="bg-white border border-indigo-100 rounded-2xl shadow-lg">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-bold text-indigo-700 flex items-center">
                  <FiBook className="mr-2" />
                  Active Clubs
                </h2>
                <div className="text-sm text-gray-500">
                  Page {currentPage} of {totalPages}
                </div>
              </div>
              
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {clubs.length > 0 ? (
                  clubs.map((club) => (
                    <div
                      key={club.id}
                      className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-200 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md"
                    >
                      <div className="p-5">
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-xl text-indigo-800">{club.name}</h3>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditClick(club)}
                              className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 transition"
                              title="Edit"
                            >
                              <FiEdit />
                            </button>
                            <button
                              onClick={() => handleDeleteClub(club.id)}
                              className="p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600 transition"
                              title="Delete"
                            >
                              <FiTrash />
                            </button>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 mt-3 mb-4 text-sm min-h-[60px]">
                          {club.description}
                        </p>
                        
                        <div className="text-sm text-gray-700 border-t border-gray-200 pt-3">
                          <div className="flex items-center mb-1">
                            <FiUser className="mr-2 text-indigo-600" />
                            <span className="font-medium">Advisor:</span>
                            <span className="ml-1">{club.advisor_name}</span>
                          </div>
                          <div className="flex items-center">
                            <FiUsers className="mr-2 text-indigo-600" />
                            <span className="font-medium">Created By:</span>
                            <span className="ml-1">{club.created_by}</span>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <button
                            onClick={() => list_members(club.id)}
                            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-medium py-2.5 rounded-lg transition-all"
                          >
                            <FiUsers className="text-lg" />
                            View Members
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-24 h-24 mx-auto mb-4 flex items-center justify-center text-gray-400">
                      <FiBook className="text-4xl" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-700">No Clubs Found</h3>
                    <p className="text-gray-500 mt-2">Create your first club to get started</p>
                  </div>
                )}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200">
                  <div className="flex items-center justify-center space-x-2">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`p-2 rounded-full ${
                        currentPage === 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed '
                          : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition'
                      }`}
                    >
                      <FiChevronLeft className="text-xl" />
                    </button>
                    
                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index + 1}
                        onClick={() => paginate(index + 1)}
                        className={`w-8 h-8 rounded-full font-medium transition ${
                          currentPage === index + 1
                            ? 'bg-indigo-600 text-white pb-3'
                            : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`p-2 rounded-full ${
                        currentPage === totalPages
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition'
                      }`}
                    >
                      <FiChevronRight className="text-xl" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Members Section */}
            {listMembers.length > 0 && (
              <div className="mt-8 bg-white border border-indigo-100 rounded-2xl shadow-lg">
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-indigo-700 flex items-center">
                    <FiUsers className="mr-2" />
                    Club Members
                    <span className="ml-2 bg-indigo-100 text-indigo-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                      {listMembers.length}
                    </span>
                  </h2>
                  <button 
                    onClick={() => setListMembers([])}
                    className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition"
                  >
                    <FiX className="text-gray-600" />
                  </button>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {listMembers.map((member) => (
                    <div
                      key={member.member_id}
                      className="flex items-center p-4 bg-indigo-50 border border-indigo-100 rounded-xl transition hover:bg-indigo-100"
                    >
                      <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                        <FiUser className="text-indigo-600 text-xl" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{member.student_username}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          Joined: {new Date(member.signup_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 py-6 text-center text-gray-600 text-sm border-t border-gray-200 mt-6">
        <p>© 2023 EduClub Admin Portal. All rights reserved.</p>
      </footer>
    </div>
    </div>
  );
};

export default HomeAdmin;