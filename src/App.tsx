import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './App.css'
import Navbar from './components/Layout/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import UserProfile from './pages/UserProfile'
import Dashboard from './pages/Dashboard'
import MyLostItems from './pages/MyLostItems'
import MyFoundItems from './pages/MyFoundItems'
import ItemsList from './pages/ItemsList'
import ItemDetail from './pages/ItemDetail'
import Claims from './pages/Claims'
import ReportLostItem from './pages/ReportLostItem'
import ReportFoundItem from './pages/ReportFoundItem'
import ReportedItems from './pages/ReportedItems'
import Favorites from './pages/Favorites'
import Notifications from './pages/Notifications'
import Messages from './pages/Messages'
import ClaimAppeal from './pages/ClaimAppeal'
import RegisteredItems from './pages/RegisteredItems'
import NotFoundPage from './pages/NotFoundPage.tsx'
import Footer from './components/Layout/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import AboutUs from './pages/AboutUs'
import ContactUs from './pages/ContactUs'
import Careers from './pages/Careers'
import Press from './pages/Press'
import Features from './pages/Features'
import Pricing from './pages/Pricing'
import News from './pages/News'
import Support from './pages/Support'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsAndConditions from './pages/TermsAndConditions'
import ScrollToTop from './components/ScrollToTop'

export default function App() {
	return (
		<BrowserRouter>
			<Toaster position="top-right" />
			<Navbar />
			<ScrollToTop/>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
				<Route path="/my-lost-items" element={<ProtectedRoute><MyLostItems /></ProtectedRoute>} />
				<Route path="/my-found-items" element={<ProtectedRoute><MyFoundItems /></ProtectedRoute>} />
				<Route path="/registered-items" element={<ProtectedRoute><RegisteredItems /></ProtectedRoute>} />
				<Route path="/claims" element={<ProtectedRoute><Claims /></ProtectedRoute>} />
				<Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />			<Route path="/profile/:username" element={<UserProfile />} />				<Route path="/items" element={<ItemsList />} />
				<Route path="/items/:id" element={<ItemDetail />} />
				<Route path="/items/lost/:id" element={<ItemDetail />} />
				<Route path="/items/found/:id" element={<ItemDetail />} />
				<Route path="/report-lost" element={<ReportLostItem />} />
				<Route path="/items/report/lost" element={<ReportLostItem />} />
				<Route path="/report-found" element={<ReportFoundItem />} />
				<Route path="/items/report/found" element={<ReportFoundItem />} />
				<Route path="/reported-items" element={<ProtectedRoute><ReportedItems /></ProtectedRoute>} />
				<Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
				<Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
				<Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
				<Route path="/claims/:id/appeal" element={<ProtectedRoute><ClaimAppeal /></ProtectedRoute>} />
				<Route path="/claims/appeal" element={<ProtectedRoute><ClaimAppeal /></ProtectedRoute>} />
				{/* Footer Pages */}
				<Route path="/about" element={<AboutUs />} />
				<Route path="/contact" element={<ContactUs />} />
				<Route path="/careers" element={<Careers />} />
				<Route path="/press" element={<Press />} />
				<Route path="/features" element={<Features />} />
				<Route path="/pricing" element={<Pricing />} />
				<Route path="/news" element={<News />} />
				<Route path="/support" element={<Support />} />
				<Route path="/privacy" element={<PrivacyPolicy />} />
				<Route path="/terms" element={<TermsAndConditions />} />
				<Route path="*" element={<NotFoundPage />} />
			</Routes>
			<Footer />
		</BrowserRouter>
	)
}
