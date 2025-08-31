import React, { useContext } from "react";
import Navbar from "../components/Navbar";
import { TopCategoriesSidebar, SportFieldsSidebar } from "../components/Sidebar"; // named imports
import TopOffersSidebar from "../components/TopOffersSidebar";
import OfferCard from "../components/OfferCard";
import Banner from "../components/Banner";
import Footer from "../components/Footer";
import { AuthContext } from "../context/AuthContext";
import SearchBar from "../components/SearchBar"; // ← add this


export default function Home() {
  const { user } = useContext(AuthContext);

  // Delete handler can be passed to OfferCard if needed
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/offers/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!res.ok) throw new Error("Delete failed");
      console.log("Offer deleted:", id);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <Navbar />
      <br />
      <br />
      <br />
      <br />
      <h1 className="maintext">დაჯავშნე გასართობი აქტივობები ერთ სივრცეში</h1>
      <h3 className="sidetext">გეიმინგი, სპორტი, გართობა - მარტივად, ერთ კლიკში.</h3>
      <SearchBar />
      <Banner />
      <TopOffersSidebar />

      {/* Top Categories Sidebar */}
      <TopCategoriesSidebar />

      {/* Sport Fields Sidebar */}
      <SportFieldsSidebar />

      {/* You can remove the All Offers grid completely if not needed */}
       <Footer />
    </div>
  );
}
