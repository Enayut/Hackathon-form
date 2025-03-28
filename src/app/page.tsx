"use client";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import "./globals.css"; // Updated import to use the global CSS file
import { motion, AnimatePresence } from "framer-motion";

// Define interfaces for type safety
type TeammateData = {
  name: string;
  uid: string;
  branch: string;
  foodPreference: string;
  tshirt: string;
  phoneNumber: string;
};

type FormData = {
  leaderName: string;
  leaderUID: string;
  leaderBranch: string;
  leaderFoodPreference: string;
  leaderTShirt: string;
  leaderEmail: string;
  leaderPhone: string;
  teamName: string;
  teammates: TeammateData[];
};

// Define props interfaces for components
interface TeammateProps {
  onSubmit: (teammateData: TeammateData) => void;
  teamName: string;
  leaderName: string;
  onBack: () => void;
  teammateCount: number;
  maxTeamSize: number;
  onFinalSubmit: () => void;
  canSubmitFinal: boolean;
  addedTeammates: TeammateData[];
}

interface PaymentProps {
  teamName: string;
  memberCount: number;
  leaderName: string;
  teammates: TeammateData[];
  onBack: () => void;
  onComplete: () => void;
}

function App() {
  // Update state to include "payment" as a possible page
  const [page, setPage] = useState<"leader" | "teammate" | "payment">("leader");
  const [formData, setFormData] = useState<FormData>({
    leaderName: "",
    leaderUID: "",
    leaderBranch: "",
    leaderFoodPreference: "",
    leaderTShirt: "",
    leaderEmail: "",
    leaderPhone: "",
    teamName: "",
    teammates: [],
  });
  const [loading, setLoading] = useState<boolean>(true);

  // Page load animation
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Max team size (including leader)
  const MAX_TEAM_SIZE = 4;

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Leader's Name:", formData.leaderName); // Log the leader's name
    setPage("teammate");
  };

  const handleTeammateSubmit = (teammateData: TeammateData) => {
    // Check if adding another teammate would exceed the limit
    if (formData.teammates.length >= MAX_TEAM_SIZE - 1) {
      alert(
        `Team size cannot exceed ${MAX_TEAM_SIZE} members (including leader)`
      );
      return;
    }

    setFormData({
      ...formData,
      teammates: [...formData.teammates, teammateData],
    });
    console.log("Full form data:", formData);
  };

  const handleFinalSubmit = () => {
    // Ensure there's at least one teammate before final submission
    if (formData.teammates.length < 1) {
      alert("You need at least one teammate to register a team");
      return;
    }

    // Navigate to payment page instead of showing alert and resetting
    setPage("payment");
  };

  // Add visual feedback on input focus
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleFocus = (fieldName: string) => {
    setFocusedField(fieldName);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  // Progress indicator
  const getProgress = () => {
    switch (page) {
      case "leader":
        return { width: "33%", text: "Step 1 of 3" };
      case "teammate":
        return { width: "66%", text: "Step 2 of 3" };
      case "payment":
        return { width: "100%", text: "Step 3 of 3" };
      default:
        return { width: "0%", text: "" };
    }
  };

  // Add condition to render Payment component
  if (page === "payment") {
    return (
      <Payment
        teamName={formData.teamName}
        memberCount={formData.teammates.length + 1}
        leaderName={formData.leaderName}
        teammates={formData.teammates}
        onBack={() => setPage("teammate")}
        onComplete={() => {
          setFormData({
            leaderName: "",
            leaderUID: "",
            leaderBranch: "",
            leaderFoodPreference: "",
            leaderTShirt: "",
            leaderEmail: "",
            leaderPhone: "",
            teamName: "",
            teammates: [],
          });
          setPage("leader");
        }}
      />
    );
  }

  if (page === "teammate") {
    return (
      <Teammate
        onSubmit={handleTeammateSubmit}
        teamName={formData.teamName}
        onBack={() => setPage("leader")}
        teammateCount={formData.teammates.length}
        maxTeamSize={MAX_TEAM_SIZE}
        onFinalSubmit={handleFinalSubmit}
        canSubmitFinal={formData.teammates.length >= 1}
        addedTeammates={formData.teammates}
        leaderName={formData.leaderName}
      />
    );
  }

  return (
    <AnimatePresence>
      {loading ? (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-gray-900 z-50"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 360],
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
            }}
            className="w-16 h-16 rounded-full border-t-4 border-b-4 border-purple-500"
          />
        </motion.div>
      ) : (
        <motion.div
          className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          style={{
            backgroundImage:
              "url('https://i.pinimg.com/736x/ab/b8/90/abb8903ab4daab208e95a3fd4807d0ef.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            position: "relative",
          }}
        >
          {/* Animated background overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 to-pink-900/30 animate-gradient-slow"></div>

          <motion.div
            className="w-full max-w-4xl bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border-2 border-transparent relative z-10"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{
              boxShadow: "0 0 25px 8px rgba(168,85,247,0.4)",
              borderColor: "rgba(168,85,247,0.6)",
            }}
          >
            <div className="px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10">
              {/* Progress indicator */}
              <div className="mb-8 flex justify-center">
                <div className="w-1/2 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-600 to-pink-500 rounded-full"
                    style={{ width: getProgress().width }}
                  ></div>
                </div>
                <div className="ml-3 text-xs text-pink-300">
                  {getProgress().text}
                </div>
              </div>

              {/* Responsive Banner Image */}
              <motion.div
                className="mb-6 sm:mb-8 flex items-center justify-center"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <img
                  src="https://i.ibb.co/4n3msVrc/SEHACKKKKK-2.png"
                  alt="Hackathon Banner"
                  className="w-full max-w-[1000px] rounded-2xl shadow-lg"
                />
              </motion.div>

              {/* Responsive Title */}
              <motion.div
                className="text-center mb-6 sm:mb-8 md:mb-10"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <h2 className="text-transparent bg-clip-text font-bold text-2xl sm:text-3xl md:text-4xl bg-gradient-to-r from-pink-500 to-purple-600 animate-text-shimmer">
                  Team Leader Registration
                </h2>
                <p className="text-gray-400 mt-2 text-sm sm:text-base">
                  Complete your hackathon registration details
                </p>
              </motion.div>

              <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
                {/* Responsive Grid for Form Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <motion.div
                    whileHover={{ y: -2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className={
                      focusedField === "leaderName"
                        ? "ring-2 ring-purple-500/50 rounded-xl p-1"
                        : "p-1"
                    }
                  >
                    <label className="block text-pink-300 mb-2 text-xs sm:text-sm">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="leaderName"
                      value={formData.leaderName}
                      onChange={handleChange}
                      onFocus={() => handleFocus("leaderName")}
                      onBlur={handleBlur}
                      required
                      className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-gray-700/90 border border-pink-700/40 rounded-xl text-pink-200 text-sm sm:text-base
                        focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                      placeholder="Enter your full name"
                    />
                  </motion.div>

                  <motion.div
                    whileHover={{ y: -2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className={
                      focusedField === "teamName"
                        ? "ring-2 ring-purple-500/50 rounded-xl p-1"
                        : "p-1"
                    }
                  >
                    <label className="block text-pink-300 mb-2 text-xs sm:text-sm">
                      Team Name
                    </label>
                    <input
                      type="text"
                      name="teamName"
                      value={formData.teamName}
                      onChange={handleChange}
                      onFocus={() => handleFocus("teamName")}
                      onBlur={handleBlur}
                      required
                      className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-gray-700/90 border border-pink-700/40 rounded-xl text-pink-200 text-sm sm:text-base
                        focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                      placeholder="Enter your team name"
                    />
                  </motion.div>
                </div>

                {/* Additional form fields with animations */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <motion.div
                    whileHover={{ y: -2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className={
                      focusedField === "leaderUID"
                        ? "ring-2 ring-purple-500/50 rounded-xl p-1"
                        : "p-1"
                    }
                  >
                    <label className="block text-pink-300 mb-2 text-xs sm:text-sm">
                      UID
                    </label>
                    <input
                      type="text"
                      name="leaderUID"
                      value={formData.leaderUID}
                      onChange={handleChange}
                      onFocus={() => handleFocus("leaderUID")}
                      onBlur={handleBlur}
                      required
                      className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-gray-700/90 border border-pink-700/40 rounded-xl text-pink-200 text-sm sm:text-base
                        focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                      placeholder="Enter your UID"
                    />
                  </motion.div>

                  <motion.div
                    whileHover={{ y: -2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className={
                      focusedField === "leaderBranch"
                        ? "ring-2 ring-purple-500/50 rounded-xl p-1"
                        : "p-1"
                    }
                  >
                    <label className="block text-pink-300 mb-2 text-xs sm:text-sm">
                      Branch
                    </label>
                    <select
                      name="leaderBranch"
                      value={formData.leaderBranch}
                      onChange={handleChange}
                      onFocus={() => handleFocus("leaderBranch")}
                      onBlur={handleBlur}
                      required
                      className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-gray-700/90 border border-pink-700/40 rounded-xl text-pink-200 text-sm sm:text-base
                        focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    >
                      <option value="">Select Branch</option>
                      <option value="CSE">CSE</option>
                      <option value="COMPS AB">COMPS AB</option>
                      <option value="COMPS CD">COMPS CD</option>
                      <option value="EXTC">EXTC</option>
                    </select>
                  </motion.div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <motion.div
                    whileHover={{ y: -2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className={
                      focusedField === "leaderFoodPreference"
                        ? "ring-2 ring-purple-500/50 rounded-xl p-1"
                        : "p-1"
                    }
                  >
                    <label className="block text-pink-300 mb-2 text-xs sm:text-sm">
                      Food Preference
                    </label>
                    <select
                      name="leaderFoodPreference"
                      value={formData.leaderFoodPreference}
                      onChange={handleChange}
                      onFocus={() => handleFocus("leaderFoodPreference")}
                      onBlur={handleBlur}
                      required
                      className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-gray-700/90 border border-pink-700/40 rounded-xl text-pink-200 text-sm sm:text-base
                        focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    >
                      <option value="">Select Food Preference</option>
                      <option value="Veg">Veg</option>
                      <option value="Jain">Jain</option>
                    </select>
                  </motion.div>

                  <motion.div
                    whileHover={{ y: -2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className={
                      focusedField === "leaderTShirt"
                        ? "ring-2 ring-purple-500/50 rounded-xl p-1"
                        : "p-1"
                    }
                  >
                    <label className="block text-pink-300 mb-2 text-xs sm:text-sm">
                      Hackathon T-Shirt
                    </label>
                    <select
                      name="leaderTShirt"
                      value={formData.leaderTShirt}
                      onChange={handleChange}
                      onFocus={() => handleFocus("leaderTShirt")}
                      onBlur={handleBlur}
                      required
                      className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-gray-700/90 border border-pink-700/40 rounded-xl text-pink-200 text-sm sm:text-base
                        focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </motion.div>
                </div>

                {/* New row for email and phone fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <motion.div
                    whileHover={{ y: -2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className={
                      focusedField === "leaderEmail"
                        ? "ring-2 ring-purple-500/50 rounded-xl p-1"
                        : "p-1"
                    }
                  >
                    <label className="block text-pink-300 mb-2 text-xs sm:text-sm">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="leaderEmail"
                      value={formData.leaderEmail}
                      onChange={handleChange}
                      onFocus={() => handleFocus("leaderEmail")}
                      onBlur={handleBlur}
                      required
                      className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-gray-700/90 border border-pink-700/40 rounded-xl text-pink-200 text-sm sm:text-base
                        focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                      placeholder="Enter your email address"
                    />
                  </motion.div>

                  <motion.div
                    whileHover={{ y: -2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className={
                      focusedField === "leaderPhone"
                        ? "ring-2 ring-purple-500/50 rounded-xl p-1"
                        : "p-1"
                    }
                  >
                    <label className="block text-pink-300 mb-2 text-xs sm:text-sm">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="leaderPhone"
                      value={formData.leaderPhone}
                      onChange={handleChange}
                      onFocus={() => handleFocus("leaderPhone")}
                      onBlur={handleBlur}
                      required
                      className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-gray-700/90 border border-pink-700/40 rounded-xl text-pink-200 text-sm sm:text-base
                        focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                      placeholder="Enter your phone number"
                    />
                  </motion.div>
                </div>

                <div className="mt-6 sm:mt-8 flex justify-end">
                  <motion.button
                    type="submit"
                    className="w-full py-3 sm:py-4 bg-gradient-to-r from-purple-700 to-pink-600 text-white rounded-xl 
                    text-sm sm:text-base shadow-xl relative overflow-hidden group"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-600 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    <span className="relative flex items-center justify-center">
                      Next: Add Teammates
                      <svg
                        className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5-5 5M5 12h13"
                        />
                      </svg>
                    </span>
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Teammate({
  onSubmit,
  teamName,
  leaderName,
  onBack,
  teammateCount,
  maxTeamSize,
  onFinalSubmit,
  canSubmitFinal,
}: TeammateProps) {
  const [teammateData, setTeammateData] = useState<TeammateData>({
    name: "",
    uid: "",
    phoneNumber: "",
    branch: "",
    foodPreference: "",
    tshirt: "",
  });
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [teammates, setTeammates] = useState<TeammateData[]>([]); // Store all teammates

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTeammateData({
      ...teammateData,
      [name]: value,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTeammates([...teammates, teammateData]); // Add current teammate to the list
    onSubmit(teammateData);
    // Reset form after submission
    setTeammateData({
      name: "",
      uid: "",
      phoneNumber: "",
      branch: "",
      foodPreference: "",
      tshirt: "",
    });
  };

  const handleFocus = (fieldName: string) => {
    setFocusedField(fieldName);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      style={{
        backgroundImage:
          "url('https://i.pinimg.com/736x/ab/b8/90/abb8903ab4daab208e95a3fd4807d0ef.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        position: "relative",
      }}
    >
      {/* Animated background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 to-pink-900/30 animate-gradient-slow"></div>

      <motion.div
        className="w-full max-w-4xl bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border-2 border-transparent relative z-10"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        whileHover={{
          boxShadow: "0 0 25px 8px rgba(168,85,247,0.4)",
          borderColor: "rgba(168,85,247,0.6)",
        }}
      >
        <div className="px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10">
          {/* Progress indicator */}
          <div className="mb-8 flex justify-center">
            <div className="w-1/2 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-600 to-pink-500 rounded-full"
                style={{ width: "100%" }}
              ></div>
            </div>
            <div className="ml-3 text-xs text-pink-300">Step 2 of 2</div>
          </div>

          {/* Responsive Banner Image */}
          <motion.div
            className="mb-6 sm:mb-8 flex items-center justify-center"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <img
              src="https://i.ibb.co/4n3msVrc/SEHACKKKKK-2.png"
              alt="Hackathon Banner"
              className="w-full max-w-[1000px] rounded-2xl shadow-lg"
            />
          </motion.div>

          {/* Responsive Title */}
          <motion.div
            className="text-center mb-6 sm:mb-8 md:mb-10"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h2 className="text-transparent bg-clip-text font-bold text-2xl sm:text-3xl md:text-4xl bg-gradient-to-r from-pink-500 to-purple-600 animate-text-shimmer">
              Team {teamName} - Add Teammates
            </h2>
            <p className="text-gray-400 mt-2 text-sm sm:text-base">
              Total Teammates: {teammateCount + 1} of {maxTeamSize} (max)
            </p>
          </motion.div>

          <div className="mb-6 text-center">
            <motion.div
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-800 to-purple-900 rounded-full"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <span className="text-purple-300 text-sm font-medium">
                {teammateCount} {teammateCount === 1 ? "teammate" : "teammates"}{" "}
                added so far
              </span>
            </motion.div>
          </div>

          <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
            {/* Responsive Grid for Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <motion.div
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 300 }}
                className={
                  focusedField === "name"
                    ? "ring-2 ring-purple-500/50 rounded-xl p-1"
                    : "p-1"
                }
              >
                <label className="block text-pink-300 mb-2 text-xs sm:text-sm">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={teammateData.name}
                  onChange={handleChange}
                  onFocus={() => handleFocus("name")}
                  onBlur={handleBlur}
                  required
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-gray-700/90 border border-pink-700/40 rounded-xl text-pink-200 text-sm sm:text-base
                      focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter teammate's full name"
                />
              </motion.div>

              <motion.div
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 300 }}
                className={
                  focusedField === "uid"
                    ? "ring-2 ring-purple-500/50 rounded-xl p-1"
                    : "p-1"
                }
              >
                <label className="block text-pink-300 mb-2 text-xs sm:text-sm">
                  UID
                </label>
                <input
                  type="text"
                  name="uid"
                  value={teammateData.uid}
                  onChange={handleChange}
                  onFocus={() => handleFocus("uid")}
                  onBlur={handleBlur}
                  required
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-gray-700/90 border border-pink-700/40 rounded-xl text-pink-200 text-sm sm:text-base
                      focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter teammate's UID"
                />
              </motion.div>

              {/* Add Phone Number Field */}
              <motion.div
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 300 }}
                className={
                  focusedField === "phoneNumber"
                    ? "ring-2 ring-purple-500/50 rounded-xl p-1"
                    : "p-1"
                }
              >
                <label className="block text-pink-300 mb-2 text-xs sm:text-sm">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={teammateData.phoneNumber}
                  onChange={handleChange}
                  onFocus={() => handleFocus("phoneNumber")}
                  onBlur={handleBlur}
                  required
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-gray-700/90 border border-pink-700/40 rounded-xl text-pink-200 text-sm sm:text-base
                      focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter teammate's phone number"
                  pattern="[0-9]{10}"
                  title="Please enter a valid 10-digit phone number"
                />
              </motion.div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <motion.div
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 300 }}
                className={
                  focusedField === "branch"
                    ? "ring-2 ring-purple-500/50 rounded-xl p-1"
                    : "p-1"
                }
              >
                <label className="block text-pink-300 mb-2 text-xs sm:text-sm">
                  Branch
                </label>
                <select
                  name="branch"
                  value={teammateData.branch}
                  onChange={handleChange}
                  onFocus={() => handleFocus("branch")}
                  onBlur={handleBlur}
                  required
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-gray-700/90 border border-pink-700/40 rounded-xl text-pink-200 text-sm sm:text-base
                      focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                >
                  <option value="">Select Branch</option>
                  <option value="CSE">CSE</option>
                  <option value="COMPS AB">COMPS AB</option>
                  <option value="COMPS CD">COMPS CD</option>
                  <option value="EXTC">EXTC</option>
                </select>
              </motion.div>

              <motion.div
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 300 }}
                className={
                  focusedField === "foodPreference"
                    ? "ring-2 ring-purple-500/50 rounded-xl p-1"
                    : "p-1"
                }
              >
                <label className="block text-pink-300 mb-2 text-xs sm:text-sm">
                  Food Preference
                </label>
                <select
                  name="foodPreference"
                  value={teammateData.foodPreference}
                  onChange={handleChange}
                  onFocus={() => handleFocus("foodPreference")}
                  onBlur={handleBlur}
                  required
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-gray-700/90 border border-pink-700/40 rounded-xl text-pink-200 text-sm sm:text-base
                      focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                >
                  <option value="">Select Food Preference</option>
                  <option value="Veg">Veg</option>
                  <option value="Jain">Jain</option>
                </select>
              </motion.div>

              <motion.div
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 300 }}
                className={
                  focusedField === "tshirt"
                    ? "ring-2 ring-purple-500/50 rounded-xl p-1"
                    : "p-1"
                }
              >
                <label className="block text-pink-300 mb-2 text-xs sm:text-sm">
                  Hackathon T-Shirt
                </label>
                <select
                  name="tshirt"
                  value={teammateData.tshirt}
                  onChange={handleChange}
                  onFocus={() => handleFocus("tshirt")}
                  onBlur={handleBlur}
                  required
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-gray-700/90 border border-pink-700/40 rounded-xl text-pink-200 text-sm sm:text-base
                      focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                >
                  <option value="">Select Option</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </motion.div>
            </div>

            <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <motion.button
                type="button"
                onClick={onBack}
                className="py-3 sm:py-4 bg-gray-700 text-white rounded-xl text-sm sm:text-base
                  hover:bg-gray-600 transition duration-300 ease-in-out flex items-center justify-center"
                whileHover={{ scale: 1.02, backgroundColor: "rgb(75, 85, 99)" }}
                whileTap={{ scale: 0.98 }}
              >
                <svg
                  className="mr-2 w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to Leader Info
              </motion.button>

              <motion.button
                type="submit"
                className="py-3 sm:py-4 bg-gradient-to-r from-purple-700 to-pink-600 text-white rounded-xl 
                  text-sm sm:text-base relative overflow-hidden group"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                disabled={teammateCount >= maxTeamSize - 1}
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-600 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative flex items-center justify-center">
                  Add Teammate
                  <svg
                    className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </span>
              </motion.button>

              <motion.button
                type="button"
                onClick={onFinalSubmit}
                disabled={!canSubmitFinal}
                className={`py-3 sm:py-4 text-white rounded-xl text-sm sm:text-base relative overflow-hidden group
                    ${
                      canSubmitFinal
                        ? "bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600"
                        : "bg-gray-500 cursor-not-allowed"
                    }`}
                whileHover={canSubmitFinal ? { scale: 1.03 } : {}}
                whileTap={canSubmitFinal ? { scale: 0.97 } : {}}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                {canSubmitFinal && (
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-green-500 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                )}
                <span className="relative flex items-center justify-center">
                  Complete Registration
                  <svg
                    className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
              </motion.button>
            </div>
          </form>

          {teammateCount > 0 && (
            <motion.div
              className="mt-8 border-t border-gray-700 pt-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-lg text-purple-300 font-medium mb-4 flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                Current Team ({teammateCount + 1} members)
              </h3>
              <div className="bg-gray-800/60 rounded-xl p-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <motion.div
                    className="bg-purple-900/40 p-3 rounded-lg border border-purple-700/30"
                    whileHover={{
                      scale: 1.02,
                      boxShadow: "0 5px 15px rgba(168, 85, 247, 0.2)",
                    }}
                  >
                    <div className="text-purple-300 font-medium">Leader</div>
                    <div className="text-white">{leaderName}</div>{" "}
                  </motion.div>

                  <AnimatePresence>
                    {teammates.map((teammate, i) => (
                      <motion.div
                        key={i}
                        className="bg-pink-900/40 p-3 rounded-lg border border-pink-700/30"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        whileHover={{
                          scale: 1.02,
                          boxShadow: "0 5px 15px rgba(236, 72, 153, 0.2)",
                        }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="text-pink-300 font-medium">
                          Teammate {i + 1}
                        </div>
                        <div className="text-white">{teammate.name}</div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}

          <motion.div
            className="text-center mt-8 text-gray-400 text-xs sm:text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            Need to start over?
            <motion.button
              onClick={onBack}
              className="text-pink-500 hover:text-pink-400 ml-2 inline-block"
              whileHover={{
                scale: 1.05,
                textShadow: "0 0 8px rgb(236 72 153 / 0.6)",
              }}
            >
              Return to leader form
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Payment({
  teamName,
  memberCount,
  onBack,
  onComplete,
  leaderName,
  teammates = [],
}: PaymentProps) {
  const totalAmount = 200;
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionStatus, setSubmissionStatus] = useState<{
    success?: boolean;
    message?: string;
  }>({});
  // Add state for file upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Function to handle file selection
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setUploadError(null);

    if (file) {
      // Check file type
      if (!file.type.match("image.*")) {
        setUploadError("Please select an image file (JPEG, PNG)");
        return;
      }

      // Check file size (limit to 50MB)
      if (file.size > 50 * 1024 * 1024) {
        setUploadError("Image size should be less than 50MB");
        return;
      }

      setSelectedFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to Cloudinary
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "hackathon"); // Use your upload preset or create one in Cloudinary dashboard
        // Extract cloud name from CLOUDINARY_URL in .env
        // Format typically: cloudinary://api_key:api_secret@cloud_name
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME; // Extracted from your CLOUDINARY_URL
        
        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to upload image to Cloudinary");
        }

        const data = await response.json();
        if (data && data.secure_url) {
          setBase64Image(data.secure_url); // Cloudinary returns secure_url for the uploaded image
        } else {
          setUploadError("Failed to retrieve image URL from Cloudinary");
        }
      } catch (error) {
        console.error("Image upload error:", error);
        setUploadError("An error occurred while uploading the image");
      }
    } else {
      setSelectedFile(null);
      setImagePreview(null);
      setBase64Image(null);
    }
  };

  const handleFormSubmit = async () => {
    // Validate that payment proof is uploaded
    if (!base64Image) {
      setUploadError("Please upload payment screenshot before submitting");
      return;
    }

    setIsSubmitting(true);

    try {
      // Format data for the API
      const formattedTeammates = teammates.map((teammate) => ({
        name: teammate.name,
        uid: teammate.uid,
        branch: teammate.branch,
        diet: teammate.foodPreference,
        tShirt: teammate.tshirt === "Yes" ? true : false,
      }));

      // Create params object
      const params = new URLSearchParams();

      // Add leader and team info
      params.append("leaderName", leaderName);
      params.append("leaderUID", teammates[0]?.uid || ""); // We need to store leader UID
      params.append("leaderBranch", teammates[0]?.branch || ""); // We need to store leader branch
      params.append("leaderDiet", teammates[0]?.foodPreference || "Veg");
      params.append("teamName", teamName);
      params.append(
        "leaderTShirt",
        teammates[0]?.tshirt === "Yes" ? "true" : "false"
      );

      // Add teammates info as JSON
      params.append("teammates", JSON.stringify(formattedTeammates));

      // Add payment confirmation with the base64 image
      params.append("paymentProof", base64Image || "");
      console.log(base64Image);
      // Construct URL with query parameters - using a placeholder URL
      // In production, this should come from environment variables
      const url = `${process.env.NEXT_PUBLIC_BASE_URL}${params.toString()}`;
      console.log("Submitting registration data:", url);

      const response = await fetch(url, {
        method: "GET", // Using GET with query parameters for Google Apps Script
        mode: "no-cors", // Important for cross-origin requests to Google Apps Script
      });

      // Since we're using no-cors, we can't read the response status directly
      // We'll assume success unless there's an error
      console.log(response);
      console.log("Submission complete!");
      setSubmissionStatus({
        success: true,
        message:
          "Registration submitted successfully! Thank you for registering.",
      });

      // After short delay, call onComplete to reset the form
      setTimeout(() => {
        onComplete();
      }, 3000);
    } catch (error) {
      console.error("Submission error:", error);
      setSubmissionStatus({
        success: false,
        message:
          "An error occurred during submission. Please try again or contact support.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // If submission was successful, show success message
  if (submissionStatus.success) {
    return (
      <motion.div
        className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        style={{
          backgroundImage:
            "url('https://i.pinimg.com/736x/ab/b8/90/abb8903ab4daab208e95a3fd4807d0ef.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          position: "relative",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 to-pink-900/30 animate-gradient-slow"></div>

        <motion.div
          className="w-full max-w-md bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border-2 border-green-500/50 relative z-10 p-8"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center">
            <motion.div
              className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-500/20 mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
            >
              <svg
                className="h-10 w-10 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </motion.div>

            <h2 className="mt-4 text-2xl font-bold text-white">
              Registration Successful!
            </h2>
            <p className="mt-3 text-green-300">{submissionStatus.message}</p>

            <p className="mt-6 text-sm text-gray-300">
              You will receive a confirmation email shortly. If you have any
              questions, please contact us.
            </p>

            <motion.button
              onClick={onComplete}
              className="mt-8 w-full py-3 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-xl"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Register Another Team
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  // If submission failed, show error message
  if (submissionStatus.message && !submissionStatus.success) {
    return (
      <motion.div
        className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        style={{
          backgroundImage:
            "url('https://i.pinimg.com/736x/ab/b8/90/abb8903ab4daab208e95a3fd4807d0ef.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          position: "relative",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 to-pink-900/30 animate-gradient-slow"></div>

        <motion.div
          className="w-full max-w-md bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border-2 border-red-500/50 relative z-10 p-8"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center">
            <motion.div
              className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-500/20 mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
            >
              <svg
                className="h-10 w-10 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </motion.div>

            <h2 className="mt-4 text-2xl font-bold text-white">
              Registration Failed
            </h2>
            <p className="mt-3 text-red-300">{submissionStatus.message}</p>

            <div className="mt-8 flex space-x-4">
              <motion.button
                onClick={() => setSubmissionStatus({})}
                className="flex-1 py-3 bg-gray-700 text-white rounded-xl"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Try Again
              </motion.button>

              <motion.button
                onClick={onBack}
                className="flex-1 py-3 bg-gradient-to-r from-purple-700 to-pink-600 text-white rounded-xl"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Back
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      style={{
        backgroundImage:
          "url('https://i.pinimg.com/736x/ab/b8/90/abb8903ab4daab208e95a3fd4807d0ef.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        position: "relative",
      }}
    >
      {/* Animated background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 to-pink-900/30 animate-gradient-slow"></div>

      <motion.div
        className="w-full max-w-4xl bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border-2 border-transparent relative z-10"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        whileHover={{
          boxShadow: "0 0 25px 8px rgba(168,85,247,0.4)",
          borderColor: "rgba(168,85,247,0.6)",
        }}
      >
        <div className="px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10">
          {/* Progress indicator */}
          <div className="mb-8 flex justify-center">
            <div className="w-1/2 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-600 to-pink-500 rounded-full"
                style={{ width: "100%" }}
              ></div>
            </div>
            <div className="ml-3 text-xs text-pink-300">Final Step</div>
          </div>

          {/* Responsive Banner Image */}
          <motion.div
            className="mb-6 sm:mb-8 flex items-center justify-center"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <img
              src="https://i.ibb.co/6SKwHvH/SEHACKKKKK.png"
              alt="Hackathon Banner"
              className="w-full max-w-[1000px] rounded-2xl shadow-lg"
            />
          </motion.div>

          {/* Responsive Title */}
          <motion.div
            className="text-center mb-6 sm:mb-8 md:mb-10"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h2 className="text-transparent bg-clip-text font-bold text-2xl sm:text-3xl md:text-4xl bg-gradient-to-r from-pink-500 to-purple-600 animate-text-shimmer">
              Complete Payment
            </h2>
            <p className="text-gray-400 mt-2 text-sm sm:text-base">
              Team {teamName} - {memberCount}{" "}
              {memberCount === 1 ? "member" : "members"}
            </p>
          </motion.div>

          <div className="bg-gray-700/50 rounded-2xl p-6 mb-8">
            <h3 className="text-xl text-purple-300 font-medium mb-4 text-center">
              Payment Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-gray-800/60 p-4 rounded-xl">
                  <div className="text-gray-400 text-sm">Team Name</div>
                  <div className="text-white font-medium">{teamName}</div>
                </div>

                <div className="bg-gray-800/60 p-4 rounded-xl">
                  <div className="text-gray-400 text-sm">Team Members</div>
                  <div className="text-white font-medium">
                    <div className="flex items-center mt-1">
                      {leaderName}
                      <span className="bg-purple-600 text-xs px-2 py-1 rounded mr-2">
                        Leader
                      </span>
                    </div>
                    {teammates.map((teammate, index) => (
                      <div key={index} className="mt-1">
                        {teammate.name}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-purple-900/40 p-4 rounded-xl border border-purple-500/30">
                  <div className="text-purple-300 text-sm">
                    Registration Fee
                  </div>
                  <div className="text-white font-bold text-xl">
                    ₹{totalAmount}
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center">
                <motion.div
                  className="bg-white p-4 rounded-xl mb-4"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 0 20px rgba(168,85,247,0.5)",
                  }}
                >
                  {/* Placeholder QR code image - updated to use the fixed amount */}
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=UPI://pay?pa=example@upi&pn=SE-HACK&am=400&cu=INR"
                    alt="Payment QR Code"
                    className="w-48 h-48 sm:w-56 sm:h-56"
                  />
                </motion.div>
                <p className="text-pink-300 text-sm font-medium mb-2">
                  Scan to pay via UPI
                </p>
                <p className="text-gray-400 text-xs text-center">
                  After payment, take a screenshot of the payment confirmation
                </p>
              </div>
            </div>
          </div>

          {/* Payment Screenshot Upload Section */}
          <div className="bg-gray-700/50 rounded-2xl p-6 mb-8">
            <h3 className="text-lg text-purple-300 font-medium mb-4 text-center">
              Upload Payment Proof
            </h3>

            <div className="flex flex-col items-center">
              <motion.div
                className="border-2 border-dashed border-pink-400/50 rounded-xl p-6 w-full max-w-md text-center cursor-pointer hover:border-pink-400 transition-colors duration-300"
                whileHover={{ scale: 1.02 }}
                onClick={() =>
                  document.getElementById("payment-proof")?.click()
                }
              >
                <input
                  type="file"
                  id="payment-proof"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />

                {!imagePreview ? (
                  <div className="py-4">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4h-8m-12 0H8m12 0a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <p className="mt-1 text-sm text-gray-300">
                      Click to upload payment screenshot
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      PNG, JPG, JPEG up to 5MB
                    </p>
                  </div>
                ) : (
                  <div className="relative py-2">
                    <img
                      src={imagePreview}
                      alt="Payment proof"
                      className="max-h-64 mx-auto rounded-lg shadow-lg"
                    />
                    <button
                      type="button"
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFile(null);
                        setImagePreview(null);
                        setBase64Image(null);
                      }}
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                )}
              </motion.div>

              {uploadError && (
                <p className="mt-2 text-sm text-red-400">{uploadError}</p>
              )}

              {selectedFile && (
                <p className="mt-2 text-sm text-green-400">
                  File &quot;{selectedFile.name}&quot; selected (
                  {Math.round(selectedFile.size / 1024)} KB)
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <motion.button
              type="button"
              onClick={onBack}
              className="py-3 sm:py-4 bg-gray-700 text-white rounded-xl text-sm sm:text-base
                hover:bg-gray-600 transition duration-300 ease-in-out flex items-center justify-center"
              whileHover={{ scale: 1.02, backgroundColor: "rgb(75, 85, 99)" }}
              whileTap={{ scale: 0.98 }}
              disabled={isSubmitting}
            >
              <svg
                className="mr-2 w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Team Details
            </motion.button>

            <motion.button
              type="button"
              onClick={handleFormSubmit}
              className="py-3 sm:py-4 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-xl 
                text-sm sm:text-base relative overflow-hidden group"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              disabled={isSubmitting}
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-green-500 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative flex items-center justify-center">
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>
                    Complete Registration
                    <svg
                      className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </>
                )}
              </span>
            </motion.button>
          </div>

          <motion.div
            className="text-center mt-8 text-gray-400 text-xs sm:text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            Having trouble with payment?
            <motion.a
              href="#"
              className="text-pink-500 hover:text-pink-400 ml-2 inline-block"
              whileHover={{
                scale: 1.05,
                textShadow: "0 0 8px rgb(236 72 153 / 0.6)",
              }}
            >
              Contact support
            </motion.a>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default App;

