import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaCheckCircle,
  FaSignOutAlt,
  FaUserCircle,
  FaUsers,
  FaBook,
  FaFlask,
  FaMusic,
  FaChess,
  FaPalette,
  FaCode,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const Home = () => {
  const [clubs, setClubs] = useState([]);
  const [joinedClubs, setJoinedClubs] = useState([]);
  const [currentView, setCurrentView] = useState("all");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const fetchClubs = async (page) => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/");
      return;
    }

    try {
      const clubsRes = await fetch(`https://gopal123.pythonanywhere.com/clubs/?page=${page}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!clubsRes.ok) return navigate("/");

      const clubsData = await clubsRes.json();
      console.log("Fetched clubs:", clubsData);
      setClubs(Array.isArray(clubsData) ? clubsData : clubsData.results || []);
      setTotalPages(Math.ceil(clubsData.count / 4)); // Assuming 4 items per page as per backend

      const joinedRes = await fetch("https://gopal123.pythonanywhere.com/user/clubs/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (joinedRes.ok) {
        const joinedData = await joinedRes.json();
        console.log("Fetched joined clubs:", joinedData);
        setJoinedClubs(Array.isArray(joinedData) ? joinedData : []);
      }
    } catch (err) {
      console.error("Error fetching clubs:", err);
      navigate("/");
    }
  };

  useEffect(() => {
    fetchClubs(currentPage);
  }, [currentPage, navigate]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleJoin = async (clubId) => {
    const token = localStorage.getItem("access_token");
    if (!token) return navigate("/");

    try {
      const res = await fetch(`https://gopal123.pythonanywhere.com/clubs/${clubId}/join/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        const club = clubs.find((c) => c.id === clubId);
        setJoinedClubs((prev) => [...prev, club]);
        alert("Successfully joined the club!");
      } else {
        alert("Failed to join club.");
      }
    } catch (err) {
      console.error("Join error:", err);
    }
  };

  const handleLeave = async (clubId) => {
    const token = localStorage.getItem("access_token");
    if (!token) return navigate("/");

    try {
      const res = await fetch(`https://gopal123.pythonanywhere.com/clubs/${clubId}/leave/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        setJoinedClubs((prev) => prev.filter((c) => c.id !== clubId));
        alert("Left the club.");
      } else {
        alert("Failed to leave club.");
      }
    } catch (err) {
      console.error("Leave error:", err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const sourceClubs = currentView === "all" ? clubs : joinedClubs;

  const filteredClubs = Array.isArray(sourceClubs)
    ? sourceClubs.filter((club) =>
        club?.name?.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  // Category icons and colors
  const categoryIcons = {
    academic: <FaBook className="text-indigo-600" />,
    science: <FaFlask className="text-green-600" />,
    music: <FaMusic className="text-red-500" />,
    art: <FaPalette className="text-yellow-500" />,
    tech: <FaCode className="text-blue-500" />,
    chess: <FaChess className="text-purple-600" />,
    default: <FaUsers className="text-gray-500" />,
  };

  const categoryColors = {
    academic: "bg-indigo-100 border-indigo-300",
    science: "bg-green-100 border-green-300",
    music: "bg-red-100 border-red-300",
    art: "bg-yellow-100 border-yellow-300",
    tech: "bg-blue-100 border-blue-300",
    chess: "bg-purple-100 border-purple-300",
    default: "bg-gray-100 border-gray-300",
  };

  const getCategoryIcon = (category) =>
    categoryIcons[category?.toLowerCase()] || categoryIcons.default;

  const getCategoryColor = (category) =>
    categoryColors[category?.toLowerCase()] || categoryColors.default;

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 flex justify-center items-start py-12 px-4">
      <div className="w-full max-w-7xl">
        {/* Header */}
        <header className="bg-white rounded-2xl shadow-md px-6 py-6 mb-10 flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center gap-4 mb-4 sm:mb-0">
            <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600">
              <FaUsers className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                EduClub Portal
              </h1>
              <p className="text-sm text-gray-500">Discover and join student clubs</p>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-full">
              <FaUserCircle className="text-indigo-600" />
              <span className="text-indigo-900 font-medium">Student</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex gap-2 items-center bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-4 py-2 rounded-full font-semibold shadow hover:shadow-md transition-all"
            >
              <FaSignOutAlt />
              Logout
            </button>
          </div>
        </header>

        {/* Search + Filters */}
        <section className="bg-white shadow-md rounded-2xl px-6 py-6 mb-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="relative w-full md:w-1/2">
            <FaSearch className="absolute top-3.5 left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search clubs by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => {
                setCurrentView("all");
                setCurrentPage(1);
              }}
              className={`px-5 py-2.5 rounded-full border-2 font-medium transition-all ${
                currentView === "all"
                  ? "bg-indigo-600 text-white border-indigo-700 shadow"
                  : "bg-white text-indigo-700 border-indigo-300 hover:bg-indigo-50"
              }`}
            >
              Browse All Clubs
            </button>
            <button
              onClick={() => setCurrentView("joined")}
              className={`px-5 py-2.5 rounded-full border-2 font-medium transition-all ${
                currentView === "joined"
                  ? "bg-green-500 text-white border-green-600 shadow"
                  : "bg-white text-green-700 border-green-300 hover:bg-green-50"
              }`}
            >
              My Clubs ({joinedClubs.length})
            </button>
          </div>
        </section>

        {/* Clubs Grid */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {currentView === "all" ? "All Student Clubs" : "My Joined Clubs"}{" "}
            <span className="ml-2 bg-indigo-100 text-indigo-800 text-sm font-medium px-2 py-0.5 rounded-full">
              {filteredClubs.length}
            </span>
          </h2>

          {filteredClubs.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredClubs.map((club) => (
                  <div
                    key={club.id}
                    className={`border-l-4 ${getCategoryColor(
                      club.category
                    )} bg-white rounded-xl shadow-md hover:shadow-xl transition-all`}
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white border rounded-lg">
                            {getCategoryIcon(club.category)}
                          </div>
                          <h3 className="text-xl font-bold text-gray-800">{club.name}</h3>
                        </div>
                        <span className="bg-indigo-50 text-indigo-800 text-xs font-medium px-2 py-0.5 rounded-full">
                          {club.category}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">{club.description}</p>
                      <div className="flex justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center gap-1">
                          <FaUsers />
                          {club.member_count} members
                        </div>
                        <div>Meeting: {club.meeting_day}</div>
                      </div>

                      {currentView === "all" ? (
                        joinedClubs.some((j) => j.id === club.id) ? (
                          <button className="w-full bg-green-100 text-green-700 py-2.5 rounded-lg font-medium cursor-not-allowed flex justify-center items-center gap-2">
                            <FaCheckCircle /> Joined
                          </button>
                        ) : (
                          <button
                            onClick={() => handleJoin(club.id)}
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2.5 rounded-lg font-medium shadow hover:shadow-md transition-all"
                          >
                            Join Club
                          </button>
                        )
                      ) : (
                        <button
                          onClick={() => handleLeave(club.id)}
                          className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white py-2.5 rounded-lg font-medium shadow hover:shadow-md transition-all flex justify-center items-center gap-2"
                        >
                          <FaSignOutAlt /> Leave Club
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Controls - Only show for "all" view */}
              {currentView === "all" && totalPages > 1 && (
                <div className="mt-8 flex justify-center items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-full ${
                      currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition'
                    }`}
                  >
                    <FaChevronLeft className="w-5 h-5" />
                  </button>

                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handlePageChange(index + 1)}
                      className={`w-8 h-8 rounded-full font-medium transition ${
                        currentPage === index + 1
                          ? 'bg-indigo-600 text-white'
                          : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-full ${
                      currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition'
                    }`}
                  >
                    <FaChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-10 text-center mt-10">
              <FaUsers className="text-4xl text-gray-400 mb-4 mx-auto" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">No Clubs Found</h3>
              <p className="text-gray-600 mb-4">
                {currentView === "all"
                  ? "Try a different search term."
                  : "You haven't joined any clubs yet."}
              </p>
              <button
                onClick={() => {
                  setCurrentView("all");
                  setSearch("");
                  setCurrentPage(1);
                }}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-2.5 px-6 rounded-lg shadow hover:shadow-md transition-all"
              >
                Browse All Clubs
              </button>
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="text-center text-sm text-gray-500 mt-12 border-t pt-6">
          © 2023 EduClub Portal. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default Home;
