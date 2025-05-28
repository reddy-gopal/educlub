import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaCheckCircle , FaSignOutAlt, FaUserCircle} from "react-icons/fa";

const Home = () => {
    const [clubs, setClubs] = useState([]);
    const [joinedClubs, setJoinedClubs] = useState([]);
    const [currentView, setCurrentView] = useState('all');
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const accessToken = localStorage.getItem("access_token");
            if (!accessToken) {
                navigate("/");
                return;
            }

            try {
                const clubsResponse = await fetch("http://127.0.0.1:8000/clubs/", {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    }
                });

                if (!clubsResponse.ok) {
                    navigate("/");
                    return;
                }

                const clubsData = await clubsResponse.json();
                setClubs(clubsData);

                const joinedClubsResponse = await fetch("http://127.0.0.1:8000/user/clubs/", {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    }
                });

                if (joinedClubsResponse.ok) {
                    const joinedClubsData = await joinedClubsResponse.json();
                    setJoinedClubs(joinedClubsData);
                } else {
                    console.error("Failed to fetch joined clubs.");
                }

            } catch (error) {
                console.error("Error fetching data:", error);
                navigate("/");
            }
        };

        fetchData();
    }, [navigate]);

    const handleJoin = async (clubId) => {
        const accessToken = localStorage.getItem("access_token");
        if (!accessToken) {
            alert("You need to be logged in to join a club.");
            navigate("/");
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:8000/clubs/${clubId}/join/`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const club = clubs.find(c => c.id === clubId);
                setJoinedClubs(prev => [...prev, club]);
                alert("Successfully joined the club!");
            } else {
                alert("Failed to join the club.");
            }
        } catch (error) {
            console.error("Error joining club:", error);
        }
    };

    // Leave club handler
    const handleLeave = async (clubId) => {
        const accessToken = localStorage.getItem("access_token");
        if (!accessToken) {
            alert("You need to be logged in to leave a club.");
            navigate("/");
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:8000/clubs/${clubId}/leave/`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                setJoinedClubs(prev => prev.filter(c => c.id !== clubId));
                alert("You have left the club.");
            } else {
                alert("Failed to leave the club.");
            }
        } catch (error) {
            console.error("Error leaving club:", error);
        }
    };

    const filteredClubs = (currentView === 'all' ? clubs : joinedClubs).filter(club =>
        club.name.toLowerCase().includes(search.toLowerCase())
    );
    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("is_admin");
        navigate("/");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
            <div className="w-full max-w-6xl mx-auto px-4 py-10 bg-white/80 rounded-2xl shadow-lg">
                <div className="flex justify-between items-center mb-10">
                    <h1 className="text-4xl font-extrabold text-blue-800">
                        Student Club Portal
                    </h1>
                    <div className="flex items-center gap-4">
                        {/* Example: User Icon */}
                        <FaUserCircle className="text-2xl text-blue-700" />
                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 bg-red-100 hover:bg-red-200 text-red-600 px-3 py-1 rounded-lg font-semibold transition"
                        >
                            <FaSignOutAlt />
                            Logout
                        </button>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                    <div className="flex items-center border rounded-lg px-4 py-2 bg-white shadow-sm w-full sm:w-1/2">
                        <FaSearch className="text-gray-400 mr-2" />
                        <input
                            type="text"
                            placeholder="Search clubs..."
                            className="w-full outline-none text-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => setCurrentView('all')}
                            className={`px-6 py-2 rounded-full font-semibold border transition ${
                                currentView === 'all'
                                    ? 'bg-blue-700 text-white'
                                    : 'bg-white text-blue-700 border-blue-600 hover:bg-blue-100'
                            }`}
                        >
                            Browse Clubs
                        </button>
                        <button
                            onClick={() => setCurrentView('joined')}
                            className={`px-6 py-2 rounded-full font-semibold border transition ${
                                currentView === 'joined'
                                    ? 'bg-blue-700 text-white'
                                    : 'bg-white text-blue-700 border-blue-600 hover:bg-blue-100'
                            }`}
                        >
                            My Clubs ({joinedClubs.length})
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredClubs.length > 0 ? (
                        filteredClubs.map(club => (
                            <div key={club.id} className="backdrop-blur-sm bg-white/70 border border-gray-200 shadow-lg rounded-xl p-6">
                                <h3 className="text-2xl font-bold text-blue-900 mb-2">{club.name}</h3>
                                <p className="text-gray-700 mb-4 text-sm">{club.description}</p>
                                {currentView === 'all' && (
                                    joinedClubs.some(j => j.id === club.id) ? (
                                        <button className="flex items-center justify-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-md w-full cursor-not-allowed">
                                            <FaCheckCircle /> Joined
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleJoin(club.id)}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md w-full font-semibold"
                                        >
                                            Join Club
                                        </button>
                                    )
                                )}
                                {currentView === 'joined' && (
                                   <button
                                        onClick={() => handleLeave(club.id)}
                                        className="bg-red-100 hover:bg-red-200 text-red-600 font-medium px-4 py-2 rounded-md w-full flex items-center justify-center gap-2"
                                    >
                                        <FaSignOutAlt /> Leave Club
                                    </button>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center text-gray-500 mt-20">
                            <img src="https://illustrations.popsy.co/gray/user-research.svg" alt="No results" className="w-40 mx-auto mb-4" />
                            <p>No clubs found in this view.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;