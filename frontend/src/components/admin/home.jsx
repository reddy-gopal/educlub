import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiBook, FiUser, FiSettings, FiPlus, FiTrash, FiEdit, FiUsers } from "react-icons/fi";

const HomeAdmin = () => {
  const [clubs, setClubs] = useState([]);
  const [newClubName, setNewClubName] = useState("");
  const [newClubDescription, setNewClubDescription] = useState("");
  const [newClubAdvisor, setNewClubAdvisor] = useState("");
  const [editingClubId, setEditingClubId] = useState(null);
  const [listMembers, setListMembers] = useState([]);
  const navigate = useNavigate();

  const accessToken = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchClubs = async () => {
      if (!accessToken) {
        navigate("/");
        return;
      }

      try {
        const response = await fetch("http://127.0.0.1:8000/clubs/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          navigate("/");
          return;
        }

        const data = await response.json();
        setClubs(data);
      } catch (error) {
        console.error("Error fetching clubs:", error);
        navigate("/");
      }
    };

    fetchClubs();
  }, [navigate, accessToken]);

  const handleCreateClub = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/clubs/create/", {
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
        const newClub = await response.json();
        setClubs((prev) => [...prev, newClub]);
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
      const response = await fetch(`http://127.0.0.1:8000/clubs/${editingClubId}/edit/`, {
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
      const response = await fetch(`http://127.0.0.1:8000/clubs/${clubId}/delete/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        setClubs((prev) => prev.filter((club) => club.id !== clubId));
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
      const response = await fetch(`http://127.0.0.1:8000/clubs/${clubId}/members/`, {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      {/* Navbar */}
      <nav className="bg-white shadow sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FiBook className="text-3xl text-purple-600" />
            <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
          </div>
          <div className="flex space-x-3">
            <button className="hover:bg-purple-100 p-2 rounded-full transition">
              <FiSettings className="text-purple-600 text-xl" />
            </button>
            <button className="hover:bg-purple-100 p-2 rounded-full transition">
              <FiUser className="text-purple-600 text-xl" />
            </button>
            <button
              onClick={handleLogout}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Club Form */}
          <div className="lg:w-1/3 flex flex-col items-center justify-center">
            <div className="bg-white border border-purple-100 shadow-md rounded-2xl p-6 hover:shadow-xl transition">
              <h2 className="text-xl font-semibold text-purple-700 mb-4 flex items-center">
                <FiPlus className="mr-2" />
                {editingClubId ? "Edit Club" : "New Club"}
              </h2>
              <form onSubmit={editingClubId ? handleEditClub : handleCreateClub} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Club Name</label>
                  <input
                    type="text"
                    value={newClubName}
                    onChange={(e) => setNewClubName(e.target.value)}
                    className="w-[300px] px-4 py-2 border border-gray-300 rounded-xl focus:ring-purple-500 focus:border-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={newClubDescription}
                    onChange={(e) => setNewClubDescription(e.target.value)}
                    rows="4"
                    className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-xl focus:ring-purple-500 focus:border-purple-500 resize-none"
                    placeholder="Describe the club"
                    required
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Advisor</label>
                  <input
                    type="text"
                    value={newClubAdvisor}
                    onChange={(e) => setNewClubAdvisor(e.target.value)}
                    className="w-[300px] px-4 py-2 border border-gray-300 rounded-xl focus:ring-purple-500 focus:border-purple-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-xl font-medium flex items-center justify-center transition"
                >
                  <FiPlus className="mr-2" />
                  {editingClubId ? "Update Club" : "Create Club"}
                </button>
                {editingClubId && (
                  <button
                    type="button"
                    onClick={clearForm}
                    className="w-full mt-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-xl transition"
                  >
                    Cancel
                  </button>
                )}
              </form>
            </div>
          </div>

          {/* Club List */}
          <div className="lg:w-2/3 w-full">
            <div className="bg-white border border-indigo-100 shadow-md rounded-2xl">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-indigo-700 flex items-center">
                  <FiBook className="mr-2" />
                  Active Clubs
                </h2>
              </div>
              <div className="p-6 grid sm:grid-cols-1 md:grid-cols-2 gap-4">
                {clubs.map((club) => (
                  <div
                    key={club.id}
                    className="bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 p-4 rounded-xl transition shadow-sm"
                  >
                    <h3 className="font-bold text-gray-800">{club.name}</h3>
                    <p className="text-sm text-gray-600">{club.description}</p>
                    <div className="mt-2 text-sm text-gray-500 flex items-center">
                      <FiUser className="mr-1" />
                      Advisor: {club.advisor_name}
                    </div>
                    <div className="mt-2 text-sm text-gray-500 flex items-center">
                      <FiUsers className="mr-1" />
                      Created By: {club.created_by}
                    </div>
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => handleEditClick(club)}
                        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition"
                      >
                        <FiEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteClub(club.id)}
                        className="bg-rose-500 hover:bg-rose-600 text-white p-2 rounded-full transition"
                      >
                        <FiTrash />
                      </button>
                      <button
                        onClick={() => list_members(club.id)}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white p-2 rounded-full transition"
                      >
                        <FiUsers />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Members Section */}
            {listMembers && (
              <div className="mt-8 bg-white border border-purple-100 shadow-md rounded-2xl">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-bold text-purple-700 flex items-center">
                    <FiUsers className="mr-2" />
                    Club Members
                  </h2>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {listMembers.length === 0 ? (
                    <p className="text-gray-500 text-center col-span-full">
                      There are no users joined in the club yet.
                    </p>
                  ) : (
                    listMembers.map((member) => (
                      <div
                        key={member.member_id}
                        className="flex items-center p-4 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl transition"
                      >
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <FiUser className="text-purple-600" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-semibold text-gray-800">{member.student_username}</p>
                          <p className="text-xs text-gray-500"><span className="text-sm font-semibold text-gray-800">Signed Up at : </span>{member.signup_date}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeAdmin;
