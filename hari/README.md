# EV Charging Station Locator - Complete Web Application

A full-featured web application for finding, booking, and paying for electric vehicle charging stations with Google Maps integration.

## Features

### 🗺️ Map Integration
- Google Maps integration to display all charging stations
- Real-time location tracking
- Station markers with color coding (green = available, red = not available)
- Map controls for finding your location and refreshing stations

### 🔍 Station Search & Filtering
- Search stations by name or address
- Filter by availability status
- Filter fast charging stations
- Real-time distance calculation

### ⚡ Station Details
- Complete station information (address, phone, hours)
- Real-time availability status:
  - **Available**: Ready for charging
  - **In Use**: Currently occupied
  - **Maintenance**: Under maintenance
  - **Occupied**: Full capacity
- Multiple charger types with power ratings
- Location distance from user

### 📅 Booking System
- Select specific charger (only available ones)
- Choose booking start time
- Set charging duration
- Select vehicle type
- Real-time cost estimation based on:
  - Charger type and power
  - Duration of charging
  - Base fee per station
  - Per kWh pricing

### 💳 Payment Processing
- Multiple payment methods:
  - Credit/Debit Card
  - Digital Wallet
  - Bank Transfer
- Secure card details input with validation
- Cost breakdown showing:
  - Base fee
  - Charging cost
  - Total amount
- Detailed payment preview

### ✅ Booking Management
- Booking confirmation with details
- Booking history with all past bookings
- Reschedule bookings
- Cancel bookings
- View booking status and payment information

## Setup Instructions

### 1. Get Google Maps API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable the Maps JavaScript API
4. Create an API key
5. (Optional) Restrict the key to HTTP referrers for security

### 2. Replace API Key
In `index.html`, find this line:
```html
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY"></script>
```

Replace `YOUR_GOOGLE_MAPS_API_KEY` with your actual API key:
```html
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyD_BXK_9w0jYZ-Xh3VbZZZZZZZZZZZZZZ"></script>
```

### 3. File Structure
```
New folder/
├── index.html        (Main HTML structure)
├── styles.css        (All styling and responsive design)
├── script.js         (All JavaScript functionality)
└── README.md         (This file)
```

### 4. Running the Application
- Open `index.html` in any modern web browser
- Or use a local server:
  ```bash
  # Python 3
  python -m http.server 8000
  
  # Python 2
  python -m SimpleHTTPServer 8000
  
  # Node.js
  npx http-server
  ```
- Navigate to `http://localhost:8000`

## How to Use

### Finding a Station
1. **Click "Find My Location"** to center the map on your current location
2. **View nearby stations** on the map (green = available, red = unavailable)
3. **Search** by typing station name or address in the search box
4. **Filter** by checking "Available Only" or "Fast Charge Only"

### Booking a Charger
1. **Click a station** from the list or map to view details
2. **Review** availability, chargers, and pricing
3. **Select a charger** from the available options
4. **Set booking details**:
   - Start time
   - Duration (in hours)
   - Vehicle type
5. **Review estimated cost** and click "Book Now"

### Payment
1. **Review payment summary** with booking details
2. **Select payment method**:
   - Card: Enter card details (name, number, expiry, CVV)
   - Wallet/Bank: Additional methods available
3. **Review cost breakdown**
4. **Click "Pay Now"** to complete booking
5. **Confirmation** displays with booking ID and details

### Viewing Bookings
1. **Click "View My Bookings"** after confirmation
2. **View all past bookings** with status and details
3. **Reschedule or Cancel** existing bookings

## Mock Data

The application includes 4 pre-loaded charging stations with different characteristics:

1. **Downtown Charging Hub** - High availability fast charger
2. **Airport Station** - Multiple chargers with fast charging
3. **Shopping Mall Garage** - AC chargers in garage
4. **University Campus West** - Educational institution chargers

### Charger Types
- **DC Fast Chargers**: 350kW - Ultra-fast charging (High cost)
- **AC Chargers**: 7kW - Standard charging (Lower cost)

### Pricing Structure
- Base Fee: $1.00 - $2.50 (per booking)
- Per kWh: $0.25 - $0.40 (varies by station)

## Features Technical Details

### Data Storage
- Bookings are stored in browser's `localStorage`
- Persists across browser sessions
- No backend required (all frontend)

### Responsive Design
- Works on desktop, tablet, and mobile
- Adaptive layout changes based on screen size
- Touch-friendly buttons and controls

### Real-time Calculations
- Automatic distance calculation
- Live cost estimation
- Dynamic charger availability

### Notifications
- Toast notifications for all user actions
- Success, error, warning, and info messages
- Auto-dismiss after 3 seconds

## Browser Requirements
- Modern browsers with ES6 support
- JavaScript enabled
- Geolocation API support (for "Find My Location")
- Google Maps API access

## API Integration Notes

### Current Implementation
- Uses mock data for demonstration
- Local storage for bookings (frontend only)

### For Production Implementation
- Replace mock data with real API calls
- Implement backend for:
  - Real availability checking
  - Payment processing integration
  - Booking database
  - User authentication
  - Real-time notifications

## Future Enhancements
- User registration and authentication
- Real payment gateway integration
- Email/SMS booking confirmations
- Real-time charger availability via WebSocket
- Rating and review system
- Favorite stations
- Charging history analytics
- Carbon savings tracker
- Integration with vehicle APIs
- Multiple language support

## Troubleshooting

### Map not displaying
- Check your Google Maps API key
- Ensure API key is active in Google Cloud Console
- Verify Maps JavaScript API is enabled

### Bookings not saving
- Clear browser cache and cookies
- Check if localStorage is enabled
- Verify browser storage permissions

### Geolocation not working
- Allow location access when prompted
- Use HTTPS in production (required for geolocation)
- Check browser geolocation permissions

## Security Considerations

### For Development
- Current implementation is frontend-only
- No sensitive data handling in production

### For Production
- Implement proper authentication
- Use HTTPS only
- Add CSRF protection
- Validate all inputs server-side
- Encrypt payment information
- Implement proper API rate limiting
- Add user data privacy compliance

## File Sizes
- HTML: ~15 KB
- CSS: ~18 KB
- JavaScript: ~20 KB
- Total: ~53 KB (excluding map library)

## Performance Tips
- Google Maps library is loaded from CDN
- Lazy loading for station images
- Optimized marker rendering
- CSS animations use GPU acceleration

## Support
For issues or questions, review the code comments in:
- `script.js` - JavaScript functionality
- `styles.css` - CSS structure and styling
- `index.html` - HTML structure

## License
Free to use and modify for personal or commercial projects.

---

**Happy Charging! ⚡**
